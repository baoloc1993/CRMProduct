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
import { createBrowserHistory } from "history";
import theme from './theme';
import ShipForm from "./component/ship/ShipForm";
import OrderDetail from "./component/order/OrderDetail";
import EditOrder from "./component/order/EditOrder";



function App() {
    const history = createBrowserHistory()
    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Switch>
                    <Route exact path='/' component={SignIn}/>
                    <Route path='/login' component={SignIn}/>
                    <Route path='/home' component={Home}/>
                    <Route path='/ship' component={Checkout}/>
                    <Route path='/order' component={LatestOrders}/>
                    <Route path='/orderDetail' component={OrderDetail}/>
                    <Route path='/editDetail' component={EditOrder}/>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App;

