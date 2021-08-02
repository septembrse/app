
import React from "react";

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export function LogoutComponent(props) {

  let account = props.account;
  let setAccount = props.setAccount;

  if (!setAccount){
    throw new Error("You must supply account details!");
  }

  function logout(){
    if (account && account.isLoggedIn()){
      account.logout();
      setAccount(null);
    }
  }

  if (account && account.isLoggedIn()){
    return (
      <Card bg="primary" border="primary" text="primary">
        <Card.Body>
          <div style={{width: "100%",
                       textAlign: "center",
                       marginBottom: "10px"}}>
            Are you sure you want to log out?
          </div>
          <Button
            variant="secondary"
            style={{width: "100%"}}
            onClick={() => logout()}>
              Yes - log out!
          </Button>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card bg="primary" border="primary" text="primary">
        <Card.Body>
          <div style={{width: "100%",
                       textAlign: "center",
                       marginBottom: "10px"}}>
            You are now logged out.
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export function Logout(props){

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
            <LogoutComponent  account={account} setAccount={setAccount} />
          </Col>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    </SimplePage>
  );
}
