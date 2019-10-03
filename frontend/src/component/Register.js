import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Cookies from 'js-cookie'
import axios from "axios";
import {Redirect} from "react-router-dom";
import Authentication, {authentication} from "./Authentication";



const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [user, setUser] = React.useState({
    username : "",
    password : "",
    name  : ""
  })


  function handleInputChange(event) {
    const {name,value} = event.target;
    setUser({...user, [name]: value})
  }


  function addUser() {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    axios.defaults.headers.common['Authorization'] = token;
    let url = "http://112.78.4.119:8080/login/addUser";
    axios.post(url, {
      username : user.username,
      password : user.password,
      name : user.name
    }).then(r => {
      if (r.status == 200) {
        alert("OK");
        setUser({
          username: "",
          password : "",
          name : ""
        });
      } else {
        alert("Fail");
      }
    }).catch(e =>{
      alert("Fail");
      console.log(e);
    });


  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add User
        </Typography>
        <div className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="email"
            value = {user.username}
            onChange={(event)=>handleInputChange(event)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value = {user.password}
            onChange={(event)=>handleInputChange(event)}

          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            type="name"
            id="name"
            autoComplete="name"
            value = {user.name}
            onChange={(event)=>handleInputChange(event)}

          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={()=>addUser()}
          >
            Register
          </Button>
        </div>
      </div>
    </Container>
  );
}

