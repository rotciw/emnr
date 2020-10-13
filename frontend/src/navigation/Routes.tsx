import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

//pages
import App from '../App/App';
import LoginPage from '../pages/LoginPage';
import VerifyLogin from '../pages/VerifyLogin';
import { CoursePage } from 'pages/CoursePage';
import MePage from '../pages/MePage';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/verifylogin' component={VerifyLogin} />
      <PrivateRoute exact path='/' component={App} />
      <PrivateRoute path='/course/:id' component={CoursePage} />
      <PrivateRoute path='/me' component={MePage} />
      <Route exact path='/login' component={LoginPage} />
    </Switch>
  );
};

export default Routes;
