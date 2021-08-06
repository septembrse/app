
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Session from '../model/Session';
import Submission from "../model/Submission";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Link } from "react-router-dom";


export function DayTimetableComponent(props){
  let day = props.day;
  let variant = props.variant;

  if (!variant){
    variant = "primary";
  }

  if (day){
    let day_string = Session.getDayString(day);

    return (
      <Row key={day_string}>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <Card bg={variant} border={variant} text={variant}
                style={{borderRadius: "5px"}}>
            <Card.Header style={{textAlign: "center", fontSize: "larger",
                                 fontWeight: "bold"}}>
              {day_string}
            </Card.Header>
            <Card.Body style={{align_items:"center"}}>
              {props.children}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  } else {
    return null;
  }
}

export function SessionTimetableComponent(props){
  let session = props.session;

  let variant = props.variant;

  if (!variant){
    variant = "secondary";
  }

  if (session){
    let event_ids = session.getEventIDs();

    let events = [];

    for (let i in event_ids){
      let event = Submission.getSubmission(event_ids[i]);

      if (event){
        events.push(
          <li><Link to={event.getLink()}>{event.getFormat()}: {event.getTitle()}</Link></li>
        );
      }
    }

    if (events.length === 0){
      events.push(
        <ul>
          <li>Events will be scheduled into this session soon!</li>
        </ul>
      )
    } else {
      events = (
        <ul>
          {events}
        </ul>
      );
    }

    return (
      <Card bg={variant} border={variant} text={variant}
            style={{borderRadius: "5px", marginBottom:"10px"}}>
        <Card.Header style={{textAlign: "center"}}>
          {session.getDurationString()} : <Link to={session.getLink()}>Session {session.getID()}</Link>
        </Card.Header>
        <Card.Body style={{align_items:"center"}}>
          <Card.Title style={{fontWeight: "bold"}}>{session.getTitle()}</Card.Title>
          {events}
        </Card.Body>
      </Card>
    );
  } else {
    return null;
  }
}


export function TimetableComponent(props){

  let days = Session.getConferenceDays();

  let day_views = [];

  if (days){
    for (let i in days){
      let sessions = Session.getSessionsOnDay(days[i]);

      let session_parts = [];

      for (let j in sessions){
        let session = sessions[j];

        if (session){
          session_parts.push(
            <SessionTimetableComponent account={props.account}
                                      session={session}
                                      key={session.getID()} />
          );
        }
      }

      day_views.push(
        <DayTimetableComponent account={props.account}
                                  day={days[i]}
                                  key={i}>
          {session_parts}
        </DayTimetableComponent>
      )
    }
  }

  return (
    <Container fluid>
      {day_views}
    </Container>
  );
}

export function Timetable(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <TimetableComponent account={account} setAccount={setAccount} />
    </SimplePage>
  );
}
