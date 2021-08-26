import img1 from "../../assets/img/86943-triangle-symbol-sign-content-weather-warning.png";
import img2 from "../../assets/img/IMGBIN_computer-worm-computer-virus-trojan-horse-malware-png_hWBkURUi.png";
import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import {Link} from "react-router-dom";

const WarningPage = (props) => {
    return (
        <div id="warningpage" className="container" style={{marginTop: "2%"}}>
            <div className="splitsection">
                <div className="left">
                    <img src={img1}/>
                </div>
                <div className="right display-3">Malicious code detected</div>
            </div>
            <div className="subheading">

                <p className="lead">
                    <strong> We suspect that you are trying to run a program that could harm our system.</strong></p>
            </div>
            <div className="instructions">
                <div className="leftside">

                    <h3>Please re-check your code and make sure that:</h3>
                    <ul className="list-group">
                        <li className="list-group-item">Your code is not trying to modify/access the system resources.
                        </li>
                        <li className="list-group-item">Does not use functions or import modules that are not allowed.
                        </li>
                        <li className="list-group-item">Follows the structure as described <Link to="/howitworks"
                                                                                                 onClick={props.addLinkCount}>here</Link>.
                        </li>
                    </ul>
                    <div className="notes">
                        <p className="lead"><strong>If the problem persists, <Link to="/contact" onClick={props.addLinkCount}>Write us
                            here</Link> raise an issue
                            on <a href="https://github.com/NeuralSystemsAndSignals/Comp-Engine-Features">GitHub</a></strong></p>
                    </div>
                </div>
                <div className="rightside">
                    <img src={img2}/>
                </div>
            </div>


        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(WarningPage)