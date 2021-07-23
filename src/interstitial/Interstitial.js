
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

    let mins = (delta / 60);
    let secs = delta - (60*mins);

    console.log(`${delta} : ${mins} : ${secs}`);

    if (delta <= 0){
        return (
            <div>
                In progress...
            </div>
        );
    }

    console.log(delta);

    return (
        <div>
            <h1>Interstitial</h1>
            <p>{s.getStartTimeString()}</p>
            <p>{s.getEndTimeString()}</p>
            <CountDown/>
        </div>
    );
};
export default Interstitial;
