import {
    accountChangedSubscription, callMethod,
    getAccountAndBalance,
    initializationWeb3,
    networkChangedSubscription, sendMethod
} from "../../utilities/web3Utilities";

import {
    _errorInitializeWeb3,
    _initializeWeb3,
    _sendingTransactionWeb3,
    _updateAccount,
    _updateBalance
} from "./Web3DefaultActions";

/** Action to initialize Web3 and trow error or subscribe for network and account change **/
export function initializeWeb3(providerUrl) {
    providerUrl = providerUrl || "http://localhost:8545";

    return (dispatch) => {
        initializationWeb3(
            (web3Obj) => initAndSubscribeWeb3(web3Obj, dispatch), //Workaround to have context - TODO Make better
            errorInitializeWeb3,
            providerUrl
        );
    }
}

/** Action to get the Account and Balance in Ethers by default **/
export function getAccountAndEtherBalance(web3, formatUnit) {
    return (dispatch) => {
        getAccountAndBalance(web3, formatUnit)
            .then( (result) => {
                dispatch(_updateAccount(result.account));
                dispatch(_updateBalance(result.balance));
        });
    }
}

/** Action to call a function that not alter the smart contract state.  **/
export function sendTransaction(contract, methodName, parameters) {
    return (dispatch) => {
        dispatch(_sendingTransactionWeb3(true));
        sendMethod(contract, methodName, parameters).then(
            (result) => {
                // result can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                dispatch(_sendingTransactionWeb3(false));
                console.log(result);
            }
        )
    }
}

/** Action to call a function that alter the smart contract state. **/
export function callTransaction(contract, methodName, parameters) {
    return (dispatch) => {
        dispatch(_sendingTransactionWeb3(true));
        callMethod(contract, methodName, parameters).then(
            (result) => {
                dispatch(_sendingTransactionWeb3(false));
                console.log(result);
            }
        )
    }
}

/**----------------------------------- Internal Functions -----------------------------------------------**/

/** Function to subscribe for changes a dispatch _init **/
function initAndSubscribeWeb3(web3Obj, dispatch) {

    // Request Account Address and Balance
    getAccountAndBalance(web3Obj,)
        .then( (result) => {
            dispatch(_updateAccount(result.account));
            dispatch(_updateBalance(result.balance));
        });
    // Subscribe to any account change
    accountChangedSubscription(web3Obj,
        (accAndBal) => {
            dispatch(_updateAccount(accAndBal.account));
            dispatch(_updateBalance(accAndBal.balance));
        });
    // Subscribe to any network change
    networkChangedSubscription(web3Obj,
        (balAndNet) => {
            console.log(balAndNet.balance);                 //TODO
            console.log(balAndNet.currentNetwork)           //TODO
        });

    dispatch(_initializeWeb3(web3Obj))
}

/** Function to handler error and dispatch _error **/
function errorInitializeWeb3(error) {
    return (dispatch) => {
        console.log(error);
        dispatch(_errorInitializeWeb3(error));
    }
}
