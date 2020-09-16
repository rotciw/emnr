import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

//pages
import App from '../App/App';
import Login from '../pages/Login';
import VerifyLogin from '../pages/VerifyLogin';

const Routes: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute exact path='/verifylogin' component={VerifyLogin} />
      <PrivateRoute exact path='/' component={App} />
      <Route exact path='/login' component={Login} />
    </Switch>
  );
};

export default Routes;
