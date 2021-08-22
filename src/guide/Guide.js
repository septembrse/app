
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { Redirect } from "react-router-dom";

import { useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'

import styles from "./Guide.module.css";

import quick_markdown from "./quickstart.txt";
import guide_markdown from "./venue.txt";
import keys_markdown from "./keys.txt";
import treasure_markdown from "./treasure.txt";
import sponsor_markdown from "./sponsor.txt";
import contact_markdown from "./contact.txt";

const gfm = require('remark-gfm');

export function MarkdownComponent(props){

  return (
    <Container fluid>
      <Row>
        <Col style={{marginTop:"10px",
                    maxWidth: "768px",
                    marginLeft: "auto", marginRight: "auto"}}>
          <h1 style={{textAlign: "center"}}>{props.title}</h1>
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

  if (page){
    return <MarkdownComponent {...props} />
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
                    variant="primary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              What can I do in the Virtual Conference Center?
            </Button>
            <Button onClick={() => props.history.push("/venue/treasure")}
                    variant="secondary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              Oracle Cryptic Code Treasure Hunt
            </Button>
            <Button onClick={() => props.history.push("/venue/sponsors")}
                    variant="primary"
                    style={{borderRadius: "5px", marginTop: "5px"}}>
              Information for Sponsors
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

  if (props.need_login){
    if (!(account && account.isLoggedIn())){
      return (<Redirect to="/login" />);
    }
  }

  let title = "Conference Venue Guide";

  if (!page){
    page = props.page;
  }

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
      .then((textContent) => {setText(textContent)});
  } else if (page === "treasure"){
    fetch(treasure_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});
  } else if (page === "sponsors"){
    fetch(sponsor_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});
  } else if (page === "contact"){
    title = "Contact Information";
    fetch(contact_markdown)
      .then((response) => response.text())
      .then((textContent) => {setText(textContent)});
  } else {
    page = null;
  }

  return (
    <SimplePage {...props} account={account} setAccount={setAccount}>
      <GuideComponent account={account}
                      setAccount={setAccount}
                      history={props.history}
                      title={title}
                      text={text}
                      page={page}/>
    </SimplePage>
  );

}
