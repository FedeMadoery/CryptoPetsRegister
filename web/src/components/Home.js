import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {callTransaction, initializeContract, sendTransaction, sendTransactionWithMoney} from "../redux/actions";
import {interface as PetsAbi} from "../utilities/ABIs/PetsOwnership";
import _ from 'lodash';

import {Button, FormControl, InputLabel, Select, MenuItem, TextField} from './material-ui';
import {withStyles} from "@material-ui/core";
import Loading from "./commons/Loading";

class Home extends Component {

    state = {
        functions: [],
        selectedFunction: '',
        params: []
    }

    componentWillMount() {
        const {initializeContract, web3Obj} = this.props;
        initializeContract(PetsAbi, "0xaDc5B4176e9136068E5dbCF8a59eA755e7Af42b5", web3Obj);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.contract !== this.props.contract) {
            const functions = _.remove(Object.keys(nextProps.contract.methods), function (e) {
                return e.indexOf("0x") === -1 && e.indexOf('(') !== -1
            });
            this.setState({functions: functions})

        }
    }

    menuItems() {
        const {functions} = this.state;

        return functions.map((f) => (<MenuItem value={f} key={f}>{f}</MenuItem>))
    }

    handleChange = event => {
        let auxArgs = _.split(event.target.value, '(')[1].slice(0, -1);
        let args = _.split(auxArgs, ',');
        let params = [];
        if(args[0] !== '') {
            params = _.times(args.length, () => '');
        }
        this.setState({[event.target.name]: event.target.value, params});
    };

    functionParameters() {
        const {selectedFunction} = this.state;
        const {classes} = this.props;
        if (selectedFunction) {
            let auxArgs = _.split(selectedFunction, '(')[1].slice(0, -1);
            let args = _.split(auxArgs, ',');
            if (args[0] !== '') {
                return args.map((name, index) => (
                        <TextField
                            key={name + index}
                            type={name.indexOf("uint") === -1 ? "string" : "number"}
                            id="standard-name"
                            label={name}
                            className={classes.textField}
                            value={this.state.params[index]}
                            onChange={this.handleInputChange(index, name)}
                            margin="normal"
                        />
                    )
                )
            }
        }
    }

    handleInputChange = (index, name) => event => {
        event.persist();
        console.log(this.state)
        this.setState((state) => {
            return {
                params: state.params.map((p, i) => {
                    if (name.indexOf("uint") === -1) {
                        return i !== index ? p : event.target.value
                    } else {
                        return i !== index ? p : Number(event.target.value)
                    }
                })
            }
        });
    };

    call() {
        const {callTransaction, account, contract} = this.props;
        const {selectedFunction, params} = this.state;
        const functionToExecute = _.split(selectedFunction, '(', 1);

        callTransaction(contract, functionToExecute, account, params);
        //contract.methods.pets(0).call({from:account}).then(console.log);
    }

    send() {
        const {sendTransaction, account, contract} = this.props;
        const {selectedFunction, params} = this.state;
        const functionToExecute = _.split(selectedFunction, '(', 1);

        sendTransaction(contract, functionToExecute, account, params);
    }

    sendWithMoney() {
        const {sendTransactionWithMoney, account, contract, web3Obj} = this.props;
        const {selectedFunction, params} = this.state;
        const functionToExecute = _.split(selectedFunction, '(', 1);

        sendTransactionWithMoney(contract, web3Obj, functionToExecute, account, params, 0.001);
    }

    render() {
        const {classes, sendingTransactions} = this.props;
        return (
            <>
                <h1>Functions in Smart-Contract</h1>
                <br/>

                <form className={classes.root} autoComplete="off">
                    <FormControl className={classes.formControl}>
                        <InputLabel>Functions</InputLabel>
                        <Select
                            autoWidth={true}
                            value={this.state.selectedFunction}
                            onChange={this.handleChange}
                            inputProps={{name: 'selectedFunction', id: 'functions-simple',}}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {this.menuItems()}
                        </Select>
                    </FormControl>
                    <br/>
                    {this.functionParameters()}
                </form>

                <br/>
                {sendingTransactions && <Loading/>}
                {!sendingTransactions && (
                    <Button variant="contained" color="primary" className={classes.button}
                            onClick={() => this.call()}>
                        Call Function
                    </Button>
                )}
                {!sendingTransactions && (
                    <Button variant="contained" color="secondary" className={classes.button}
                            onClick={() => this.send()}>
                        Send Functions
                    </Button>
                )}
                {!sendingTransactions && (
                    <Button variant="contained" color="secondary" className={classes.button}
                            onClick={() => this.sendWithMoney()}>
                        Send Functions Whit Money
                    </Button>
                )}
            </>
        );


    }

}

const mapStateToProps = (state) => {
    return {...state.web3};
};

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    root: {},
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

export default withStyles(styles)(
    withRouter(connect(mapStateToProps, {sendTransaction, callTransaction, initializeContract, sendTransactionWithMoney})(Home))
);
