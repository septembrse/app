
import React from "react";

import SimplePage from "../SimplePage";

import Account from "../model/Account";
import Session from "../model/Session";

import {CopyToClipboard} from 'react-copy-to-clipboard';

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import {get_key, get_day_secret,
        get_user_key, mangle_email, get_day_string} from "../model/Secret";

import styles from "./Generate.module.css";


function _to_csv(guestlist){
  let lines = [];

  lines.push("email,name,role,affiliation");

  for (let i in guestlist){
    let email = guestlist[i][0];

    if (email){
      let name = guestlist[i][1];
      if (!name){ name = "Anonymous" }

      let role = guestlist[i][2];
      if (!role){ role = "user" }

      let af = guestlist[i][3];
      if (!af){ af = "unknown"}

      lines.push(`${email},${name},${role},${af}`);
    }
  }

  return lines.join("\n");
}


class Generate extends React.Component {
  constructor(props){
    super(props);

    this.state = {output: null,
                  guestlist: null};
  }

  readJSON = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)

      try{
        let output = this.generateOutput(text);
        this.setState({output: output["secrets"],
                       guestlist: _to_csv(output["guestlist"]),
                       num_general: output["num_general"],
                       num_day: output["num_day"]});
      } catch(error){
        console.log(error);
        this.setState({output: null, guestlist: null});
      }
    };
    reader.readAsText(e.target.files[0])
  }

  generateOutput(text){
    let data = JSON.parse(text);

    console.log("Generate output...");

    const gather_link = data.gather_link;

    if (!gather_link){
      throw new Error("No gather link!");
    }

    const message_link = data.message_link;

    if (!message_link){
      throw new Error("No message link!");
    }

    const feedback_link = data.feedback_link;

    if (!feedback_link){
      throw new Error("No feedback link!");
    }

    const god_key = data.god_key;

    if (!god_key){
      throw new Error("No god key!");
    }

    const drive_links = data.drive_links;

    if (!drive_links){
      throw new Error("No drive links!");
    }

    // next, encrypt all of the zoom and slido links using the god key
    let zoom_data = data.zoom_links;
    let zoom_links = {};

    if (!zoom_links){
      throw new Error("No zoom links!");
    }

    // get a list of day keys
    let day_secrets = {};

    for (let i in zoom_data){
      let day = new Date(i);
      let day_secret = get_day_secret(god_key, day);
      day_secrets[get_day_string(day)] = day_secret;
      let key = get_key(day_secret);
      let zoom_link = zoom_data[i];

      if (zoom_link){
        zoom_links[get_day_string(day)] = key.encrypt(zoom_link);
      }
    }

    // get a list of extra zoom links
    let extra_zoom_data = data.extra_zoom_links;
    let extra_zoom_links = {}

    for (let i in extra_zoom_data){
      let session = Session.getSessionForPresentation(i);

      if (session){
        let day = session.getStartTime();

        if (day){
          let day_secret = get_day_secret(god_key, day);
          day_secrets[get_day_string(day)] = day_secret;
          let key = get_key(day_secret);
          let extra_zoom_link = extra_zoom_data[i];

          if (extra_zoom_link){
            extra_zoom_links[i] = key.encrypt(extra_zoom_link);
          }
        } else {
          console.log(`No day for session ${session.getID()} : ${i}`);
        }
      }
    }

    let slido_data = data.slido_links;
    let slido_links = {};

    // get a list of slido links
    for (let i in slido_data){
      let session = Session.getSessionForPresentation(i);

      if (session){
        let day = session.getStartTime();

        if (day){
          let day_secret = get_day_secret(god_key, day);
          day_secrets[get_day_string(day)] = day_secret;
          let key = get_key(day_secret);
          let slido_link = slido_data[i];

          if (slido_link){
            slido_links[i] = key.encrypt(slido_link);
          }
        } else {
          console.log(`No day for session ${session.getID()} : ${i}`);
        }
      } else {
        console.log(`No session for slido link at ${i}`);
      }
    }

    let wshop_data = data.wshop_form_links;

    let wshop_links = {};

    for (let i in wshop_data){
      let session = Session.getSessionForPresentation(i);

      if (session){
        let day = session.getStartTime();

        if (day){
          let day_secret = get_day_secret(god_key, day);
          day_secrets[get_day_string(day)] = day_secret;
          let key = get_key(day_secret);
          let wshop_link = wshop_data[i];

          if (wshop_link){
            let pub = {"link": wshop_link["link"],
                       "max_attendees": wshop_link["max_attendees"]}

            wshop_links[i] = key.encrypt(JSON.stringify(pub));
          }
        } else {
          console.log(`No day for session ${session.getID()} : ${i}`);
        }
      } else {
        console.log(`No session for workshop link at ${i}`);
      }
    }

    // next, we need to create a key for every user based on
    // their password, encrypt the god_key using their password,
    // and then save this for output
    let attendees = data.attendees;

    if (!attendees){
      throw new Error("No attendees!");
    }

    let tickets = {"zoom_links": zoom_links,
                   "extra_zoom_links": extra_zoom_links,
                   "slido_links": slido_links,
                   "workshop_links": wshop_links,
                   "attendees": {}};

    let guestlist = [];
    let today = Account.getNow();

    let num_general = 0;
    let num_day = 0;

    for (let i in attendees){
      let attendee = attendees[i];

      let email = mangle_email(attendee.email);

      if (tickets.email){
        throw Error(`Duplicate mangled email? ${email} : ${attendee.email}`);
      }

      let ticket = {"ticket": attendee.ticket,
                    "gather_link": data.gather_link,
                    "message_link": data.message_link,
                    "feedback_link": data.feedback_link };

      if (attendee.ticket === "committee" ||
          attendee.ticket === "volunteer" ||
          attendee.ticket === "general" ||
          attendee.ticket === "full"){
        // general ticket - can access everything every day
        ticket["god_key"] = god_key;

        let level = "user";

        if (attendee.email === "Christopher.Woods@bristol.ac.uk"){
          level = "admin";
        }

        guestlist.push([attendee.email, attendee.name, level, attendee.affiliation]);
        num_general += 1;

      } else if (attendee.ticket === "day") {
        // we need to supply day tickets - loop over all of
        // the days that this person is attending and give
        // them the day key
        let day_keys = {};

        let has_access_today = false;

        for (let j in attendee.presentations){
          let presentation = attendee.presentations[j].trim();

          // look up the session for this presentation
          let session = Session.getSessionForPresentation(presentation);

          if (!session){
            console.log(`No session assigned to ${presentation}`);
          } else {
            let day_string = get_day_string(session.getStartTime());
            day_keys[day_string] = day_secrets[day_string];

            // time in days to the session
            let delta = (session.getStartTime() - today) / (1000*60*60*24);

            if (delta < 1.0 && delta > -1.0){
              console.log(`${attendee.email} : ${delta} : ${session.getStartTime()}`);
            }
          }
        }

        ticket["day_keys"] = day_keys;

        if (has_access_today){
          guestlist.push([attendee.email, attendee.name, "user", attendee.affiliation]);
          num_day += 1;
        }

      } else {
        throw new Error(`Unrecognised ticket type? ${attendee.ticket}`);
      }

      let links = {};
      let has_links = false;

      // now add in any drive links for the presentations
      for (let j in attendee.presentations){
        let presentation = attendee.presentations[j].trim();

        //look up the drive write link for the presentation
        let link = drive_links[presentation];

        if (!link){
          console.log(`No drive link for presentation ${presentation}`);
        } else {
          link = link.write;

          if (!link){
            console.log(`No write drive link for presentation ${presentation}`);
          }
        }

        //is this presentation a workshop with limited attendance? If so,
        //let the presenter see the list of emails that have signed up
        let signups = {}

        let wshop = wshop_data[presentation];

        if (wshop){
          signups = {"signed_up": wshop["signed_up"],
                     "unsuccessful": wshop["unsuccessful"]};
        }

        // still write the null link, as the key is used to
        // get the list of presentations for this attendee
        links[presentation] = {"link": link, "signups": signups};
        has_links = true;
      }

      if (has_links){
        ticket["drive_links"] = links;
      }

      let signed_up = [];
      let unsuccessful = [];

      let has_signed_up = false;
      let has_unsuccessful = false;

      // has the ticket holder signed up to any workshops?
      for (let i in wshop_data){
        let wshop = wshop_data[i];

        if (wshop["signed_up"].includes(attendee.email)){
          signed_up.push(i);
          has_signed_up = true;
        } else if (wshop["unsuccessful"].includes(attendee.email)){
          unsuccessful.push(i);
          has_unsuccessful = true;
        }
      }

      if (has_signed_up){
        ticket["signed_up"] = signed_up;
      }

      if (has_unsuccessful){
        ticket["unsuccessful"] = unsuccessful;
      }

      let key = get_user_key(attendee.email, attendee.password);
      ticket = key.encrypt(JSON.stringify(ticket));

      tickets["attendees"][email] = ticket;
    }

    //finally(!) add in all of the drive read links
    let drive_read_links = {}

    for (let i in drive_links){
      let link = drive_links[i].read;

      if (link){
        drive_read_links[i] = link;
      }
    }

    tickets["drive_links"] = drive_read_links;

    //add the time of generation so we know if we need to update
    tickets["version"] = new Date().toISOString();

    return { secrets: JSON.stringify(tickets),
             guestlist: guestlist,
             num_general: num_general,
             num_day: num_day };
  }

  render = () => {

    let account = Account.get_account();

    if (account && account.isAdmin()){
      let copy_button = null;
      let guest_button = null;

      if (this.state.output){
        copy_button = (
          <CopyToClipboard text={this.state.output}
                           key="secrets"
                           onCopy={() => this.setState({copied: true})}>
            <Button variant="secondary"
                    style={{width:"100%"}}>
              Copy secrets.json to clipboard
            </Button>
          </CopyToClipboard>);
      }

      if (this.state.guestlist){
        guest_button = [
          <CopyToClipboard text={this.state.guestlist}
                           key="guestlist"
                           onCopy={() => this.setState({copied: true})}>
            <Button variant="info"
                    style={{width:"100%"}}>
              Copy Gather guestlist to clipboard
            </Button>
          </CopyToClipboard>,
          <ul key="ticket_list">
            <li key="general">General tickets: {this.state.num_general}</li>
            <li key="day">Day tickets: {this.state.num_day}</li>
            <li key="total">Total tickets: {this.state.num_general+this.state.num_day}</li>
          </ul>];
      }

      return (
        <SimplePage {...this.props}>
          <Container fluid>
            <Row>
              <Col style={{marginTop:"10px",
                           maxWidth: "768px",
                           marginLeft: "auto", marginRight: "auto"}}>
                <Card bg="primary" border="primary" text="primary"
                      style={{borderRadius: "5px"}}>
                  <Card.Body style={{align_items:"center"}}>
                    <Form>
                      <Card.Title>Choose a JSON file containing the secrets</Card.Title>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="file"
                                      placeholder="Enter the json filename"
                                      onChange={(e) => this.readJSON(e)} />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col style={{marginTop:"10px",
                           maxWidth: "768px",
                           marginLeft: "auto", marginRight: "auto"}}>
                {guest_button}
                {copy_button}
              </Col>
            </Row>
            <Row>
              <Col style={{marginTop:"10px",
                           maxWidth: "768px",
                           marginLeft: "auto", marginRight: "auto"}}>
                <div className={styles.outputtext}>{this.state.output}</div>
              </Col>
            </Row>
          </Container>
        </SimplePage>
      );
    } else {
      return (
        <SimplePage {...this.props}>
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
  }
};

export default Generate;
