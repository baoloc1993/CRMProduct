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
import {URL_PREFIX} from "../Authentication";


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
    let URL = URL_PREFIX + "listUsers";
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


  function changeRole(event) {
    let value =  event.target.value;

    let roleId = parseInt(value.split("-")[0]);
    let userId = parseInt(value.split("-")[1]);
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);

    let URL = URL_PREFIX + "changeRole";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
      roleId :roleId,
      userId : userId
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
                    <TableCell>User Name</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.users.map(user => (
                    <TableRow
                      hover
                      key={user.id}
                    >
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Select value={user.role.id.toString() + "-" + user.id.toString()}
                                onChange={changeRole}
                        >
                          {data.roles.map(role=>(
                            <MenuItem value={role.id.toString() + "-" + user.id.toString()}>{role.name}</MenuItem>
                          ))}

                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <Divider/>
      </Card>
    );
  }

};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
