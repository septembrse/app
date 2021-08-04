
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Session from '../model/Session';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { useParams } from "react-router-dom";


export function SessionCard(props){
  let session = props.session;
  let variant = props.variant;

  if (!variant){
    variant = "primary";
  }

  return (
    <Row>
      <Col>&nbsp;</Col>
        <Col md="auto" style={{minWidth: "80%", maxWidth:"768px"}}>
          <Card bg={variant} border={variant} text={variant}
                style={{borderRadius: "5px"}}>
            <Card.Header style={{textAlign: "center"}}>
              {session.getStartTimeString()} - {session.getEndTimeString()}
            </Card.Header>
            <Card.Body style={{align_items:"center"}}>
              <Card.Title style={{textAlign: "center"}}>
                Session {session.getID()}: {session.getTitle()}
              </Card.Title>
              <Card.Text>
                {session.getDescription()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      <Col>&nbsp;</Col>
    </Row>
  );
}

export function SessionComponent(props){

  let session_id = props.session_id;

  let session = Session.getSession(session_id);

  if (session){
    return (
      <Container fluid>
        <SessionCard account={props.account} setAccount={props.setAccount}
                     session={session} />
      </Container>
    );
  } else {
    return (
      <div>Failed to find info about this session!</div>
    );
  }
}

export function SessionPage(props){
  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  let params = useParams();

  if (params.session_id){
    return (
      <SimplePage account={account} setAccount={setAccount}>
        <SessionComponent account={account} setAccount={setAccount}
                          session_id={params.session_id} />
      </SimplePage>
    );
  } else {
    return (
      <SimplePage account={account} setAccount={setAccount}>
        <div>Information about all sessions?</div>
      </SimplePage>
    );
  }
}
