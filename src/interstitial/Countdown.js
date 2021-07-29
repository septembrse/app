import React from 'react'

const CountDown = ({ target = null, offset = 0 }) => {

  let minutes = 100;
  let seconds = 0;

  const [time, setTime] = React.useState({target, minutes, seconds});

  const tick = () => {
    let delta = null;

    try{
      delta = Math.floor((time.target - new Date()) / 1000.0) - offset;
    } catch(e){
      reset();
      return;
    }

    let minutes = Math.floor(delta / 60);
    let seconds = delta - (60 * minutes);

    if (minutes < 0){
        reset();
    } else {
        setTime({target: time.target, minutes: minutes, seconds: seconds});
    }
  };

  const reset = () => setTime({target: time.target,
                               minutes: time.minutes,
                               seconds: time.seconds});

  React.useEffect(() => {
      const timerId = setInterval(() => tick(), 500);
      return () => clearInterval(timerId);
  });

  if (time.minutes <= 0 && time.seconds <= 0){
      return <div>Session has started</div>
  } else {
    return (
        <div>
          Session will start in {`${time.minutes.toString()}:${time.seconds.toString().padStart(2, '0')}`}
        </div>
    );
  };
}

export default CountDown;