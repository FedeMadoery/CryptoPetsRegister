import {EMAIL_CHANGED, LOGIN_USER, LOGIN_USER_SUCCESS, LOGOUT_USER, PASSWORD_CHANGED} from "./types";
import history from '../../components/commons/history';
import service from "../../components/services/services";

export const emailChanged = (text) => {

    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {

    return {
        type: PASSWORD_CHANGED,
        payload: text

    };
};


export const loginUser = ({email, password}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        service.http.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(({data}) => {
                loginUserSucces(dispatch, data);
                console.log('Received:', data);
            });


    };
};

export const logoutUser = () => {
    return (dispatch) => {
        dispatch({
            type: LOGOUT_USER
        });
        history.push('/');
    }

};

const loginUserSucces = (dispatch, user) => {

    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });

    history.push('/home');
};


