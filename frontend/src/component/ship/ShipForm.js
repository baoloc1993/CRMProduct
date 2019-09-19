import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function ShipForm(role) {
  role = "ADMIN";
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
          />
        </Grid>
        <Grid item xs={12}  style = {{display: checkRole(role,["CUSTOMER","MANAGER","ADMIN"])}}>
          <TextField
            id="address"
            name="address"
            label="Địa chỉ"
            fullWidth
            autoComplete="address"
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

          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["STAFF","MANAGER","ADMIN"])}}>
          <TextField
            id="tax"
            name="tax"
            label="Tax"
            fullWidth
            autoComplete="tax"
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
          />
        </Grid>
        <Grid item xs={12} style = {{display: checkRole(role,["MANAGER","ADMIN"])}}>
          <TextField
            id="rate"
            name="rate"
            label="Tỉ giá"
            fullWidth
            autoComplete="rate"
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
          />
        </Grid>

      </Grid>
    </React.Fragment>
  );
}

function checkRole (role,listRoles){
  return listRoles.includes(role) ? "block" : "none";
}
