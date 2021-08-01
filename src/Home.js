
import React from 'react';

import SimplePage from "./SimplePage";

import Account from './model/Account';

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

//import styles from "./Home.css"

function Home(props){

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    setAccount(Account.get_account());
  }, [account]);

  return (
    <SimplePage account={account} setAccount={setAccount}>
      <h1>SeptembRSE</h1>
      <h2>Conference Information System</h2>
      <ButtonGroup vertical style={{width: "80%"}}>
        <Button onClick={() => props.history.push("/venue")}
                variant="primary">
          Guide to the conference venue (gather.town)
        </Button>
        <Button onClick={() => props.history.push("/today")}
                variant="secondary">
          What's happening today?
        </Button>
        <Button onClick={() => props.history.push("/timetable")}
                variant="info">
          View the conference timetable
        </Button>
        <Button onClick={() => props.history.push("/search")}
                variant="secondary">
          Search for a presentation or event
        </Button>
        <Button onClick={() => props.history.push("/ticket")}
                variant="info">
          View your conference ticket
        </Button>
        <Button href="https://septembrse.society-rse.org"
                variant="primary">
          Go to the conference website
        </Button>
      </ButtonGroup>
    </SimplePage>
  );
};

export default Home;
