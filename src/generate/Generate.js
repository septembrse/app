
import React from "react";

import SimplePage from "../SimplePage";

import {get_god_key} from "./Secret";

import styles from "./Generate.module.css";

class Generate extends React.Component {
  constructor(props){
    super(props);

    this.state = {input: null,
                  output: null};
  }

  readJSON = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)

      try{
        let data = JSON.parse(text);
        this.setState({input: data, output: null});
      } catch(error){
        this.setState({input: null, output: null});
      }
    };
    reader.readAsText(e.target.files[0])
  }

  generateOutput(){
    if (this.state.input === null){
      return;
    }

    if (this.state.output !== null){
      return;
    }

    console.log("Generate output...");

    const input = this.state.input;

    let god_key = get_god_key(input.god_key);

    console.log(god_key);
  }

  render = () => {

    this.generateOutput();

    return (
      <SimplePage>
        <div className={styles.inputbox}>
          <div className={styles.inputlabel}>Select JSON file to process:</div>
          <div className={styles.inputdiv}>
            <input className={styles.input} type="file"
                   onChange={(e) => this.readJSON(e)} />
          </div>
        </div>
        <div className={styles.output}>
          {this.state.output}
        </div>
      </SimplePage>
    )
  }
};

export default Generate;
