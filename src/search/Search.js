
import React from 'react';

import Submission from "../model/Submission";
import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from "react-bootstrap/ButtonGroup";

import ReactMarkdown from 'react-markdown'

import styles from "./Search.module.css";

const gfm = require('remark-gfm');

export function SearchComponent(props){

  let text = props.text;

  const [search_text, setSearchText] = React.useState(text);

  const search_bar = (
    <Row>
      <Col>&nbsp;</Col>
      <Col md="auto" style={{minWidth: "75%"}}>
        <input key="input" className={styles.searchBar} type="search"
               onChange={(e) => setSearchText(e.target.value)}
               placeholder="Search..." />
      </Col>
      <Col>&nbsp;</Col>
    </Row>
  );

  const divider = (
    <Row><Col>&nbsp;</Col></Row>
  );

  const view_all = (
    <Row>
      <Col>&nbsp;</Col>
      <Col md="auto" style={{minWidth: "75%"}}>
        <ButtonGroup vertical style={{width: "100%"}}>
          <Button variant="primary"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("all")}>
            View all submissions
          </Button>
          <Button variant="secondary"
                  style={{borderRadius: "5px",
                  marginTop: "5px"}}
                  onClick={() => setSearchText("talks")}>
            View all talks
          </Button>
          <Button variant="info"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("walkthroughs")}>
            View all walkthroughs
          </Button>
          <Button variant="primary"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("posters")}>
            View all posters
          </Button>
          <Button variant="secondary"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("workshops")}>
            View all workshops
          </Button>
          <Button variant="info"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("panels")}>
            View all panels
          </Button>
          <Button variant="primary"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText("discussions")}>
            View all discussions
          </Button>
          <Button variant="danger"
                  style={{borderRadius: "5px",
                          marginTop: "5px"}}
                  onClick={() => setSearchText(null)}>
            Clear
          </Button>
        </ButtonGroup>
      </Col>
      <Col>&nbsp;</Col>
    </Row>
  );

  if (search_text === "" || !search_text){
    return (
      <Container fluid>
        {search_bar}
        {divider}
        {view_all}
      </Container>
    );
  }

  let results = Submission.search(search_text);

  if (results.length === 0){
    return (
      <Container fluid>
        {search_bar}
        <Row>
          <Col>
            <div className={styles.message}>
              No match.
            </div>
          </Col>
        </Row>
        {divider}
        {view_all}
      </Container>
    );
  }

  let formatted_results = [];

  let i = 0;

  for (let result in results){
    let r = results[result];

    let variant = "primary";

    if (i % 3 === 1){
      variant = "secondary";
    } else if (i % 3 === 2){
      variant = "info";
    }

    i += 1;

    formatted_results.push(
      <Row key={r.getID()}>
        <Col>
          <Card className="text-center"
                bg={variant} border={variant} text={variant}
                key={r.getID()}
                style={{borderRadius: "5px", marginTop:"10px",
                        maxWidth: "1024px",
                        marginLeft: "auto",
                        marginRight: "auto"}}>
            <Card.Header style={{color: "rgb(220,220,220)",
                         fontWeight: "bold"}}>
              {r.getFormat()}: {r.getID()}
            </Card.Header>
            <Card.Body>
              <Card.Title style={{fontSize: "large"}}>
                {r.getTitle()}
              </Card.Title>
              <Card.Title style={{fontSize: "medium", fontWeight: "bold"}}>
                {r.getName()}
              </Card.Title>
              <Card.Title style={{fontSize: "medium", fontStyle: "italic"}}>
                {r.getInstitution()}
              </Card.Title>
              <div className={styles.markdown}>
                  <ReactMarkdown remarkPlugins={[gfm]}
                                children={r.getAbstract()} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Container fluid>
      {search_bar}
      {formatted_results}
      {divider}
      {view_all}
    </Container>
  );
}

export function Search(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <SearchComponent />
    </SimplePage>
  );
}
