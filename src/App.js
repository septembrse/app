
import React from 'react';

import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import Home from './Home';
import Interstitial from './interstitial/Interstitial';
import Search from './search/Search';

function App() {
  return (
    <div>
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route exact path="/" component = {Home} />
              <Route exact path="/interstitial" component = {Interstitial} />
              <Route exact path="/interstitial/:test_date" component = {Interstitial} />
              <Route exact path="/search" component = {Search} />
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
