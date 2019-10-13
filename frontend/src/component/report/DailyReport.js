import React, {useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider, TableHead,
} from '@material-ui/core';
import Cookies from "js-cookie";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactTable from 'react-table'
import Moment from 'moment'
import 'react-table/react-table.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0,
        overflow: 'scroll',
        height: '850px'
    },
    inner: {
        minWidth: 800
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    status: {
        marginRight: theme.spacing(1)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    paper: {},
}));

const DailyReport = props => {
    const classes = useStyles();


    // const [auth, setAuth] = React.useState(undefined);



    function getDataByDate(date, callback) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        if (date === "") return;
        let URL = "http://112.78.4.119:8080/report/getReport?dateStr=" + date;
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(URL, {}).then(r => {
            if (r.status == 200) {
                callback(r.data);
            } else {
                callback(undefined);
            }
        }).catch(e => {
            callback(undefined);
        });

    };

    function handleChange(date) {
        console.log(date);
        getDataByDate(date.toLocaleDateString(), (a) => onChange(a));
        // setDate(date);
    }

    function handleSelect(date) {
        setDate(date);
    }

    const [data, setData] = React.useState({
        transactions: []
    });
    const [date, setDate] = React.useState(new Date());


        return generatePage()


    function onChange(data) {
        setData(data);
    }

    function blank() {
        return (<div/>)
    }




    function generatePage() {


        return (
            <Card
                className={clsx(classes.root)}
            >
                <CardHeader title="Reports"/>
                <Divider/>
                <CardContent>
                    <InputLabel>Select Date</InputLabel>
                    <DatePicker
                        label="Select Date"
                        selected={date}
                        onChange={handleChange}
                        onSelect={(e) => handleSelect(e)}
                    />
                </CardContent>

                <CardContent className={classes.content}>
                    <Typography variant="h1" component="h3">
                        Transactions
                    </Typography>
                    <ReactTable
                        data={data.transactions}
                        columns={transactionColumn}
                        className="-striped -highlight"
                        resolveData={data => data.map(row => row)}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value}
                        contentEditable
                    />
                    {/*</div>*/}
                    {/*</ScrollBar>*/}
                </CardContent>
            </Card>
        );
    }

};

DailyReport.propTypes = {
    className: PropTypes.string
};
const transactionColumn = [
    {
        id: "transactionId",
        Header: 'Transaction ID',
        accessor: 'id' // String-based value accessors!
    }, {
        id: "customerName",
        Header: 'Customer Name',
        accessor: d => d.customer.name,
        sortMethod: (a, b) => {
            if (a === null && b === null) return 0;
            if (a === null) return -1;
            if (b === null) return 1;
            if (a.length === b.length) {
                return a > b ? 1 : -1;
            }
            return a.length > b.length ? 1 : -1;
        },
        // Cell : renderEditable

    },  {
        id: "totalPayVnd",
        Header: 'Pay Amount',
        accessor: d => d.payAmountVnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },  {
        id: "date",
        Header: 'Payment Date',
        accessor: d => {
            d.payDateTime[1]  = d.payDateTime[1] -1;
            return Moment(d.payDateTime)
                .local()
                .format("YYYY-MM-DD hh:mm:ss a")
        }
    }]

function renderEditable(cellInfo) {
    return (
        <div
            style={{backgroundColor: "#fafafa"}}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
                const data = this.getData();
                data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                this.setData(data);
            }}
            dangerouslySetInnerHTML={{
                // __html: this.getData()[cellInfo.index][cellInfo.column.id]
            }}
        />
    );
}

export default DailyReport;
