import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Result from "./Results";
import Pageloader from "./Pageloader";
import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";

const Exploremode = (props) => {
    const {id, name} = useParams();
    const url = props.url + "exploremode/" + id + "/" + name
    const [dashboardData, setDashboardData] = useState("");
    const [isPending, changeIsPending] = useState(true);
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
        changeIsPending(true);
        // console.log(name)
        // console.log(props.featureBuffer[name])
        // console.log(props)
        if(props.featureBuffer[name] !== undefined){
            setDashboardData(props.featureBuffer[name])
            // changeTabledata(props.featureBuffer[name].tabledata);
            // changeMatches(props.featureBuffer[name].totalmatches);
            // changeFname(props.featureBuffer[name].featurename);
            // changeImage(props.featureBuffer[name].heatmap);
            // changeTimeSeriesNames(props.featureBuffer[name].timeseriesnames);
            // changeScatterPlotGraphs(props.featureBuffer[name].scatterplotgraphs);
            // changeTimeSeriesCategory(props.featureBuffer[name].timeseriescategory);
            // changeNetworkGraph(props.featureBuffer[name].networkGraph)
            changeIsPending(false);
        }
        else{
            // console.log("here")
            axios.get(url).then((response) => {
                // console.log(response)
                setDashboardData(response.data)
                // changeTabledata(response.data.tabledata);
                // changeMatches(response.data.totalmatches);
                // changeFname(response.data.featurename);
                // changeImage(response.data.heatmap);
                // changeTimeSeriesNames(response.data.timeseriesnames);
                // changeScatterPlotGraphs(response.data.scatterplotgraphs);
                // changeTimeSeriesCategory(response.data.timeseriescategory);
                // changeNetworkGraph(response.data.networkGraph)
                changeIsPending(false);
                props.addFeatureToBuffer(response.data, response.data.featurename)
            });
        }
    }, [url]);

    return (
        <div>
            {isPending && <Pageloader/>}
            {/*{!isPending &&*/}
            {/*<Result tabledata={tableData} totalmatches={totalMatches} featurename={featurename} img={img} scatterPlotGraphs={scatterPlotGraphs}*/}
            {/*        timeseriesnames={timeseriesnames} timeseriescategory={timeseriescategory} networkGraph={networkGraph}/>}*/}
            {!isPending && <Result {...dashboardData}/>}
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Exploremode)
