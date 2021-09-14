
import React from 'react';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Account from "./model/Account";

import { useParams } from 'react-router-dom';

import { get_key, get_hash } from "./model/Secret";
import { ClipboardCopy } from './generate/Generate';

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

export function Note(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  const [greeting, setGreeting] = React.useState(null);
  const [track, setTrack] = React.useState(null);
  const [main_code, setCode] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);

  let { code } = useParams();

  if (!code){

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

  let hash_greeting = get_coded_hash(code, greeting);

  if (hash_greeting){
    console.log(hash_greeting);
  }

  return (
    <div style={{marginBottom: "30px"}}>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                 onChange={(e) => setGreeting(e.target.value)}
                 placeholder="Greeting..." />
        </Col>
      </Row>
    </div>
  );
}
