import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import Web3Reducer from "./Web3Reducer";


export default combineReducers({
    auth: AuthReducer,
    web3: Web3Reducer,
});