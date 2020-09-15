import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './navigation/Routes';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
