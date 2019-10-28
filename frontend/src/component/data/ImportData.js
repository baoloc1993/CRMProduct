import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Cookies from "js-cookie";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ReactFileReader from 'react-file-reader';
import DatePicker from "react-datepicker";
import {URL_PREFIX} from "../Authentication";
import Header from "../Header";
import Container from "@material-ui/core/Container";

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


export default function ImportData() {
  const classes = useStyles();
  const [form, setForm] = React.useState({
    userId: 0,
    date: new Date(),
    data : ""
  });
  const [customers, setCustomers] = React.useState([]);

  function handleInputChange(event) {
    const {name, value} = event.target;
    setForm({...form, [name]: value})
  }

  function handleChange(date) {

    setForm({...form, ['date']: date});

  }

  function handleSelect(date) {

    setForm({...form, ['date']: date});
  }

  function handleConfirm() {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL_PREFIX + "data/migrateData", {
      userId: form.userId,
      date: form.date,
      data : form.data
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
    let URL = URL_PREFIX + "data/getCustomers";
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(URL, {}).then(r => {
      if (r.status == 200) {
        callback(r.data.customers);
      } else {
        return blank();
      }
    }).catch(e => {
      console.log(e);
      return blank();
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

  function handleFiles(files) {
    var reader = new FileReader();
    reader.onload = function (e) {
      // Use reader.result
      setForm({...form, ['data']: reader.result});
    }
    reader.readAsText(files[0]);
  }

  function generatePage() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <Header/>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Migrate Data
            </Typography>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3" component="h3">Customer</Typography>
                  <Select value={form.userId}

                          onChange={(event) => handleInputChange(event)}
                          name="userId"
                          id="userId"
                          label="Customer">
                    {customers.map(d => (
                      <MenuItem value={d.id}>{d.username}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <ReactFileReader handleFiles={handleFiles} fileTypes={'.tsv'}>
                    <Button className='btn'>Upload</Button>
                  </ReactFileReader>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h3" component="h3">Select Date</Typography>
                  <DatePicker
                    name="startDate"
                    selected={form.date}
                    onChange={(e) => handleChange(e)}
                    onSelect={(e) => handleSelect(e)}/>
                </Grid>
                <Grid>
                  <div className={classes.buttons}>
                    <Button variant="contained" color="primary"
                            onClick={handleConfirm} className={classes.button}>
                      Xác nhận
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
    return blank();
  }
}
