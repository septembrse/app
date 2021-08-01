
import React from 'react';

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import {LinkContainer} from 'react-router-bootstrap'

function Navigation(props){

  let account = props.account;

  let login_logout = null;

  if (account && account.isLoggedIn()){
    login_logout = (
      <Nav.Item>
        <LinkContainer to="/logout">
          <Nav.Link>Logout</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    );
  } else {
    login_logout = (
      <Nav.Item>
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    );
  }

  return (
    <Navbar expand="lg">
      <Container>
        <Nav.Item>
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/today">
            <Nav.Link>Today</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/timetable">
            <Nav.Link>Timetable</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/venue">
            <Nav.Link>Venue</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/ticket">
            <Nav.Link>Ticket</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        {login_logout}
      </Container>
    </Navbar>
  );
}

export default Navigation;
