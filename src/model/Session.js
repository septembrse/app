
import sessions_data from "../sessions.json";

let _sessions = null;

function get_day(date){
  let d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

  static _getSessions(){
    if (_sessions === null){
      _sessions = {};

      let sessions = sessions_data["sessions"];

      for (let session in sessions){
        let s = new Session(sessions[session]);
        _sessions[s.getID()] = s;
      }
    }

    return _sessions;
  }

  static getConferenceDays(){
    let days = {}

    let sessions = this._getSessions();

    let start = new Date("2021-09-06");

    for (let i in sessions){
      let session = sessions[i];

      if (session.getStartTime() - start >= 0){
        days[get_day(session.getStartTime())] = 1;
      }
    }

    let keys = Object.keys(days);
    keys.sort((a, b) => {return (a - b)});

    if (keys.length > 1){
      if (keys[0] > keys[keys.length - 1]){
        keys = keys.reverse();
      }
    }

    return keys;
  }

  static getSessionsOnDay(date){
    let sessions = this._getSessions();

    let day = get_day(date);

    let s = [];

    for (let i in sessions){
      let session = sessions[i];

      let session_day = get_day(session.getStartTime());

      if (session_day - day === 0){
        s.push(session);
      }
    }

    s.sort((a, b) => {return a.getStartTime() - b.getStartTime()});

    return s;
  }

  static getSession(id){
    let sessions = Session._getSessions();
    return sessions[id];
  }

  static getSessionForPresentation(id){
    let presentations = sessions_data["presentations"];

    let session = presentations[id];

    if (session){
      return Session.getSession(session);
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

    let running_sessions = [];
    let upcoming_sessions = {};

    for (let session in sessions){
      let s = new Session(sessions[session]);

      if (s.getID().startsWith("NW")){
        // skip the networking sessions
        continue;
      }

      let delta_start = s.getStartTime() - now;

      if (delta_start >= -10*60*1000){
        upcoming_sessions[delta_start] = s;
      }
    }

    let keys = Object.keys(upcoming_sessions);

    if (running_sessions.length > 0){
      return running_sessions[0];
    } else if (keys.length > 0){
      keys.sort((a, b)=>{return a - b});
      return upcoming_sessions[keys[0]];
    } else {
      return new Session();
    }
  }

  getTitle(){
    return this.title;
  }

  getLink(){
    return `/session/${this.getID()}`;
  }

  isBlended(){
    return this.getID().startsWith("NB");
  }

  isWithinMinutes(date, minutes=30){
    let delta_start = date - this.getStartTime();

    const buffer = minutes * 60 * 1000;

    if (delta_start < -buffer){
      return false;
    }

    let delta_end = date - this.getEndTime();

    if (delta_end > buffer){
      return false;
    }

    return true;
  }

  isNetworking(){
    return this.getID().startsWith("NW");
  }

  getZoomLink(account){
    if (account && account.isLoggedIn()){
      // allow connection up to 30 minutes before and 30 minutes
      // after the session
      if (this.isWithinMinutes(account.thisGetNow(), 30)){
        return account.getZoomLink();
      }
    }
  }

  getEventIDs(){
    if (this._event_ids){
      return this._event_ids;
    }

    let event_ids = [];
    let my_id = this.getID();

    let presentations = sessions_data["presentations"];

    for (let event_id in presentations){
      if (my_id === presentations[event_id]){
        event_ids.push(event_id);
      }
    }

    this._event_ids = event_ids;

    return this._event_ids;
  }

  hasDescription(){
    return this.description !== null;
  }

  getDescription(){
    if (this.isNetworking()){
      if (this.description){
        return this.description;
      }

      return "This is a designated networking session. Please feel free to " +
             "join and explore the virtual conference center and to network " +
             "with other attendees."
    }

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

  static getDayString(d){
    d = new Date(d);
    return `${d.toLocaleString('en-GB', { weekday:"long", year:"numeric", month:"long", day:"numeric"})}`;
  }

  static getDateString(d){
    d = new Date(d);
    return `${d.toLocaleString('en-US', {hour:"numeric", minute:"numeric", hour12:true})} on ${d.toLocaleString('en-GB', { weekday:"long", year:"numeric", month:"long", day:"numeric"})}`;
  }

  getDurationString(){
    let s = new Date(this.getStartTime());
    let e = new Date(this.getEndTime());

    return `${s.toLocaleString('en-US', {hour:"numeric", minute:"numeric", hour12:true})}-${e.toLocaleString('en-US', {hour:"numeric", minute:"numeric", hour12:true})}`;
  }

  getStartTimeString(){
    return Session.getDateString(this.getStartTime());
  }

  getEndTimeString(){
    return Session.getDateString(this.getEndTime());
  }

  getHoursDuration(){
    return this.duration;
  }
};

export default Session;
