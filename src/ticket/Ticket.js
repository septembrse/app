
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Submission from '../model/Submission';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { Redirect, Link } from "react-router-dom";

export function TicketComponent(props){

  let account = props.account;

  if (account && account.isLoggedIn()){
    let access_buttons = null;

    let presentation_buttons = [];

    let presentations = account.getPresentations();

    for (let i in presentations){
      try{
        let id = presentations[i];
        let drive_link = account.getDriveLink(id);

        if (drive_link){
          drive_link = [
            <Card.Title key="t1"
                        style={{fontSize: "medium", fontStyle: "bold",
                                textAlign: "center"}}>
              Uploading your slides or other materials
            </Card.Title>,
            <Card.Text key="t2">
              <a href={drive_link}>Upload your slides or other materials into this Google Drive</a>.
            </Card.Text>,
            <Card.Text key="t3">
              Materials should
              not exceed 100 MB in size.
              Please <a href="mailto:conference-2021@society-rse.org">contact us</a> if you
              need more space.
            </Card.Text>
          ];
        } else {
          drive_link = [
            <Card.Title key="t1" style={{fontSize: "medium",
                                         fontStyle: "bold",
                                         textAlign: "center"}}>
              Uploading your slides or other materials
            </Card.Title>,
            <Card.Text key="t2">
              You should be able to see a drive link above. The fact you
              cannot shows that there is an error in the system.
              Please <a href="mailto:conference-2021@society-rse.org">email us</a> to
              let us know and we will fix this as soon as possible.
            </Card.Text>
          ];
        }

        let submission = Submission.getSubmission(id);

        if (!submission){
          throw new Error("Why are we missing a session?");
        }

        let session = submission.getSession();
        let slido_link = submission.getSlidoLink(account);
        let zoom_link = null;

        if (session){
          zoom_link = session.getZoomLink(account);

          session = [
            <Card.Title key="s1" style={{fontSize: "medium",
                                         fontStyle: "italic"}}>
              Your event is schedule to be part
              of <Link to={session.getLink()}>session {session.getID()}.</Link> This
              runs between
            </Card.Title>,
            <ul key="s3">
              <li>{session.getStartTimeString()} to</li>
              <li>{session.getEndTimeString()}</li>
            </ul>
          ];
        } else {
          session = [
            <Card.Title key="s1" style={{fontSize: "medium",
                                         fontStyle: "bold",
                                         textAlign: "center"}}>
              Your event has not yet been scheduled.
            </Card.Title>,
            <Card.Text key="s2">
              More information about the scheduling of your event will
              appear here, once it is available. If you still don't
              have scheduling information once SeptembRSE has started
              then please <a href="mailto:conference-2021@society-rse.org">email us</a> to
              let us know, and we will fix this as soon as possible.
            </Card.Text>
          ];
        }

        if (zoom_link){
          zoom_link = [
            <Card.Title key="z1" style={{fontSize: "medium",
                                         fontStyle: "bold",
                                         textAlign: "center"}}>
              Zoom link
            </Card.Title>,
            <Card.Text key="z2">
              Please <a href={zoom_link}>click here</a> to access
              the Zoom meeting in which you will present your session.
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
              Within 30 minutes of your event there will be a zoom link
              here that you can click to get direct access to the
              Zoom meeting. You can also enter the meeting by
              walking to the lecture theatre in the virtual
              conference centre and pressing 'x' to join Zoom.
              If your event is about to start and you can't
              find this link, then
              please <a href="mailto:conference-2021@society-rse.org">email us</a>.
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
              sli.do board associated with your event. You can check
              this to see what questions are being asked about your event.
            </Card.Text>,
            <Card.Text key="l3">
              If you can't access this sli.do board, then
              please <a href="mailto:conference-2021@society-rse.org">email us</a> and
              we will do our best to fix things.
            </Card.Text>
          ];
        }

        let variant = "secondary";

        if (i % 3 === 1){
          variant = "info";
        } else if (i % 3 === 2){
          variant = "primary";
        }

        presentation_buttons.push(
          <Row key={id}>
            <Col>
              <Card
                  bg={variant} border={variant} text={variant}
                  style={{borderRadius: "5px", marginTop:"10px",
                          maxWidth: "768px",
                          marginLeft: "auto", marginRight: "auto"}}>
                <Card.Header style={{color: "rgb(220,220,220)",
                                     fontWeight: "bold",
                                     textAlign: "center"}}>
                  Your {submission.getFormat()}: {id}
                </Card.Header>
                <Card.Body>
                  <Card.Title style={{fontSize: "large",
                                      textAlign: "center"}}>
                    {submission.getTitle()}
                  </Card.Title>
                  {session}
                  {zoom_link}
                  {drive_link}
                  {slido_link}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );

      } catch (error){
        console.log(error);
      }
    }

    let presenter = null;

    if (account.isPresenter()){
      presenter = (
        <li>
          You are a presenter at SeptembRSE. Links to upload any
          presentation materials, access Zoom and Sli.do, and
          information about scheduling of your event(s) are
          given in the event cards below.
        </li>
      );
    }

    let gathertown = account.getGatherTownLink();

    if (gathertown){
      gathertown = (
        <li>Please <a href={gathertown}>click here</a> to enter the
            gather.town virtual conference center. If this is the first time
            you are connecting, you will be asked to sign into gather.town.
            Please use your ticket's email address ({account.getEmail()}).</li>
      );
    } else {
      if (account.isGeneralTicket()){
        gathertown = (
          <li>A link to connect to the gather.town virtual conference center
              will appear here when the conference center is open. This
              will be from the 2nd September to the 1st October 2021.</li>
        );
      } else {
        gathertown = (
          <li>A link to connect to the gather.town virtual conference center
              will appear here on the days on which your ticket is valid.
              This will on the day(s) of your event(s) as you hold
              a day ticket.</li>
        );
      }
    }

    return (
      <Container fluid>
        <Row>
          <Col>
            <Card bg="primary" border="primary" text="primary"
                  style={{borderRadius: "5px", marginTop:"10px",
                          maxWidth: "768px",
                          marginLeft: "auto", marginRight: "auto"}}>
              <Card.Header style={{textAlign: "center"}}>
                {account.getEmail()}
              </Card.Header>
              <Card.Body style={{align_items:"center"}}>
                <Card.Title style={{textAlign: "center"}}>
                  Your SeptembRSE Ticket
                </Card.Title>
                <ul>
                  <li>
                    Ticket type: {account.getTicket()}
                  </li>
                  <li>
                    {account.getTicketDetails()}
                  </li>
                  {gathertown}
                  <li>
                    When the conference is running you will be able
                    to get direct links to Zoom meetings and Sli.do
                    boards for today's events by visiting
                    the <Link to="/today">What's on Today?</Link> page.
                  </li>
                  {presenter}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {access_buttons}
        {presentation_buttons}
      </Container>
    );
  } else {
    return (
      <Redirect to="/login" />
    )
  }
}

export function Ticket(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <TicketComponent account={account} setAccount={setAccount} />
    </SimplePage>
  );
}
