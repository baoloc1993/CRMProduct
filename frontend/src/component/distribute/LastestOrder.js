import React, {useState} from 'react';
import clsx from 'clsx';
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
import Cookies from "js-cookie";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactTable from 'react-table'
import Moment from 'moment'
import 'react-table/react-table.css'
import {URL_PREFIX} from "../Authentication";
import Header from "../Header";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DatePicker from "react-datepicker";


const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0,
        overflow: 'scroll',
        height: '850px'
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
    const [data, setData] = React.useState(undefined);
    const [date, setDate] = React.useState({
        startDate: new Date(),
        endDate: new Date()
    });
    const [customerId, setCustomerId] = React.useState("None");
    const [isDisplayTable, hasDisplayTable] = React.useState(true);
    const columns = [{
        id: "orderId",
        Header: 'Order Ref',
        accessor: 'orderId' // String-based value accessors!
    }, {
        id: "customerName",
        Header: 'Customer Name',
        accessor: d => d.customer.name,
        sortMethod: (a, b) => {
            if (a === null && b === null) return 0;
            if (a === null) return -1;
            if (b === null) return 1;
            if (a.length === b.length) {
                return a > b ? 1 : -1;
            }
            return a.length > b.length ? 1 : -1;
        },
        filterMethod: (filter, row) => {
            let value = filter.value.target.value;
            if (value === "All") return true;
            if (value === "None") return false;
            return value === row.customerName;
        },
        Filter: ({filter, onChange}) =>
            <Select value={filter ? filter.value.target.value : "All"}
                    onChange={(event) => onChange(event)}
                    name="userId"
                    id="userId"
                    label="Customer">
                <MenuItem value={"None"}>None</MenuItem>
                <MenuItem value={"All"}>All</MenuItem>
                {data.customer.map(d => (
                    <MenuItem value={d.name}>{d.name}</MenuItem>
                ))}
            </Select>

    }, {
        id: "orderLink",
        Header: 'Order Link',
        accessor: 'orderLink',
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "trackingLink",
        Header: 'Track Link',
        accessor: 'trackingLink',
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "address",
        Header: 'Ship Information',
        accessor: 'address',
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "number",
        Header: 'Quantity',
        accessor: 'number',
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "usdPrice",
        Header: 'USD Price',
        accessor: d => d.usdPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "tax",
        Header: 'Tax',
        accessor: 'tax',
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "totalUsd",
        Header: 'Total Price USD',
        accessor: d => d.totalValueUsd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }, {
        id: "rate",
        Header: 'Rate',
        accessor: d => d.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        Cell: (cellInfo) => renderEditable(cellInfo)
    }, {
        id: "totalVnd",
        Header: 'VND Price',
        accessor: d => d.totalValueVnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }, {
        id: "status",
        Header: 'Status',
        accessor: d => d.status.name,
        Cell: (cellInfo) => renderStatusEditable(cellInfo)
    }, {
        id: "assign",
        Header: 'Assign',
        accessor: d => d.personInCharge === null ? "" : d.personInCharge.username
    }, {
        id: "date",
        Header: 'Order Date Time',
        accessor: d => {
            d.orderDateTime[1] = d.orderDateTime[1] - 1;
            return Moment(d.orderDateTime)
                .local()
                .format("DD-MM-YYYY hh:mm:ss a")
        }
    }];

    function renderEditable(cellInfo) {
        return (
            <div

                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    data.order[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    setData(data);
                    saveOrder(cellInfo.row._original);
                }}
            >{data.order[cellInfo.index][cellInfo.column.id]}</div>
        );
    }

    function renderStatusEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning>
                <Select value={data.order[cellInfo.row._index].status.id}
                        onChange={(event) => handleInputChange(event, cellInfo.row._original)}>
                    {data.status.map(status => (
                        <MenuItem value={status.id}>{status.name}</MenuItem>
                    ))}

                </Select>
            </div>
        );

        function handleInputChange(event, data) {
            const {name, value} = event.target;
            let token = Cookies.get('access_token');
            token = ("Bearer " + token);
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(URL_PREFIX + "order/update", {
                id: data.id,
                orderLink: data.orderLink,
                trackingLink: data.trackingLink,
                address: data.address,
                usdPrice: data.usdPrice,
                tax: data.tax,
                totalValueUsd: data.totalValueUsd,
                rate: data.rate,
                totalValueVnd: data.totalValueVnd,
                note: data.note,
                number: data.number,
                status: value
            }).then(r => {
                if (r.status == 200) {
                    getData((a) => onChange(a));
                }
            }).catch();

        }
    }

    // const [auth, setAuth] = React.useState(undefined);

    function getData(callback) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);
        let url = window.location.href;
        let URL = URL_PREFIX + "order/getList";
        if (url.indexOf('customerId') > 0) {
            let customerId = url.split("=")[1];
            URL = URL_PREFIX + "order/getListByCustomer?customerId=" + customerId;
        }
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

    function saveOrder(data) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL_PREFIX + "order/update", {
            id: data.id,
            orderLink: data.orderLink,
            trackingLink: data.trackingLink,
            address: data.address,
            usdPrice: data.usdPrice,
            tax: data.tax,
            totalValueUsd: data.totalValueUsd,
            rate: data.rate,
            totalValueVnd: data.totalValueVnd,
            note: data.note,
            number: data.number,
            status: data.status.id
        }).then(r => {
            if (r.status == 200) {
                getData((a) => onChange(a));
            }
        }).catch();

    };

    if (data === undefined) {
        getData((a) => onChange(a));
        return blank();
    } else {
        return generatePage();
    }

    function onChange(data) {
        setData(data);
    }

    function blank() {
        return (<div/>)
    }

    function viewOrderDetail(orderId) {
        props.history.push('/orderDetail?id=' + orderId);

    }

    function editOrderDetail(orderId) {
        props.history.push('/editDetail?id=' + orderId);

    }

    function completeOrder(orderId) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        let URL = URL_PREFIX + "order/complete";
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL, {
            orderId: orderId,
        }).then(r => {
            if (r.status == 200) {
                setData(r.data);
            } else {
                setData(undefined);
            }
        }).catch(e => {
            setData(undefined);
        });
    };

    function goToCustomer(customerId) {
        window.location.href = "/order?customerId=" + customerId;
    }

    function assignStaff(event) {
        let value = event.target.value;

        let orderId = value.split("-")[0];
        let staffId = value.split("-")[1];
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        let URL = URL_PREFIX + "order/assign";
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL, {
            orderId: orderId,
            staffId: staffId
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

    function processOrder(orderId) {
        let token = Cookies.get('access_token');
        token = ("Bearer " + token);

        let URL = URL_PREFIX + "order/perform";
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(URL, {
            orderId: orderId,
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

    function handleChangeStart(startDate) {

        // getDataByDate(startDate, date.endDate, (a) => onChange(a));
        // getData((a) => filterData(a));
        // hasDisplayTable(true);
        setDate({...date, ['startDate']: startDate});
    }

    function handleChangeEnd(endDate) {

        // getDataByDate(date.startDate, endDate, (a) => onChange(a));
        // getData((a) => filterData(a));
        setDate({...date, ['endDate']: endDate});
        // hasDisplayTable(true);


    }

    function handleSelectStart(startDate) {

        setDate({...date, ['startDate']: startDate});
    }

    function handleSelectEnd(endDate) {

        setDate({...date, ['endDate']: endDate});
    }

    function handleInputChangeCustomer(event) {

        setCustomerId(event.target.value);
        // hasDisplayTable(true);
        // getData((a) => filterData(a));

    }

    function filterData(data) {
        if (customerId == 0) {
            let orders = data.order;
            let displayOrders = [];
            for (let i = 0; i < orders.length; i++) {
                let dateStr = orders[i].orderDateTime[0] + "," + (orders[i].orderDateTime[1]) + "," + orders[i].orderDateTime[2];
                let orderDate = new Date(dateStr);
                if (orderDate.getTime() > date.startDate.getTime() && orderDate.getTime() < date.endDate.getTime()) {
                    displayOrders.push(orders[i]);
                }

            }
            data.order = displayOrders;
            console.log(displayOrders);
            setData(data);
        } else {
            let orders = data.order;
            let displayOrders = [];
            for (let i = 0; i < orders.length; i++) {
                let dateStr = orders[i].orderDateTime[0] + "," + (orders[i].orderDateTime[1]) + "," + orders[i].orderDateTime[2];
                let orderDate = new Date(dateStr);
                if (orders[i].customer.id === customerId && orderDate.getTime() > date.startDate.getTime() && orderDate.getTime() < date.endDate.getTime()) {
                    displayOrders.push(orders[i]);
                }

            }
            data.order = displayOrders;
            console.log(displayOrders);
            setData(data);
        }

    }


    function generatePage() {


        return (
            <Card
                className={clsx(classes.root)}
            >
                {/*<CardHeader>*/}
                <Header/>
                {/*</CardHeader>*/}

                <Divider/>
                <CardContent className={classes.content}>
                    <br/>
                    {/*<Grid container spacing={3}>*/}
                    {/*    <Grid item xs={4}>*/}
                    {/*        <Paper className={classes.paper}>*/}
                    {/*            <Typography variant="h3" component="h3">Select Start Date</Typography>*/}
                    {/*            <DatePicker*/}
                    {/*                name="startDate"*/}
                    {/*                selected={date.startDate}*/}
                    {/*                onChange={handleChangeStart}*/}
                    {/*                onSelect={(e) => handleSelectStart(e)}/>*/}
                    {/*        </Paper>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={4}>*/}
                    {/*        <Paper className={classes.paper}>*/}
                    {/*            <Typography variant="h3" component="h3">Select End Date</Typography>*/}
                    {/*            <DatePicker*/}
                    {/*                name="endDate"*/}
                    {/*                selected={date.endDate}*/}
                    {/*                onChange={handleChangeEnd}*/}
                    {/*                onSelect={(e) => handleSelectEnd(e)}/>*/}
                    {/*        </Paper>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={4}>*/}
                    {/*        <Paper className={classes.paper}>*/}
                    {/*            <Typography variant="h3" component="h3">Select Customer</Typography>*/}
                    {/*            <Select value={customerId}*/}
                    {/*                    onChange={(event) => handleInputChangeCustomer(event)}*/}
                    {/*                    name="userId"*/}
                    {/*                    id="userId"*/}
                    {/*                    label="Customer">*/}
                    {/*                <MenuItem value={0}>All</MenuItem>*/}
                    {/*                {data.customer.map(d => (*/}
                    {/*                    <MenuItem value={d.id}>{d.name}</MenuItem>*/}
                    {/*                ))}*/}
                    {/*            </Select>*/}
                    {/*        </Paper>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                    {/*<ScrollBar>*/}
                    {/*<div className={classes.inner}>*/}
                    <br/>
                    {isDisplayTable ?
                        <ReactTable
                            data={data.order}
                            columns={columns}
                            // className="-striped -highlight"
                            resolveData={data => data.map(row => row)}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            contentEditable
                        /> : <div/>}
                    {/*</div>*/}
                    {/*</ScrollBar>*/}
                </CardContent>
            </Card>
        );
    }


};

LatestOrders.propTypes = {
    className: PropTypes.string
};


export default LatestOrders;
