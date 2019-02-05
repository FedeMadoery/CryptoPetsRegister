import React, {Component} from 'react';
import Provider from "react-redux/es/components/Provider";

import {store} from "./redux/store/store";

import Home from "./components/Home";
import './App.css';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Home></Home>
                </div>
            </Provider>
        );
    }
}

export default App;
