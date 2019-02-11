import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {callTransaction, initializeContract, sendTransaction} from "../redux/actions";
import {interface as PetsAbi, bytecode} from "../utilities/ABIs/PetsOwnership";
import _ from 'lodash';

import {Button, FormControl, InputLabel, Select, MenuItem, TextField} from './material-ui';
import {withStyles} from "@material-ui/core";

class Home extends Component {

    state = {
        functions: [],
        selectedFunction: '',
        params: ''
    }

    componentWillMount() {
        const {initializeContract, web3Obj} = this.props;
        initializeContract(PetsAbi,"0xa124e1e201CC1fcCb084Eb2FAEA495F75B42e7af", web3Obj);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.contract !== this.props.contract){
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
        this.setState({[event.target.name]: event.target.value});
    };

    functionParameters() {
        const {selectedFunction} = this.state;
        const {classes} = this.props;
        if(selectedFunction){
            let auxArgs = _.split(selectedFunction, '(')[1].slice(0, -1);
            let args = _.split(auxArgs, ',');

            return args.map( (name, index) => (
                    <TextField
                        key={name + index}
                        id="standard-name"
                        label={name}
                        className={classes.textField}
                        value={this.state[name]}
                        onChange={this.handleInputChange(name)}
                        margin="normal"
                    />
                )
            )
        }
    }

    handleInputChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    call() {
        const {callTransaction, web3Obj, account, contract} = this.props;
        const {selectedFunction} = this.state;
        const functionToExecute = _.split(selectedFunction, '(',1);

        callTransaction(contract, functionToExecute, account, []);
    }

    send() {
        const {sendTransaction, account, contract} = this.props;
        const {selectedFunction} = this.state;
        const functionToExecute = _.split(selectedFunction, '(',1);

        sendTransaction(contract, functionToExecute, account, []);
    }


    render() {
        const {classes} = this.props;
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
                <Button variant="contained" color="primary" className={classes.button}
                    onClick={() => this.call()}>
                    Call Function
                </Button>

                <Button variant="contained" color="secondary" className={classes.button}
                        onClick={() => this.send()}>
                    Send Functions
                </Button>
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
    root: {

    },
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
    withRouter(connect(mapStateToProps, {sendTransaction, callTransaction, initializeContract})(Home))
);
