import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Redirect } from "react-router-dom";

export function LoginComponent(props) {
  const [credentials, setCredentials] = React.useState({
    email: null,
    password: null,
    message: null
  });

  function setEmail(email) {
    setCredentials({
      email: email,
      password: credentials.password,
      message: null
    });
  }

  function setPassword(password) {
    setCredentials({
      email: credentials.email,
      password: password,
      message: null
    });
  }

  let account = props.account;
  let setAccount = props.setAccount;

  if (!setAccount){
    throw new Error("You must pass in the account details!");
  }

  function fail(message) {
    setCredentials({
      email: credentials.email,
      password: credentials.password,
      message: message
    });
    setAccount(null);
  }

  function success(account) {
    if (account && account.isLoggedIn()) {
      setCredentials({
        email: credentials.email,
        password: null,
        message: "Logged in"
      });
      setAccount(account);
    } else {
      fail("Something went wrong with the login.");
    }
  }

  function login() {
    let email = credentials.email;
    let password = credentials.password;

    if (!email || !password) {
      return;
    }

    try {
      let account = Account.login(email, password);
      success(account);
    } catch (error) {
      setAccount(null);
      fail(error.message);
    }
  }

  function logout() {
    let account = Account.get_account();

    if (account) {
      account.logout();
    }

    setAccount(null);
    setCredentials({
      email: null,
      password: null,
      message: null
    });
  }

  function enterOnEnter(e) {
    if (e.key === "Enter") {
      login();
    }
  }

  if (account && account.isLoggedIn()) {
    return (
      <Redirect to="/ticket" />
    );
  } else {
    let alert = null;

    if (credentials.message) {
      alert = <Alert variant="danger" style={{margin:"10px"}}>
                {credentials.message}
              </Alert>;
    }

    return (
      <Card bg="primary" border="primary" text="primary">
        <Card.Body style={{align_items:"center"}}>
          {alert}
          <Form>
            <Card.Title>Email address</Card.Title>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email"
                            placeholder="Enter your SeptembRSE email"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => enterOnEnter(e)} />
              <Form.Text className="text-muted">
                <div style={{color:"white"}}>
                  Use the email address to which your SeptembRSE ticket
                  was sent. Authentication happens locally on your computer.
                  No details are sent over the internet.
                </div>
              </Form.Text>
            </Form.Group>

            <Card.Title>Password</Card.Title>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => enterOnEnter(e)} />
              <Form.Text className="text-muted">
                <div style={{color:"white"}}>
                  Use the password that was include in the email with
                  your SeptembRSE ticket.
                </div>
              </Form.Text>
            </Form.Group>
            <Button style={{width:"100%"}}
                    variant="secondary"
                    onClick={()=>login()}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export function Login(props){

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <Container fluid>
        <Row>
          <Col>&nbsp;</Col>
          <Col md="auto" style={{maxWidth:"768px"}}>
            <LoginComponent account={account} setAccount={setAccount} />
          </Col>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    </SimplePage>
  );
}
