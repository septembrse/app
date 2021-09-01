
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
        let zoom_link = submission.getZoomLink(account);
        let is_in_gather = submission.isInGather(account);
        let signup_link = submission.getSignUpLink(account);

        if (session){
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
          if (is_in_gather){
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
                Please <a href={zoom_link}>click here</a> to access
                the Zoom meeting in which you will present your session.
                This is a parallel session, and cannot be reached
                from within the virtual conference center.
                Please <a href="mailto:conference-2021@society-rse.org">email us</a> if
                you are unable to connect.
              </Card.Text>
            ];
          }
        } else {
          if (is_in_gather){
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
                Zoom meeting. This is a parallel session so cannot be
                reached from the virtual conference center.
                If your event is about to start and you can't
                find this link, then
                please <a href="mailto:conference-2021@society-rse.org">email us</a>.
              </Card.Text>
            ];
          }
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

        let signups = null;
        let unsuccessful = null;

        if (signup_link){
          signups = submission.getSignUps(account);
          unsuccessful = submission.getUnsuccessful(account);

          if (signups.length > 0){
            signups = [
              <Card.Text key="wl3">
                The number of current sign ups is {signups.length}.
              </Card.Text>,
              <Card.Text key="wl4">
                Email addresses of sign ups:
              </Card.Text>,
              <pre key="wl5">{signups.join(", ")}</pre>
            ];
          } else {
            signups = [
              <Card.Text key="wl3">
                No-one has signed up yet. The email addresses of those that
                do sign up will be shown here within 48 hours of them
                filling in the above form.
              </Card.Text>
            ];
          }

          if (unsuccessful.length > 0){
            unsuccessful = [
              <Card.Text key="wu1">
                There are more people registered ({unsuccessful.length}) than
                there is space. You have a very popular workshop!
              </Card.Text>
            ];
          } else {
            unsuccessful = null;
          }

          signup_link = [
            <Card.Title key="wl1" style={{fontSize: "medium",
                                         fontStyle: "bold",
                                         textAlign: "center"}}>
              Workshop Signup Information
            </Card.Title>,
            <Card.Text key="wl2">
              Registered ticket holders of SeptembRSE will sign up to
              your workshop using <a href={signup_link}>this form</a>.
            </Card.Text>
          ];
        }

        let variant = "secondary";

        if (i % 3 === 1){
          variant = "info";
        } else if (i % 3 === 2){
          variant = "primary";
        }

        variant = "secondary";

        presentation_buttons.push(
          <Row key={id}>
            <Col>
              <Card
                  bg={variant}
                  style={{borderRadius: "5px", marginTop:"10px",
                          maxWidth: "768px",
                          marginLeft: "auto", marginRight: "auto"}}>
                <Card.Header style={{fontWeight: "bold",
                                     textAlign: "center"}}>
                  <Link to={submission.getLink()}>Your {submission.getFormat()}: {id}</Link>
                </Card.Header>
                <Card.Body>
                  <Card.Title style={{fontSize: "large",
                                      textAlign: "center"}}>
                    {submission.getTitle()}
                  </Card.Title>
                  {session}
                  {zoom_link}
                  {signup_link}
                  {signups}
                  {unsuccessful}
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
              will be from the afternoon of the 3rd September to the 1st October 2021.</li>
        );
      } else {
        gathertown = (
          <li>A link to connect to the gather.town virtual conference center
              will appear here on the day(s) on which your ticket is valid.
              This will on the day(s) of your event(s) as you hold
              a day ticket.</li>
        );
      }
    }

    let signups = account.getMySignUps();

    if (signups && signups.length > 0){
      let links = [];

      for (let i in signups){
        let ID = signups[i];
        links.push(
          <Row>
            <Col>
              <Card bg="dark"
                    style={{borderRadius: "5px", marginTop:"10px",
                            maxWidth: "768px",
                            marginLeft: "auto", marginRight: "auto"}}>
                <Card.Header style={{textAlign: "center"}}>
                  Registered for Workshop {ID}
                </Card.Header>
                <Card.Body style={{align_items:"center"}}>
                  <Card.Title style={{textAlign: "center"}}>
                    You are successfully registered to attend workshop {ID}
                  </Card.Title>
                  <Card.Text>
                    This workshop can only be accessed via the Zoom link
                    that is provided on the <a href={`/#/event/${ID}`}>workshop page</a>.
                  </Card.Text>
                  <Card.Text>
                    This workshop has limited space.
                    Please <a href="mailto:conference-2021@society-rse.org">email us</a> at least
                    48 hours before the workshop if you can no longer attend.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      }

      signups = links;
    }

    let unsuccessful = account.getMyUnsuccessful();

    if (unsuccessful && unsuccessful.length > 0){
      let links = [];

      for (let i in unsuccessful){
        let ID = unsuccessful[i];
        links.push(
          <Row>
            <Col>
              <Card bg="dark"
                    style={{borderRadius: "5px", marginTop:"10px",
                            maxWidth: "768px",
                            marginLeft: "auto", marginRight: "auto"}}>
                <Card.Header style={{textAlign: "center"}}>
                  Sorry - you have not been able to register for Workshop {ID}
                </Card.Header>
                <Card.Body style={{align_items:"center"}}>
                  <Card.Title style={{textAlign: "center"}}>
                    You were unsuccessful in registering to attend workshop {ID}
                  </Card.Title>
                  <Card.Text>
                    The workshop is full. We are sorry that there are no spaces remaining.
                  </Card.Text>
                  <Card.Text>
                    You have been put into a wait list. You will be informed via
                    this page at least 48 hours before the event if a space
                    has opened up for you.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      }

      unsuccessful = links;
    }

    return (
      <Container fluid>
        <Row>
          <Col style={{marginTop:"10px",
                      maxWidth: "768px",
                      marginLeft: "auto", marginRight: "auto"}}>
            <h1 style={{textAlign: "center"}}>Your SeptembRSE Ticket</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card bg="primary"
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
                  <li key="ticket_type">
                    Ticket type: {account.getTicket()}
                  </li>
                  <li key="ticket_details">
                    {account.getTicketDetails()}
                  </li>
                  {gathertown}
                  <li key="zoom_link_today">
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
        {signups}
        {unsuccessful}
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
    <SimplePage {...props} account={account} setAccount={setAccount}>
      <TicketComponent account={account} setAccount={setAccount} />
    </SimplePage>
  );
}
