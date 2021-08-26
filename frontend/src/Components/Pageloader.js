import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";
import CircularProgress from '@material-ui/core/CircularProgress';
import React from "react";

const Pageloader = (props) => {
    return (
        <div className="popup">
            <CircularProgress size="60px" thickness={4} style={{color: "#007bff"}}/>
            {props.pageloaderMessage !== undefined &&
            <p style={{fontWeight: "300", fontSize: "1.75rem", marginTop: "20px"}}>
                {props.pageloaderMessage}
            </p>
            }
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Pageloader)
