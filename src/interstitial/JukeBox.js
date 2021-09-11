
import React from 'react';

import SimplePage from "../SimplePage";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from 'react-bootstrap/FormControl';
import Button from "react-bootstrap/Button";

import Sound from "react-sound";

import {getTracks} from "../music/Music";

import styles from "./JukeBox.module.css"

export class JukeBox extends React.Component {
  constructor(props){
    super(props);

    this.state = { "playing": Sound.status.STOPPED,
                   "track": 0,
                   "position": null,
                   "autoload": false };
  }

  stopPlaying(){
    this.setState({"playing": Sound.status.STOPPED,
                   "position": null});
  }

  togglePlaying(){
    if (this.state.playing === Sound.status.STOPPED){
      this.setState({"playing": Sound.status.PLAYING});
    } else {
      this.setState({"playing": Sound.status.STOPPED});
    }
  }

  playNext(){
    let tracks = getTracks();

    let track = this.state.track + 1;

    if (track >= tracks.length){
      track = 0;
    }

    this.setState({"track": track,
                   "playing": Sound.status.STOPPED,
                   "position": null,
                   "autoload": true});
  }

  playPrevious(){
    let track = this.state.track - 1;

    if (track < 0){
      let tracks = getTracks();
      track = tracks.length - 1;
    }

    this.setState({"track": track,
                   "playing": Sound.status.STOPPED,
                   "position": null,
                   "autoload": true});
  }

  onLoad(o){
    this.setState({"playing": Sound.status.PLAYING});
  }

  onPlaying(o){
    let position = o.position;
    this.setState({"position": position});
  }

  render(){

    let tracks = getTracks();
    let track = tracks[this.state.track];

    let buttons = [];

    for (let i=0; i<tracks.length; ++i){
      let variant = "primary";

      if (this.state.track === i){
        variant = "secondary";
      }

      buttons.push(
        <Button
            variant={variant}
            key={i}
            className={styles.trackbutton}
            onClick={()=>{this.setState({"track": i})}}
        >
          {i+1}
        </Button>
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
        <div className={styles.jukebox}>
          <div className={styles.trackinfo}>
            <div className={styles.title}>
              <a href={track.track_url}>{track.title}</a>
            </div>
            <div className={styles.author}>
              <a href={track.author_url}>{track.author}</a>
            </div>
            <a href={track.license_url}>
              <img
                className={styles.licenseimg}
                src={track.license_img}
                alt="Track License"/>
            </a>
          </div>
          <div className={styles.buttons}>
            {buttons}
          </div>
          <div className={styles.playbuttons}>
            <Button className={styles.playbutton}
                    variant="info"
                    onClick={()=>{this.playPrevious()}}>
              ⏮️
            </Button>
            <Button className={styles.playbutton}
                    variant="info"
                    onClick={()=>{this.togglePlaying()}}>
              ⏯️
            </Button>
            <Button className={styles.playbutton}
                    variant="info"
                    onClick={()=>{this.stopPlaying()}}>
              ⏹️
            </Button>
            <Button className={styles.playbutton}
                    variant="info"
                    onClick={()=>{this.playNext()}}>
              ⏭️
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default JukeBox;
