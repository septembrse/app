
import sessions from "../sessions.json";

class Session {
  constructor(data = {}){
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
      this.title = "No title";
    }

    this.delay_minutes = 5;
  }

  static getNextSession(){
    for (let session in sessions){
      return new Session(sessions[session]);
    }

    return new Session();
  }

  getTitle(){
    return this.title;
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
    return `${d.toLocaleString('en-GB', {hour:"numeric", minute:"numeric", hour12:true})} on ${d.toLocaleString('en-GB', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}`;
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
