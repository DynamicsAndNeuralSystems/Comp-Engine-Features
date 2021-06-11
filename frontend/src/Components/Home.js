import img1 from "../assets/img/comp-engine-features-schematic.svg";
import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom"
import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiOutlinedInput-input': {
            padding: "10px",
            textAlign: "left",
        },
    },
}));

const Home = (props) => {
    const classes = useStyles();
    const hist = useHistory();
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Upload your code file here');
    const [featurename, setFeaturename] = useState('Upload your code file here');
    const [language, setLanguage] = useState("Python");

    const onChangeName = e => {
        setFeaturename(e.target.value)
    };

    const onChangeFile = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };
    const onSubmit = e => {
        e.preventDefault();
        props.sendData(file, featurename, language);
        hist.push("/results");
    }

    return (
        <div>
            <div id="homesec">
                <div className="container">
                    <h1 className="display-1">CompEngine: Time-Series Features</h1>
                    <p className="display-2" style={{paddingTop: "20px"}}>A self-organizing database of time-series
                        analysis features</p>
                    <p className="lead">Welcome to CompEngine: Time-Series Features! Scientists have
                        developed thousands of methods to understand patterns in time-series data.
                        This website allows you to explore over 7000 such methods, or upload your own and
                        compare its behavior to our full library.
                        Click the buttons below to <Link to="/howitworks" onClick={props.addLinkCount}>learn more</Link>,
                        or <Link to="/explore" onClick={props.addLinkCount}>explore</Link> our features,
                        or fill in the box below to upload your own code.
                    </p>
                    <div id="btnsec" className="buttonssection">
                        <button type="button" className="btn btn-dark btn-lg">
                            <Link to="/howitworks" onClick={props.addLinkCount}>Learn More</Link>
                        </button>
                        {" "}
                        <button type="button" className="btn btn-dark btn-lg">
                            <Link to="/explore" onClick={props.addLinkCount}>Explore</Link>
                        </button>
                    </div>

                    <div className="containerfluid">
                        <div className="leftside">
                            <div className="image-control">
                                <img alt={""} src={img1} width="400px" height="400px"/>
                            </div>
                        </div>

                        <div className="rightside">
                            <form
                                id="myform"
                                className="form-container"
                                onSubmit={onSubmit}
                            >
                                <div className="form-group">
                                    <label>Function Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter function name"
                                        required
                                        onChange={onChangeName}
                                    />
                                    <small id="emailHelp" className="form-text text-muted">
                                        Function name should be same as defined in code file.
                                    </small>
                                </div>

                                <div className="input-group mb-3">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            required
                                            onChange={onChangeFile}
                                        />
                                        <label
                                            className="custom-file-label"
                                            aria-describedby="inputGroupFileAddon02">
                                            {filename}
                                        </label>
                                    </div>
                                </div>

                                <TextField
                                    className={classes.root}
                                    select
                                    label="Select Language"
                                    value={language}
                                    onChange={(event) => {
                                        setLanguage(event.target.value)
                                    }}
                                    variant="outlined"
                                    style={{width: "130px", margin: "1.5rem 0rem"}}
                                >
                                    <MenuItem dense="true" value={"Python"} key={"Python"}>{"Python"}</MenuItem>
                                    <MenuItem dense="true" value={"Julia"} key={"Julia"}>{"Julia"}</MenuItem>
                                </TextField>

                                <button
                                    type="submit"
                                    value="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Home)
