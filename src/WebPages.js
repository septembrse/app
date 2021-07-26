
import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import Home from './Home';
import Interstitial from './interstitial/Interstitial';
import Search from './search/Search';

const Webpages = () => {
    return(
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact component = {Home} />
              <Route path="/interstitial" component = {Interstitial} />
              <Route path="/search" component = {Search} />
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </Router>
    );
};

export default Webpages;