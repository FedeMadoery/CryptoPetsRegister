import {
    INITIALIZE_WEB3,
    INITIALIZE_URL_WEB3,
    UPDATE_ACCOUNT,
    UPDATE_BALANCE,
    SENDING_TRANSACTION_WEB3,
    ERROR_TRANSACTION_WEB3,
    PENDING_TRANSACTION_WEB3,
    REMOVE_PENDING_TRANSACTION_WEB3,
    NEW_CONTRACT,
    DELETE_NOTIFICATION,
    NEW_NOTIFICATION,
    NO_PENDING_NOTIFICATION, ADD_SUBSCRIBED_EVENTS, DELETE_SUBSCRIBED_EVENTS
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
    sendingTransactions: false,
    pendingNotifications: 0,
    notifications: [],
    subscribedEvents: []
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
        case NEW_NOTIFICATION:
            return {
                ...state,
                notifications: _.uniqBy([...state.notifications, action.payload],'transactionHash'),
                pendingNotifications: state.pendingNotifications + 1
            };
        case DELETE_NOTIFICATION:
            return {
                ...state,
                notifications: [
                    ...state.notifications.slice(0, action.payload),
                    ...state.notifications.slice(action.payload + 1)
                ],
            };
        case NO_PENDING_NOTIFICATION:
            return {
                ...state,
                pendingNotifications: action.payload
            };
        case ADD_SUBSCRIBED_EVENTS:
            return {
                ...state,
                subscribedEvents: [...state.subscribedEvents, action.payload]
            };
        case DELETE_SUBSCRIBED_EVENTS:
            return {
                ...state
            };
        default:
            return state;
    }
};