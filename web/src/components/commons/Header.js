import {Component} from "react";
import React from "react";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import _ from 'lodash';

import {getAccountAndEtherBalance, initializeWeb3} from "../../redux/actions/Web3Actions";
import {
    AppBar, Toolbar, IconButton, Typography, InputBase, Badge, Menu, MenuItem, ListItemIcon, ListItemText,
    MenuIcon, SearchIcon, MailIcon, NotificationsIcon, AccountCircle, MoreIcon, WalletIcon, MoneyIcon,
    fade
} from '../material-ui'

class Header extends Component {
    state = {
        isMenuOpen: false,
        pendingNotifications: 1, // TODO Move to Redux in future feature
    };

    componentDidMount() {
        const {initializeWeb3} = this.props;
        initializeWeb3("http://localhost:8545");
    }

    handleMenuClose = () => {
        this.setState({anchorEl: null});
    };

    handleProfileMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    render() {
        const {classes, handleDrawerOpen} = this.props;
        const {balance, account} = this.props.web3;
        const accountTruncated = _.truncate(account, {'length': 6,}) + account.slice(-4);
        const {anchorEl, pendingNotifications} = this.state;
        const isMenuOpen = Boolean(anchorEl);


        const accountInfo = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <WalletIcon/>
                    </ListItemIcon>
                    <ListItemText classes={{primary: classes.primary}} inset primary={accountTruncated}/>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <MoneyIcon/>
                    </ListItemIcon>
                    <ListItemText classes={{primary: classes.primary}} inset primary={balance + ' Ethers'}/>
                </MenuItem>
            </Menu>
        );

        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={handleDrawerOpen}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            Crypto-React-Init
                        </Typography>
                        <div className={classes.search} hidden={true /* Enable if tis needed */}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.grow}/>
                        <div className={classes.sectionDesktop}>
                            <div hidden={true /* Enable if tis needed */}>
                                <IconButton color="inherit">
                                    <Badge badgeContent={4} color="secondary">
                                        <MailIcon/>
                                    </Badge>
                                </IconButton>
                            </div>
                            <IconButton color="inherit">
                                <Badge badgeContent={pendingNotifications} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                <MoreIcon/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {accountInfo}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state}
};

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

export default withStyles(styles)(
    connect(mapStateToProps, {initializeWeb3, getAccountAndEtherBalance})(Header)
);