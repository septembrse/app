
import React from 'react';

import { Link } from "react-router-dom";

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export function TicketComponent(props){

  let account = props.account;

  if (account && account.isLoggedIn()){
    let access_buttons = null;

    if (account.isValidToday()){
      access_buttons = (
        <div>Access buttons here!</div>
      );
    }

    return (
      <Container fluid>
        <Row>
          <Col>&nbsp;</Col>
            <Col md="auto" style={{maxWidth:"768px"}}>
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
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          <Col>&nbsp;</Col>
        </Row>
        {access_buttons}
      </Container>
    );
  } else {
    return (
      <Container fluid>
        <Row>
          <Col>&nbsp;</Col>
            <Col md="auto" style={{maxWidth:"768px"}}>
              <Card bg="danger" border="danger" text="danger">
                <Card.Body style={{align_items:"center"}}>
                    <Card.Title>Please log in!</Card.Title>
                    <Card.Text>
                      You need
                      to <Link to="/login">login</Link> to be
                      able to see your ticket.
                    </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    )
  }
}

export function Ticket(props){

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <TicketComponent account={account} setAccount={setAccount} />
    </SimplePage>
  );
}
