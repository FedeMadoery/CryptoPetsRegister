import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import '../App.css';
import {getAccountAndEtherBalance, initializeWeb3} from "../redux/actions";
import Header from "./commons/Header";


class Home extends Component {

    componentDidMount() {
        const {initializeWeb3} = this.props;
        initializeWeb3("http://localhost:8545");

    }

    async getData() {
        const {web3Obj, getAccountAndEtherBalance} = this.props;
        getAccountAndEtherBalance(web3Obj);
    }

    setWeb3Error(error) {
        console.log(error);
    }

    render() {
        const {balance, account} = this.props;
        return (
            <>
                <Header></Header>
                <h1>Home</h1>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state.web3}
};

const styles = {

};

export default withStyles(styles)(
    connect(mapStateToProps, {initializeWeb3, getAccountAndEtherBalance})(Home)
);