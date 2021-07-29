
import React from 'react';

import { Link } from "react-router-dom";

//import styles from "./Home.css"

const Home = () => {
    return (
        <div>
            <h1>SeptembRSE</h1>
            <div><Link to="/interstitial">Interstitial</Link></div>
            <div><Link to="/search">Search</Link></div>
            <div><Link to="/login">Login</Link></div>
        </div>
    );
};
export default Home;
