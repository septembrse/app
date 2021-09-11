
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
import {Ticket} from "./ticket/Ticket";
import {Timetable} from "./timetable/Timetable";
import {Today} from "./today/Today";
import {Guide} from "./guide/Guide";
import {SessionPage} from "./session/SessionPage";
import {EventPage} from "./search/EventPage";
import {Music} from './music/Music';
import {Treasure} from './Treasure';
import {JukeBox} from './interstitial/JukeBox';

import Generate from "./generate/Generate";
import GetLinks from "./generate/GetLinks";

function App() {
  return (
    <div>
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route exact path="/" component = {Home} />
              <Route exact path="/interstitial" component = {Interstitial} />
              <Route exact path="/interstitial/:test_date" component = {Interstitial} />
              <Route exact path="/break" render = {(props) => <Interstitial {...props} is_break={true} />} />
              <Route exact path="/treasure/:code" component = {Treasure} />
              <Route exact path="/search" component = {Search} />
              <Route exact path="/login" component = {Login} />
              <Route exact path="/logout" component = {Logout} />
              <Route exact path="/ticket" component = {Ticket} />
              <Route exact path="/timetable" component = {Timetable} />
              <Route exact path="/timetable/:day_or_week" component = {Timetable} />
              <Route exact path="/today" component = {Today} />
              <Route exact path="/venue" component = {Guide} />
              <Route exact path="/venue/:page" component = {Guide} />
              <Route exact path="/generate" component = {Generate} />
              <Route exact path="/getlinks" component = {GetLinks} />
              <Route exact path="/session" component = {SessionPage} />
              <Route exact path="/session/:session_id" component = {SessionPage} />
              <Route exact path="/event" component = {EventPage} />
              <Route exact path="/event/:event_id" component = {EventPage} />
              <Route exact path="/music" component = {Music} />
              <Route exact path="/jukebox" component = {JukeBox} />
              <Route exact path="/contact" render = {(props) => <Guide {...props} page="contact" need_login={true} />} />
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
