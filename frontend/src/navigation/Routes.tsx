import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// pages
import App from '../App/App';
import LoginPage from '../pages/LoginPage';
import CoursePage from 'pages/CoursePage';
import VerifyLogin from '../pages/VerifyLogin';
import MePage from '../pages/MePage';
import AboutPage from 'pages/AboutPage';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/verifylogin' component={VerifyLogin} />
      <PrivateRoute exact path='/' component={App} />
      <PrivateRoute path='/course/:id' component={CoursePage} />
      <PrivateRoute path='/me' component={MePage} />
      <PrivateRoute path='/about' component={AboutPage} />
      <Route exact path='/login' component={LoginPage} />
    </Switch>
  );
};

export default Routes;
