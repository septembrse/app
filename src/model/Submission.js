
import submissions from "../submissions.json";

class Submission {
  constructor(data = {}){
    this.title = data.title;
    this.abstract = data.abstract;
    this.name = data.name;
    this.institution = data.institution;
    this.format = data.format;
    this.id = null;
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
};

export default Submission;
