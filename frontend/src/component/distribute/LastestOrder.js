import React, {useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@material-ui/core';
import Cookies from "js-cookie";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactTable from 'react-table'
import Moment from 'moment'
import 'react-table/react-table.css'
import {URL_PREFIX} from "../Authentication";


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

const LatestOrders = props => {
  const classes = useStyles();
  const [data, setData] = React.useState(undefined);
  const columns = [{
    id: "orderId",
    Header: 'Order Ref',
    accessor: 'orderId' // String-based value accessors!
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

  }, {
    id: "orderLink",
    Header: 'Order Link',
    accessor: 'orderLink',
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "trackingLink",
    Header: 'Track Link',
    accessor: 'trackingLink',
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "address",
    Header: 'Ship Information',
    accessor: 'address',
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "number",
    Header: 'Quantity',
    accessor: 'number',
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "usdPrice",
    Header: 'USD Price',
    accessor: d => d.usdPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "tax",
    Header: 'Tax',
    accessor: 'tax',
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "totalUsd",
    Header: 'Total Price USD',
    accessor: d => d.totalValueUsd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }, {
    id: "rate",
    Header: 'Rate',
    accessor: d => d.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    Cell: (cellInfo) => renderEditable(cellInfo)
  }, {
    id: "totalVnd",
    Header: 'VND Price',
    accessor: d => d.totalValueVnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }, {
    id: "status",
    Header: 'Status',
    accessor: d => d.status.name,
    Cell: (cellInfo) => renderStatusEditable(cellInfo)
  }, {
    id: "assign",
    Header: 'Assign',
    accessor: d => d.personInCharge === null ? "" : d.personInCharge.username
  }, {
    id: "date",
    Header: 'Order Date Time',
    accessor: d => {
      d.orderDateTime[1] = d.orderDateTime[1] - 1;
      return Moment(d.orderDateTime)
        .local()
        .format("DD-MM-YYYY hh:mm:ss a")
    }
  }];

  function renderEditable(cellInfo) {
    return (
      <div

        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          data.order[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setData(data);
          saveOrder(cellInfo.row._original);
        }}
      >{data.order[cellInfo.index][cellInfo.column.id]}</div>
    );
  }
  function renderStatusEditable(cellInfo) {
    console.log (data.order[cellInfo.row._index]);
    return (
      <div
        contentEditable
        suppressContentEditableWarning>
        <Select value={data.order[cellInfo.row._index].status.id}
                onChange={(event) => handleInputChange(event,cellInfo.row._original)}>
          {data.status.map(status=>(
            <MenuItem value={status.id}>{status.name}</MenuItem>
          ))}

        </Select>
      </div>
    );
    function handleInputChange(event,data) {
      const {name, value} = event.target;
      let token = Cookies.get('access_token');
      token = ("Bearer " + token);
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(URL_PREFIX + "order/update", {
        id: data.id,
        orderLink: data.orderLink,
        trackingLink: data.trackingLink,
        address: data.address,
        usdPrice: data.usdPrice,
        tax: data.tax,
        totalValueUsd: data.totalValueUsd,
        rate: data.rate,
        totalValueVnd: data.totalValueVnd,
        note: data.note,
        number: data.number,
        status : value
      }).then(r => {
        if (r.status == 200) {
          getData((a) => onChange(a));
        }
      }).catch();

    }
  }

  // const [auth, setAuth] = React.useState(undefined);

  function getData(callback) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let url = window.location.href;
    let URL = URL_PREFIX + "order/getList";
    if (url.indexOf('customerId') > 0) {
      let customerId = url.split("=")[1];
      URL = URL_PREFIX + "order/getListByCustomer?customerId=" + customerId;
    }
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

  function saveOrder(data) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL_PREFIX + "order/update", {
      id: data.id,
      orderLink: data.orderLink,
      trackingLink: data.trackingLink,
      address: data.address,
      usdPrice: data.usdPrice,
      tax: data.tax,
      totalValueUsd: data.totalValueUsd,
      rate: data.rate,
      totalValueVnd: data.totalValueVnd,
      note: data.note,
      number: data.number,
      status : data.status.id
    }).then(r => {
      if (r.status == 200) {
        getData((a) => onChange(a));
      }
    }).catch();

  };

  if (data === undefined) {
    getData((a) => onChange(a));
    return blank();
  } else {
    return generatePage()
  }

  function onChange(data) {
    setData(data);
  }

  function blank() {
    return (<div/>)
  }

  function viewOrderDetail(orderId) {
    props.history.push('/orderDetail?id=' + orderId);

  }

  function editOrderDetail(orderId) {
    props.history.push('/editDetail?id=' + orderId);

  }

  function completeOrder(orderId) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = URL_PREFIX + "order/complete";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId: orderId,
    }).then(r => {
      if (r.status == 200) {
        setData(r.data);
      } else {
        setData(undefined);
      }
    }).catch(e => {
      setData(undefined);
    });
  };

  function goToCustomer(customerId) {
    window.location.href = "/order?customerId=" + customerId;
  }

  function assignStaff(event) {
    let value = event.target.value;

    let orderId = value.split("-")[0];
    let staffId = value.split("-")[1];
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = URL_PREFIX + "order/assign";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId: orderId,
      staffId: staffId
    }).then(r => {
      if (r.status == 200) {
        setData(r.data);
      } else {
        setData(undefined);
      }
    }).catch(e => {
      setData(undefined);
    });
  }

  function processOrder(orderId) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = URL_PREFIX + "order/perform";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId: orderId,
    }).then(r => {
      if (r.status == 200) {
        setData(r.data);
      } else {
        setData(undefined);
      }
    }).catch(e => {
      setData(undefined);
    });
  }

  function generatePage() {


    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          title="List Orders"
        />
        <Divider/>
        <CardContent className={classes.content}>
          {/*<ScrollBar>*/}
          {/*<div className={classes.inner}>*/}
          <ReactTable
            data={data.order}
            columns={columns}
            // className="-striped -highlight"
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

LatestOrders.propTypes = {
  className: PropTypes.string
};


export default LatestOrders;
