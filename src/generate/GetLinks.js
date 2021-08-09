
import React from "react";

import SimplePage from "../SimplePage";

import Account from "../model/Account";
import Session from "../model/Session";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export function GetLinks(props){

  let [account, setAccount] = React.useState(Account.get_account());

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  if (account && account.isAdmin()){

    let today = Account.getNow();

    let sessions = Session.getSessionsOnDay(today);

    let zoom_links = [];
    let slido_links = [];

    let zoom_link = account.getZoomLink();

    if (!zoom_link){
      zoom_links.push(
        <Card.Text key="no_zoom_link">
          The conference is not running today. There is no link for Zoom.
        </Card.Text>
      );
    } else {
      zoom_links.push(
        <Card.Text key="zoom_link">
          Conference Zoom Link: {zoom_link}<br/>
          <a href={zoom_link}>Click to start Zoom</a>
        </Card.Text>
      )
    }

    for (let i in sessions){
      let session = sessions[i];

      let event_ids = session.getEventIDs();

      for (let j in event_ids){
        let event_id = event_ids[j];
        let l = account.getZoomLinkIfDifferent(event_id);

        if (l){
          zoom_links.push(
            <Card.Text key={`zoom_link_${l}`}>
              Event {event_id} has its own Zoom link: {l}<br/>
              <a href={l}>Click to start Zoom</a>
            </Card.Text>
          );
        }

        l = account.getSlidoLink(event_id);

        if (l){
          slido_links.push(
            <Card.Text key={`slido_link_${l}`}>
              Slido board for {event_id}: {l}<br/>
              <a href={l}>Click to visit this board</a>
            </Card.Text>
          )
        }
      }
    }

    if (zoom_links.length === 0){
      zoom_links.push(
        <Card.Text key="no_zoom_links">There are no Zoom links for today.</Card.Text>
      );
    }

    if (slido_links.length === 0){
      slido_links.push(
        <Card.Text key="no_slido_links">There are no Sli.do links for today.</Card.Text>
      )
    }

    return (
      <SimplePage account={account} setAccount={setAccount}>
        <Container fluid>
          <Row>
            <Col style={{marginTop:"10px",
                        maxWidth: "768px",
                        marginLeft: "auto", marginRight: "auto"}}>
              <h1 style={{textAlign: "center"}}>Today's conference links</h1>
              <h3 style={{textAlign: "center"}}>{Session.getDayString(today)}</h3>
            </Col>
          </Row>

          <Row>
            <Col style={{marginTop:"10px",
                          maxWidth: "768px",
                          marginLeft: "auto", marginRight: "auto"}}>
              <Card bg="primary" border="primary" text="primary"
                    style={{borderRadius: "5px"}}>
                <Card.Body style={{align_items:"center"}}>
                  <Card.Title key="gather_title">
                    Virtual Conference Center Link
                  </Card.Title>
                  <Card.Text key="gather_link">
                    gather.town<br/>
                    <a href={account._getGatherTownLink()}>Click to visit the Virtual Conference Center</a>
                  </Card.Text>
                  <Card.Title>
                    Zoom Links
                  </Card.Title>
                  {zoom_links}
                  <Card.Title>
                    Sli.do Links
                  </Card.Title>
                  {slido_links}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SimplePage>
    );
  } else {
    return (
      <SimplePage>
        <Container fluid>
          <Row>
            <Col style={{marginTop:"10px",
                          maxWidth: "768px",
                          marginLeft: "auto", marginRight: "auto"}}>
              <Card bg="danger" border="danger" text="danger">
                <Card.Body style={{align_items:"center"}}>
                    <Card.Title>Forbidden page!</Card.Title>
                    <Card.Text>
                      You don't have permission to view this page.
                      Please log in using an admin or committee
                      member account.
                    </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SimplePage>
    );
  }
};

export default GetLinks;
