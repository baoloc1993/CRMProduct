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
    const [auth, setAuth] = React.useState(undefined);
    authentication("auth/order", onChange);
    if (auth === undefined){
        return blank();
    }else if (auth) {
        return generatePage()
    } else {
        return fail()
    }
    function onChange(auth) {
        setAuth(auth);
    }

    function fail() {
        return (<div>NOT PERMITTED</div>)
    }

    function blank() {
        return (<div/>)
    }
    function generatePage() {
        return (
          <Card
            {...rest}
            className={clsx(classes.root, className)}
          >
              <CardHeader
                action={
                    <Button
                      color="primary"
                      size="small"
                      variant="outlined"
                    >
                        New entry
                    </Button>
                }
                title="Latest Orders"
              />
              <Divider/>
              <CardContent className={classes.content}>
                  <PerfectScrollbar>
                      <div className={classes.inner}>
                          <Table>
                              <TableHead>
                                  <TableRow>
                                      <TableCell>Order Ref</TableCell>
                                      <TableCell>Customer</TableCell>
                                      <TableCell sortDirection="desc">
                                          <Tooltip
                                            enterDelay={300}
                                            title="Sort"
                                          >
                                              <TableSortLabel
                                                active
                                                direction="desc"
                                              >
                                                  Date
                                              </TableSortLabel>
                                          </Tooltip>
                                      </TableCell>
                                      <TableCell>Status</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {orders.map(order => (
                                    <TableRow
                                      hover
                                      key={order.id}
                                    >
                                        <TableCell>{order.ref}</TableCell>
                                        <TableCell>{order.customer.name}</TableCell>
                                        <TableCell>
                                            {moment(order.createdAt).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            <div className={classes.statusContainer}>
                                                <StatusBullet
                                                  className={classes.status}
                                                  color={statusColors[order.status]}
                                                  size="sm"
                                                />
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
