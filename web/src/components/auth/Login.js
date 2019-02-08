import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core";

import {emailChanged, loginUser, passwordChanged} from "../../redux/actions";
import {TextField, Button} from '../material-ui';

class Login extends Component {


    handleSubmit(event) {
        event.preventDefault();

        const {email, password} = this.props;
        this.props.loginUser({email, password});
    }

    onEmailChange(event) {
        this.props.emailChanged(event.target.value);
    }

    onPasswordChange(event) {
        this.props.passwordChanged(event.target.value);
    }


    componentDidUpdate(prevProps) {
        // nextProps are the next set op profs that this
        // if (prevProps !== this.props)
        //     this.checkUser();

    }



    render() {
        const {classes} = this.props;

        return (
            <div>
                <TextField
                    id="outlined-email-input"
                    label="Email"
                    placeholder="Enter your mail"
                    className={classes.textField}
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    onChange={(event, newValue) => this.onEmailChange(event)}
                />
                <br/>
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    placeholder="Enter your Password"
                    className={classes.textField}
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    variant="outlined"
                    onChange={(event, newValue) => this.onPasswordChange(event)}
                />
                <br/>
                <Button variant="contained" color="primary" className={classes.button}
                        onClick={(event) => this.handleSubmit(event)}>
                    Submit
                </Button>
            </div>
        );

    }

}


const mapStateToProps = (state) => {
    const {email, password, user} = state.auth;

    return {email, password, user};
};

const styles = {

};

export default withStyles(styles)(withRouter(
    connect(mapStateToProps, {emailChanged, passwordChanged, loginUser})(Login)
));