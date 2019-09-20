import React, {useState} from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import theme from "../../theme";
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

import mockData from './data';
import StatusBullet from "./StatusBullet";
import {authentication} from "../Authentication";
import Cookies from "js-cookie";
import axios from "axios";


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

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const LatestOrders = props => {
  const {className, ...rest} = props;

  const classes = useStyles();

  const [orders] = useState(mockData);
  // const [auth, setAuth] = React.useState(undefined);

  function getData(callback) {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = "http://localhost:8080/order/getList";
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(URL, {}).then(r => {
      if (r.status == 200) {
        callback(r.data.order);
      } else {
        callback(undefined);
      }
    }).catch(e => {
      callback(undefined);
    });

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

  function generatePage() {
    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
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
                    <TableCell>Order Link</TableCell>
                    <TableCell>
                      <Tooltip
                        enterDelay={300}
                        title="Sort"
                      >
                        <TableSortLabel
                          active
                          direction="desc"
                        >
                          Order Date Time
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(order => (
                    <TableRow
                      hover
                      key={order.id}
                      onClick={()=>viewOrderDetail(order.id)}
                      style={{cursor:"pointer"}}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderLink}</TableCell>
                      <TableCell>
                        {moment(order.orderDateTime).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <div className={classes.statusContainer}>
                          {order.status}
                        </div>
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
