import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import {Link} from "react-router-dom";

const SyntaxError = (props) => {
    return (
        <div id="syntaxerror" className="container">
            <p className="display-2"><strong>Syntax Error</strong></p>
            <hr/>
                <p className="lead">We have encountered a syntax error while running your code.</p>
                <button type="button" className="btn btn-dark btn-lg"><Link to="/" onClick={props.addLinkCount}>Go Back</Link></button>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(SyntaxError)