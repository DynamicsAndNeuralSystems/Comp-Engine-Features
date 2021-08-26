import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";

class NavLink extends React.Component {
    render() {
        var isActive = window.location.pathname === this.props.to;
        var clsname = isActive ? 'active' : '';
        return(
            <li className={"nav-item "+clsname}>
                <Link className="nav-link" to={this.props.to}>{this.props.name}</Link>
            </li>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavLink)