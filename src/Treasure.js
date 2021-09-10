
import React from 'react';


import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useParams } from 'react-router-dom';

import { get_key } from "./model/Secret";

import styles from "./Treasure.module.css";


export function Treasure(props){

  let key = props.key;

  const [key_text, setKeyText] = React.useState(key);

  let { code } = useParams();

  let output = null;

  if (!key_text || key_text.length === 0){
    output = "Enter your input above to generate the key."
  } else {
    output = get_key(`${code}${key_text.toLowerCase().trim()}`).fingerprint();
  }

  return (
    <div style={{marginBottom: "30px"}}>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <input key="input" className={styles.inputbar}
                onChange={(e) => setKeyText(e.target.value)}
                placeholder="Input..." />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.output}>{output}</div>
        </Col>
      </Row>
      <div className={styles.background}/>
    </div>
  );
}
