
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
      <LinkContainer to="/logout">
        <Nav.Link>Logout</Nav.Link>
      </LinkContainer>
    );
  } else {
    login_logout = (
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
    );
  }

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {login_logout}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
