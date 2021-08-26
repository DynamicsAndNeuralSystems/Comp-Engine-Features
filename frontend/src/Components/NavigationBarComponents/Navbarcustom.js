import {Link, useHistory} from "react-router-dom";
import NavLink from "./NavLink";
import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import {useState} from "react";

const Navbarcustom = (props) => {
    const hist = useHistory();
    const [keyword, setKeyword] = useState('');

    const onSubmit = e => {
        e.preventDefault()
        props.updateKeywordSearch(keyword)
        hist.push("/explore");
    }
    return (
        <div>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark" onClick={props.addLinkCount}>
                <Link className="navbar-brand" to="/">CompEngineFeatures</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <NavLink to="/" name="Home"/>
                        <NavLink to="/howitworks" name="How it Works"/>
                        <NavLink to="/explore" name="Explore"/>
                        <NavLink to="/contact" name="Contact Us"/>
                        {/*<Nav_Link to="/contribute" name="Contribute"/>*/}
                    </ul>
                    <form className="form-inline" onSubmit={onSubmit}>
                        <input className="form-control mr-sm-2"
                               placeholder="Search by keywords"
                               onChange={(e) =>{setKeyword(e.target.value)}}
                        />
                        <button className="btn btn-outline-success" type="submit" value="submit">Search</button>
                    </form>
                </div>
            </nav>
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbarcustom)