import {
    ADD_SUBSCRIBED_EVENTS,
    DELETE_NOTIFICATION,
    ERROR_INITIALIZE_WEB3,
    ERROR_TRANSACTION_WEB3,
    INITIALIZE_URL_WEB3,
    INITIALIZE_WEB3,
    NEW_CONTRACT,
    NEW_NOTIFICATION, NO_PENDING_NOTIFICATION,
    PENDING_TRANSACTION_WEB3,
    REMOVE_PENDING_TRANSACTION_WEB3,
    SENDING_TRANSACTION_WEB3,
    UPDATE_ACCOUNT,
    UPDATE_BALANCE
} from "./types";

/**----------------------------------- Default Actions -----------------------------------------------**/
export const _initializeWeb3 = (web3) => {
    return {
        type: INITIALIZE_WEB3,
        payload: web3
    };
};

export const _initializeUrlWeb3 = (web3) => {
    return {
        type: INITIALIZE_URL_WEB3,
        payload: web3
    };
};

export const _errorInitializeWeb3 = (error) => { //TODO handler error
    return {
        type: ERROR_INITIALIZE_WEB3,
        payload: error
    };
};

export const _updateAccount = (account) => {
    return {
        type: UPDATE_ACCOUNT,
        payload: account
    };
};

export const _updateBalance = (balance) => {
    return {
        type: UPDATE_BALANCE,
        payload: balance
    }
};

export const _sendingTransactionWeb3 = (sending) => {
    return {
        type: SENDING_TRANSACTION_WEB3,
        payload: !!sending
    };
};

export const _errorTransactionWeb3 = (error) => {
    return {
        type: ERROR_TRANSACTION_WEB3,
        payload: error
    };
};

export const _pendingTransactionWeb3 = (pending) => {
    return {
        type: PENDING_TRANSACTION_WEB3,
        payload: pending
    };
};

export const _removePendingTransactionWeb3 = (pending) => {
    return {
        type: REMOVE_PENDING_TRANSACTION_WEB3,
        payload: pending
    };
};

export const _initializeContract = (contract) => {
    return {
        type: NEW_CONTRACT,
        payload: contract
    };
};

export const _newNotification = (notification) => {
    return {
        type: NEW_NOTIFICATION,
        payload: notification
    }
};

export const _deleteNotification = (index) => {
    return {
        type: DELETE_NOTIFICATION,
        payload: index
    }
};

export const _resetPendingNotification = () => {
    return {
        type: NO_PENDING_NOTIFICATION,
        payload: 0
    }
};

export const _addSuscription = (eventName) => {
    return {
        type: ADD_SUBSCRIBED_EVENTS,
        payload: eventName
    }
};