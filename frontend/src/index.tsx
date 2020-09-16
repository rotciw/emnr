import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStateProvider from './context/GlobalStateContext';
import Routes from './navigation/Routes';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <Router>
        <Routes />
      </Router>
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
