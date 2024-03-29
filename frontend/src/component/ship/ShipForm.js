import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import {Route} from "react-router";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {URL_PREFIX} from "../Authentication";

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

const ShipForm = props => {
    let role = props.role;
    let disable = props.disable;
    let data = props.data;
    let statuses = props.statuses;
    const [formData, setForm] = React.useState(data);
    let form = formData;
    if (form == undefined) {
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
            number: 0,
            status: {
                id: -1,
                name : ""
            },
            customerName: ""
        };
    }


    const classes = useStyles();
    function handleConfirm(){
        let url = window.location.href;
        let id = url.split("=")[1];
        if (id !== undefined){
            handleUpdate(id);
        }else{
            handleSubmit();
        }
    }

    function handleUpdate(id) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL_PREFIX + "order/update", {
            id: id,
            orderLink: form.orderLink,
            trackingLink: form.trackingLink,
            address: form.address,
            usdPrice: form.usdPrice,
            tax: form.tax,
            totalValueUsd: form.totalValueUsd,
            rate: form.rate,
            totalValueVnd: form.totalValueVnd,
            note: form.note,
            status: form.status,
            number: form.number,
            customerName : form.customerName
        }).then(r => {
            if (r.status == 200) {
                alert("SUCCESS");
                window.location.href="/order";

            } else {
                alert("FAIL");

            }
        }).catch();
    }


    function handleSubmit() {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL_PREFIX + "order/create", {
            orderLink: form.orderLink,
            trackingLink: form.trackingLink,
            address: form.address,
            usdPrice: form.usdPrice,
            tax: form.tax,
            totalValueUsd: form.totalValueUsd,
            rate: form.rate,
            totalValueVnd: form.totalValueVnd,
            note: form.note,
            status: form.status.id,
            number: form.number,
            customerName  :form.customerName
        }).then(r => {
            if (r.status == 200) {
                alert("SUCCESS");
                window.location.href="/order";
            } else {
                alert(r.data);
            }
        }).catch(e=>{
            alert(e);
        });
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
                        value={form.orderLink}
                        required
                        id="orderLink"
                        name="orderLink"
                        label="Link Đặt Hàng"
                        fullWidth
                        autoComplete="order"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={12} style={{display: checkRole(role, ["CUSTOMER", "STAFF", "ADMIN"])}}>
                    <TextField
                        value={form.trackingLink}
                        id="trackingLink"
                        name="trackingLink"
                        label="Link Tracking"
                        fullWidth
                        autoComplete="tracking"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["CUSTOMER", "STAFF", "ADMIN"])}}>
                    <TextField
                        required
                        value={form.address}
                        id="address"
                        name="address"
                        label="Thông tin ship"
                        fullWidth
                        autoComplete="address"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={form.usdPrice}
                        type="number"
                        required
                        id="usdPrice"
                        name="usdPrice"
                        label="Giá Sản phẩm (USD)"
                        fullWidth
                        autoComplete="usdPrice"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["CUSTOMER", "STAFF", "ADMIN"])}}>
                    <TextField
                        value={form.tax}
                        type="number"
                        id="tax"
                        name="tax"
                        label="Tax"
                        fullWidth
                        autoComplete="tax"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["STAFF", "ADMIN"])}}>
                    <TextField
                        value={form.totalValueUsd}
                        type="number"
                        id="totalValueUSD"
                        name="totalValueUSD"
                        label="Tổng giá trị đơn (USD)"
                        fullWidth
                        autoComplete="totalValueUSD"
                        inputprops={{
                            readOnly: disable,
                        }}

                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, [ "ADMIN"])}}>
                    <TextField
                        value={form.rate}
                        type="number"
                        id="rate"
                        name="rate"
                        label="Tỉ giá"
                        fullWidth
                        autoComplete="rate"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["ADMIN"])}}>
                    <TextField
                        value={form.totalValueVnd}
                        type="number"
                        id="totalValueVND"
                        name="totalValueVND"
                        label="Tổng giá trị đơn (VND)"
                        fullWidth
                        autoComplete="totalValueVND"
                        inputprops={{
                            readOnly: disable,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} style={{display: checkRole(role, ["CUSTOMER", "STAFF", "ADMIN"])}}>
                    <TextField
                        value={form.number}
                        type="number"
                        id="number"
                        name="number"
                        label="Số Lượng"
                        fullWidth
                        autoComplete="number"
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}/>
                </Grid>
                <Grid item xs={12} sm={12} style={{display: checkRole(role, ["CUSTOMER", "STAFF", "ADMIN"])}}>
                    <TextField
                        value={form.note}
                        id="note"
                        name="note"
                        label="Ghi chú"
                        fullWidth
                        autoComplete="note"
                        multiline
                        onChange={(event) => handleInputChange(event)}
                        inputprops={{
                            readOnly: disable,
                        }}/>
                </Grid>
                <Grid item xs={12} style={{display: checkRole(role, ["STAFF", "ADMIN"])}}>
                    <Select value={form.status.id}
                            onChange={(event) => handleInputChange(event)}
                            name="status"
                            id="status"
                            label="Trạng thái đơn"
                            inputprops={{
                                readOnly: disable,
                            }}>
                        {statuses.map(status=>(
                            <MenuItem value={status.id}>{status.name}</MenuItem>
                        ))}

                    </Select>
                </Grid>
                <div className={classes.buttons} style={{display: disable ? 'none' : 'block'}}>
                    <Button variant="contained" color="primary"
                            onClick={handleConfirm} className={classes.button}>
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

export default ShipForm;
