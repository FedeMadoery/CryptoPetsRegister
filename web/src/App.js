import React, {Component} from 'react';
import Provider from "react-redux/es/components/Provider";

import {store} from "./redux/store/store";

import Home from "./components/Home";
import './App.css';

class App extends Component {
    render() {

        /** Prevent the browser from re-loading - May be for PROD **/
        /*
        window.onbeforeunload = function(e) {
            let dialogText = 'Voy por la escopeta. Bart no quiero asustarte pero tal vez la pagina se recargue, Chrome esta por regargar la pagina.';
            e.returnValue = dialogText;
            return dialogText;
        };
        */

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
