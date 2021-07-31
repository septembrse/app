
import React from 'react';

import SimplePage from "../SimplePage";

import { Account, useLoginStatus } from '../model/Account';

import styles from "./Login.module.css";

const Login = () => {

  const [credentials, setCredentials] = React.useState(
      {email:null, password:null, secret:null, message:null});

  let account = useLoginStatus();

  if (account && account.isLoggedIn()){
    return (
      <SimplePage>
        <button onClick={() => account.logout()}>Logout</button>
      </SimplePage>
    );
  }

  function setEmail(email){
    setCredentials({email:email,
                    password:credentials.password,
                    message: null});
  }

  function setPassword(password){
    setCredentials({email:credentials.email,
                    password:password,
                    message: null});
  }

  function fail(message){
    setCredentials({email: credentials.email,
                    password: credentials.password,
                    message: message});
  }

  function success(message){
    setCredentials({email: credentials.email,
                    password: null,
                    message:message});
  }

  function login(){
    let email = credentials.email;
    let password = credentials.password;

    if (!email || !password){
      return;
    }

    try{
      Account.login(email, password);
      success("Logged in!");
    } catch(error){
      fail(error.message);
    }
  }

  function enterOnEnter(e){
    if (e.key === "Enter"){
      login();
    }
  }

  return (
    <SimplePage>
      <div className={styles.loginBox}>
        <input className={styles.input} type="text"
               onChange={(e) => setEmail(e.target.value)}
               onKeyPress={(e) => enterOnEnter(e)}
               placeholder="Enter your email address"/>
        <input className={styles.input} type="password"
               onChange={(e) => setPassword(e.target.value)}
               onKeyPress={(e) => enterOnEnter(e)}
               placeholder="Enter your password"/>
        <button className={styles.button}
                onClick={() => login()}>Login</button>
      </div>
      <div className={styles.message}>
        {credentials.message}
      </div>
    </SimplePage>
  );
}

export default Login;
