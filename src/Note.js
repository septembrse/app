
import React from 'react';


import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useParams } from 'react-router-dom';

import { get_key, get_hash } from "./model/Secret";
import { ClipboardCopy } from './generate/Generate';

import styles from "./Note.module.css";


export function Note(props){

  const [greeting, setGreeting] = React.useState(null);
  const [track, setTrack] = React.useState(null);
  const [main_code, setCode] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);

  let { code } = useParams();

  if (!code){

    let hash_key = get_hash(`${main_code}:${greeting}`);
    let hash_answer = get_hash(`${main_code}:${answer}`);

    let key = get_key(`${main_code}:${greeting.toLowerCase().trim()}`);

    let t = null;

    try{
      t = parseInt(track);
    } catch(error){}

    let data = {
      "question": question,
      "track": t,
      "answer": hash_answer
    };

    let secret = key.encrypt(JSON.stringify(data));

    let output = `"${hash_key}": "${secret}"`;

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
  } else {
    return <div>Not yet!</div>;
  }
}
