
import React from 'react';

import Session from "../model/Session";

import CountDown from './Countdown';

import styles from "./Interstitial.css"

const Interstitial = () => {

  let s = Session.getNextSession();

  // get the time now
  let d = new Date();

  // how many milliseconds to go?
  let delta = (s.getDelayTime() - d) / 1000.0;

  let mins = Math.floor(delta / 60);
  let secs = delta - (60*mins);

  let countdown = null;

  if (delta <= 0){
    delta = s.getEndTime() - d;

    if (delta < 0){
      countdown = <div>Session has finished</div>;
    } else {
      countdown = <div>Session is in progress</div>;
    }
  } else if (delta > 500){
    countdown = (<div className={styles.countdown}>
                  <div>Session will start at {s.getStartTimeString()}</div>
                 </div>);
  } else {
    countdown = (<div className={styles.countdown}>
                  <CountDown minutes={mins} seconds={secs}/>
                 </div>);

  }

  let title = <div className={styles.title}>{s.getTitle()}</div>;

  let description = null;

  if (s.hasDescription()){
    description = <div className={styles.description}>{s.getDescription()}</div>;
  }

  return (
      <div className={styles.background}>
          {title}
          {description}
          {countdown}
      </div>
  );
};

export default Interstitial;
