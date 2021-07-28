
import React from 'react';

import styles from "./Navigation.module.css";

const Navigation = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navitem}>
        <a href="https://septembrse.github.io/app/#/app/search">Timetable</a>
      </div>
      <div className={styles.navitem}>
        <a href="https://septembrse.github.io">Venue Guide</a>
      </div>
      <div className={styles.navitem}>
        <a href="https://septembrse.society-rse.org">Website</a>
      </div>
    </div>
  );
}

export default Navigation;
