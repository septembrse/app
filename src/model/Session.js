
class Session {
  constructor(){
    this.start_time = new Date();
    this.duration = 2;
    this.delay_minutes = 5;
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
    return new Date(this.start_time.getTime() + (this.duration * 60 * 60 * 1000));
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
