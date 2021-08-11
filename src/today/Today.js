
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Session from '../model/Session';
import Submission from '../model/Submission';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";

function EventToday(props){
  let event = props.event;

  let variant = "secondary";

  let account = props.account;

  let zoom_link = null;
  let slido_link = null;
  let drive_link = Account.getDriveReadLink(event.getID());

  let links = [];

  if (account && account.isLoggedIn()){
    zoom_link = event.getZoomLink(account);
    slido_link = event.getSlidoLink(account);

    if (zoom_link){
      if (zoom_link !== props.zoom_link){
        links.push(
          <Card.Text key="z1" style={{textAlign: "center"}}>
            <a href={zoom_link}>Connect to the Zoom meeting for this event.</a>
          </Card.Text>
        );
      }
    }

    if (slido_link){
      links.push(
        <Card.Text key="s1" style={{textAlign:"center"}}>
          <a href={slido_link}>Connect to the sli.do board for this event.</a>
        </Card.Text>
      );
    }
  }

  if (drive_link){
    links.push(
      <Card.Text key="drive" style={{textAlign:"center"}}>
        <a href={drive_link}>Download slides or other materials</a>
      </Card.Text>
    );
  }

  return (
    <Card bg={variant} border={variant} text={variant}
          style={{borderRadius: "5px", marginBottom:"10px"}}
          key={event.getID()}>
      <Card.Header style={{textAlign: "center"}}>
        <Link to={event.getLink()}>{event.getFormat()} {event.getID()}</Link>
      </Card.Header>
      <Card.Body style={{align_items:"center"}}>
        <Card.Title style={{fontWeight: "bold", textAlign: "center"}}>
          {event.getTitle()}
        </Card.Title>
        <Card.Text style={{textAlign: "center", fontStyle: "italic"}}>
          {event.getName()}
        </Card.Text>
      </Card.Body>
      {links}
    </Card>
  );
}

