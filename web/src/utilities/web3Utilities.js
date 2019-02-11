import Web3 from "web3";
import {ETHEREUM_ACCESS_DENIED, GAS_PRICE, MAX_GAS, NO_WEB3, TRANSACTION_ERROR_CODES} from "./constants";

/** Function to initialize Web3 considering the different types of init **/
export function initializationWeb3(setWeb3, setWeb3Error, providerURL) {
    if (!setWeb3 || !setWeb3Error || !providerURL) {
        return
    }
    const {web3, ethereum} = window;

    // for modern dapp browsers
    if (ethereum)
        ethereum.enable()
            .then(() => {
                const web3Obj = new Web3(ethereum);
                setWeb3(web3Obj);
            })
            .catch(deniedAccessMessage => {
                const deniedAccessError = new Error(deniedAccessMessage.toString());
                deniedAccessError.code = ETHEREUM_ACCESS_DENIED;
                setWeb3Error(deniedAccessError)
            });

    // for legacy dapp browsers
    else if (web3 && web3.currentProvider) {
        const web3Obj = new Web3(web3.currentProvider);
        setWeb3(web3Obj);
    }

    // use providerURL as a backup
    else if (providerURL) {
        const web3Obj = new Web3(providerURL);
        setWeb3(web3Obj);
    }

    // no web3 detected
    else {
        const noWeb3Error = new Error('No Web3 Provider Detected.');
        noWeb3Error.code = NO_WEB3;
        setWeb3Error(noWeb3Error)
    }
}

/** Function to get the Balance internally **/
function _getBalance(web3, account, format = 'ether') {
    if (!web3 || !account) {
        return
    }
    return web3.eth.getBalance(account)
        .then(balance => web3.utils.fromWei(balance, format))
}

/** Function to get the Account internally **/
function _getAccount(web3) {
    if (!web3) {
        return
    }
    return web3.eth.getAccounts().then((accs, err) => {
        if (err != null) return new Error("An error occurred: " + err);
        else if (accs.length === 0) return new Error("User is not logged");
        let userAddress = toChecksumAddress(web3, accs[0]);
        return userAddress;
    });
}

/** Function to get Account and Balance**/
export async function getAccountAndBalance(web3, formatUnit) {
    if (!web3) {
        return
    }
    const account = await _getAccount(web3);
    const balance = await _getBalance(web3, account, formatUnit);
    return {account, balance};
}

/** Event to detect if user has changed the account **/
export function accountChangedSubscription (web3, onChangeCallBack){
    if (!web3 || !onChangeCallBack) {
        return
    }
    const { ethereum } = window
    let userData = {};
    ethereum.on('accountsChanged', async accounts => {
        let balance = await _getBalance(web3, accounts[0]);
        let userAddress = toChecksumAddress(web3, accounts[0]);
        userData = {
            account: userAddress,
            balance: balance
        }
        onChangeCallBack(userData)
    })
    return userData
}

/** Event to detect if user has changed the network **/
export function networkChangedSubscription(web3, onChangeCallBack) {
    if (!web3 || !onChangeCallBack) {
        return
    }
    const { ethereum } = window;
    let userData = {};
    ethereum.on('networkChanged', async network => {
        let {account, balance} = await getAccountAndBalance(web3);
        userData = {
            account: account,
            currentNetwork: network,
            balance: balance
        };
        onChangeCallBack(userData)
    });
    return userData
}

/** Converts the address from uppercase to lowercase (checksum format) in order to avoid metamask bug of using both address **/
export function toChecksumAddress(web3, address) {
    if (!web3 || !address) {
        return
    }
    return web3.utils.toChecksumAddress(address)
}

/** Function to instantiate a Contract to next interact with it **/
export function instantiateContract(web3, _ABI, _ContractAddress) {
    if (!web3 || !_ABI || !_ContractAddress) {
        return
    }
    return new web3.eth.Contract(_ABI, _ContractAddress);
}

/** Function to call a function that not alter the smart contract state.  **/
export function callMethod(contract, methodName, account, parameters) {
    if (!contract || !methodName) {
        return
    }
    const options = GAS_PRICE ? {gasPrice: GAS_PRICE, gas: MAX_GAS, from: account} : {from: account};
    return contract.methods[methodName](...parameters).call(options)
}

/** Function to call a function that alter the smart contract state. **/
export function sendMethod(contract, methodName, account, parameters) {
    if (!contract || !methodName) {
        return
    }
    const options = GAS_PRICE ? {gasPrice: GAS_PRICE, gas: MAX_GAS, from: account} : {from: account};
    return contract.methods[methodName](...parameters).send(options)
}

/** Function to call a function that not alter the smart contract state, and send money with it **/
export function sendMethodWithMoney(contract, web3, methodName, parameters, money, fromAccount) {
    if (!contract || !methodName || !web3 || !money || !fromAccount) {
        return
    }
    const valueToSend = {from: fromAccount, value: web3.utils.toWei(money.toString(), "ether")};
    const options = GAS_PRICE ? {gasPrice: GAS_PRICE, gas: MAX_GAS, ...valueToSend} : valueToSend;
    return contract.methods[methodName](...parameters).send(options)
}

/** Generic function to subscribe to an event in the contract **/
export function subscribeToEvent(contract, eventName, dataCallBack, errorCallBack) {
    if (!contract || !eventName || !dataCallBack || !errorCallBack) {
        return
    }
    contract.events[eventName]()
        .on("data", dataCallBack)
        .on("error", errorCallBack);
}

/** Generic function to subscribe to an event in the contract with a filter to listen determinate things **/
export function subscribeToEventWithFilter(contract, eventName, dataCallBack, errorCallBack, filters) {
    if (!contract || !eventName || !dataCallBack || !errorCallBack || !filters) {
        return
    }
    // Ej of Use: { filter: { _to: userAccount } }
    // `filter` to only fire this code when `_to` equals `userAccount`
    contract.events[eventName]({filter: filters})
        .on("data", dataCallBack)
        .on("error", errorCallBack);
}

/** Function to get past events, from certain block number to another **/
export function pastEvents(contract, eventName, fromBlock, toBlock = "latest", callBack) {
    if (!contract || !eventName || !fromBlock || !callBack) {
        return
    }
    // "block" in this case referring to the Ethereum block number
    // Ej: { fromBlock: 0, toBlock: "latest" }
    contract.getPastEvents(eventName, {fromBlock, toBlock})
        .then(function (events) {
            callBack(events); // `events` is an array of `event` objects that we can iterate
        });
}

/** Function to wrap error message **/
function wrapError(error, name) {
    if (!TRANSACTION_ERROR_CODES.includes(name)) return Error(`Passed error name ${name} is not valid.`)
    error.code = name
    return error
}