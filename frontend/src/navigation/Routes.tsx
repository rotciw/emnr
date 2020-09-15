import React from 'react';
import { Switch, Route } from 'react-router-dom';

//pages
import App from '../App/App';
import Login from '../pages/Login';
import VerifyLogin from '../pages/VerifyLogin';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/login' component={Login} />
      <Route exact path='/verifylogin' component={VerifyLogin} />
      <Route path='/' component={App} />
    </Switch>
  );
};

export default Routes;
