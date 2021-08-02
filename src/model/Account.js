

import {get_local_key,
        get_user_key, mangle_email} from "./Secret";

import secrets from "./secrets.json";


class Account {
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

  getDayKey(date=null){
    if (!this.isLoggedIn()){
      return null;
    }

    if (!date){
      date = new Date();
    }

    console.log("Get day key!");

    return null;
  }

  isAdmin(){
    if (this.isLoggedIn()){
      return this._secret.ticket === "committee";
    }

    return false;
  }

  static get_account(){
    // have we loaded the account into memory?
    if (Account._logged_in_account){
      return Account._logged_in_account;
    }

    // see if we have already successfully logged in
    let email = localStorage.getItem("septembrse_user");

    if (email){
      let local_data = localStorage.getItem("septembrse_secret_data");

      if (local_data){
        let key = get_local_key(email);

        try{
          let secret = key.decrypt(local_data);

          let parsed = JSON.parse(secret);

          let account = new Account(email, parsed);
          Account._logged_in_account = account;
          return account;

        } catch(error){
          console.log("Cannot load saved data...?");
        }
      }
    }

    return null;
  }

  static login(email, password){
    if (!email || !password){
      throw new Error("Missing email or password");
    }

    let encrypted_secret = secrets[mangle_email(email)];

    if (!encrypted_secret){
      throw new Error(
          "Invalid email. " +
          "You need to use the exact email address to " +
          "which your SeptembRSE ticket was sent. " +
          "Email conference-2021@society-rse.org if you " +
          "have lost your ticket.");
    }

    // try to decrypt our secret package
    try {
      let key = get_user_key(email, password);
      let secret = key.decrypt(encrypted_secret);

      let parsed = JSON.parse(secret);

      // cache this to localStorage
      key = get_local_key(email);
      localStorage.setItem("septembrse_user", email);
      localStorage.setItem("septembrse_secret_data", key.encrypt(secret));

      let account = new Account(email, parsed);

      // save this to memory
      Account._logged_in_account = account;

      return account;

    } catch(error){
      throw new Error(
          "Invalid password. " +
          "Check the password sent to the email address " +
          "associated with your SeptembRSE ticket. " +
          "Email conference-2021@society-rse.org if you " +
          "have lost your ticket.");
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

export default Account;
