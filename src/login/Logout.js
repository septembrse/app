
import React from "react";

import SimplePage from "../SimplePage";

import Account from '../model/Account';

//import styles from "./Login.module.css";

const Logout = () => {

  let [account, setAccount] = React.useState(null);

  React.useEffect(() => {
      console.log("useEffect");
      setAccount(Account.get_account());
  }, [account]);

  function logout(){
    if (account && account.isLoggedIn()){
      account.logout();
      setAccount(null);
    }
  }

  if (account && account.isLoggedIn()){
    return (
      <SimplePage>
        <div>Are you sure you want to log out?</div>
        <button onClick={() => logout()}>Yes - log out!</button>
      </SimplePage>
    );
  } else {
    return (
      <SimplePage>
        <div>You are now logged out</div>
      </SimplePage>
    );
  }
}

export default Logout;
