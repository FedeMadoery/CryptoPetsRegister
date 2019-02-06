import React, {Component} from 'react';
import {connect} from 'react-redux';
import {emailChanged, loginUser, passwordChanged} from "../../redux/actions";
import {withRouter} from 'react-router-dom';

import {AppBar, TextField, Button} from '../material-ui';

class Login extends Component {


    handleSubmit(event) {
        event.preventDefault();

        const {email, password} = this.props;
        this.props.loginUser({email, password});
    }

    handleChange(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        this.setState({[inputName]: inputValue});


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

    checkUser() {
        const {user, history} = this.props;
        if (user) {
            history.push(`/home`);
        }
    }


    render() {


        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Login"
                        />
                        <TextField
                            hintText="Enter your mail"
                            floatingLabelText="Mail"

                            onChange={(event, newValue) => this.onEmailChange(event)}
                        />
                        <br/>
                        <TextField
                            type="password"

                            hintText="Enter your Password"
                            floatingLabelText="Password"
                            onChange={(event, newValue) => this.onPasswordChange(event)}
                        />
                        <br/>
                        <Button variant="contained" label="Submit" primary={true} style={style}
                                      onClick={(event) => this.handleSubmit(event)}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );


    }

}


const mapStateToProps = (state) => {
    const {email, password, user} = state.auth;

    return {email, password, user};
};

const style = {
    margin: 15,
};

export default withRouter(connect(mapStateToProps, {emailChanged, passwordChanged, loginUser})(Login));