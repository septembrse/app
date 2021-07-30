
import React from "react";

import SimplePage from "../SimplePage";

import {CopyToClipboard} from 'react-copy-to-clipboard';

import {get_key, get_day_secret,
        get_user_key, mangle_email} from "./Secret";

import styles from "./Generate.module.css";


class Generate extends React.Component {
  constructor(props){
    super(props);

    this.state = {output: null};
  }

  readJSON = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)

      try{
        this.setState({output: this.generateOutput(text)});
      } catch(error){
        console.log(error);
        this.setState({output: null});
      }
    };
    reader.readAsText(e.target.files[0])
  }

  generateOutput(text){
    let data = JSON.parse(text);

    console.log("Generate output...");

    const god_key = data.god_key;

    if (!god_key){
      throw new Error("No god key!");
    }

    const drive_links = data.drive_links;

    if (!drive_links){
      throw new Error("No drive links!");
    }

    // next, encrypt all of the zoom links using the god key
    let zoom_links = data.zoom_links;

    if (!zoom_links){
      throw new Error("No zoom links!");
    }

    // get a list of day keys
    let day_secrets = {};

    for (let i in zoom_links){
      let day_secret = get_day_secret(god_key, i);
      day_secrets[i] = day_secret;
      let key = get_key(day_secret);
      zoom_links[i] = key.encrypt(zoom_links[i]);
    }

    // next, we need to create a key for every user based on
    // their password, encrypt the god_key using their password,
    // and then save this for output
    let attendees = data.attendees;

    if (!attendees){
      throw new Error("No attendees!");
    }

    let sessions = data.sessions;

    if (!sessions){
      console.log("Sessions are not loaded!");
      sessions = {};
    }

    let tickets = {};

    for (let i in attendees){
      let attendee = attendees[i];

      let email = mangle_email(attendee.email);

      if (tickets.email){
        throw Error(`Duplicate mangled email? ${email} : ${attendee.email}`);
      }

      let key = get_user_key(attendee.email, attendee.password);

      let ticket = {"ticket": attendee.ticket};

      if (attendee.ticket === "committee" ||
          attendee.ticket === "volunteer" ||
          attendee.ticket === "full"){
        // general ticket - can access everything every day
        ticket["god_key"] = god_key;
      } else if (attendee.ticket === "day") {
        // we need to supply day tickets - loop over all of
        // the days that this person is attending and give
        // them the day key
        for (let j in attendee.presentations){
          let presentation = attendee.presentations[j];

          // look up the session for this presentation
          let session = sessions[presentation];

          let day_keys = [];

          if (!session){
            console.log(`No session assigned to ${presentation}`);
          } else {
            day_keys[session.date] = day_secrets[session.date];
          }

          ticket["day_keys"] = day_keys;
        }
      } else {
        throw new Error(`Unrecognised ticket type? ${attendee.ticket}`);
      }

      let links = {};
      let has_links = false;

      // now add in any drive links for the presentations
      for (let j in attendee.presentations){
        let presentation = attendee.presentations[j];

        //look up the drive write link for the presentation
        let link = drive_links[presentation];

        if (!link){
          console.log(`No drive link for presentation ${presentation}`);
        } else {
          links[presentation] = link.write;
          has_links = true;
        }
      }

      if (has_links){
        ticket["drive_links"] = links;
      }

      ticket = key.encrypt(JSON.stringify(ticket));

      tickets[email] = ticket;
    }

    return JSON.stringify(tickets);
  }

  render = () => {
    return (
      <SimplePage>
        <div className={styles.inputbox}>
          <div className={styles.inputtext}>
            Choose a JSON file containing the secrets
          </div>
          <div className={styles.inputdiv}>
            <input className={styles.input} type="file"
                   onChange={(e) => this.readJSON(e)}
                   placeholder="Choose a JSON file containing the secrets">
            </input>
          </div>
        </div>
        <div className={styles.output}>
          <CopyToClipboard text={this.state.output}
                           onCopy={() => this.setState({copied: true})}>
            <button className={styles.copybutton}>
              Copy to clipboard
            </button>
          </CopyToClipboard>
          <div className={styles.outputtext}>{this.state.output}</div>
        </div>
      </SimplePage>
    )
  }
};

export default Generate;
