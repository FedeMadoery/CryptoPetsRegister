import React, {Component, Suspense} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {Route, Router, Switch} from 'react-router-dom';

import '../App.css';
import {DRAWER_WIDTH} from '../utilities/constants';
import history from './commons/history';
import {getAccountAndEtherBalance, initializeWeb3} from '../redux/actions';
import Header from './commons/Header';
import SideBar from './commons/SideBar';
import Loading from "./commons/Loading";
import PrivateRoute from "./commons/PrivateRoute";
import Login from "./auth/Login";
import Home from "./Home";


class Main extends Component {
    state = {
        openDrawer: false
    };

    componentDidMount() {
        const {initializeWeb3} = this.props;
        initializeWeb3("http://localhost:8545");
    }

    handleDrawerOpen = () => {
        this.setState({openDrawer: true});
    };

    handleDrawerClose = () => {
        this.setState({openDrawer: false});
    };

    render() {
        const {classes} = this.props;
        const {openDrawer} = this.state;

        return (
            <>
                <Header handleDrawerOpen={this.handleDrawerOpen}/>
                <SideBar open={openDrawer} handleDrawerClose={this.handleDrawerClose}/>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: openDrawer,
                    })}
                >
                    <Router history={history}>
                        <Suspense fallback={<Loading/>}>
                            <Switch>
                                <Route path="/" render={() => <Login/>} exact={true}/>
                                <div>
                                    <PrivateRoute path="/home" inner={Home}/>
                                </div>
                            </Switch>
                        </Suspense>
                    </Router>
                </main>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state.web3}
};

const drawerWidth = DRAWER_WIDTH;

const styles = theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
});

export default withStyles(styles)(
    connect(mapStateToProps, {initializeWeb3, getAccountAndEtherBalance})(Main)
);