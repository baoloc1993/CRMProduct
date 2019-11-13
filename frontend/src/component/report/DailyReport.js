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
import Picker from "react-month-picker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {URL_PREFIX} from "../Authentication";
import Header from "../Header";
import Container from "@material-ui/core/Container";


const useStyles = makeStyles(theme => ({
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
  root: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',

  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const DailyReport = props => {
  const classes = useStyles();


  // const [auth, setAuth] = React.useState(undefined);


  function getDataByDate(startDate,endDate, callback) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    if (date === "") return;
    let URL = URL_PREFIX + "report/getReport?startDateStr=" + startDate.toLocaleDateString() + "&endDateStr=" + endDate.toLocaleDateString();
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

  function handleChangeStart(startDate) {

    getDataByDate(startDate, date.endDate, (a) => onChange(a));
    setDate({...date,['startDate']:startDate});
  }
  function handleChangeEnd(endDate) {

    getDataByDate(date.startDate, endDate, (a) => onChange(a));
    setDate({...date,['endDate']:endDate});

  }

  function handleSelectStart(startDate) {

    setDate({...date,['startDate']:startDate});
  }
  function handleSelectEnd(endDate) {

    setDate({...date,['endDate']:endDate});
  }

  const [data, setData] = React.useState({
    transactions: []
  });
  const [date, setDate] = React.useState({
    startDate : new Date(),
    endDate : new Date()
  });


  return generatePage()


  function onChange(data) {
    setData(data);
  }

  function blank() {
    return (<div/>)
  }


  function generatePage() {
    return (
      <div className={classes.root}>
        <Header/>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h3">Reports</Typography>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Typography variant="h3" component="h3">Select Start Date</Typography>
              <DatePicker
                name = "startDate"
                selected={date.startDate}
                onChange={handleChangeStart}
                onSelect={(e) => handleSelectStart(e)}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Typography variant="h3" component="h3">Select End Date</Typography>
              <DatePicker
                name = "endDate"
                selected={date.endDate}
                onChange={handleChangeEnd}
                onSelect={(e) => handleSelectEnd(e)}/>
            </Paper>
          </Grid>
          < Grid item xs={12}>
            <Paper className={classes.paper}>
              < Typography variant="h3" component="h3">
                Transactions
              </Typography>
              <ReactTable
                data={data.transactions}
                columns={transactionColumn}
                className="-striped -highlight"
                resolveData={data => data.map(row => row)}
                defaultPageSize="10"
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
                contentEditable
              />
            </Paper>
          </Grid>
          < Grid item xs={4}>
            <Paper className={classes.paper}>
              < Typography variant="h3" component="h3">
                Money In
              </Typography>
              <ReactTable
                data={data.moneyIn}
                columns={moneyInColumns}
                className="-striped -highlight"
                resolveData={data => data.map(row => row)}
                defaultPageSize="10"
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
                contentEditable
              />
            </Paper>
          </Grid>
          < Grid item xs={4}>
            <Paper className={classes.paper}>
              < Typography variant="h3" component="h3">
                Money Out
              </Typography>
              <ReactTable
                data={data.moneyOut}
                columns={moneyInColumns}
                className="-striped -highlight"
                resolveData={data => data.map(row => row)}
                defaultPageSize="10"
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
                contentEditable
              />
            </Paper>
          </Grid>
          < Grid item xs={4}>
            <Paper className={classes.paper}>
              < Typography variant="h3" component="h3">
                Balance
              </Typography>
              <ReactTable
                data={data.balances}
                columns={moneyInColumns}
                className="-striped -highlight"
                resolveData={data => data.map(row => row)}
                defaultPageSize="10"
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
                contentEditable
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
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
    accessor: d=>d.customer.name,
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

  }, {
    id: "totalPayVnd",
    Header: 'Pay Amount',
    accessor: d => d.payAmountVnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }, {
    id: "date",
    Header: 'Payment Date',
    accessor: d => {
      return Moment(d.payDateTime*1000)
        .local()
        .format("YYYY-MM-DD hh:mm:ss a")
    }
  }
];
const moneyInColumns = [
  {
    id: "customerName",
    Header: 'Customer Name',
    accessor: d => d.name,
    sortMethod: (a, b) => {
      if (a === null && b === null) return 0;
      if (a === null) return -1;
      if (b === null) return 1;
      if (a.length === b.length) {
        return a > b ? 1 : -1;
      }
      return a.length > b.length ? 1 : -1;
    },

  }, {
    id: "totalPayVnd",
    Header: 'Pay Amount',
    accessor: d => d.paymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
];
const balanceColumns = [
  {
    id: "customerName",
    Header: 'Customer Name',
    accessor: d => d.name,
    sortMethod: (a, b) => {
      if (a === null && b === null) return 0;
      if (a === null) return -1;
      if (b === null) return 1;
      if (a.length === b.length) {
        return a > b ? 1 : -1;
      }
      return a.length > b.length ? 1 : -1;
    },

  }, {
    id: "balance",
    Header: 'Balance',
    accessor: d => d.paymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    Cell : row =>(
      <span style={{color: row.value < 0 ? 'red' : 'black'}}></span>
    )
  }
];
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
