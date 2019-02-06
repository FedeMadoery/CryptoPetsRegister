import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import '../App.css';
import {getAccountAndEtherBalance, initializeWeb3} from "../redux/actions";
import Header from "./commons/Header";
import SideBar from "./commons/SideBar";
import {DRAWER_WIDTH} from "../utilities/constants";


class Home extends Component {
    state = {
        openDrawer: false
    };

    componentDidMount() {
        const {initializeWeb3} = this.props;
        initializeWeb3("http://localhost:8545");
    }

    handleDrawerOpen = () => {
        this.setState({ openDrawer: true });
    };

    handleDrawerClose = () => {
        this.setState({ openDrawer: false });
    };

    render() {
        const {classes} = this.props;
        const {openDrawer} = this.state;

        return (
            <>
                <Header handleDrawerOpen={this.handleDrawerOpen}></Header>
                <SideBar open={openDrawer} handleDrawerClose={this.handleDrawerClose}></SideBar>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: openDrawer,
                    })}
                >
                    <h1>Home</h1>
                </main>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state.web3}
};

const drawerWidth = DRAWER_WIDTH;

const styles = theme =>  ({
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

export default withStyles(styles)(
    connect(mapStateToProps, {initializeWeb3, getAccountAndEtherBalance})(Home)
);