function SessionToday(props){
  let session = props.session;

  let variant = "primary";

  let account = props.account;

  let zoom_link = null;
  let zoom_text = null;

  let events = [];

  let event_ids = session.getEventIDs();

  for (let j in event_ids){
    let event_id = event_ids[j];

    let event = Submission.getSubmission(event_id);

    if (event){
      if (account && account.isLoggedIn()){

        if (!zoom_text){
          zoom_link = event.getZoomLink(account);

          if (zoom_link){
            if (event.isInGather(account)){
              zoom_text = (
                <Card.Text style={{textAlign: "center", color: "white"}}>
                  <a href={zoom_link}>
                    Connect to the Zoom meeting for this session.
                  </a><br/>Alternatively you can walk to the lecture theatre
                  in the <a href={account.getGatherTownLink()}>virtual conference center</a> and press 'x' to connect
                  to Zoom.
                </Card.Text>
              );
            } else {
              zoom_text = (
                <Card.Text style={{textAlign: "center", color: "white"}}>
                  <a href={zoom_link}>
                    Connect to the Zoom meeting for this session.
                  </a><br/>This is a parallel session, so it cannot be
                  reached from within the <a href={account.getGatherTownLink()}>virtual conference center</a>.
                </Card.Text>
              );
            }
          } else if (!account.isValidToday()){
            zoom_text = (
              <Card.Text style={{textAlign: "center", color: "white"}}>
                Your ticket is not valid today, so you cannot connect
                to the Zoom session.
              </Card.Text>
            );
          } else {
            zoom_text = (
              <Card.Text style={{textAlign: "center", color: "white"}}>
                The link to the Zoom meeting for this session will appear
                from 30 minutes before the session starts, and will be available
                until 30 minutes after it has finished.
              </Card.Text>
            );
          }
        }
      }

      events.push(<EventToday key={event_id}
                              event={event}
                              account={props.account}
                              setAccount={props.setAccount}
                              zoom_link={zoom_link} />);
    }
  }

  if (!zoom_text){
    if (account && account.isLoggedIn()){
      zoom_link = session.getZoomLink(account);

      if (zoom_link){
        zoom_text = (
          <Card.Text style={{textAlign: "center", color: "white"}}>
            <a href={zoom_link}>
              Connect to the Zoom meeting for this session.
            </a><br/>Or connect to Zoom by visiting the lecture theatre
            in the <a href={account.getGatherTownLink()}>virtual conference center</a>.
          </Card.Text>
        );
      } else if (!account.isValidToday()){
        zoom_text = (
          <Card.Text style={{textAlign: "center", color: "white"}}>
            Your ticket is not valid today, so you cannot connect
            to the Zoom session.
          </Card.Text>
        );
      } else {
        zoom_text = (
          <Card.Text style={{textAlign: "center", color: "white"}}>
            The link to the Zoom meeting for this session will appear
            from 30 minutes before the session starts, and will be available
            until 30 minutes after it has finished.
          </Card.Text>
        );
      }
    } else {
      zoom_text = (
        <Card.Text style={{textAlign: "center", color: "white"}}>
          <Link to="/login">Log in</Link> to get the Zoom and Sli.do
          links associated with this session.
        </Card.Text>
      )
    }
  }

  return (
    <Row key={session.getID()}>
      <Col style={{marginTop:"10px",
                   maxWidth: "768px",
                   marginLeft: "auto", marginRight: "auto"}}>
        <Card bg={variant} border={variant} text={variant}
              style={{borderRadius: "5px"}}>
          <Card.Header style={{textAlign: "center", fontSize: "larger",
                              fontWeight: "bold"}}>
            {session.getDurationString()} : <Link to={session.getLink()}>Session {session.getID()}</Link>
          </Card.Header>
          <Card.Body style={{align_items:"center"}}>
            <Card.Title style={{textAlign: "center"}}>{session.getTitle()}</Card.Title>
            {zoom_text}
            {events}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export function TodayComponent(props){

  let today = Account.getNow();

  let sessions = [];

  if (today > new Date("2021-09-05")){
    sessions = Session.getSessionsOnDay(today);
  }

  let session_components = [];

  for (let i in sessions){
    session_components.push(
      <SessionToday key={sessions[i].getID()}
                         account={props.account}
                         setAccount={props.setAccount}
                         session={sessions[i]} />
    );
  }

  let gather_link = null;

  let account = props.account;

  if (account && account.isLoggedIn()){
    if (account.isValidToday()){
      gather_link = (
        <Row key="gather_link">
          <Col style={{marginTop:"10px",
                      maxWidth: "768px",
                      marginLeft: "auto", marginRight: "auto"}}>
            <Button variant="dark"
                    style={{width: "100%", borderRadius: "5px"}}
                    href={account.getGatherTownLink()}>
              Connect to the gather.town Virtual Conference Center
            </Button>
          </Col>
        </Row>
      );
    } else {
      gather_link = (
        <Row key="gather_link">
          <Col style={{marginTop:"10px",
                      maxWidth: "768px",
                      marginLeft: "auto", marginRight: "auto"}}>
            <Button variant="dark"
                    style={{width: "100%", borderRadius: "5px"}}>
              Your ticket is not valid today
            </Button>
          </Col>
        </Row>
      );
    }
  } else {
    gather_link = (
      <Row key="gather_link">
        <Col style={{marginTop:"10px",
                    maxWidth: "768px",
                    marginLeft: "auto", marginRight: "auto"}}>
          <Button variant="dark"
                  style={{width: "100%", borderRadius: "5px"}}
                  onClick={() => props.history.push("/login")}>
            Login to get the link to connect to the gather.town
            Virtual Conference Center
          </Button>
        </Col>
      </Row>
    );
  }

  if (session_components.length === 0){
    session_components.push(
      <Row key="session_0">
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <Card.Text style={{textAlign: "center"}}>
            SeptembRSE runs from the 6th-30th September 2021.
          </Card.Text>
          <Card.Text style={{textAlign: "center"}}>
            There is nothing scheduled to run today.
          </Card.Text>
        </Col>
      </Row>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{marginTop:"10px",
                     maxWidth: "768px",
                     marginLeft: "auto", marginRight: "auto"}}>
          <h1 style={{textAlign: "center"}}>What is happening today?</h1>
          <h3 style={{textAlign: "center"}}>{Session.getDayString(today)}</h3>
        </Col>
      </Row>
      {gather_link}
      {session_components}
    </Container>
  );
}

export function Today(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <TodayComponent account={account} setAccount={setAccount}
                      history={props.history} />
    </SimplePage>
  );
}
