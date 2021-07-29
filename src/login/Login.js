
import React from 'react';

import SymmetricKey from "../model/SymmetricKey";

const Login = () => {

  console.log("HERE!");

  let key = SymmetricKey.createFromPassword("Christopher.Woods@bristol.ac.uk",
                                            "fluffy_sheep");

  let message = "Hello World!";

  let encrypted = key.encrypt(message);

  console.log(encrypted);

  let key2 = SymmetricKey.createFromPassword("Christopher.Woods@bristol.ac.uk",
                                             "fluffy_sheep");


  console.log(key2.decrypt(encrypted));

  return (
    <div>Loaded the page!</div>
  );
}

export default Login;
