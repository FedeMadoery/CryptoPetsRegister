import {Component} from "react";
import React from "react";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import _ from 'lodash';

import {
    subscribeToContractEvent,
    getAccountAndEtherBalance,
    initializeWeb3,
    _deleteNotification,
    _resetPendingNotification
} from "../../redux/actions";
import {
    AppBar, Toolbar, IconButton, Typography, InputBase, Badge, Menu, MenuItem, ListItemIcon, ListItemText,
    MenuIcon, SearchIcon, MailIcon, NotificationsIcon, AccountCircle, MoreIcon, WalletIcon, MoneyIcon,
    fade, DeleteIcon
} from '../material-ui'

class Header extends Component {
    state = {
        anchorAccEl: null,
        anchorNotEl: null,
    };

    componentWillMount() {
        const {initializeWeb3} = this.props;
        initializeWeb3("http://localhost:8545");
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {web3Obj, contract} = this.props.web3;
        const {subscribeToContractEvent} = this.props;
        if (web3Obj && nextProps.web3.contract !== contract && nextProps.web3.contract) {
            if (nextProps.web3.subscribedEvents.indexOf("NewPet") === -1)
                subscribeToContractEvent(nextProps.web3.contract, "NewPet");
            if (nextProps.web3.subscribedEvents.indexOf("OwnershipTransferred") === -1 )
                subscribeToContractEvent(nextProps.web3.contract, "OwnershipTransferred");
            if (nextProps.web3.subscribedEvents.indexOf("Transfer") === -1)
                subscribeToContractEvent(nextProps.web3.contract, "Transfer") ;
        }
    }

    handleClose = (name) => {
        this.setState({[name]: null});
        const {web3, _resetPendingNotification} = this.props;
        if (web3.pendingNotifications) _resetPendingNotification();

    };

    handleOpen = (name, event) => {
        this.setState({[name]: event.currentTarget});
    };

    renderNotification() {
        const {classes, _deleteNotification} = this.props;
        const {notifications} = this.props.web3;

        return notifications.map((n, index) => {
            let text;
            switch (n.event) {
                case "NewPet":
                    text = (<ListItemText classes={{primary: classes.primary}} inset
                                          primary={n.event}
                                          secondary={'Se creo la mascota de nombre: ' + n.returnValues.name}/>);
                    break;
                case "Transfer":
                    text = (<ListItemText classes={{primary: classes.primary}} inset
                                          primary={n.event}
                                          secondary={'Se hizo una transferencia de: ' + n.returnValues._tokenId}/>);
                    break;
                case "OwnershipTransferred":
                    text = (<ListItemText classes={{primary: classes.primary}} inset
                                          primary={n.event}
                                          secondary={n.returnValues.previousOwner + ' ya no es mas el owner'}/>);
                    break;
                default:
                    text = (<ListItemText classes={{primary: classes.primary}} inset
                                          primary={n.event}
                                          secondary={'Notificacion sin formato'}/>);
                    break;
            }

            return (
                <MenuItem className={classes.menuItem} key={n}>
                    {text}
                    <ListItemIcon className={classes.icon} onClick={() => _deleteNotification(index)}>
                        <DeleteIcon/>
                    </ListItemIcon>
                </MenuItem>
            )
        })
    }

    render() {
        const {classes, handleDrawerOpen} = this.props;
        const {balance, account, pendingNotifications} = this.props.web3;
        const accountTruncated = _.truncate(account, {'length': 6,}) + account.slice(-4);
        const {anchorAccEl, anchorNotEl} = this.state;
        const isMenuOpen = Boolean(anchorAccEl);
        const isNotifOpen = Boolean(anchorNotEl) && !!pendingNotifications;


        const accountInfo = (
            <Menu
                anchorEl={anchorAccEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMenuOpen}
                onClose={() => this.handleClose('anchorAccEl')}
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

        const notificationInfo = (
            <Menu
                anchorEl={anchorNotEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isNotifOpen}
                onClose={() => this.handleClose('anchorNotEl')}
            >
                {this.renderNotification()}
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
                            <IconButton color="inherit"
                                        onClick={(event) => this.handleOpen('anchorNotEl', event)}>
                                <Badge badgeContent={pendingNotifications} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={(event) => this.handleOpen('anchorAccEl', event)}
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
                {notificationInfo}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state}
};

const mapDispatchToProps = {
    initializeWeb3,
    getAccountAndEtherBalance,
    subscribeToContractEvent,
    _resetPendingNotification,
    _deleteNotification
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
    connect(mapStateToProps, mapDispatchToProps)(Header)
);