
import React from 'react';

import Session from "../model/Session";
import Account from "../model/Account";
import SimplePage from "../SimplePage";

import CountDown from './Countdown';

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./Interstitial.module.css"

import banner from "../images/interstitial_bg.png";
import no_camera from "../images/no_camera.png";
import no_microphone from "../images/no_microphone.png";

const Interstitial = () => {

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  if (account && account.isAdmin()){

    let test_date = account.thisGetNow();

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
  } else {
    return (
      <SimplePage>
        <Container fluid>
          <Row>
            <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
              <Card bg="danger" border="danger" text="danger">
                <Card.Body style={{align_items:"center"}}>
                    <Card.Title>Forbidden page!</Card.Title>
                    <Card.Text>
                      You don't have permission to view this page.
                      Please log in using an admin or committee
                      member account.
                    </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SimplePage>
    );
  }

};

export default Interstitial;
