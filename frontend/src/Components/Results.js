import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";
import React, {useEffect} from "react";
import Chip from '@material-ui/core/Chip';
import DashBoardTable from "./VisualizationComponents/DashBoardTable";
import VisualizationDrawer from "./VisualizationComponents/VisualizationDrawer";
import Tooltip from "@material-ui/core/Tooltip";
import {Link} from "react-router-dom";


const Result = (props) => {

    useEffect(() => {
        if (props.tabledata && props.features)
            props.tabledata.map((item) => {
                item.name = props.features[item.id].name
                item.keywords = props.features[item.id].keywords
            })
        window.scrollTo(0, 0)
    }, [props.tabledata, props.features])

    return (
        <div id="resultsec">
            <div className="container" style={{marginTop: "4%"}}>
                <p className="display-1">{props.featurename}</p>
                <ul className="list">
                    {props.codeFile !== undefined && props.codeFile !== "NA" &&
                    <li>
                        The implementation of target feature - <b>{props.featurename}</b> can be found in <a
                        target="_blank" rel="noreferrer"
                        href="https://github.com/benfulcher/hctsa"><i>hctsa</i></a> Code
                        File - <b>{props.codeFile}</b> ({props.description}).
                    </li>
                    }
                    <li>
                        Below are the set of <b>{props.totalmatches}</b> time-series analysis features having Spearman
                        correlation coefficient's p-value {"<"} 0.05 with the target feature - <b>{props.featurename}</b>.
                    </li>
                    <li>
                        Click on a time-series feature name below to visualize its closest relationships to all
                        other time-series analysis features in our library.
                        Four different visualizations are available, which allow you to inspect the
                        relationships between different scientific methods for time-series analysis.
                        To learn more about any given feature, see the code and documentation of <a
                        target="_blank" rel="noreferrer" href="https://github.com/benfulcher/hctsa"><i>hctsa</i></a>.
                    </li>
                    <li>
                        Filter out the features by clicking on the tags or adding condition in the filters option.
                    </li>
                </ul>
                {/*<ul className="list-group" style={{width: "fit-content", display: "table", margin: "0 auto"}}>*/}
                {/*    <li className="list-group-item d-flex justify-content-between align-items-center">*/}
                {/*        <b style={{marginRight: "50px"}}>Target Feature</b>*/}
                {/*        <Tooltip title="Feature being explored">*/}
                {/*            <Chip*/}
                {/*                style={{backgroundColor: "#007bff", color: "#fff"}}*/}
                {/*                label={props.featurename}*/}
                {/*                key={props.featurename}*/}
                {/*                className={"badge badge-primary badge-pill"}>*/}
                {/*            </Chip>*/}
                {/*        </Tooltip>*/}
                {/*    </li>*/}
                {/*    <li className="list-group-item d-flex justify-content-between align-items-center">*/}
                {/*        <b style={{marginRight: "50px"}}>Total Matches</b>*/}
                {/*        <Tooltip*/}
                {/*            title={props.totalmatches + " features had Spearman correlation coefficient's p-value less than 0.05"}>*/}
                {/*            <Chip*/}
                {/*                style={{backgroundColor: "#007bff", color: "#fff"}}*/}
                {/*                label={props.totalmatches}*/}
                {/*                key={props.totalmatches}*/}
                {/*                className={"badge badge-primary badge-pill"}*/}
                {/*            />*/}
                {/*        </Tooltip>*/}
                {/*    </li>*/}
                {/*    {props.codeFile !== undefined &&*/}
                {/*    <li className="list-group-item d-flex justify-content-between align-items-center">*/}
                {/*        <b style={{marginRight: "50px"}}><a target="_blank" rel="noreferrer"*/}
                {/*                                            href="https://github.com/benfulcher/hctsa"><i>hctsa</i></a> Code*/}
                {/*            File</b>*/}
                {/*        <Tooltip title={props.description}>*/}
                {/*            <Chip*/}
                {/*                style={{backgroundColor: "#007bff", color: "#fff"}}*/}
                {/*                label={props.codeFile}*/}
                {/*                key={props.codeFile}*/}
                {/*                className={"badge badge-primary badge-pill"}*/}
                {/*            />*/}
                {/*        </Tooltip>*/}
                {/*    </li>*/}
                {/*    }*/}
                {/*</ul>*/}
                <div className="container mt-2 mb-2">
                    <br/>
                    <DashBoardTable tabledata={props.tabledata}/>
                    <br/>
                    <hr/>
                    <br/>
                    <VisualizationDrawer {...props}/>
                </div>
            </div>
        </div>

    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Result)
