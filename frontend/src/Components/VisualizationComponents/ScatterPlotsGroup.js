import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {useState} from "react";
import PlotlyComponent from "./PlotlyComponent";
import Slider from '@material-ui/core/Slider';


const AntSwitch = withStyles((theme) => ({
    root: {
        width: 40,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(24px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const PrettoSlider = withStyles({
    root: {
        color: '#3f51b5',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const ScatterPlotsGroup = (props) => {
    const [state, setState] = useState(true)
    const [totalPlots, setTotalPlots] = useState(6)
    // console.log(props)
    return (
        <div>
            <Typography component="div" style={{margin: '20px'}}>
                <Grid container alignItems="center">
                    <Grid item  container alignItems="center" spacing={2} xs={9} style={{display: "flex", justifyContent: "flex-start"}}>
                        <Grid item>Plots for display</Grid>
                        <Grid item xs={9}>
                            <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={totalPlots} min={1}
                                          max={props.scatterPlotGraphs.yaxes.length} onChange={(event, newValue) => {setTotalPlots(newValue)}}/>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" spacing={1} xs={3} style={{display: "flex", justifyContent: "flex-end"}}>
                        <Grid item>Raw</Grid>
                        <Grid item><AntSwitch checked={state} onChange={() => {setState(!state)}}/></Grid>
                        <Grid item>Ranked</Grid>
                    </Grid>
                </Grid>
            </Typography>

            {state &&
            props.scatterPlotGraphs.yaxes.map((yaxis, index) => {
                    if (index < totalPlots) {
                        return (
                            <PlotlyComponent index={index} xdata={props.scatterPlotGraphs.xaxis.xdata}
                                             ydata={yaxis.ydata}
                                             key={index}
                                             xtit={props.scatterPlotGraphs.xaxis.xtit} ytit={yaxis.ytit}
                                             title={yaxis.title} timeseriesnames={props.timeseriesnames}/>
                        );
                    }
                    else{
                        return <div key={index}/>
                    }
                }
            )
            }
            {!state &&
            props.scatterPlotGraphs.yaxes.map((yaxis, index) => {
                    if (index < totalPlots) {
                        return (
                            <PlotlyComponent index={index} xdata={props.scatterPlotGraphs.xaxis.xdataraw}
                                             ydata={yaxis.ydataraw}
                                             key={index}
                                             xtit={props.scatterPlotGraphs.xaxis.xtit} ytit={yaxis.ytit}
                                             title={yaxis.title} timeseriesnames={props.timeseriesnames}/>
                        );
                    }
                    else{
                        return <div key={index}/>
                    }
                }
            )
            }
        </div>
    )
};
export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlotsGroup)
