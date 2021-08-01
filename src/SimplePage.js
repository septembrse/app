
import React from 'react';

import Navigation from './Navigation';

import Container from "react-bootstrap/Container";

import styles from "./SimplePage.module.css";

class SimplePage extends React.Component {

  render(){
    return (
      <div>
        <Navigation account={this.props.account}
                    setAccount={this.props.setAccount} />
        <Container fluid>
          {this.props.children}
        </Container>
        <div className={styles.background}/>
      </div>
    );
  }
};

export default SimplePage;
