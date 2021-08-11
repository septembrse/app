

import {get_local_key, get_day_key, get_day_string,
        get_user_key, mangle_email, get_key} from "./Secret";

import Session from "./Session";

import secrets from "./secrets.json";


class Account {
  constructor(email, secret){
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

  getVersion(){
    if (!this.isLoggedIn()){
      return null;
    }

    return this._secret.version;
  }

  getTicket(){
    if (!this.isLoggedIn()){
      return null;
    }

    return this._secret.ticket;
  }

  isPresenter(){
    if (!this.isLoggedIn()){
      return false;
    }

    if (this.isLoggedIn()){
      if (this._secret.drive_links){
        return Object.keys(this._secret.drive_links).length > 0;
      }
    }

    return false;
  }

  getTicketDetails(){
    if (!this.isLoggedIn()){
      return null;
    }

    if (this.isGeneralTicket()){
      return "This is a general ticket that provides complete access " +
             "to the whole conference.";
    } else {
      return "This is a day ticket that provides access only on " +
             "specified days.";
    }
  }

  isGeneralTicket(){
    if (!this.isLoggedIn()){
      return false;
    }

    if (this.getTicket() === "committee" ||
        this.getTicket() === "full"){
      return true;
    }

    return false;
  }

  _getGatherTownLink(){
    if (this.isAdmin()){
      return this._secret["gather_link"];
    }
  }

  getGatherTownLink(){
    if (this.isValidToday()){
      return this._secret["gather_link"];
    }
  }

  isValidToday(){
    if (!this.isLoggedIn()){
      return false;
    }

    let today = Account.getNow();

    let conference_start = new Date("2021-09-02");
    let conference_end = new Date("2021-10-02");

    if (today - conference_start < 0){
      console.log("The conference hasn't started yet...");
      return false;
    } else if (conference_end - today < 0){
      console.log("The conference has already finished.");
      return false;
    }

    if (this.isGeneralTicket()){
      return true;
    } else if (this._secret.day_keys){
      if (this._secret.day_keys[get_day_string(today)]){
        return true;
      } else {
        console.log("Your day ticket is not valid today.");
        return false;
      }
    }

    console.log("You don't appear to have a valid ticket.");

    return false;
  }

  getDayKey(date=null){
    if (!this.isLoggedIn()){
      return null;
    }

    if (!date){
      date = new Date();
    }

    if (this._secret.god_key){
      return get_day_key(this._secret.god_key, date);
    } else if (this._secret.day_keys) {
      let day_string = get_day_string(date);
      let day_secret = this._secret.day_keys[day_string];

      if (day_secret){
        return get_key(day_secret);
      }
    }

    return null;
  }

  getSlidoLink(id){
    if (!this.isLoggedIn()){
      return null;
    }

    let slido_links = secrets["slido_links"];

    if (!slido_links){
      return null;
    }

    let link = slido_links[id];

    if (link) {
      // need to get the day key for the session containing this link
      let session = Session.getSessionForPresentation(id);

      if (!session){
        console.log(`There is no session for event ${id}?`);
        return null;
      }

      let key = this.getDayKey(session.getStartTime());

      if (!key){
        console.log(`No day key for ${session.getStartTime().toISOString()}`);
        return null;
      }

      try{
        return key.decrypt(link);
      } catch(error){
        console.log("Cannot decrypt the slido link?");
        console.log(error);
      }
    }

    return null;
  }

  static getNow(){
    let today = new Date();

    // uncomment to test different dates
    //today = new Date("2021-09-28T10:31:00");

    return today;
  }

  thisGetNow(){
    return Account.getNow();
  }

  isInGather(id){
    if (!this.isLoggedIn()){
      return false;
    }

    // look up this session ID in the extra zoom link database
    let extra_zoom_links = secrets["extra_zoom_links"];

    if (extra_zoom_links){
      let link = extra_zoom_links[id];

      if (link){
        return false;
      }
    }

    return true;
  }

  getZoomLinkIfDifferent(id){
    if (!this.isLoggedIn()){
      return null;
    }

    // look up this session ID in the extra zoom link database
    let extra_zoom_links = secrets["extra_zoom_links"];

    if (extra_zoom_links){
      let link = extra_zoom_links[id];

      if (link){
        let session = Session.getSessionForPresentation(id);

        if (!session){
          return null;
        }

        let today = Account.getNow();

        try{
          // can only return today's zoom link
          let key = this.getDayKey(today);

          if (key){
            return key.decrypt(link);
          }
        } catch(error){
          console.log("Error decrypting the zoom link?");
          console.log(error);
        }
      }
    }

    return null;
  }

  getZoomLinkForSubmission(id){
    if (!this.isLoggedIn()){
      return null;
    }

    // look up this session ID in the extra zoom link database
    let extra_zoom_links = secrets["extra_zoom_links"];

    if (extra_zoom_links){
      let link = extra_zoom_links[id];

      if (link){
        let session = Session.getSessionForPresentation(id);

        if (!session){
          return null;
        }

        let today = Account.getNow();

        if (!session.isWithinMinutes(today, 30)){
          return false;
        }

        try{
          // can only return today's zoom link
          let key = this.getDayKey(today);

          if (key){
            return key.decrypt(link);
          }
        } catch(error){
          console.log("Error decrypting the zoom link?");
          console.log(error);
        }
      }
    }

    // this is not a parallel link, so return the general session link
    let session = Session.getSessionForPresentation(id);

    if (session){
      return session.getZoomLink(this);
    } else {
      return null;
    }
  }

  getZoomLink(){
    if (!this.isLoggedIn()){
      return null;
    }

    let zoom_links = secrets["zoom_links"];

    if (!zoom_links){
      return null;
    }

    // can only return the zoom link for today!
    let today = Account.getNow();

    let link = zoom_links[get_day_string(today)];

    if (link){
      try{
        // can only return today's zoom link
        let key = this.getDayKey(today);

        if (key){
          return key.decrypt(link);
        }
      } catch(error){
        console.log("Error decrypting the zoom link?");
        console.log(error);
      }
    } else {
      console.log(`ERROR - NO ZOOM LINK FOR ${get_day_string(today)}`);
    }

    return null;
  }

  hasSignUpFormForSubmission(ID){
    if (!this.isLoggedIn()){
      return false;
    }

    let wshop_links = secrets["workshop_links"];

    if (wshop_links){
      if (wshop_links[ID]){
        let link = this.getSignUpLink(ID);

        if (link){
          return true;
        }
      }
    }

    return false;
  }

  getSignUpLink(id){
    if (!this.isLoggedIn()){
      return null;
    }

    let links = secrets["workshop_links"];

    if (!links){
      return null;
    }

    let link = links[id];

    if (link) {
      // need to get the day key for the session containing this link
      let session = Session.getSessionForPresentation(id);

      if (!session){
        console.log(`There is no session for event ${id}?`);
        return null;
      }

      let key = this.getDayKey(session.getStartTime());

      if (!key){
        console.log(`No day key for ${session.getStartTime().toISOString()}`);
        return null;
      }

      try{
        link = JSON.parse(key.decrypt(link));
        return link["link"];
      } catch(error){
        console.log("Cannot decrypt the workshop link?");
        console.log(error);
      }
    }

    return null;
  }

  hasSuccessfulSignUp(ID){
    if (!this.isLoggedIn()){
      return false;
    }

    if (this._secret.signed_up){
      return this._secret.signed_up.includes(ID);
    }

    return false;
  }

  hasUnsuccessfulSignUp(ID){
    if (!this.isLoggedIn()){
      return false;
    }

    if (this._secret.unsuccessful){
      return this._secret.unsuccessful.includes(ID);
    }

    return false;
  }

  _getEventSecret(id){
    if (!this.isLoggedIn()){
      return null;
    }

    if (this._secret.drive_links){
      return this._secret.drive_links[id];
    } else {
      return null;
    }
  }

  getSignUps(id){
    let secret = this._getEventSecret(id);

    if (secret){
      if (secret["signups"]){
        return secret["signups"]["signed_up"];
      }
    }

    return null;
  }

  getUnsuccessful(id){
    let secret = this._getEventSecret(id);

    if (secret){
      if (secret["signups"]){
        return secret["signups"]["unsuccessful"];
      }
    }

    return null;
  }

  getMySignUps(){
    if (!this.isLoggedIn()){
      return [];
    }

    if (this._secret.signed_up){
      return this._secret.signed_up;
    }

    return [];
  }

  getMyUnsuccessful(){
    if (!this.isLoggedIn()){
      return [];
    }

    if (this._secret.unsuccessful){
      return this._secret.unsuccessful;
    }

    return [];
  }

  getDriveLink(id){
    let secret = this._getEventSecret(id);

    if (secret){
      if (secret["link"]){
        return secret["link"];
      }
    }

    return null;
  }

  static getDriveReadLink(id){
    let drive_links = secrets["drive_links"];

    if (drive_links) {
      if (drive_links[id]){
        return drive_links[id];
      }
    }

    return null;
  }

  getPresentations(){
    if (!this.isLoggedIn()){
      return [];
    }

    if (this._secret.drive_links){
      return Object.keys(this._secret.drive_links);
    } else {
      return [];
    }
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
      let version = localStorage.getItem("septembrse_version");

      if (version !== secrets["version"]){
        // we need to update the data
        try{
          console.log("Logging in again due to change of version");
          console.log(`${version} : ${secrets["version"]}`);
          let local_email = localStorage.getItem("septembrse_user");
          let key = get_local_key(local_email);
          let local_password = key.decrypt(
                          localStorage.getItem("septembrse_secret"));
          Account.login(local_email, local_password);
        } catch (error){
          console.log("Error logging in again!")
          console.log(error);
          Account._logged_in_account.logout();
        }
      }

      return Account._logged_in_account;
    }

    // see if we have already successfully logged in
    let email = localStorage.getItem("septembrse_user");

    if (email){
      let version = localStorage.getItem("septembrse_version");

      if (version !== secrets["version"]){
        console.log("Need to update secret as there has been a change");
        console.log(`${version} vs ${secrets["version"]}`);

        try {
          let key = get_local_key(email);
          let password = key.decrypt(localStorage.getItem(
                                              "septembrse_secret"));
          Account.login(email, password);
          return Account._logged_in_account;
        } catch (error){
          console.log("Cannot relogin from old login data!");
          console.log(error);
          Account._logged_in_account = null;
          localStorage.removeItem("septembrse_user");
          localStorage.removeItem("septembrse_secret_data");
          localStorage.removeItem("septembrse_secret");
          localStorage.removeItem("septembrse_version");
          return null;
        }
      }

      let local_data = localStorage.getItem("septembrse_secret_data");

      if (local_data){
        let key = get_local_key(email);

        try{
          let secret = key.decrypt(local_data);

          let parsed = JSON.parse(secret);

          let new_account = new Account(email, parsed);
          Account._logged_in_account = new_account;

          return new_account;

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

    let encrypted_secret = secrets["attendees"][mangle_email(email)];

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
      parsed["version"] = secrets["version"];

      // cache this to localStorage
      key = get_local_key(email);

      localStorage.setItem("septembrse_user", email);
      localStorage.setItem("septembrse_version", secrets["version"]);
      localStorage.setItem("septembrse_secret_data", key.encrypt(secret));
      localStorage.setItem("septembrse_secret", key.encrypt(password));

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
      console.log("LOGOUT");
      Account._logged_in_account = null;
      localStorage.removeItem("septembrse_user");
      localStorage.removeItem("septembrse_secret_data");
      localStorage.removeItem("septembrse_secret");
      localStorage.removeItem("septembrse_version");
      this._email = null;
      this._secret = null;
      this._is_logged_in = false;
    }
  }
};

Account._logged_in_account = null;

export default Account;
