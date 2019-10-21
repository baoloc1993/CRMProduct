import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {authentication, getRole, URL_PREFIX} from "../Authentication";
import Redirect from "react-router-dom/es/Redirect";
import ShipForm from "../ship/ShipForm";
import Cookies from "js-cookie";
import axios from "axios";
import queryString from 'query-string';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {InputLabel} from "@material-ui/core";

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


export default function Payment() {
    const classes = useStyles();
    const [form, setForm] = React.useState({
        userId : 0,
        paymentAmount : 0
    });
    const [customers, setCustomers] = React.useState([]);

    function handleInputChange(event) {
        const {name, value} = event.target;
        setForm({...form, [name]: value})
    }
    function handleConfirm() {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL_PREFIX + "report/makePayment", {
            userId : form.userId,
            paymentAmount: parseInt(form.paymentAmount)
        }).then(r => {
            if (r.status == 200) {
                alert("SUCCESS");
            } else {
                alert("FAIL");

            }
        }).catch();
    }
    function getData(callback) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        let URL = URL_PREFIX + "report/getCustomers";
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(URL, {}).then(r => {
            if (r.status == 200) {
                callback(r.data.customers);
            } else {
                callback(undefined);
            }
        }).catch(e => {
            callback(undefined);
        });

    }

    if (customers !== undefined && customers.length === 0) {
        getData((a) => onChange(a));
        return blank();

    } else {
        return generatePage()
    }

    function onChange(customers) {
        setCustomers(customers);
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
                            Payment
                        </Typography>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} >
                                    <InputLabel>Customer</InputLabel>
                                    <Select value={form.userId}
                                            onChange={(event) => handleInputChange(event)}
                                            name="userId"
                                            id="userId"
                                            label="Customer">
                                        {customers.map(d=>(
                                            <MenuItem value={d.id}>{d.username}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={form.paymentAmount}
                                        type="number"
                                        required
                                        id="paymentAmount"
                                        name="paymentAmount"
                                        label="Payment Amount"
                                        fullWidth
                                        onChange={(event) => handleInputChange(event)}
                                    />
                                </Grid>
                                <div className={classes.buttons} >
                                    <Button variant="contained" color="primary"
                                            onClick={handleConfirm} className={classes.button}>
                                        Xác nhận
                                    </Button>
                                </div>
                            </Grid>
                        </React.Fragment>
                    </Paper>
                </main>
            </React.Fragment>
        );
        return blank();
    }
}
