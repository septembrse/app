
import React from 'react';

import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import Home from './Home';
import Interstitial from './interstitial/Interstitial';
import {Search} from './search/Search';
import {Login} from './login/Login';
import {Logout} from "./login/Logout";
import Generate from "./generate/Generate";

function App() {
  return (
    <div>
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route exact path="/" component = {Home} />
              <Route exact path="/interstitial" component = {Interstitial} />
              <Route exact path="/interstitial/:test_date" component = {Interstitial} />
              <Route exact path="/search" component = {Search} />
              <Route exact path="/login" component = {Login} />
              <Route exact path="/logout" component = {Logout} />
              <Route exact path="/generate" component = {Generate} />
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
