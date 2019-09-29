import React, {forwardRef} from 'react';
import {NavLink as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {List, ListItem, Button, colors} from '@material-ui/core';
import {ArrowBack, Shop, ShoppingCart} from "@material-ui/icons";
import {authentication} from "./Authentication";


const useStyles = makeStyles(theme => ({
    root: {},
    item: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0
    },
    button: {
        color: colors.blueGrey[800],
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
        color: theme.palette.icon,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1)
    },
    active: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '& $icon': {
            color: theme.palette.primary.main
        }
    }
}));

const CustomRouterLink = forwardRef((props, ref) => (
    <div
        ref={ref}
        style={{flexGrow: 1}}
    >
        <RouterLink {...props} />
    </div>
));
const pages = [
    {
        title: 'Create Order',
        href: '/ship',
        icon: <Shop/>
    },
    {
        title: 'View Orders',
        href: '/order',
        icon: <ShoppingCart/>
    },
    {
        title: 'Log out',
        href: '/logout',
        icon: <ArrowBack/>
    },
];


function Home(props) {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(undefined);
    authentication("auth/home", onChange);
    if (auth === undefined){
      return blank();
    }else if (auth) {
        return generatePage()
    } else {
        return fail()
    }
    function onChange(auth) {
        setAuth(auth);
    }

    function fail() {
        return (<div>NOT PERMITTED</div>)
    }

    function blank() {
        return (<div/>)
    }
    function generatePage() {

        return (
            <List
                className={clsx(classes.root)}
            >
                {pages.map(page => (
                    <ListItem
                        className={classes.item}
                        disableGutters
                        key={page.title}
                    >
                        <Button
                            activeClassName={classes.active}
                            className={classes.button}
                            component={CustomRouterLink}
                            to={page.href}
                        >
                            <div className={classes.icon}>{page.icon}</div>
                            {page.title}
                        </Button>
                    </ListItem>
                ))}
            </List>
        );
    }




};


export default Home;
