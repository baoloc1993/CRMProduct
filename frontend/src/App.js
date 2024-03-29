import React from 'react';
import logo from './logo.svg';
import './App.css';
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import LatestOrders from "./component/distribute/LastestOrder";
import Grid from "@material-ui/core/Grid";
import Checkout from "./component/ship/Checkout";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from "./component/Home";
import SignIn from "./component/Login";
import {createBrowserHistory} from "history";
import theme from './theme';
import ShipForm from "./component/ship/ShipForm";
import OrderDetail from "./component/order/OrderDetail";
import EditOrder from "./component/order/EditOrder";
import {logout} from "./component/Logout";
import Register from "./component/account/Register";
import ListUser from "./component/account/ListUser";
import DailyReport from "./component/report/DailyReport";
import Payment from "./component/report/Payment";
import ImportData from "./component/data/ImportData";


function App() {
  const history = createBrowserHistory()
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/login' component={SignIn}/>
          <Route path='/home' component={Home}/>
          <Route path='/ship' component={Checkout}/>
          <Route path='/order' component={LatestOrders}/>
          <Route path='/orderDetail' component={OrderDetail}/>
          <Route path='/editDetail' component={EditOrder}/>
          <Route path='/logout' component={logout}/>
          <Route path='/addUser' component={Register}/>
          <Route path='/listUser' component={ListUser}/>
          <Route path='/report' component={DailyReport}/>
          <Route path='/makePayment' component={Payment}/>
          <Route path='/importData' component={ImportData}/>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;

