
import React from 'react';

import SimplePage from "../SimplePage";

import Account from '../model/Account';

import styles from "./Login.module.css";

const Login = () => {

  const [credentials, setCredentials] = React.useState(
      {email:null, password:null, message:null});

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
      setAccount(Account.get_account());
  }, [account]);

  function setEmail(email){
    setCredentials({email: email,
                    password: credentials.password,
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
    setAccount(null);
  }

  function success(account){
    if (account && account.isLoggedIn()){
      setCredentials({email: credentials.email,
                      password: null,
                      message: "Logged in"});
      setAccount(account);
    } else {
      fail("Something went wrong with the login.");
    }
  }

  function login(){
    let email = credentials.email;
    let password = credentials.password;

    if (!email || !password){
      return;
    }

    try{
      let account = Account.login(email, password);
      success(account);
    } catch(error){
      setAccount(null);
      fail(error.message);
    }
  }

  function logout(){
    let account = Account.get_account();

    if (account){
      account.logout();
    }

    setAccount(null);
    setCredentials({email: null, password: null, message: null});
  }

  function enterOnEnter(e){
    if (e.key === "Enter"){
      login();
    }
  }

  if (account && account.isLoggedIn()){
    return (
      <SimplePage>
        <button onClick={() => logout()}>Logout</button>
      </SimplePage>
    );
  } else {
    return (
      <SimplePage>
        <div>{credentials.counter}</div>
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
