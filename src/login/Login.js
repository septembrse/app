
import React from 'react';

import SimplePage from "../SimplePage";

import { get_user_key, mangle_email,
         get_local_key } from '../model/Secret';

import styles from "./Login.module.css";

import secrets from "../model/secrets.json";

const Login = () => {

  const [credentials, setCredentials] = React.useState(
      {email:null, password:null, secret:null, message:null,
       logged_in: false});

  // see if we have already successfully logged in
  let local_email = localStorage.getItem("user");

  if (local_email){
    console.log(`Loading from local login: ${local_email}`);
    let local_data = localStorage.getItem("secret_data");

    if (local_data){
      let key = get_local_key(local_email);

      try{
        let data = key.decrypt(local_data);

        if (data !== credentials.secret){
          setCredentials({email: local_email,
                          password: null,
                          secret: data,
                          message: null,
                          logged_in: true});
        }

        console.log("Successfully retrieved secret from localStorage");
      } catch(error){
        console.log("Cannot load saved data...?");
      }
    }
  }

  function setEmail(email){
    setCredentials({email:email,
                    password:credentials.password,
                    secret: null,
                    message: null,
                    logged_in: false});
  }

  function setPassword(password){
    setCredentials({email:credentials.email,
                    password:password,
                    secret: null,
                    message: null,
                    logged_in: false});
  }

  function fail(message){
    setCredentials({email: credentials.email,
                    password: credentials.password,
                    secret: null,
                    message: message,
                    logged_in: false});
  }

  function success(message, secret){
    console.log("Saving to localStorage");
    let key = get_local_key(credentials.email);
    localStorage.setItem("user", credentials.email);
    localStorage.setItem("secret_data", key.encrypt(secret));

    setCredentials({email: credentials.email,
                    password: null,
                    secret: secret,
                    message:message,
                    logged_in: true});
  }

  function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("secret_data");
    setCredentials({email: null,
                    password: null,
                    secret: null,
                    message: null,
                    logged_in: false});
  }

  function login(){
    let email = credentials.email;
    let password = credentials.password;

    if (!email || !password){
      return;
    }

    let encrypted_secret = secrets[mangle_email(email)];

    if (!encrypted_secret){
      fail(["Invalid email.",
            "You need to use the exact email address to which your SeptembRSE ticket was sent."]);
      return;
    }

    // try to decrypt our secret package
    try {
      let key = get_user_key(email, password);
      let data = key.decrypt(encrypted_secret);
      success(`Logged in as ${email}`, data);
    } catch(error){
      fail(["Invalid password.",
            "Check the password sent to the email address associated with your SeptembRSE ticket."])
      return;
    }
  }

  function enterOnEnter(e){
    if (e.key === "Enter"){
      login();
    }
  }

  if (credentials.logged_in){
    return (
      <SimplePage>
        <button onClick={() => logout()}>Logout</button>
      </SimplePage>
    );
  } else {
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
}

export default Login;
