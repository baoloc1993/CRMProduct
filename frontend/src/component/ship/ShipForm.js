import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
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
  const [form, setForm] = React.useState({
    orderLink: "",
    trackingLink: "",
    address: "",
    usdPrice: 0.00,
    tax: 0.00,
    totalValueUSD: 0.00,
    rate : 0.00,
    totalValueVND: 0,
    note : "",
    status : ""
  });
  const classes = useStyles();


  function handleSubmit() {
    axios.post("http://localhost:8080/order/submit", {
      form
    })
      .then(res => {
        this.data = res.data;
        this.setState({

        });
      });
  }

  function handleInputChange(event) {
    const {name,value} = event.target;
    setForm({...form, [name]: value})
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="orderLink"
            name="orderLink"
            label="Link Đặt Hàng"
            fullWidth
            autoComplete="order"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={12} style = {{display: checkRole(role,["STAFF","MANAGER","ADMIN"])}} >
          <TextField
            required
            id="trackingLink"
            name="trackingLink"
            label="Link Tracking"
            fullWidth
            autoComplete="tracking"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12}  style = {{display: checkRole(role,["CUSTOMER","MANAGER","ADMIN"])}}>
          <TextField
            id="address"
            name="address"
            label="Địa chỉ"
            fullWidth
            autoComplete="address"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            required
            id="usdPrice"
            name="usdPrice"
            label="Giá Sản phẩm (USD)"
            fullWidth
            autoComplete="usdPrice"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["STAFF","MANAGER","ADMIN"])}}>
          <TextField
            id="tax"
            name="tax"
            label="Tax"
            fullWidth
            autoComplete="tax"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="totalValueUSD"
            name="totalValueUSD"
            label="Tổng giá trị đơn (USD)"
            fullWidth
            autoComplete="totalValueUSD"
            disabled
            onChange={(event)=>handleInputChange(event)}

          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="rate"
            name="rate"
            label="Tỉ giá"
            fullWidth
            autoComplete="rate"
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="totalValueVND"
            name="totalValueVND"
            label="Tổng giá trị đơn (VND)"
            fullWidth
            autoComplete="totalValueVND"
            disabled
            onChange={(event)=>handleInputChange(event)}
          />
        </Grid>
        <Grid item xs={12} sm={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="note"
            name="note"
            label="Note"
            fullWidth
            autoComplete="note"
            multiline
            onChange={(event)=>handleInputChange(event)}
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="status"
            name="status"
            label="Trạng thái đơn"
            fullWidth
            autoComplete="status"
            disabled
            onChange={(event)=>handleInputChange(event)}
          />
        </Grid>
        <div className={classes.buttons} style = {{display : disable ? 'none' : 'block' }}>
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

function checkRole (role,listRoles){
  return listRoles.includes(role) ? "block" : "none";
}
