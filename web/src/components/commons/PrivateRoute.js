import React, {Component} from 'react';
import {Redirect, Route, withRouter} from 'react-router-dom';
import {connect} from "react-redux";

class PrivateRoute extends Component {

    render() {
        const {user, location} = this.props;
        const PrivateComponent = this.props.inner; // A Component must start with a capital letter
        return (
            <Route {...this.props} render={(props) => (
                user
                    ? <PrivateComponent {...props}/>
                    : <Redirect to={{pathname: '/', state: {from: location}}}/>
            )}
            />
        );
    }
}


const mapStateToProps = (state) => {
    const {user} = state.auth;

    return {user};
};


export default withRouter(connect(mapStateToProps)(PrivateRoute));