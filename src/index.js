import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";


// Vapor bootstrap theme from https://bootswatch.com/
// MIT Licensed - Thanks :-)
import './vapor.min.css';

import './index.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

