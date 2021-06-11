import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import {Link} from "react-router-dom";

const Timeout = (props) => {
    return (
        <div id="timeout" className="container">
            <p className="display-2">Timeout Error</p>
            <hr/>
                <p className="lead">The process terminated as the program executed for longer than expected.<br/>Please ensure your program has no infinite loops or unnecessary overhead. If this problem persists, please contact us at...</p>
                <button type="button" className="btn btn-dark btn-lg"><Link to="/" onClick={props.addLinkCount}>Go Back</Link></button>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Timeout)