import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'styles/globalStyles';
import GlobalStateProvider from './context/GlobalStateContext';
import { defaultTheme } from './styles/theme';
import Routes from './navigation/Routes';

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
