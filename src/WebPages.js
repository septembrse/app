
import React from 'react';

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Home from './Home';
import Interstitial from './interstitial/Interstitial';

const Webpages = () => {
    return(
        <Router basename={process.env.PUBLIC_URL}>
            <Route path="/" exact component = {Home} />
            <Route path = "/interstitial" component = {Interstitial} />
        </Router>
    );
};

export default Webpages;