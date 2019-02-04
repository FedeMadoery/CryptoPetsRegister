import React, {Component} from 'react';
import '../App.css';
import {getAccountAndBalance, initializationWeb3} from "../utilities/web3Utilities";


class Home extends Component {
    state = {
        account: '',
        balance: '',
        web3: {},
        contract: {}
    };
    //TODO Implement Redux - Soon as possible

    componentDidMount() {
        initializationWeb3(
            window,
            (web3Obj) => this.setWeb3(web3Obj), //Workaround to have context - TODO Make better
            this.setWeb3Error,
            "http://localhost:8545"
        );
        // TODO Need deal with .enable() bug - If user dont notice that app need approval

    }

    setWeb3(web3Obj) {
        this.setState(web3Obj);
    }

    async getData() {
        // TODO change this for a method that return accounts and balance at once
        const {web3} = this.state;
        const {account, balance} = await getAccountAndBalance(web3);
        this.setState({account, balance});
    }


    setWeb3Error(error) {
        console.log(error);
    }

    render() {
        const {balance, account} = this.state;
        return (
            <>
                <h1>Home</h1>

                <button onClick={() => this.getData()}>
                    getData
                </button>

                <h3>{'Account: ' + account}</h3>
                <h5>{'Balance: ' + balance / 10 ** 18 + ' Ether'}</h5>
            </>
        );
    }
}

export default Home;
