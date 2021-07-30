
import React from 'react';

import SimplePage from "../SimplePage";

import { get_user_key, mangle_email } from '../generate/Secret';

import styles from "./Login.module.css";

import secrets from "./secrets.json";

const Login = ({email=null, password=null}) => {

  const [credentials, setCredentials] = React.useState({email, password});

  const [status, setStatus] = React.useState({message: null});

  function setEmail(email){
    setCredentials({email:email,
                    password:credentials.password});
  }

  function setPassword(password){
    setCredentials({email:credentials.email,
                    password:password});
  }

  function fail(message){
    setStatus({message:message});
  }

  function success(message){
    setStatus({message:message});
  }

  function login(){
    let email = credentials.email;
    let password = credentials.password;

    if (!email || !password){
      return;
    }

    console.log(`Log in using ${email} : ${password}`);

    let secret = secrets[mangle_email(email)];

    if (!secret){
      fail(["Invalid email.",
            "You need to use the exact email address to which your SeptembRSE ticket was sent."]);
      return;
    }

    console.log(secret);

    // try to decrypt our secret package
    let key = get_user_key(email, password);

    try {
      secret = key.decrypt(secret);
    } catch(error){
      console.log(error);
      fail(["Invalid password.",
            "Check the password sent to the email address associated with your SeptembRSE ticket."])
      return;
    }

    success(`Logged in as ${email}`);
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
               placeHolder="Enter your email address"/>
        <input className={styles.input} type="password"
               onChange={(e) => setPassword(e.target.value)}
               onKeyPress={(e) => enterOnEnter(e)}
               placeHolder="Enter your password"/>
        <button className={styles.button}
                onClick={() => login()}>Login</button>
      </div>
      <div className={styles.message}>
        {status.message}
      </div>
    </SimplePage>
  );
}

export default Login;
