
import submissions from "../submissions.json";

import Session from "./Session";

class Submission {
  constructor(data = {}){
    this.title = data.title;
    this.abstract = data.abstract;
    this.name = data.name;
    this.institution = data.institution;
    this.format = data.format;
    this.requirements = data.requirements;
    this.id = null;

    let i = 0;
    while (true){
      i += 1;
      let nme = `name${i}`;
      let institution = `institution${i}`;

      if (data[`name${i}`]){
        this.name = `${this.name}, ${data[nme]}`;
        this.institution = `${this.institution}, ${data[institution]}`;
      } else {
        break;
      }
    }
  }

  getSession(){
    if (this.id === null){
      return null;
    } else {
      return Session.getSessionForPresentation(this.id);
    }
  }

  static getSubmission(id){
    let d = submissions[id];

    let s = null;

    if (d){
      s = new Submission(d);
    } else {
      s = new Submission();
    }

    s.id = id;
    return s;
  }

  static search(text){
    let results = [];

    if (!text || text.length === 0){
      return results;
    }

    try {
      text = text.toLowerCase();
    } catch(error) {
      return results;
    }

    if (text === "all"){
      for (let submission in submissions){
        let s = submissions[submission];

        let r = new Submission(s);
        r.id = submission;
        results.push(r);
      }
    } else if (text === "talks" || text === "talk"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Talk"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "walkthroughs" || text === "walkthrough"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Walkthrough"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "posters" || text === "poster"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Poster"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "workshops" || text === "workshop"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Workshop"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "panels" || text === "panel"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Panel"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "discussions" || text === "discussion"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Discussion"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "keynote" || text === "keynotes"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Keynote"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else if (text === "special" || text === "specials"){
      for (let submission in submissions){
        let s = submissions[submission];

        if (s.format === "Special event"){
          let r = new Submission(s);
          r.id = submission;
          results.push(r);
        }
      }
    } else {
      for (let submission in submissions){
        let s = submissions[submission];

        let r = null;

        if (s.title && s.title.toLowerCase().indexOf(text) !== -1){
          r = new Submission(s);
        } else if (s.name && s.name.toLowerCase().indexOf(text) !== -1){
          r = new Submission(s);
        } else if (s.institution && s.institution.toLowerCase().indexOf(text) !== -1){
          r = new Submission(s);
        } else if (s.abstract && s.abstract.toLowerCase().indexOf(text) !== -1){
          r = new Submission(s);
        }

        if (r){
          r.id = submission;
          results.push(r);
        }
      }
    }

    return results;
  }

  getTitle(){
    return this.title;
  }

  getName(){
    return this.name;
  }

  getAbstract(){
    return this.abstract;
  }

  getInstitution(){
    return this.institution;
  }

  getFormat(){
    return this.format;
  }

  getID(){
    return this.id;
  }

  getLink(){
    return `/event/${this.getID()}`;
  }

  hasLimitedAttendance(account){
    if (account && account.isLoggedIn()){
      return account.hasSignUpFormForSubmission(this.getID());
    }

    return false;
  }

  getSignUpLink(account){
    if (account && account.isLoggedIn()){
      return account.getSignUpLink(this.getID());
    }

    return null;
  }

  getSignUps(account){
    if (account && account.isLoggedIn()){
      return account.getSignUps(this.getID());
    }

    return [];
  }

  getUnsuccessful(account){
    if (account && account.isLoggedIn()){
      return account.getUnsuccessful(this.getID());
    }

    return [];
  }

  hasSuccessfulSignUp(account){
    if (account && account.isLoggedIn()){
      return account.hasSuccessfulSignUp(this.getID());
    }

    return false;
  }

  hasUnsuccessfulSignUp(account){
    if (account && account.isLoggedIn()){
      return account.hasUnsuccessfulSignUp(this.getID());
    }

    return false;
  }

  isPoster(){
    return this.getID().startsWith("P1");
  }

  getZoomLink(account){
    if (account && account.isLoggedIn()){
      return account.getZoomLinkForSubmission(this.getID());
    }

    return null;
  }

  isInGather(account){
    if (account && account.isLoggedIn()){
      return account.isInGather(this.getID());
    }

    return null;
  }

  getSlidoLink(account){
    if (account && account.isLoggedIn()){
      return account.getSlidoLink(this.getID());
    }

    return null;
  }
};

export default Submission;
