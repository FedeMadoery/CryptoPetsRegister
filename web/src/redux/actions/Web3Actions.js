import {
    accountChangedSubscription, callMethod,
    getAccountAndBalance,
    initializationWeb3,
    networkChangedSubscription, sendMethod, sendMethodWithMoney
} from "../../utilities/web3Utilities";

import {
    _errorInitializeWeb3, _initializeContract,
    _initializeWeb3,
    _sendingTransactionWeb3,
    _updateAccount,
    _updateBalance
} from "./Web3DefaultActions";
import {interface as PetsAbi} from "../../utilities/ABIs/PetsOwnership";

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

/**
 * Action to initialize a Contract
 * @param contractAbi
 * @param contractAddress
 * @param web3Obj
 * @returns {Function}
 */
export function initializeContract(contractAbi, contractAddress, web3Obj) {
    return (dispatch) => {
        const contract = new web3Obj.eth.Contract(
            JSON.parse(contractAbi),
            contractAddress
        );
        dispatch(_initializeContract(contract));
    }
}

/**
 * Action to get the Account and Balance in Ethers by default
 * @param web3
 * @param formatUnit
 * @returns {Function}
 */
export function getAccountAndEtherBalance(web3, formatUnit) {
    return (dispatch) => {
        getAccountAndBalance(web3, formatUnit)
            .then((result) => {
                dispatch(_updateAccount(result.account));
                dispatch(_updateBalance(result.balance));
            });
    }
}

/**
 * Action to call a function that alter the smart contract state.
 * @param contract
 * @param methodName
 * @param account
 * @param parameters
 * @returns {Function}
 */
export function sendTransaction(contract, methodName, account, parameters) {
    return (dispatch) => {
        dispatch(_sendingTransactionWeb3(true));
        sendMethod(contract, methodName, account, parameters).then(
            (result) => {
                // result can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                dispatch(_sendingTransactionWeb3(false));
                console.log(result);
            }
        ).catch((error) => {
            console.log({error: error}) // TODO Wrap errors
        })
    }
}


/**
 * Action to call a function that not alter the smart contract state, and send money with it
 * @param contract
 * @param web3Obj
 * @param methodName
 * @param account
 * @param parameters
 * @param money
 * @returns {Function}
 */
export function sendTransactionWithMoney(contract, web3Obj, methodName, account, parameters, money) {
    return (dispatch) => {
        dispatch(_sendingTransactionWeb3(true));
        sendMethodWithMoney(contract, web3Obj, methodName, parameters, money, account).then(
            (result) => {
                // result can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                dispatch(_sendingTransactionWeb3(false));
                console.log(result);
            }
        ).catch((error) => {
            console.log({error: error}) // TODO Wrap errors
        })
    }
}

/** Action to call a function that not alter the smart contract state. **/
export function callTransaction(contract, methodName, account, parameters) {
    return (dispatch) => {
        dispatch(_sendingTransactionWeb3(true));
        callMethod(contract, methodName, account, parameters).then(
            (result) => {
                dispatch(_sendingTransactionWeb3(false));
                console.log(result);
            }
        ).catch((error) => {
            console.log({error: error}) // TODO Wrap errors
        })
    }
}

/**----------------------------------- Internal Functions -----------------------------------------------**/

/** Function to subscribe for changes a dispatch _init **/
function initAndSubscribeWeb3(web3Obj, dispatch) {

    // Request Account Address and Balance
    getAccountAndBalance(web3Obj,)
        .then((result) => {
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
