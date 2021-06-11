import {useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";

const Contribute = (props) => {
    const hist = useHistory();
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Upload your .py file here');
    const [featurename, setFeaturename] = useState('Upload your .py file here');
    const [keywords, setKeywords] = useState('Upload your .py file here');



    const onChangeFile = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };
    const onSubmit = e => {
        e.preventDefault();
        console.log(featurename,filename,keywords)
        const formData = new FormData();
        formData.append('featurecode', file);
        formData.append('featurename', featurename);
        formData.append('keywords', keywords);
        axios.post(props.url+'contribute', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        hist.push("/");
    }

    return (
        <div id="contributesec">
            <div class="container">
                <h1 class="display-1">Comp-Engine-Features</h1>
                <p class="lead">{props.lorem}</p>
                <div className="containerfluid">
                    <div class="rightside">
                        <form class="form-container" onSubmit={onSubmit}>
                            <div class="form-group">
                                <label>Function Name</label>
                                <input type="text" class="form-control" name="featurename"
                                       aria-describedby="emailHelp" placeholder="Enter function name" required
                                       onChange={(e) => setFeaturename(e.target.value)}/>
                                <small id="emailHelp" class="form-text text-muted">
                                    Function name should be same as defined in python file.<br/>It will be used for referencing in the future as well.
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Keywords</label>
                                <input type="text" className="form-control" name="featurename"
                                       aria-describedby="emailHelp" placeholder="Enter function name" required
                                       onChange={(e) => setKeywords(e.target.value)}/>
                            </div>

                            <div class="input-group mb-3">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="inputGroupFile02"
                                           name="featurecode" required onChange={onChangeFile}/>
                                    <label class="custom-file-label" for="inputGroupFile02" aria-describedby="inputGroupFileAddon02">
                                        {filename}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" value="submit" class="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Contribute)
