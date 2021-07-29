
import React from "react";

import SymmetricKey from "../model/SymmetricKey";

class Generate extends React.Component {
  constructor(props){
    super(props);

    this.state = {emails: null,
                  zoom_links: null,
                  god_key: new SymmetricKey("You need a better password!")};
  }

  readEmails = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.setState({emails: text});
    };
    reader.readAsText(e.target.files[0])
  }

  readZoomLinks = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.setState({zoom_links: text});
    };
    reader.readAsText(e.target.files[0])
  }

  readGodKey = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.setState({god_key: text});
    };
    reader.readAsText(e.target.files[0])
  }

  render = () => {
    /** God key should be text from a text box - this is the text password,
     *  generate locally using openssl
     */

    return (
      <div>
        <div>
          List of emails: <input type="file" onChange={(e) => this.readEmails(e)} />
        </div>
        <div>
          List of Zoom links: <input type="file" onChange={(e) => this.readZoomLinks(e)} />
        </div>
        <div>
          God key: <input type="file" onChange={(e) => this.readGodKey(e)} />
        </div>
        <div>
          <div>{this.state.zoom_links}</div>
          <div>{this.state.emails}</div>
          <div>{this.state.god_key.toString()}</div>
        </div>
      </div>
    )
  }
};

export default Generate;
