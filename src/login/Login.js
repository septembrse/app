
import React from 'react';

import SymmetricKey from "../model/SymmetricKey";

const Login = () => {

  console.log("HERE!");

  let key = new SymmetricKey();

  console.log(key);

  let message = "Hello World!";

  let encrypted = key.encrypt(message);

  console.log(encrypted);

  console.log(key.decrypt(encrypted));

  return (
    <div>Loaded the page!</div>
  );
}

export default Login;
