import React from 'react';
import ReactDOM from 'react-dom'
import App from './App.js'
import _ from "lodash"
import styles from "../scss/main.scss"


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('app'));