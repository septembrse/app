
import React from 'react';

import Navigation from './Navigation';

import styles from "./SimplePage.module.css";

class SimplePage extends React.Component {

  render(){
    return (
      <div style={{marginBottom: "30px"}}>
        <Navigation account={this.props.account}
                    setAccount={this.props.setAccount} />
        {this.props.children}
        <div className={styles.background}/>
      </div>
    );
  }
};

export default SimplePage;
