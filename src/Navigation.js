
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
    <Container>
    <Navbar variant="dark" expand="md" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>SeptembRSE</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
            <LinkContainer to="/search">
              <Nav.Link>Search</Nav.Link>
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </Container>
  );
}

export default Navigation;
