
import React, { useState, useEffect } from 'react';

import {get_local_key,
        get_user_key, mangle_email} from "./Secret";


import secrets from "./secrets.json";


export class Account {
  constructor(email=null, secret=null){
    if (!email){
      secret = null;
    }

    if (secret){
      this._email = email;
      this._secret = secret;
      this._is_logged_in = true;
    } else {
      this._email = null;
      this._secret = null;
      this._is_logged_in = false;
    }
  }

  getEmail(){
    return this._email;
  }

  isLoggedIn(){
    return this._is_logged_in;
  }

  static get_account(){
    // have we loaded the account into memory?
    if (Account._logged_in_account){
      return Account._logged_in_account;
    }

    // see if we have already successfully logged in
    let email = localStorage.getItem("septembrse_user");

    if (email){
      console.log(`Loading from local login: ${email}`);
      let local_data = localStorage.getItem("septembrse_secret_data");

      if (local_data){
        let key = get_local_key(email);

        try{
          let secret = key.decrypt(local_data);

          console.log("Successfully retrieved secret from localStorage");

          let account = new Account(email, secret);
          Account._logged_in_account = account;
          return account;

        } catch(error){
          console.log("Cannot load saved data...?");
        }
      }
    }

    return new Account();
  }

  static login(email, password){
    if (!email || !password){
      throw new Error("Missing email or password");
    }

    let encrypted_secret = secrets[mangle_email(email)];

    if (!encrypted_secret){
      throw new Error(["Invalid email.",
          "You need to use the exact email address to which your SeptembRSE ticket was sent."]);
    }

    // try to decrypt our secret package
    try {
      let key = get_user_key(email, password);
      let secret = key.decrypt(encrypted_secret);

      // cache this to localStorage
      key = get_local_key(email);
      localStorage.setItem("septembrse_user", email);
      localStorage.setItem("septembrse_secret_data", key.encrypt(secret));

      let account = new Account(email, secret);

      // save this to memory
      Account._logged_in_account = account;

      return account;

    } catch(error){
      throw new Error(["Invalid password.",
            "Check the password sent to the email address associated with your SeptembRSE ticket."])
    }
  }

  logout(){
    if (this.isLoggedIn()){
      Account._logged_in_account = null;
      localStorage.removeItem("septembrse_user");
      localStorage.removeItem("septembrse_secret_data");
      this._email = null;
      this._secret = null;
      this._is_logged_in = false;
    }
  }
};

Account._logged_in_account = null;

export function useLoginStatus(){
  const [loggedInAccount, setLoggedInAccount] = useState(null);

  function handleStatusChange(account){
    setLoggedInAccount(account);
  }

  useEffect(() => {
    let old_account = Account._logged_in_account;
    let account = Account.get_account();

    console.log("useEffect");
    console.log(old_account, account);

    if (old_account != account){
      handleStatusChange(account);
    }
  });

  return loggedInAccount;
}
