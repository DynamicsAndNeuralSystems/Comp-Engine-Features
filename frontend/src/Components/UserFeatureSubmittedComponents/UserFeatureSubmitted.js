import {useEffect, useState} from "react";
import axios from "axios";
import Result from "../Results";
import Pageloader from "../Pageloader";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import Timeout from "./Timeout";
import SyntaxError from "./SyntaxError";
import WarningPage from "./WarningPage";

const UserFeatureSubmitted = (props) => {
    const [stat, changeStat] = useState("");
    const [isPending, changeIsPending] = useState(true);
    const [dashboardData, setDashboardData] = useState("");
    const [pendingMessage, setPendingMessage] = useState("Running code against 1000 Empirical Timeseries")
    // const [tableData, changeTabledata] = useState([]);
    // const [totalMatches, changeMatches] = useState(0);
    // const [featurename, changeFname] = useState("");
    // const [img, changeImage] = useState("");
    // const [scatterPlotGraphs, changeScatterPlotGraphs] = useState("");
    // const [timeseriesnames, changeTimeSeriesNames] = useState([]);
    // const [timeseriescategory, changeTimeSeriesCategory] = useState([]);
    // const [networkGraph, changeNetworkGraph] = useState([]);

    useEffect(() => {
        props.addLinkCount()
        // console.log("UsersubmittedCode", props.featureName, props.featureCode);
        const formData = new FormData();
        formData.append('featurecode', props.featureCode);
        formData.append('featurename', props.featureName);
        formData.append('language', props.language);
        axios.post(props.url+'codesubmit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.data.stat === 1) {
                setPendingMessage("Computing correlations with "+ Object.keys(props.features).length +" other features")
                const formData = new FormData();
                formData.append('featureTimeSeriesValues', response.data.featureTimeSeriesValues);
                formData.append('featurename', props.featureName);
                axios.post(props.url+'exploremode/userfeature', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    setDashboardData(response.data)
                    changeStat(1)
                    changeIsPending(false);
                })
            }
            else{
                changeStat(response.data.stat)
                changeIsPending(false);
            }

        });
    }, []);

    return (
        <div>
            {isPending && <Pageloader pageloaderMessage={pendingMessage}/>}
            {!isPending && stat === 1 &&
            <Result {...dashboardData}/>
            }
            {!isPending && stat === 2 &&
            <SyntaxError/>
            }
            {!isPending && stat === 3 &&
            <WarningPage/>
            }
            {!isPending && stat === 4 &&
            <Timeout />
            }
            {!isPending && stat === 5 && <Redirect to="/"/>}
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(UserFeatureSubmitted)
