import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";

class Home extends Component {

    componentWillMount() {
    }


    render() {
        return (
            <h1>Home</h1>
        );


    }

}

const mapStateToProps = (state) => {
    const {user} = state.auth;

    return {user};
};


export default withRouter(connect(mapStateToProps, {})(Home));
