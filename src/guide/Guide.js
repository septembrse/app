
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'

import styles from "./Guide.module.css";

import quick_markdown from "./quickstart.txt";
import guide_markdown from "./venue.txt";
import keys_markdown from "./keys.txt";
import treasure_markdown from "./treasure.txt";

const gfm = require('remark-gfm');

export function MarkdownComponent(props){

  console.log(props.text);

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


export function GuideComponent(props){
  let page = props.page;

  console.log(props.page);

  if (page){
    return <MarkdownComponent text={props.text} history={props.history} />
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 style={{textAlign: "center"}}>SeptembRSE</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 style={{textAlign: "center"}}>Virtual Conference Center Guide</h2>
        </Col>
      </Row>
      <Row>
        <Col style={{marginTop:"10px",
                    maxWidth: "768px",
                    marginLeft: "auto", marginRight: "auto"}}>
          <ButtonGroup vertical style={{width: "100%"}}>
            <Button onClick={() => props.history.push("/venue/quickstart")}
                    variant="primary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              How do I connect to the Virtual Conference Center?
            </Button>
            <Button onClick={() => props.history.push("/venue/keys")}
                    variant="secondary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              How do I navigate? Useful keys and features
            </Button>
            <Button onClick={() => props.history.push("/venue/features")}
                    variant="info"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              What can I do in the Virtual Conference Center?
            </Button>
            <Button onClick={() => props.history.push("/venue/treasure")}
                    variant="primary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              Cryptic Code Treasure Hunt
            </Button>
          </ButtonGroup>
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

  let loading = "Loading...";

  const [text, setText] = React.useState(loading);

  let { page } = useParams();

  console.log(page);

  if (page === "quickstart"){
    fetch(quick_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});
  } else if (page === "keys"){
    fetch(keys_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});

  } else if (page === "features"){
    fetch(guide_markdown)
      .then((response) => response.text())
      .then((textContent) => {console.log(textContent); setText(textContent)});
  } else if (page === "treasure"){
    fetch(treasure_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});
  } else {
    console.log("NULL PAGE?");
    page = null;
  }

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <GuideComponent account={account}
                      setAccount={setAccount}
                      history={props.history}
                      text={text}
                      page={page}/>
    </SimplePage>
  );

}
