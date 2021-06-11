import {connect} from "react-redux";
import mapStateToProps from "../ReducerComponents/mapStateToProps";
import mapDispatchToProps from "../ReducerComponents/mapDispatchToProps";
import {Link} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from "@material-ui/styles";
import {DataGrid, GridToolbar} from "@material-ui/data-grid";
import React, {useState} from "react";
import Chip from "@material-ui/core/Chip";


function createLink(params) {
    return (<Link to={`/exploremode/${params.row.id}/${params.row.name}`}><Tooltip title={params.row.name}>
        <span className="table-cell-trucate">{params.row.name}</span>
    </Tooltip></Link>);
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

function idColumn(params) {
    console.log(params)
    return <p style={{marginBottom: "0px"}}>{params.row.rank}</p>
}

const DashboardTableColumns = (updater) => {
    return [
        {
            field: 'rank',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Rank',
            headerClassName: 'super-app-theme--header',
            label: 'name',
            renderCell: idColumn,
            flex: 0.12,
        },
        {
            field: 'name',
            headerName: 'Feature Names',
            headerClassName: 'super-app-theme--header',
            renderCell: createLink,
            flex: 0.35
        },
        {
            field: 'keywords',
            headerName: 'Tags',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return splitTags(params, updater)
            },
            flex: 0.4
        },
        {
            field: 'correlation',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Corr',
            headerClassName: 'super-app-theme--header',
            flex: 0.15
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
    const [keyword, setKeyword] = useState(false)
    const changeKeyword = (value) => {
        setKeyword(value)
    }
    return (
        <div style={{height: 730, width: '100%'}} className={classes.root}>
            {!keyword &&
            <DataGrid pagination disableSelectionOnClick rowBuffer={20} rows={props.features}
                      columns={DashboardTableColumns(changeKeyword)}
                      rowHeight={40}
                      components={{
                          Toolbar: GridToolbar,
                      }}
            />
            }
            {keyword !== false &&
            <DataGrid pagination disableSelectionOnClick rowBuffer={20} rows={props.features}
                      columns={DashboardTableColumns(changeKeyword)}
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

const DashBoardTable = (props) => {
    return <StylingCellsGrid features={props.tabledata}/>
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoardTable)
