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
import Authentication, {authentication, URL_PREFIX} from "./Authentication";



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
    password : ""
  })


  function handleInputChange(event) {
    const {name,value} = event.target;
    setUser({...user, [name]: value})
  }


  function login() {
    console.log(user);

    let url = URL_PREFIX + "login/process?username=" + user.username + "&password=" + user.password;
    axios.post(url, {
      headers: {
        'Hose': '112.78.4.119:8080',
        'Access-Control-Allow-Origin': '*',
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
      },
    }).then(r => {
      console.log(r);
      if (r.status == 200) {
        Cookies.set('access_token', r.data.token);
        props.history.push('/home');
      } else {
        console.log("fail");
      }
    }).catch(e =>{
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
          Sign in
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
            onChange={(event)=>handleInputChange(event)}

          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={()=>login()}
          >
            Sign In
          </Button>
        </div>
      </div>
    </Container>
  );
}

