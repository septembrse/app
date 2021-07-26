
import React from 'react';

import Session from "../model/Session";

import CountDown from './Countdown';

import styles from "./Interstitial.css"

const Interstitial = () => {

    let s = new Session();

    // get the time now
    let d = new Date();

    // how many milliseconds to go?
    let delta = (s.getDelayTime() - d) / 1000.0;

    let mins = Math.floor(delta / 60);
    let secs = delta - (60*mins);

    console.log(`${delta} : ${mins} : ${secs}`);

    let countdown = null;

    if (delta <= 0){
      delta = s.getEndTime() - d;

      if (delta < 0){
        countdown = <div>Session has finished</div>;
      } else {
        countdown = <div>Session is in progress</div>;
      }
    } else if (delta > 500){
      countdown = <div>Session will start at {s.getStartTimeString()}</div>;
    } else {
      countdown = <CountDown minutes={mins} seconds={secs}/>;
    }

    return (
        <div>
            <h1>Interstitial</h1>
            <p>{s.getStartTimeString()}</p>
            <p>{s.getEndTimeString()}</p>
            {countdown}
        </div>
    );
};
export default Interstitial;
