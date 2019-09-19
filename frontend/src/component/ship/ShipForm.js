import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";

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
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));


export default function ShipForm(props) {
    let role = props.role;
    let disable = props.disable;
    let data = props.data;
    const [formData, setForm] = React.useState(data);
    let form = formData;
    if (form == undefined){
        form = {
            orderLink: "",
            trackingLink: "",
            address: "",
            usdPrice: 0.00,
            tax: 0.00,
            totalValueUsd: 0.00,
            rate: 0.00,
            totalValueVnd: 0,
            note: "",
            status: ""
        };
    }


        const classes = useStyles();


    function handleSubmit() {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        axios.defaults.headers.common['Authorization'] = token;
        axios.post("http://localhost:8080/order/create", {
            orderLink: form.orderLink,
            trackingLink: form.trackingLink,
            address: form.address,
            usdPrice: form.usdPrice,
            tax: form.tax,
            totalValueUsd: form.totalValueUsd,
            rate: form.rate,
            totalValueVnd: form.totalValueVnd,
            note: form.note,
            status: form.status
        }).then(r => {
            if (r.status == 200) {
                alert("SUCCESS");
            } else {
                alert("FAIL");

            }
        }).catch();
    }

    function handleInputChange(event) {
        const {name, value} = event.target;
        setForm({...form, [name]: value})
    }

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        value = {form.orderLink}
                        required
                        id="orderLink"
                        name="orderLink"
                        label="Link Đặt Hàng"
                        fullWidth
                        autoComplete="order"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={12} style={{display: checkRole(role, ["STAFF", "MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.trackingLink}
                        id="trackingLink"
                        name="trackingLink"
                        label="Link Tracking"
                        fullWidth
                        autoComplete="tracking"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["CUSTOMER", "MANAGER", "ADMIN"])}}>
                    <TextField
                        required
                        value = {form.address}
                        id="address"
                        name="address"
                        label="Địa chỉ"
                        fullWidth
                        autoComplete="address"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value = {form.usdPrice}
                        required
                        id="usdPrice"
                        name="usdPrice"
                        label="Giá Sản phẩm (USD)"
                        fullWidth
                        autoComplete="usdPrice"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["STAFF", "MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.tax}
                        id="tax"
                        name="tax"
                        label="Tax"
                        fullWidth
                        autoComplete="tax"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.totalValueUsd}
                        id="totalValueUSD"
                        name="totalValueUSD"
                        label="Tổng giá trị đơn (USD)"
                        fullWidth
                        autoComplete="totalValueUSD"
                        disabled
                        onChange={(event) => handleInputChange(event)}

                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.rate}
                        id="rate"
                        name="rate"
                        label="Tỉ giá"
                        fullWidth
                        autoComplete="rate"
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.totalValueVnd}
                        id="totalValueVND"
                        name="totalValueVND"
                        label="Tổng giá trị đơn (VND)"
                        fullWidth
                        autoComplete="totalValueVND"
                        disabled
                        onChange={(event) => handleInputChange(event)}
                    />
                </Grid>
                <Grid item xs={12} sm={12} style={{display: checkRole(role, ["MANAGER", "ADMIN"])}}>
                    <TextField
                        value = {form.note}
                        id="note"
                        name="note"
                        label="Note"
                        fullWidth
                        autoComplete="note"
                        multiline
                        onChange={(event) => handleInputChange(event)}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["MANAGER", "ADMIN"])}}>
                    <TextField
                        id="status"
                        name="status"
                        label="Trạng thái đơn"
                        fullWidth
                        autoComplete="status"
                        disabled
                        onChange={(event) => handleInputChange(event)}
                    />
                </Grid>
                <div className={classes.buttons} style={{display: disable ? 'none' : 'block'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className={classes.button}
                        disabled={disable}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Grid>
        </React.Fragment>
    );
}

function checkRole(role, listRoles) {
    return listRoles.includes(role) ? "block" : "none";
}
