import React, {memo} from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";

function PlotlyComponent({index, xdata, ydata, xtit, ytit, title, timeseriesnames}) {
    let color, letters = '0123456789ABCDEF'.split('')
    function AddDigitToColor(limit){
        color += letters[Math.round(Math.random() * limit )]
    }
    function GetRandomColor() {
        color = '#'
        AddDigitToColor(3)
        for (var i = 0; i < 5; i++) {
            AddDigitToColor(15)
        }
        return color
    }
    const randomColor = GetRandomColor()
    const xData = [].concat(...xdata);
    const yData = [].concat(...ydata);
    const timeSeriesNames = [].concat(...timeseriesnames);
    // console.log(index)
    const data = [{
        x: xData,
        y: yData,
        mode: 'markers',
        text: timeSeriesNames,
        //hovertemplate:  'X: %{x}' + 'Y: %{y}' + '<b>%{text}</b>' +'<extra></extra>',
        marker:{
            color: randomColor,
            size:5
        }
    }]
    const layout = {
        hovermode: 'closest',
        autosize: false,
        margin: {
            l: 55,
            r: 20,
            b: 90,
            t: 22,
        },
        title: {
            text:title,
            font: {
                size: 15
            }
        },
        width: 360-37,
        height: 320+40,
        yaxis: {
            title: {
                text: ytit,
                standoff: 15,
                font: {
                    size: 12
                }
            },
            gridcolor: '#ffffff',
            gridwidth: 2,
            zerolinecolor: '#ffffff',
            zerolinewidth: 2,
            linecolor: '#ffffff',
            linewidth: 2
        },
        xaxis: {
            title: {
                text: xtit,
                standoff: 10,
                font: {
                    size: 12
                }
            },
            gridcolor: '#ffffff',
            gridwidth: 2,
            zerolinecolor: '#ffffff',
            zerolinewidth: 2,
            linecolor: '#ffffff',
            linewidth: 2
        },
        plot_bgcolor: '#ededed',

    }
    const Plot = createPlotlyComponent(Plotly);
    return (
        <Plot
            data={data}
            layout={layout}
            config={{ modeBarButtonsToRemove: ['zoom2d', 'lasso2d', 'pan2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                      displaylogo: false}}
        />
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(PlotlyComponent))