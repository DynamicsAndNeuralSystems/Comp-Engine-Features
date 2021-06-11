import React, {memo, useCallback, useEffect, useState} from 'react';
import {connect} from "react-redux";
import Graph from "react-graph-vis";
import {v4} from "uuid";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import axios from "axios";
import Fab from '@material-ui/core/Fab';
import {Link} from "react-router-dom";
import Chip from "@material-ui/core/Chip";


function NetworkGraph(props) {
    const [graph, setGraph] = useState();
    useEffect(() => {
        setGraph(props.networkGraph)
    }, [props.networkGraph])
    const [selectedFeature, setSelectedFeature] = useState(false);
    const handleClick = async (action, data) => {
        if (action === 'NODE_SINGLE_CLICK') {
            if (data.id === -1) {
                setSelectedFeature({
                    name: props.featurename,
                    id: data.id
                })
            } else {
                setSelectedFeature({
                    name: props.features[data.id].name,
                    keywords: props.features[data.id].keywords,
                    id: data.id
                })
            }
        }
    }
    const memoHandleClick = useCallback(handleClick, [])
    return (
        <div id="networkplot">
            {graph && <GetGraph displayer={memoHandleClick} graph={graph} url={props.url} features={props.features}/>}
            {!selectedFeature &&
            <div style={{marginLeft: "15%", marginTop: "2%", width: '70%', marginRight: "15%"}}>
                <p>Single click on a node to view details</p>
                <p>Double click on a node to centerize that node</p>
            </div>

            }
            {selectedFeature &&
            <ul className="list-group"
                style={{marginLeft: "15%", marginTop: "2%", width: '70%', marginRight: "15%",}}>

                {selectedFeature.id === -1 &&
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <b>Feature Name </b>
                    <span className="table-cell-trucate">{selectedFeature.name}</span>
                </li>
                }
                {selectedFeature.id > -1 &&
                <div>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <b>Feature Name </b>
                        {selectedFeature.name === props.featurename &&
                        <span className="table-cell-trucate">{selectedFeature.name}</span>
                        }
                        {selectedFeature.name !== props.featurename &&
                        <Link to={`/exploremode/${selectedFeature.id}/${selectedFeature.name}`}>
                            <span className="table-cell-trucate">{selectedFeature.name}</span>
                        </Link>
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <b>Keywords</b>
                        <div>
                            {
                                selectedFeature.keywords.split(',').map((item) => {
                                    return <Chip
                                        style={{backgroundColor: "#007bff", color: "#fff", marginLeft: "2px"}}
                                        className={"badge badge-primary badge-pill"}
                                        label={item} key={item}/>
                                })
                            }
                        </div>

                    </li>
                </div>
                }
            </ul>
            }
        </div>
    );
}

const GetGraph = memo((props) => {
    const [graph, setGraph] = React.useState(props.graph);
    const [totalNode, setTotalNode] = React.useState(15);
    const options = {
        nodes: {
            fixed: {
                x: false,
                y: false
            },
            shape: "dot",
            size: 15,
            borderWidth: 1,
            borderWidthSelected: 3,
        },
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        height: "500px",
        interaction: {
            navigationButtons: true,
            keyboard: true,
            hover: true,
            hoverConnectedEdges: false,
            selectable: true,
            selectConnectedEdges: false,
            zoomView: true,
            dragView: true,
        },
        groups: {
            First: {
                color: {
                    background: "#FF33FF",
                    border: "#FF33FF",
                    highlight: {
                        border: "#B300B2",
                        background: "#FF33FF"
                    },
                    hover: {
                        border: "#B300B2",
                        background: "#FF33FF"
                    }
                }
            },
        }
    };
    const events = {
        select: (event) => {
            if (event.nodes.length !== 0) {
                props.displayer('NODE_SINGLE_CLICK', {
                    'id': graph.nodes[event.nodes[0]].fid
                })
            }
        },
        doubleClick: (event) => {
            let {nodes, edges} = event;
            if (nodes.length !== 0) {
                axios.get(props.url + 'network/' + graph.nodes[event.nodes[0]].fid + '/' + totalNode).then((response) => {
                    setGraph(response.data.networkGraph)
                });
            }
        },
    };
    let additionalLayout = {
        arrows: {
            to: {enabled: false},
            from: {enabled: false}
        },
        width: 0.5,
        smooth: true
    }
    for (let i = 0; i < graph.edges.length; i++) {
        if (i <= graph.edges.length / 2) {
            graph.edges[i].width = 2
        }
        if (graph.edges[i].length <= 1) {
            graph.edges[i].title = graph.edges[i].length
            graph.edges[i].length = 1300 - Math.abs(graph.edges[i].length) * 1000
        }
        graph.edges[i] = {...additionalLayout, ...graph.edges[i]}
    }
    for (let i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].fid !== -1) {
            graph.nodes[i].title = props.features[graph.nodes[i].fid].name
        } else {
            graph.nodes[i].title = graph.nodes[i].name
        }
        if (i === 0) {
            graph.nodes[i].color = "black"
        }
    }

    return (
        <div>
            <ul className="list-group" style={{width: "fit-content", position: "absolute", marginLeft:"10px"}}>
                <li className="list-group-item d-flex align-items-center" style={{padding: '10px'}}>
                    <div style={{ borderTop: "3px solid #000 ", marginLeft: 5, marginRight: 10, width: '10px' }}></div>
                    <p style={{margin: '0px'}}>Corr > {graph.edges[Math.ceil(graph.edges.length/2)].title}</p>
                </li>
                <li className="list-group-item d-flex align-items-center" style={{padding: '10px'}}>
                    <div style={{ borderTop: "1px solid #000 ", marginLeft: 5, marginRight: 10, width: '10px' }}></div>
                    <p style={{margin: '0px'}}>Corr > {graph.edges[graph.edges.length - 1].title - 0.001}</p>
                </li>
            </ul>
            <Graph
                key={v4()}
                graph={graph}
                options={options}
                events={events}
            />
                {graph !== props.graph &&
                <Fab variant="extended"
                     style={{
                         display: 'flex',
                         justifyContent: 'flex-start',
                         position: "absolute",
                         marginLeft: "1%",
                         marginTop: "2%"
                     }}
                     onClick={() => {
                         setGraph(props.graph)
                     }}>
                    Recentre
                </Fab>
                }

        </div>
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(NetworkGraph)