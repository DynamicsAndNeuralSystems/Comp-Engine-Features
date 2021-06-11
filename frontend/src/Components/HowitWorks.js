import img from "../assets/img/Sample Code.png";
import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";

const Howitworks = () => {
    return (
        <div id="howitworkssec">
            <div className="container">
                <p className="display-1">How It Works</p>
                <div className="section" style={{display:"block"}}>
                    <h3>The Research</h3>
                    <ul className="list">
                        <li><strong>CompEngine: Time-Series Features</strong> is based on active research on a
                            highly comparative approach to data analysis, in which we aim to unify
                            disparate scientific methods through large-scale empirical comparison.
                            It is a companion website to <a href="https://www.comp-engine.org" rel="noreferrer" target="_blank">CompEngine: Time Series</a>,
                            which is focused on time-series data. The research underlying these projects is
                            currently led by Ben Fulcher at the <a href="https://dynamicsandneuralsystems.github.io" rel="noreferrer" target="_blank">Neural Systems and Signals Group</a>.
                            <br/>Our aims are as follows:</li>
                            <ul>
                                <li>To assist the selection of appropriate methods for time-series data by allowing researchers working with time-series analysis
                                    methods to easily understand how methods developed in different literatures are related to each other.</li>
                                <li>To encourage the development of new and useful methods for time series by allowing researchers to understand how
                                    their new method is related to a wide range of existing methods.</li>
                            </ul>
                        <li>The features included in <strong>CompEngine: Time-Series Features</strong> are from the <a rel="noreferrer" href="https://github.com/benfulcher/hctsa" target="_blank">hctsa</a> time-series
                            analysis package, where you can find open code to implement all features included on this website,
                            including extensive documentation.
                            <br/>To learn more, read our papers:
                            <ul>
                                <li>B.D. Fulcher and N.S. Jones. <a rel="noreferrer" href="https://www.cell.com/cell-systems/fulltext/S2405-4712(17)30438-6" target="_blank"><i>hctsa</i>: A computational framework for automated time-series phenotyping using massive feature extraction</a>. <i>Cell Systems</i> <strong>5</strong>, 527 (2017).</li>
                                <li>B.D. Fulcher, M.A. Little, N.S. Jones. <a rel="noreferrer" href="https://royalsocietypublishing.org/doi/full/10.1098/rsif.2013.0048" target="_blank">Highly comparative time-series analysis: the empirical structure of time series and their methods</a>. <i>J. Roy. Soc. Interface</i> <strong>10</strong>, 83 (2013).</li>
                            </ul>
                        </li>
                        <li>To understand the behavior of a given time-series feature, we apply it to 1000 diverse time series,
                            from the <a rel="noreferrer" href="https://figshare.com/articles/dataset/1000_Empirical_Time_series/5436136" target="_blank">Empirical1000</a> collection of data,
                            which is a subset of the <a rel="noreferrer" href="https://figshare.com/articles/dataset/1000_Empirical_Time_series/5436136" target="_blank">CompEngine Time Series</a> library.
                            <br/>To learn more about the data, read our open paper:
                            <ul>
                                <li>B.D. Fulcher et al. <a rel="noreferrer" href="https://doi.org/10.1038/s41597-020-0553-0" target="_blank">A self-organizing, living library of time-series data</a>. <i>Scientific Data</i> <strong>7</strong>, 213 (2020).</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="section" style={{display:"block"}}>
                    <h3>How it Works</h3>
                    <ul className="list">
                        <li>In our library of time-series analysis methods,
                            we assess the similarity between all pairs—analysis methods are judged as similar that give similar patterns of outputs across diverse types of empirical time-series data.
                            Formally, this similarity is quantified using the Spearman correlation coefficient between outputs computed across 1000 empirical time series.
                        </li>
                        <li>On <strong>CompEngine: Time Series Features</strong>,
                            you can explore relationships between a wide range of different time-series analysis methods,
                            and understand how they behave on time-series data, using a range of tabular and quantitative statistics, as well as interactive visualizations.
                            You can also upload your own analysis function to see how it behaves relative to existing methods.
                            Then, take your analysis even further by downloading the results, or running tailored analyses, such as comparing performance on a specific dataset (an
                            example of how analyses can be performed in Matlab is <a rel="noreferrer" href="https://github.com/benfulcher/CandidateFeatureLab" target="_blank">here</a>.)
                        </li>
                    </ul>
                </div>

                <div className="section">
                    <div className="left">
                        <h3>Setting up Python code<br/>
                            <small className="text-muted">Points to consider while making your python code.</small>
                        </h3>
                        <ul className="list">
                            <li>The function should accept only one parameter in the form of a numpy.ndarray</li>
                            <li>The function name provided at the time of submitting your .py file should be the
                                same as defined in your function definition
                            </li>
                            <li>If the function has some external module dependencies, then please declare them
                                above the function definition (as shown in the sample code on the right).
                            </li>
                            <li><strong>The supported modules are:</strong>
                                <ul>
                                    <li>Math, Statistics, Numpy, Scipy, Sklearn, Pandas, Statsmodels.</li>
                                </ul>
                            </li>
                            <li><strong>Function should only return a float convertable value</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="right"><img alt={""} src={img}/>
                    </div>
                </div>

                <div className="timeline-container">
                    <div className="timeline">
                        <ul>
                            <li>
                                <div className="content">
                                    <h3 className="lead">Enter function name and Python file.</h3>
                                    <p className="lead">
                                        Upload your function name and python file.The code in your .py file should
                                        follow the same structure as described above.
                                    </p>
                                </div>
                                <div className="time">
                                    <h4>
                                        Step 1
                                    </h4>
                                </div>
                            </li>
                            <li>
                                <div className="content">
                                    <h3>Parsing timeseries </h3>
                                    <p className="lead">
                                        The function you uploaded will be parsed through 1000+ timeseries dataset.
                                    </p>
                                </div>
                                <div className="time">
                                    <h4>
                                        Step 2
                                    </h4>
                                </div>
                            </li>
                            <li>
                                <div className="content">
                                    <h3>Comparison with other models</h3>
                                    <p className="lead">
                                        Your method will then be compared to 7000+ time series analysis methods.
                                    </p>
                                </div>
                                <div className="time">
                                    <h4>
                                        Step 3
                                    </h4>
                                </div>
                            </li>
                            <li>
                                <div className="content">
                                    <h3>Best Matches.</h3>
                                    <p className="lead">
                                        The best matches of your analysis method will be produced as output.
                                    </p>
                                </div>
                                <div className="time">
                                    <h4>
                                        Step 4
                                    </h4>


                                </div>


                            </li>

                            <div style={{clear:"both"}}>
                            </div>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Howitworks)
