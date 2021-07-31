
import React from 'react';

import Banner from "./Banner";
import Navigation from './Navigation';

import styles from "./SimplePage.module.css";

function SimplePage(props){
  return (
    <div className={styles.page}>
      <Banner />
      <Navigation account={props.account}/>
      <div className={styles.content}>
        {this.props.children}
      </div>
      <div className={styles.background}/>
    </div>
  );
};

export default SimplePage;
