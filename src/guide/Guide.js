
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function GuideComponent(props){
  return (
    <Container fluid>
      <Row>
        <Col>
          Under construction
        </Col>
      </Row>
    </Container>
  );
}

export function Guide(props){

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <GuideComponent account={account} setAccount={setAccount} />
    </SimplePage>
  );
}
