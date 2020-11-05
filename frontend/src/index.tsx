import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'styles/globalStyles';
import GlobalStateProvider from './context/GlobalStateContext';
import { defaultTheme } from './styles/theme';
import Routes from './navigation/Routes';
import firebase from 'firebase/app';
import 'firebase/analytics';
import * as serviceWorker from './serviceWorker';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDosgu1GESOz9bVsugY7SIntxDXrCOnrVo',
  authDomain: 'emnr-1b5ef.firebaseapp.com',
  databaseURL: 'https://emnr-1b5ef.firebaseio.com',
  projectId: 'emnr-1b5ef',
  storageBucket: 'emnr-1b5ef.appspot.com',
  messagingSenderId: '129467244645',
  appId: '1:129467244645:web:73713393f89cba8a3e668c',
  measurementId: 'G-3BBLK0TNS8',
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <Router>
          <Routes />
        </Router>
      </ThemeProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.register();
