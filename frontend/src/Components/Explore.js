import Chip from '@material-ui/core/Chip';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import mapStateToProps from "./ReducerComponents/mapStateToProps";
import mapDispatchToProps from "./ReducerComponents/mapDispatchToProps";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from 'react';
import {DataGrid, GridToolbar} from '@material-ui/data-grid';
import {makeStyles} from '@material-ui/styles';
import {useEffect, useState} from "react";
import Pageloader from "./Pageloader";


function createLink(params) {
    return (<Link to={`/exploremode/${params.row.id}/${params.row.name}`}><Tooltip title={params.row.name}>
        <span className="table-cell-trucate">{params.row.name}</span>
    </Tooltip></Link>);
}

function idColumn(params) {
    return <p style={{marginBottom: "0px"}}>{params.row.id}</p>
}

function splitTags(params, updater) {
    const onClick = e => {
        updater(e.target.innerText)
    }
    return (
        params.row.keywords.split(',').map((item, index) => {
            return <Chip label={item} onClick={onClick} key={item}/>
        })
    );
}

const columns = (updater) => {
    return [
        {
            field: 'id',
            type: 'number',
            headerName: 'ID',
            headerAlign: 'left',
            align: 'left',
            headerClassName: 'super-app-theme--header',
            label: 'NAME',
            flex: 0.1,
            renderCell: idColumn,
        },
        {
            field: 'name',
            headerName: 'Feature Names',
            headerClassName: 'super-app-theme--header',
            renderCell: createLink,
            flex: 0.4
        },
        {
            field: 'keywords',
            headerName: 'Tags',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return splitTags(params, updater)
            },
            flex: 0.4
        }
    ]
}

const useStyles = makeStyles({
    root: {
        '& .super-app-theme--header': {
            fontWeight: '900',
            fontSize: '1rem'
        },
        '& .super-app-theme--cell': {
            backgroundColor: 'rgba(224, 183, 60, 0.55)',
            color: '#1a3e72',
            fontWeight: '600',
        },
        '& .super-app.negative': {
            backgroundColor: 'rgba(157, 255, 118, 0.49)',
            color: '#1a3e72',
            fontWeight: '600',
        },
        '& .super-app.positive': {
            backgroundColor: '#d47483',
            color: '#1a3e72',
            fontWeight: '600',
        },
    },
});

function StylingCellsGrid(props) {
    const classes = useStyles();
    const [keyword, setKeyword] = useState(props.keywordSearch)
    const changeKeyword = (value) => {
        setKeyword(value)
    }
    const keywordSelected = e => {
        setKeyword(e.target.innerText)
    }
    useEffect(() => {
        if (props.keywordSearch !== false) {
            props.addLinkCount()
            setKeyword(props.keywordSearch)
            props.updateKeywordSearch(false)
        }
    }, [props.keywordSearch])
    return (
        <div style={{height: 730, width: '100%'}} className={classes.root}>
            <div style={{display: "flex", marginBottom: "20px"}}>
                <p style={{marginRight: "20px", marginBottom: '0px', fontSize: "20px", fontWeight: "500"}}>Popular tags
                    :</p>
                {props.popKeywords.map((item, index) => {
                    return <Chip label={item} onClick={keywordSelected} key={item} style={{marginRight: "4px"}}/>
                })}

            </div>

            {!keyword &&
            <DataGrid pagination disableSelectionOnClick rowBuffer={5} rows={props.features}
                      columns={columns(changeKeyword)}
                      rowHeight={40}
                      components={{
                          Toolbar: GridToolbar,
                      }}
            />
            }
            {keyword !== false &&
            <DataGrid pagination disableSelectionOnClick rowBuffer={5} rows={props.features}
                      columns={columns(changeKeyword)}
                      rowHeight={40}
                      components={{
                          Toolbar: GridToolbar,
                      }}
                      filterModel={{
                          items: [{columnField: 'keywords', operatorValue: 'contains', value: keyword}],
                      }}
            />
            }
        </div>
    );
}


const Explore = (props) => {
    const [features, setFeatures] = useState([]);
    useEffect(() => {
        if (props.features) {
            let tFeatures = [];
            for (const [key, val] of Object.entries(props.features)) {
                tFeatures.push(val);
            }
            setFeatures(tFeatures);
        }
    }, [props.features])
    return (
        <div>
            {props.features === null && (
                <Pageloader/>
            )}
            {props.features && (
                <div className="container mt-2 mb-2">
                    <br/><br/>
                    <div id="exploresec">
                        <div className="display-1">Explore</div>
                        <ul className="list">
                            <li>
                                Below are the full set of {Object.keys(props.features).length} time-series analysis features taken
                                from
                                the <a target="_blank" rel="noreferrer"
                                       href="https://github.com/benfulcher/hctsa"><i>hctsa</i></a> time-series analysis
                                package.
                                Implementations of the features below can be found in <i>hctsa</i> (see <Link to="/howitworks"
                                                                                                       onClick={props.addLinkCount}>How
                                It Works</Link> for more information)."
                            </li>
                            <li>
                                Click on a time-series feature name below to visualize its closest relationships to all
                                other time-series analysis features in our library.
                                Four different visualizations are available, which allow you to inspect the
                                relationships between different scientific methods for time-series analysis.
                                To learn more about any given feature, see the code and documentation of <a
                                target="_blank" rel="noreferrer" href="https://github.com/benfulcher/hctsa"><i>hctsa</i></a>.
                            </li>
                            <li>
                                Filter out the features by clicking on the tags or adding condition in the filters option.
                            </li>
                        </ul>
                    </div>
                    {/*<StylingCellsGrid features={features} keywordSearch={props.keywordSearch}/>*/}
                    <StylingCellsGrid {...props} features={features}/>
                </div>
            )}
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Explore)
