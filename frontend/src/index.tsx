import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStateProvider from './context/GlobalStateContext';
import { defaultTheme } from './styles/theme';
import Routes from './navigation/Routes';
import GlobalStyle from 'styles/globalStyles';

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
