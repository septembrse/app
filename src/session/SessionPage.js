
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

import { Link, useParams } from "react-router-dom";


export function SessionCard(props){
  let session = props.session;
  let variant = props.variant;
  let zoom_text = props.zoom_text;

  if (!variant){
    variant = "primary";
  }

  if (session.isNetworking()){
    zoom_text = null;
  }

  let youtube_link = session.getYouTubeLink();

  if (youtube_link){
    youtube_link = (
      <Card.Text style={{textAlign: "center"}}>
        <a href={youtube_link}>View recorded session on YouTube</a>
      </Card.Text>
    );

    //this is in the past, so no zoom link
    zoom_text = null;
  }

  return (
    <Row key={session.getID()}>
      <Col style={{marginTop:"10px",
                   maxWidth: "768px",
                   marginLeft: "auto", marginRight: "auto"}}>
        <Card bg={variant}
              style={{borderRadius: "5px"}}>
          <Card.Header style={{textAlign: "center"}}>
            {session.getStartTimeString()} - {session.getEndTimeString()}
          </Card.Header>
          <Card.Body style={{align_items:"center"}}>
            <Card.Title style={{textAlign: "center"}}>
              Session {session.getID()}: {session.getTitle()}
            </Card.Title>
            {youtube_link}
            {zoom_text}
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
  let account = props.account;

  let session = Session.getSession(session_id);

  let zoom_link = null;
  let zoom_text = null;

  if (session){

    let events = [];

    let event_ids = session.getEventIDs();

    if (session.isBlended()){
      zoom_text = (
        <Card.Text style={{textAlign: "center"}}>
          This is a blended session. Sign up and Zoom link details can
          be found in the abstract for the individual events.
        </Card.Text>
      );
    }

    for (let i in event_ids){
      let event_id = event_ids[i];

      let event = Submission.getSubmission(event_id);

      if (event){
        if (account && account.isLoggedIn()){

          if (!zoom_text){
            zoom_link = event.getZoomLink(account);

            if (zoom_link){
              if (event.isInGather(account)){
                zoom_text = (
                  <Card.Text style={{textAlign: "center"}}>
                    <a href={zoom_link}>
                      Connect to the Zoom meeting for this session.
                    </a><br/>Alternatively you can walk to the lecture theatre
                    in the <a href={account.getGatherTownLink()}>virtual conference center</a> and press 'x' to connect
                    to Zoom.
                  </Card.Text>
                );
              } else {
                zoom_text = (
                  <Card.Text style={{textAlign: "center"}}>
                    <a href={zoom_link}>
                      Connect to the Zoom meeting for this session.
                    </a><br/>This is a parallel session, so it cannot be
                    reached from within the <a href={account.getGatherTownLink()}>virtual conference center</a>.
                  </Card.Text>
                );
              }
            } else if (!account.isValidToday()){
              zoom_text = (
                <Card.Text style={{textAlign: "center"}}>
                  Your ticket is not valid today, so you cannot connect
                  to the Zoom session.
                </Card.Text>
              );
            } else {
              zoom_text = (
                <Card.Text style={{textAlign: "center"}}>
                  The link to the Zoom meeting for this session will appear
                  from 30 minutes before the session starts, and will be available
                  until 30 minutes after it has finished.
                </Card.Text>
              );
            }
          }
        }

        events.push(<EventCard key={event_id}
                               event={event}
                               hide_session={true} hide_zoom={true}
                               account={props.account}
                               setAccount={props.setAccount}
                               variant="secondary" />);
      }
    }

    if (!zoom_text){
      if (account && account.isLoggedIn()){
        zoom_link = session.getZoomLink(account);

        if (zoom_link){
          zoom_text = (
            <Card.Text style={{textAlign: "center"}}>
              <a href={zoom_link}>
                Connect to the Zoom meeting for this session.
              </a><br/>Or connect to Zoom by visiting the lecture theatre
              in the <a href={account.getGatherTownLink()}>virtual conference center</a>.
            </Card.Text>
          );
        } else if (!account.isValidToday()){
          zoom_text = (
            <Card.Text style={{textAlign: "center"}}>
              Your ticket is not valid today, so you cannot connect
              to the Zoom session.
            </Card.Text>
          );
        } else {
          zoom_text = (
            <Card.Text style={{textAlign: "center"}}>
              The link to the Zoom meeting for this session will appear
              from 30 minutes before the session starts, and will be available
              until 30 minutes after it has finished.
            </Card.Text>
          );
        }
      } else {
        zoom_text = (
          <Card.Text style={{textAlign: "center"}}>
            <Link to="/login">Log in</Link> to get the Zoom and Sli.do
            links associated with this session.
          </Card.Text>
        )
      }
    }

    return (
      <Container fluid>
        <Row>
          <Col style={{marginTop:"10px",
                      maxWidth: "768px",
                      marginLeft: "auto", marginRight: "auto"}}>
            <h1 style={{textAlign: "center"}}>Session Information</h1>
          </Col>
        </Row>

        <SessionCard account={props.account} setAccount={props.setAccount}
                     session={session} zoom_text={zoom_text} />
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
      <SimplePage {...props} account={account} setAccount={setAccount}>
        <SessionComponent account={account} setAccount={setAccount}
                          session_id={params.session_id} />
      </SimplePage>
    );
  } else {
    return (
      <SimplePage {...props} account={account} setAccount={setAccount}>
        <div>Information about all sessions?</div>
      </SimplePage>
    );
  }
}
