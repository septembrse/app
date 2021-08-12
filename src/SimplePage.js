
import React from 'react';

import Navigation from './Navigation';

import queryString from 'query-string';

import styles from "./SimplePage.module.css";

class SimplePage extends React.Component {

  render(){

    let embed = false;

    if (this.props.location){
      let params = queryString.parse(this.props.location.search);
      if (params.embed){
        embed = true;
      }
    }

    if (embed){
      return (
        <div style={{marginBottom: "30px"}}>
          {this.props.children}
          <div className={styles.background}/>
        </div>
      );
    } else {
      return (
        <div style={{marginBottom: "30px"}}>
          <Navigation account={this.props.account}
                      setAccount={this.props.setAccount} />
          {this.props.children}
          <div className={styles.background}/>
        </div>
      );
    }
  }
};

export default SimplePage;
