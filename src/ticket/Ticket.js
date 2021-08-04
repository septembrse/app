
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';
import Submission from '../model/Submission';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { Redirect } from "react-router-dom";

export function TicketComponent(props){

  let account = props.account;

  if (account && account.isLoggedIn()){
    let access_buttons = null;

    if (account.isValidToday()){
      access_buttons = (
        <div>Access buttons here!</div>
      );
    }

    let presentation_buttons = [];

    let presentations = account.getPresentations();

    for (let i in presentations){
      try{
        let id = presentations[i];
        let drive_link = account.getDriveLink(id);

        let submission = Submission.getSubmission(id);

        let variant = "secondary";

        if (i % 3 === 1){
          variant = "info";
        } else if (i % 3 === 2){
          variant = "primary";
        }

        let session = submission.getSession();
        console.log(session);

        presentation_buttons.push(
          <Row key={id}>
            <Col>&nbsp;</Col>
            <Col md="auto" style={{minWidth: "80%", maxWidth:"768px"}}>
              <Card className="text-center"
                  bg={variant} border={variant} text={variant}
                  style={{borderRadius: "5px", marginTop:"10px"}}>
                <Card.Header style={{color: "rgb(220,220,220)",
                                     fontWeight: "bold"}}>
                  Your {submission.getFormat()}: {id}
                </Card.Header>
                <Card.Body>
                  <Card.Title style={{fontSize: "large"}}>
                    {submission.getTitle()}
                  </Card.Title>
                  <Card.Title style={{fontSize: "medium", fontStyle: "italic"}}>
                    <a href={drive_link}>Upload your slides here</a>
                  </Card.Title>
                  <Card.Text>
                     Place your slides / materials into the
                     folder in the above-linked Drive.
                  </Card.Text>
                  <Card.Text>
                     Materials should
                     not exceed 100 MB in size.
                     Please <a href="mailto:conference-2021@society-rse.org">contact us</a> if you
                     need more space.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>&nbsp;</Col>
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
          presentation materials are given below.
        </li>
      );
    }

    return (
      <Container fluid>
        <Row>
          <Col>&nbsp;</Col>
            <Col md="auto" style={{minWidth: "80%", maxWidth:"768px"}}>
              <Card bg="primary" border="primary" text="primary"
                    style={{borderRadius: "5px"}}>
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
                    {presenter}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          <Col>&nbsp;</Col>
        </Row>
        {presentation_buttons}
        {access_buttons}
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
