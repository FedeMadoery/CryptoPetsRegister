import Web3 from "web3";
import {ETHEREUM_ACCESS_DENIED, NO_WEB3} from "./constants";

export function initializationWeb3(window, setWeb3, setWeb3Error, providerURL) {
    const {web3, ethereum} = window;
    providerURL = providerURL || "http://localhost:8545";
    console.log(web3);
    // for modern dapp browsers
    if (ethereum)
        ethereum.enable()
            .then(() => {
                const web3js = new Web3(ethereum);
                setWeb3({web3: web3js});
            })
            .catch(deniedAccessMessage => {
                const deniedAccessError = new Error(deniedAccessMessage.toString());
                deniedAccessError.code = ETHEREUM_ACCESS_DENIED;
                setWeb3Error(deniedAccessError)
            });

    // for legacy dapp browsers
    else if (web3 && web3.currentProvider) {
        const web3js = new Web3(web3.currentProvider);
        setWeb3({web3: web3js});
    }

    // use providerURL as a backup
    else if (providerURL) {
        const web3js = new Web3(providerURL);
        setWeb3({web3: web3js});
    }

    // no web3 detected
    else {
        const noWeb3Error = new Error('No Web3 Provider Detected.');
        noWeb3Error.code = NO_WEB3;
        setWeb3Error(noWeb3Error)
    }
}

export function _getBalance(web3, account, format = 'ether') {
    return web3.eth.getBalance(account)
        .then(balance => web3.utils.fromWei(balance, format))
}

export function _getAccount(web3) {
    return web3.eth.getAccounts().then((accs, err) => {
        if (err != null) return new Error("An error occurred: " + err);
        else if (accs.length === 0) return new Error("User is not logged");
        return accs[0];
    });
}

export async function getAccountAndBalance(web3) {
    const account = await _getAccount(web3);
    const balance = await _getBalance(web3, account);
    return {account, balance};
}

export function instantiateContract(web3, _ABI, _ContractAddress) {
    return new web3.eth.Contract(_ABI, _ContractAddress);
}

export function callMethod(contract, methodName, parameters) {
    return contract.methods[methodName](parameters).call()
}

export function sendMethod(contract, methodName, parameters) {
    return contract.methods[methodName](parameters).send()
}

export function sendMethodWithMoney(contract, web3, methodName, parameters, money, fromAccount) {
    const valueToSend = {from: fromAccount, value: web3.utils.toWei(money.toString(), "ether")};
    return contract.methods[methodName](parameters).send(valueToSend)
}

export function subscribeToEvent(contract, eventName, dataCallBack, errorCallBack) {
    contract.events[eventName]()
        .on("data", dataCallBack)
        .on("error", errorCallBack);
}

export function subscribeToEventWithFilter(contract, eventName, dataCallBack, errorCallBack, filters) {
    // Ej of Use: { filter: { _to: userAccount } }
    // `filter` to only fire this code when `_to` equals `userAccount`
    contract.events[eventName]({filter: filters})
        .on("data", dataCallBack)
        .on("error", errorCallBack);
}

export function pastEvents(contract, eventName, fromBlock, toBlock, callBack) {
    // "block" in this case referring to the Ethereum block number
    // Ej: { fromBlock: 0, toBlock: "latest" }
    contract.getPastEvents(eventName, {fromBlock, toBlock})
        .then(function (events) {
            callBack(events); // `events` is an array of `event` objects that we can iterate
        });
}