
import React from 'react';

import styles from "./Banner.module.css";

import banner_bg from "./images/interstitial_bg.png";

const Banner = () => {
    return (
        <img src={banner_bg}
             className={styles.banner} alt=""
        ></img>
    );
}

export default Banner;
