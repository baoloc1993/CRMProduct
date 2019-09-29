import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {authentication, getRole} from "../Authentication";
import Redirect from "react-router-dom/es/Redirect";
import ShipForm from "../ship/ShipForm";
import Cookies from "js-cookie";
import axios from "axios";
import queryString from 'query-string';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));


export default function OrderDetail() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);


    function getData(callback) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        let url = window.location.href;
        let orderID = url.split("=")[1];

        let URL = "http://112.78.4.119:8080/order/get?orderId=" + orderID;
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
    const [data, setData] = React.useState({
        role: undefined
    });

    if (data.role === undefined) {
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

    function generatePage() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <AppBar position="absolute" color="default" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Company name
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Đơn ship
                        </Typography>
                        <React.Fragment>
                            <ShipForm role={data.role} disable={true} data={data.order}/>
                        </React.Fragment>
                    </Paper>
                </main>
            </React.Fragment>
        );
        return blank();
    }
}
