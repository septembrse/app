
import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import styles from "./Home.css"

const Home = () => {
    return (
        <div>
            <h1>SeptembRSE</h1>
            <div><Link to="/interstitial">Interstitial</Link></div>
            <div><Link to="/search">Search</Link></div>
        </div>
    );
};
export default Home;
