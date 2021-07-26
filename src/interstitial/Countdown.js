import React from 'react'

const CountDown = ({ minutes = 0, seconds = 60 }) => {


    minutes = Math.floor(minutes);
    seconds = Math.floor(seconds);

    const [time, setTime] = React.useState({minutes,
                                            seconds});


    const tick = () => {

        if (time.minutes <= 0 && time.seconds <= 0){
            reset();
        } else if (time.seconds <= 0) {
            setTime({minutes: time.minutes - 1, seconds: 59});
        } else {
            setTime({minutes: time.minutes, seconds: time.seconds - 1});
        }
    };

    const reset = () => setTime({minutes: time.minutes, seconds: time.seconds});

    React.useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
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