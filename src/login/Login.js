import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

export function LoginComponent(props) {
  const [credentials, setCredentials] = React.useState({
    email: null,
    password: null,
    message: null
  });

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

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
      <Card style={{width: "80%", margin: "10px"}}>
        <Card.Body>
          <Button
            style={{width: "100%"}}
            onClick={() => logout()}>
              Logout
          </Button>
        </Card.Body>
      </Card>
    );
  } else {
    let alert = null;

    if (credentials.message) {
      alert = <Alert variant="danger" style={{margin:"10px"}}>
                {credentials.message}
              </Alert>;
    }

    return (
      <Card style={{width: "80%", margin: "10px"}}>
        <Card.Body style={{align_items:"center"}}>
          {alert}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email"
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => enterOnEnter(e)} />
              <Form.Text className="text-muted">
                Use the email address to which your SeptembRSE ticket
                was sent. Authentication happens locally on your computer.
                No details are sent over the internet.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => enterOnEnter(e)} />
              <Form.Text className="text-muted">
                Use the password that was include in the email with
                your SeptembRSE ticket.
              </Form.Text>
            </Form.Group>
            <Button style={{width:"100%"}}
                    variant="primary"
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
  return (
    <SimplePage>
      <LoginComponent />
    </SimplePage>
  );
}
