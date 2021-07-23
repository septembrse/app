
import React from 'react';

import Session from "../model/Session";

import styles from "./Interstitial.css"

const Interstitial = () => {

    let s = new Session();

    return (
        <div>
            <h1>Interstitial</h1>
            <p>{s.getStartTimeString()}</p>
            <p>{s.getEndTimeString()}</p>
        </div>
    );
};
export default Interstitial;
