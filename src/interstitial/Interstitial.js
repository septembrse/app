
import React from 'react';

import Session from "../model/Session";

import CountDown from './Countdown';

import styles from "./Interstitial.module.css"

import banner from "../images/interstitial_bg.png";
import no_camera from "../images/no_camera.png";
import no_microphone from "../images/no_microphone.png";

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

  let info = (<div className={styles.info}>
               <img className={styles.no_camera} src={no_camera} alt=""/>
               <div className={styles.info_text}>Cameras and microphones off. Please feel free to say hello in the text chat 👋 😊</div>
               <img className={styles.no_microphone} src={no_microphone} alt=""/>
              </div>)

  return (
      <div className={styles.background}>
        <img src={banner}
             className={styles.bg_image} alt=""
        ></img>
        {title}
        {description}
        {countdown}
        {info}
      </div>
  );
};

export default Interstitial;
