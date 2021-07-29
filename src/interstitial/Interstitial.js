
import React from 'react';
import { useParams } from 'react-router-dom';

import Session from "../model/Session";

import CountDown from './Countdown';

import styles from "./Interstitial.module.css"

import banner from "../images/interstitial_bg.png";
import no_camera from "../images/no_camera.png";
import no_microphone from "../images/no_microphone.png";

// Thanks - https://stackoverflow.com/questions/27012854/how-to-change-iso-date-string-to-date-object
const parseDate = dateString => {
  const b = dateString.split(/\D+/);
  const offsetMult = dateString.indexOf('+') !== -1 ? -1 : 1;
  const hrOffset = offsetMult * (+b[7] || 0);
  const minOffset = offsetMult * (+b[8] || 0);
  return new Date(Date.UTC(+b[0], +b[1] - 1, +b[2], +b[3] + hrOffset, +b[4] + minOffset, +b[5], +b[6] || 0));
};

const Interstitial = () => {

  let { test_date } = useParams();

  if (test_date){
    test_date = parseDate(test_date);
  }

  let s = Session.getNextSession(test_date);

  // get the time now
  let d = null;
  let offset = 0;

  if (test_date){
    d = test_date;
    offset = Math.floor((test_date - new Date()) / 1000.0);
  } else {
    d = new Date();
  }

  // how many seconds to go?
  let delta = (s.getDelayTime() - d) / 1000.0;

  let countdown = null;

  if (delta <= 0){
    delta = s.getEndTime() - d;

    if (delta < 0){
      countdown = <div className={styles.message}>Session has finished</div>;
    } else {
      countdown = <div className={styles.message}>Session is in progress</div>;
    }
  } else if (delta > 1800){
    countdown = (<div className={styles.countdown}>
                  <div>Session will start at {s.getStartTimeString()}</div>
                 </div>);
  } else {
    countdown = (<div className={styles.countdown}>
                  <CountDown offset={offset} target={s.getDelayTime()}/>
                 </div>);

  }

  let title = <div className={styles.title}>{s.getTitle()}</div>;

  let description = null;

  if (test_date){
    test_date = <div className={styles.test_date}>
      The time now is {`${test_date.toLocaleString('en-US', {hour:"numeric", minute:"numeric", hour12:true})} on ${test_date.toLocaleString('en-GB', { weekday:"long", year:"numeric", month:"long", day:"numeric"})}`}
    </div>
  }

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
        {test_date}
        {title}
        {description}
        {countdown}
        {info}
      </div>
  );
};

export default Interstitial;
