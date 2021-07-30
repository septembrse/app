
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

  readSessionLinks = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.setState({zoom_links: text});
    };
    reader.readAsText(e.target.files[0])
  }

  updateGodKey = async (e) => {
    e.preventDefault()
    this.setState({god_key: e.target.value});
  }

  render = () => {

    return (
      <div>
        <div>
          User details file: <input type="file" onChange={(e) => this.readUserDetails(e)} />
        </div>
        <div>
          Session links file: <input type="file" onChange={(e) => this.readSessionLinks(e)} />
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
