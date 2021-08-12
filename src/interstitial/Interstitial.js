
import React from 'react';

import Session from "../model/Session";
import Account from "../model/Account";
import SimplePage from "../SimplePage";

import CountDown from './Countdown';

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Sound from "react-sound";

import styles from "./Interstitial.module.css"

import banner from "../images/interstitial_bg.png";
import no_camera from "../images/no_camera.png";
import no_microphone from "../images/no_microphone.png";

import oracle from "../images/sponsors/oracle.png";
import amazon from "../images/sponsors/amazon.png";
import alcesflight from "../images/sponsors/alcesflight.png";


const tracks = [
  {
    url: "https://siremol.org/largefiles/music/001.mp3",
    title: "Honeyknocker Meadows",
    author: "Origami Repetika"
  },
  {
    url: "https://siremol.org/largefiles/music/002.mp3",
    title: "Let's go up",
    author: "Origami Repetika"
  },
  {
    url: "https://siremol.org/largefiles/music/003.mp3",
    title: "Gaily into the ether",
    author: "Origami Repetika"
  },
  {
    url: "https://siremol.org/largefiles/music/004.mp3",
    title: "Quare Frolic",
    author: "Origami Repetika"
  }
];


class Interstitial extends React.Component {
  constructor(props){
    super(props);

    this.state = { "account": Account.get_account(),
                   "playing": Sound.status.STOPPED,
                   "track": Math.floor(Math.random() * tracks.length),
                   "position": null,
                   "autoload": false };
  }

  getNextTrack(){
    let ntracks = tracks.length;

    let track = this.state.track;

    while (track === this.state.track){
      track = Math.floor(Math.random() * ntracks);
    }

    return track;
  }

  setAccount(account){
    this.setState("account", account);
  }

  togglePlaying(){
    if (this.state.playing === Sound.status.STOPPED){
      this.setState({"playing": Sound.status.PLAYING});
    } else {
      this.setState({"playing": Sound.status.STOPPED});
    }
  }

  playNext(){
    let track = this.getNextTrack();
    this.setState({"track": track,
                   "playing": Sound.status.STOPPED,
                   "position": null,
                   "autoload": true});
  }

  onLoad(o){
    this.setState({"playing": Sound.status.PLAYING});
  }

  onPlaying(o){
    // uncomment the below to skip to the end of the song (for testing)
    /*if (this.state.playing === Sound.status.PLAYING){
      let duration = o.duration;
      let position = o.position;

      if (position < 0.95 * duration){
        position = 0.95 * duration;
      }

      this.setState({"position": position});
    }*/
  }

  render(){
    let account = this.state.account;

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

      let track = tracks[this.state.track];

      let credits = null;

      if (this.state.playing === Sound.status.PLAYING){
        credits = (
          <div className={styles.music}>
            <div className={styles.credits}>
              Playing '{track.title}' by {track.author})
            </div>
            <div className={styles.music}>
              Visit https://septembrse.github.io/#/music for more info
            </div>
          </div>
        )
      } else {
        credits = (
          <div className={styles.music}>
            <div className={styles.credits}
                 onClick={() => this.togglePlaying()}>
              Click here to start playing music
            </div>
          </div>
        )
      }

      return (
          <div className={styles.background}>
            <Sound url={track["url"]}
                   playStatus={this.state.playing}
                   position={this.state.position}
                   onPlaying={(o) => this.onPlaying(o)}
                   onLoad={(o) => this.onLoad()}
                   autoLoad={this.state.autoload}
                   onFinishedPlaying={() => this.playNext() } />
            <img src={banner}
                 className={styles.bg_image} alt=""
                 onClick={() => this.togglePlaying()}
            />
            <div className={styles.partners}>
              <img src={oracle} className={styles.partner_logo} alt="Thanks to Oracle for Research for Sponsoring" />
              <img src={amazon} className={styles.partner_logo} alt="Thanks to Amazon Web Services for Sponsoring" />
            </div>
            {title}
            {description}
            {countdown}
            <div className={styles.partners}>
              <img src={alcesflight} className={styles.networker_logo} alt="Thanks to Alces Flight for Sponsoring" />
            </div>
            {info}
            {credits}
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
  }
};

export default Interstitial;
