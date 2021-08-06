
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Session from '../model/Session';
import Submission from '../model/Submission';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { useParams, Link } from "react-router-dom";

import ReactMarkdown from 'react-markdown'

import styles from "./Search.module.css";

const gfm = require('remark-gfm');

export function EventCard(props){
  let event = props.event;

  if (!event){
    console.log("NULL EVENT");
    return null;
  }

  let session = null;

  if (!props.hide_session){
    session = Session.getSessionForPresentation(event.getID());
  }

  let variant = props.variant;

  if (!variant){
    variant = "primary";
  }

  let account = props.account;

  let zoom_link = null;
  let is_in_gather = null;
  let slido_link = null;
  let drive_link = Account.getDriveReadLink(event.getID());

  if (account && account.isLoggedIn()){
    if (!props.hide_zoom){
      zoom_link = event.getZoomLink(account);
      is_in_gather = event.isInGather(account);
    }

    slido_link = event.getSlidoLink(account);
  }

  if (session){
    session = [
      <Card.Title key="s1" style={{fontSize: "medium",
                                   fontStyle: "italic"}}>
        This event is schedule to be part
        of <Link to={session.getLink()}>session {session.getID()}.</Link> This
        runs between
      </Card.Title>,
      <ul key="s3">
        <li>{session.getStartTimeString()} to</li>
        <li>{session.getEndTimeString()}</li>
      </ul>
    ];
  } else if (!props.hide_session) {
    session = [
      <Card.Title key="s1" style={{fontSize: "medium",
                                   fontStyle: "bold",
                                   textAlign: "center"}}>
        This event has not yet been scheduled.
      </Card.Title>,
      <Card.Text key="s2">
        More information about the scheduling of this event will
        appear here, once it is available. If you still don't
        have scheduling information once SeptembRSE has started
        then please <a href="mailto:conference-2021@society-rse.org">email us</a> to
        let us know, and we will fix this as soon as possible.
      </Card.Text>
    ];
  }

  if (zoom_link){
    if (is_in_gather){
      zoom_link = [
        <Card.Title key="z1" style={{fontSize: "medium",
                                    fontStyle: "bold",
                                    textAlign: "center"}}>
          Zoom link
        </Card.Title>,
        <Card.Text key="z2">
          Please <a href={zoom_link}>click here</a> to access
          the Zoom meeting in which this event will take place.
          You can also enter the meeting by
          walking to the lecture theatre in the virtual
          conference centre and pressing 'x' to join Zoom.
          Please <a href="mailto:conference-2021@society-rse.org">email us</a> if
          you are unable to connect.
        </Card.Text>
      ];
    } else {
      zoom_link = [
        <Card.Title key="z1" style={{fontSize: "medium",
                    fontStyle: "bold",
                  textAlign: "center"}}>
          Zoom link
        </Card.Title>,
        <Card.Text key="z2">
          Please <a href={zoom_link}>click here</a> to access
          the Zoom meeting in which this event will take place.
          This is a parallel session, and cannot be reached
          from within the virtual conference center.
          Please <a href="mailto:conference-2021@society-rse.org">email us</a> if
          you are unable to connect.
        </Card.Text>
      ];
    }
  } else if (account) {
    if (is_in_gather){
      zoom_link = [
        <Card.Title key="z1" style={{fontSize: "medium",
                                    fontStyle: "bold",
                                    textAlign: "center"}}>
          Zoom link
        </Card.Title>,
        <Card.Text key="z2">
          Within 30 minutes of this event there will be a zoom link
          here that you can click to get direct access to the
          Zoom meeting. You can also enter the meeting by
          walking to the lecture theatre in the virtual
          conference centre and pressing 'x' to join Zoom.
          If this event is about to start and you can't
          find this link, then
          please <a href="mailto:conference-2021@society-rse.org">email us</a>.
        </Card.Text>
      ];
    } else if (!props.hide_zoom) {
      zoom_link = [
        <Card.Title key="z1" style={{fontSize: "medium",
                                    fontStyle: "bold",
                                    textAlign: "center"}}>
          Zoom link
        </Card.Title>,
        <Card.Text key="z2">
          Within 30 minutes of this event there will be a zoom link
          here that you can click to get direct access to the
          Zoom meeting. This is a parallel session so cannot be
          reached from the virtual conference center.
          If this event is about to start and you can't
          find this link, then
          please <a href="mailto:conference-2021@society-rse.org">email us</a>.
        </Card.Text>
      ];
    }
  } else if (!props.hide_zoom) {
    zoom_link = [
      <Card.Text key="z3" style={{textAlign: "center"}}>
        <Link to="/login">Login</Link> to get the Zoom, Sli.do and
        Google Drive links associated with this event.
      </Card.Text>
    ];
  }

  if (slido_link){
    slido_link = [
      <Card.Title key="l1" style={{fontSize: "medium",
                                   fontStyle: "bold",
                                   textAlign: "center"}}>
        Sli.do link
      </Card.Title>,
      <Card.Text key="l2">
        Please <a href={slido_link}>click here</a> to access the
        sli.do board associated with this event.
      </Card.Text>,
      <Card.Text key="l3">
        If you can't access this sli.do board, then
        please <a href="mailto:conference-2021@society-rse.org">email us</a> and
        we will do our best to fix things.
      </Card.Text>
    ];
  }

  if (drive_link){
    drive_link = [
      <Card.Title key="l1" style={{fontSize: "medium",
                                   fontStyle: "bold",
                                   textAlign: "center"}}>
        Slides / other materials
      </Card.Title>,
      <Card.Text key="l2">
        Please <a href={drive_link}>click here</a> to access a drive
        in which the presenter may have uploaded slides or associated
        materials. These will be in the 'content' folder in this drive.
      </Card.Text>,
      <Card.Text key="l3">
        If you can't access this drive, then
        please <a href="mailto:conference-2021@society-rse.org">email us</a> and
        we will do our best to fix things.
      </Card.Text>
    ];
  }

  let abstract = null;

  if (event.getAbstract()){
    abstract = [
      <Card.Title key="d1"
                  style={{fontSize: "medium", fontStyle: "italic",
                          textAlign: "center"}}>
        Abstract
      </Card.Title>,
      <div key="d2" className={styles.markdown}>
        <ReactMarkdown remarkPlugins={[gfm]}
                       children={event.getAbstract()} />
      </div>
    ];
  }

  return (
    <Row key={event.getID()}>
      <Col style={{marginTop:"10px",
                   maxWidth: "768px",
                   marginLeft: "auto", marginRight: "auto"}}>
        <Card bg={variant} border={variant} text={variant}
              style={{borderRadius: "5px"}}>
          <Card.Header style={{color: "rgb(220,220,220)",
                               fontWeight: "bold",
                               textAlign: "center"}}>
            {event.getFormat()}: {event.getID()}
          </Card.Header>
          <Card.Body>
            <Card.Title style={{fontSize: "large",
                                textAlign: "center"}}>
              {event.getTitle()}
            </Card.Title>
            <Card.Title style={{fontSize: "medium", fontWeight: "bold",
                                textAlign: "center"}}>
              {event.getName()}
            </Card.Title>
            <Card.Title style={{fontSize: "medium", fontStyle: "italic",
                                textAlign: "center"}}>
              {event.getInstitution()}
            </Card.Title>
            {abstract}
            <Card.Title style={{fontSize: "large", fontWeight: "bold",
                                textAlign: "center"}}>
              Extra information
            </Card.Title>
            {session}
            {drive_link}
            {zoom_link}
            {slido_link}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export function EventComponent(props){

  let event_id = props.event_id;

  let event = Submission.getSubmission(event_id);

  if (event){
    return (
      <Container fluid>
        <EventCard account={props.account} setAccount={props.setAccount}
                   event={event} />
      </Container>
    );
  } else {
    return (
      <div>Failed to find info about this event!</div>
    );
  }
}

export function EventPage(props){
  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  let params = useParams();

  if (params.event_id){
    return (
      <SimplePage account={account} setAccount={setAccount}>
        <EventComponent account={account} setAccount={setAccount}
                        event_id={params.event_id} />
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