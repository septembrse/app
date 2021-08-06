
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ReactMarkdown from 'react-markdown'

import styles from "./Guide.module.css";

import markdown_file from "./venue.txt";

const gfm = require('remark-gfm');

export function GuideComponent(props){

  return (
    <Container fluid>
      <Row>
        <Col style={{marginTop:"10px",
                    maxWidth: "768px",
                    marginLeft: "auto", marginRight: "auto"}}>
          <h1 style={{textAlign: "center"}}>Conference Venue Guide</h1>
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                   maxWidth: "768px",
                   marginLeft: "auto", marginRight: "auto"}}>
          <div key="d2" className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[gfm]}
                          children={props.text} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export function Guide(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  const [text, setText] = React.useState("Loading...");

  fetch(markdown_file)
    .then((response) => response.text())
    .then((textContent) => {
       setText(textContent);
  });

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <GuideComponent account={account}
                      setAccount={setAccount}
                      text={text} />
    </SimplePage>
  );
}
