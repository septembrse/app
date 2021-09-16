
import React from 'react';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Sound from "react-sound";

import Account from "./model/Account";

import { useParams } from 'react-router-dom';

import { get_key, get_hash } from "./model/Secret";
import { ClipboardCopy } from './generate/Generate';

import {getTracks} from "./music/Music";

import styles from "./Note.module.css";

import notes from "./notes.json";

function get_coded_hash(code, value){
  if (value){
    return get_hash(`${code}:${value.toLowerCase().trim()}`);
  } else {
    return null;
  }
}

function get_coded_key(code, value){
  if (value){
    return get_key(`${value.toLowerCase().trim()}:${code}`);
  } else {
    return null;
  }
}

function NoteSetup(props){

  let [account, setAccount] = React.useState(Account.get_account());

  const [greeting, setGreeting] = React.useState(null);
  const [track, setTrack] = React.useState(null);
  const [main_code, setCode] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  if (!account || !account.isLoggedIn() || !account.isAdmin()){
    return <div>UNAUTHORISED</div>;
  }

  let output = null;
  let data = null;
  let key = get_coded_key(main_code, greeting);

  if (key){
    let hash_greeting = get_coded_hash(main_code, greeting);
    let hash_answer = get_coded_hash(main_code, answer);

    let t = null;

    try{
      t = parseInt(track);
    } catch(error){}

    data = {
      "question": question,
      "track": t,
      "answer": hash_answer
    };

    let secret = key.encrypt(JSON.stringify(data));

    output = `"${hash_greeting}": "${secret}"`;
  }

  return (
    <div style={{marginBottom: "30px"}}>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setCode(e.target.value)}
                 placeholder="Code..." />
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setGreeting(e.target.value)}
                 placeholder="Greeting..." />
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setTrack(e.target.value)}
                 placeholder="Track..." />
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setQuestion(e.target.value)}
                 placeholder="Question..." />
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setAnswer(e.target.value)}
                 placeholder="Answer..." />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.output}>{greeting}: {JSON.stringify(data)}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.output}>{output}</div>
        </Col>
      </Row>
      <ClipboardCopy copyText={output} />
      <div className={styles.background}/>
    </div>
  );
}

class NoteDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      code: props.code,
      greeting: null,
      track: null,
      main_code: null,
      question: null,
      answer: null,
      dialog: [],
      stage: 0,
      playing: "STOPPED",
      position: 0,
      start_position: 0
    };
  }

  togglePlay(){
    if (this.state.playing === "PLAYING"){
      this.setState({playing:"STOPPED",
                     position:this.state.start_position});
    } else {
      this.setState({playing:"PLAYING"});
    }
  }

  onPlaying(o){
    let p = o.position;

    this.setState({position: p});

    if (p - this.state.start_position > 10000){
      this.stopMusic();
    }
  }

  stopMusic() {
    this.setState({playing:"STOPPED",
                   position:this.state.start_position});
  }

  render(){
    let input_box = null;

    const stage = this.state.stage;

    if (stage === 0){
      input_box = (
        <input key="input_question" className={styles.inputquestion}
              onChange={(e) => this.setState({greeting:e.target.value})}
              placeholder="Say something to Dr Note..." />
      );
    } else if (stage === 1){
      input_box = (
        <input key="input_answer" className={styles.inputquestion}
              onChange={(e) => this.setState({answer:e.target.value})}
              placeholder="Give your answer to Dr Note..." />
      );
    }

    const code = this.state.code;
    const greeting = this.state.greeting;
    const dialog = this.state.dialog;
    const answer = this.state.answer;
    const track = this.state.track;

    let sound_component = null;

    if (track){
      let tracks = getTracks();

      sound_component = (
        <Sound key="music_sound"
              url={tracks[track-1]["url"]}
              playStatus={this.state.playing}
              position={this.state.position}
              onPlaying={(o)=>this.onPlaying(o)}
              autoLoad={true} />
      );
    }

    let validate = () => {
      this.stopMusic();

      let hash_greeting = get_coded_hash(code, greeting);
      let data = null;
      let d = [...dialog];
      let next_stage = stage;

      if (hash_greeting){
        if (stage === 0){
          d.push(
            <div key="greeting" className={styles.question}>{greeting}</div>
          );
        }

        data = notes[hash_greeting];

        if (data){
          try {
            let key = get_coded_key(code, greeting);
            data = JSON.parse(key.decrypt(data));
          } catch(error){
            data = null;
          }
        }
      }

      if (stage === 0) {
        if (data){
          d.push(
            <div key="greeting_answer" className={styles.answer}>
              {data.question}
            </div>
          );

          if (data.track){
            let start = Math.random() * (20000 - 10000) + 10000;

            this.setState({track:data.track,
                           position:start,
                           start_position:start});
            d.push(
              <Button key="music_button"
                      className={styles.musicbutton}
                      onClick={()=>this.togglePlay()}>
                Play
              </Button>
            );
          }

          next_stage = 1;
        } else {
          d.push(
            <div key="greeting_answer" className={styles.answer}>
              I don't know you. Goodbye.
            </div>
          );
          next_stage = -1;
        }
      } else if (stage === 1){
        let hash_answer = get_coded_hash(code, answer);

        if (hash_answer){
          d.push(
            <div key="answer" className={styles.question}>{answer}</div>
          );

          if (hash_answer === data.answer){
            d.push(
              <div key="answer_answer" className={styles.answer}>
                Correct! Here is the code. Use it wisely.
              </div>
            );
            d.push(
              <div key="answer_answer2" className={styles.answer}>
                {get_coded_key(code, answer).fingerprint()}
              </div>
            );

            next_stage = 2;
          } else {
            d.push(
              <div key="answer_answer" className={styles.answer}>
                I don't know you. Goodbye.
              </div>
            );
            next_stage = -1;
          }
        }
      }

      this.setState({dialog:d, stage:next_stage});
    };

    let validate_button = null;

    if (stage >= 0 && stage < 2){
      validate_button = (
        <Button className={styles.submitbutton}
                onClick={validate}>
          Send
        </Button>
      );
    }

    return (
      <div className={styles.container}>
        {sound_component}
        <div className={styles.dialogue}>
          {dialog}
        </div>
        <div className={styles.inputbox}>
          {input_box}
          {validate_button}
        </div>
        <div className={styles.background}/>
      </div>
    );
  }
}

export function Note(props){
  let { code } = useParams();

  if (!code){
    return <NoteSetup />;
  } else {
    return <NoteDialog code={code} />
  }
}
