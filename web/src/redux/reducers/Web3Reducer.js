import {
    INITIALIZE_WEB3,
    INITIALIZE_URL_WEB3,
    UPDATE_ACCOUNT,
    UPDATE_BALANCE,
    SENDING_TRANSACTION_WEB3,
    ERROR_TRANSACTION_WEB3,
    PENDING_TRANSACTION_WEB3,
    REMOVE_PENDING_TRANSACTION_WEB3,
    NEW_CONTRACT
} from '../actions/types'

import _ from 'lodash';

const INITIAL_STATE = {
    account: '',
    balance: '0',
    currentNetwork: '',
    web3Obj: {},
    contract: {},
    pendingTransactions: [],
    errorTransaction: '',
    sendingTransactions: false
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case INITIALIZE_WEB3:
            return {...state, web3Obj: action.payload};
        case INITIALIZE_URL_WEB3:
            return {...state, web3Obj: action.payload};
        case UPDATE_ACCOUNT:
            return {...state, account: action.payload};
        case UPDATE_BALANCE:
            return {...state, balance: action.payload};
        case SENDING_TRANSACTION_WEB3:
            return {...state, sendingTransactions: action.payload};
        case ERROR_TRANSACTION_WEB3:
            return {...state, errorTransaction: action.payload};
        case PENDING_TRANSACTION_WEB3:
            return {...state, pendingTransactions: [...state.pendingTransactions, action.payload]};
        case REMOVE_PENDING_TRANSACTION_WEB3:
            return {
                ...state,
                pendingTransactions: _.remove(state.pendingTransactions, (value) => value === action.payload)
            };
        case NEW_CONTRACT:
            return {
                ...state,
                contract: action.payload
            };
        default:
            return state;
    }
};