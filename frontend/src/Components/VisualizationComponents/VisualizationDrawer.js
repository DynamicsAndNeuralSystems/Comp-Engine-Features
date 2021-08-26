import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CategoryPlot from "./CategoryPlot";
import NetworkGraph from "./NetworkGraph";
import ScatterPlotsGroup from "./ScatterPlotsGroup";


const VisualizationDrawer = (props) => {
    // console.log(props)
    const [visualization, setVisualisation] = React.useState("scatterPlot");
    const setVisualization = (event, newAlignment) => {
        setVisualisation(newAlignment)
    }
    const width = '33%'
    return (
        <div>
            <ToggleButtonGroup value={visualization} exclusive
                               onChange={setVisualization} style={{width: '100%'}}>
                <ToggleButton value="scatterPlot" style={{width: width}}>
                    Scatter Plot
                </ToggleButton>
                <ToggleButton value="categoryPlot" style={{width: width}}>
                    Category Plot
                </ToggleButton>
                {/*<ToggleButton value="heatmap" style={{width: width}}>*/}
                {/*    Heatmap*/}
                {/*</ToggleButton>*/}
                <ToggleButton value="network" style={{width: width}}>
                    Network
                </ToggleButton>
            </ToggleButtonGroup>
            <div style={{
                overflow: "scroll", height: "950px", width: "100%",
                border: "1px solid rgba(0,0,0,0.12)"
            }}>
                <br/>

                {visualization === "scatterPlot" && <ScatterPlotsGroup {...props}/>
                // props.scatterPlotGraphs.yaxes.map((yaxis, index) => {
                //         if (index < 12) {
                //             return (
                //                 <PlotlyComponent index={index} xdata={props.scatterPlotGraphs.xaxis.xdata}
                //                                  ydata={yaxis.ydata}
                //                                  xtit={props.scatterPlotGraphs.xaxis.xtit} ytit={yaxis.ytit}
                //                                  title={yaxis.title} timeseriesnames={props.timeseriesnames}/>
                //             );
                //         }
                //     }
                // )
                }
                {visualization === "categoryPlot" &&
                <CategoryPlot graphs={props.scatterPlotGraphs} timeseriesnames={props.timeseriesnames}
                              timeseriescategory={props.timeseriescategory}/>
                }
                {visualization === "heatmap" &&
                <img
                    className="clustermap"
                    src={`data:image/png;base64,${props.img}`}
                    alt="mydataplohere"
                    height="850"
                    width="850"
                />
                }
                {visualization === "network" &&
                <NetworkGraph {...props}/>
                }
            </div>
        </div>
    )
};
export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDrawer)
