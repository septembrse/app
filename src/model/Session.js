
import sessions_data from "../sessions.json";

let _sessions = null;
let _presentations = null;

class Session {
  constructor(data = {}){
    if (data["id"]){
      this.id = data["id"];
    }

    if (data["starts"]){
      this.start_time = new Date(data["starts"]);
    } else {
      this.start_time = new Date();
    }

    if (data["ends"]){
      this.end_time = new Date(data["ends"]);
    } else {
      this.end_time = new Date(this.start_time.getTime() + (2 * 60 * 60 * 1000));
    }

    if (data["description"]){
      this.description = data["description"];
    } else {
      this.description = null;
    }

    if (data["title"]){
      this.title = data["title"];
    } else {
      this.title = "SeptembRSE has finished. We hope it was fun!";
    }

    this.delay_minutes = 5;
  }

  getID(){
    return this.id;
  }

  static getSession(id){
    if (_sessions === null){
      _sessions = {};

      let sessions = sessions_data["sessions"];

      for (let session in sessions){
        let s = new Session(sessions[session]);
        _sessions[s.getID()] = s;
      }
    }

    return _sessions[id];
  }

  static getSessionForPresentation(id){
    if (_presentations === null){
      let presentations = sessions_data["presentations"];

      let session = presentations[id];

      if (session){
        return Session.getSession(session);
      }
    }

    return null;
  }

  static getNextSession(test_date=null){
    let now = null;

    if (test_date){
      now = test_date;
    } else {
      now = new Date();
    }

    let sessions = sessions_data["sessions"];

    for (let session in sessions){
      let s = new Session(sessions[session]);
      if (s.getEndTime() - now > 0){
        return s;
      }
    }

    return new Session();
  }

  getTitle(){
    return this.title;
  }

  getLink(){
    return `/session/${this.getID()}`;
  }

  getZoomLink(account){
    if (account && account.isLoggedIn()){
      return account.getZoomLink();
    }
  }

  hasDescription(){
    return this.description !== null;
  }

  getDescription(){
    return this.description;
  }

  setStartTime(time){
    this.start_time = time;
  }

  setHoursDuration(hours){
    this.duration = hours;
  }

  getStartTime(){
    return this.start_time;
  }

  getEndTime(){
    return this.end_time;
  }

  getDelayTime(){
    return new Date(this.start_time.getTime() + (this.delay_minutes*60*1000));
  }

  _getDateString(d){
    return `${d.toLocaleString('en-US', {hour:"numeric", minute:"numeric", hour12:true})} on ${d.toLocaleString('en-GB', { weekday:"long", year:"numeric", month:"long", day:"numeric"})}`;
  }

  getStartTimeString(){
    return this._getDateString(this.getStartTime());
  }

  getEndTimeString(){
    return this._getDateString(this.getEndTime());
  }

  getHoursDuration(){
    return this.duration;
  }
};

export default Session;
