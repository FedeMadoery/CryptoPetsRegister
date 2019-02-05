import React, {Component} from 'react';
import {connect} from 'react-redux';

import '../App.css';
import {getAccountAndEtherBalance, initializeWeb3} from "../redux/actions/Web3Actions";


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
                <h1>Home</h1>

                <button onClick={() => this.getData()}>
                    getData
                </button>

                <h3>{'Account: ' + account}</h3>
                <h5>{'Balance: ' + balance + ' Ether'}</h5>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {...state.web3}
};

export default connect(mapStateToProps, {initializeWeb3, getAccountAndEtherBalance})(Home);