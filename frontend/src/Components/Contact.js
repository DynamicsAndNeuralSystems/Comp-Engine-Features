import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";

const Contact = () => {
    return (
        <div id="contactsec" >
            <Helmet>
                <script src="https://use.fontawesome.com/8ef3ce1ffd.js"></script>
            </Helmet>
        <div className="container">
            <p className="display-1">Connect with us</p>
            <ul className="list">
                <li>
                    This website is based on active research on a highly comparative approach to data analysis,
                    in which we aim to unify disparate scientific methods through large-scale empirical comparison.
                    This research began in 2008, led by <a rel="noreferrer" target="_blank" href="https://www.imperial.ac.uk/people/nick.jones">Nick Jones</a>,
                    and is currently led by Ben Fulcher at the <a rel="noreferrer" target="_blank" href="https://dynamicsandneuralsystems.github.io">Neural Systems and Signals Group</a>.
                    We aim to continue to refine this website to incorporate developments in our research.
                    This website was developed with support from Google via the Google Summer of  Code Program:
                    front-end and back-end development of this website was done by Salman Khan (2020) and <a rel="noreferrer" target="_blank" href="https://diptanshumittal.github.io/portfolio-website/">Diptanshu Mittal</a> (2021),
                    supervised by Ben Fulcher and Oliver Cliff at The University of Sydney.
                </li>
                <li>
                    To learn more about our latest work with time series, or let us know what you think
                    <div className="contact-box">
                        <ul>
                            <li><a target="_blank" rel="noreferrer" href="https://mail.google.com/mail/?view=cm&fs=1&to=physics.compengine@sydney.edu.au"><i className="fa fa-envelope"></i></a><p>Mail us</p></li>
                            <li><a target="_blank" rel="noreferrer" href="https://github.com/NeuralSystemsAndSignals/Comp-Engine-Features"><i className="fa fa-github"></i></a><p>Check the code</p></li>
                            <li><a target="_blank" rel="noreferrer" href="https://twitter.com/compTimeSeries"><i className="fa fa-twitter"/></a><p>Follow us</p></li>
                        </ul>
                    </div>

                </li>
            </ul>
        </div>
        </div>

    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Contact)
