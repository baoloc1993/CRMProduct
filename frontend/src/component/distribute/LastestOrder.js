import React, {useState} from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Cookies from "js-cookie";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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


  // const [auth, setAuth] = React.useState(undefined);

  function getData(callback) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let url = window.location.href;
    let URL = "http://112.78.4.119:8080/order/getList";
    if (url.indexOf('customerId') > 0 ){
      let customerId = url.split("=")[1];
      URL = "http://112.78.4.119:8080/order/getListByCustomer?customerId=" + customerId;
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
  function assignStaff(orderId, staffId, callback) {


  };
  const [data, setData] = React.useState(undefined);

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
    props.history.push('/orderDetail?orderId=' + orderId);

  }
  function editOrderDetail(orderId) {
      props.history.push('/editDetail?orderId=' + orderId);

  }
  function completeOrder(orderId) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = "http://112.78.4.119:8080/order/complete";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId :orderId,
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
  function goToCustomer(customerId){
    window.location.href = "/order?customerId=" + customerId;
  }
  function assignStaff(event) {
    let value =  event.target.value;

    let orderId = value.split("-")[0];
    let staffId = value.split("-")[1];
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = "http://112.78.4.119:8080/order/assign";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId :orderId,
      staffId : staffId
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

    let URL = "http://112.78.4.119:8080/order/perform";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      orderId :orderId,
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
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Ref</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Order Link</TableCell>
                    <TableCell>Order Date Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assign</TableCell>
                    <TableCell>View</TableCell>
                      <TableCell>Edit</TableCell>
                    <TableCell>Process</TableCell>
                    <TableCell>Complete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.order.map(order => (
                    <TableRow
                      hover
                      key={order.id}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell  onClick={()=>goToCustomer(order.customer.id)}>
                        <div style={{cursor: "pointer"}}  >
                        {order.customer.name}
                        </div>
                      </TableCell>
                      <TableCell>{order.orderLink}</TableCell>
                      <TableCell>
                        {moment(order.orderDateTime).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <div className={classes.statusContainer}>
                          {order.status.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={order.id.toString() + "-" + (order.personInCharge === null ? '' : order.personInCharge.id).toString()}
                                onChange={assignStaff}
                                readOnly ={order.personInCharge !== null}
                        >
                          {data.staff.map(staff=>(
                            <MenuItem value={order.id.toString() + "-" + staff.id.toString()}>{staff.username}</MenuItem>
                          ))}

                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button color="primary"  size="small"variant="text" onClick={()=>viewOrderDetail(order.id)}>
                          View
                        </Button>
                      </TableCell>
                        <TableCell>
                            <Button color="primary"  size="small"variant="text" onClick={()=>editOrderDetail(order.id)}>
                                Edit
                            </Button>
                        </TableCell>
                      <TableCell>
                        <Button color="primary"  size="small"variant="text" onClick={()=>processOrder(order.id)}
                                disabled={order.status.id >=2}
                        >
                          Process Order
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button color="primary"  size="small"variant="text" onClick={()=>completeOrder(order.id)}
                                disabled={order.status.id >=3}>
                          Complete Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <Divider/>
        <CardActions className={classes.actions}>
          <Button
            color="primary"
            size="small"
            variant="text"
          >
            View all <ArrowRightIcon/>
          </Button>
        </CardActions>
      </Card>
    );
  }

};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
