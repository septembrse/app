
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Session from '../model/Session';
import Submission from '../model/Submission';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { EventCard } from "../search/EventPage";

import { useParams } from "react-router-dom";


export function SessionCard(props){
  let session = props.session;
  let variant = props.variant;

  if (!variant){
    variant = "primary";
  }

  return (
    <Row key={session.getID()}>
      <Col style={{marginTop:"10px",
                   maxWidth: "768px",
                   marginLeft: "auto", marginRight: "auto"}}>
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
    </Row>
  );
}

export function SessionComponent(props){

  let session_id = props.session_id;

  let session = Session.getSession(session_id);

  if (session){
    let events = [];

    let event_ids = session.getEventIDs();

    for (let i in event_ids){
      let event_id = event_ids[i];

      let event = Submission.getSubmission(event_id);

      if (event){
        events.push(<EventCard key={event_id}
                               event={event}
                               hide_session={true} hide_zoom={true}
                               account={props.account}
                               setAccount={props.setAccount}
                               variant="secondary" />);
      }
    }

    return (
      <Container fluid>
        <SessionCard account={props.account} setAccount={props.setAccount}
                     session={session} />
        {events}
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
