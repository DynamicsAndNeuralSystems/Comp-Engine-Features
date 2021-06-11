import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbarcustom from "./Components/NavigationBarComponents/Navbarcustom";
import Home from "./Components/Home";
import Explore from "./Components/Explore";
import Contact from "./Components/Contact";
import Howitworks from "./Components/HowitWorks";
import Exploremode from "./Components/Exploremode";
import {useEffect, useState} from "react";
import UserFeatureSubmitted from "./Components/UserFeatureSubmittedComponents/UserFeatureSubmitted";
import Contribute from "./Components/Contribute";
import {connect} from "react-redux";
import axios from "axios";
import mapStateToProps from "./Components/ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./Components/ReducerComponents/mapDispatchToProps";

const App = (props) => {
    const [featureCode, setFeatureCode] = useState('');
    const [language, setLanguage] = useState('');
    const [featureName, setFeatureName] = useState('Upload your .py file here');
    const onFileSubmit = (featurecode, featurename, language) => {
        setFeatureCode(featurecode)
        setFeatureName(featurename)
        setLanguage(language)
    }

    useEffect(() => {
        axios.get(props.url + 'getfeatures').then((response) => {
            // console.log(response)
            props.addFeatures(response.data.featureDic);
            props.addPopKeywords(response.data.popKeywords)
        });
    }, [])

    return (
        <Router>
            <Navbarcustom/>
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <Home sendData={onFileSubmit}/>
                    </Route>
                    <Route exact path="/howitworks">
                        <Howitworks/>
                    </Route>
                    <Route exact path="/contact">
                        <Contact/>
                    </Route>
                    <Route exact path="/contribute" >
                        <Contribute/>
                    </Route>
                    {/*<Route exact path="/explore/:keyword">*/}
                    {/*    <Explore/>*/}
                    {/*</Route>*/}
                    <Route exact path="/exploremode/:id/:name">
                        <Exploremode/>
                    </Route>
                    <Route path="/result">
                    </Route>
                    <Route exact path="/explore">
                        <Explore/>
                    </Route>
                    <Route exact path="/results">
                        <UserFeatureSubmitted featureCode={featureCode} featureName={featureName} language={language}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
