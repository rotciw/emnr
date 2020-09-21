import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

//pages
import App from '../App/App';
import Login from '../pages/Login';
import VerifyLogin from '../pages/VerifyLogin';
import { hasToken } from 'utils/api';

const Routes: React.FC = () => {
  useEffect(() => {
    checkValidToken();
  }, []);

  const checkValidToken = async () => {
    try {
      const expired = await hasToken();
      if (!expired) {
        throw Error('Expired token or not existing token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  return (
    <Switch>
      <Route exact path='/verifylogin' component={VerifyLogin} />
      <PrivateRoute exact path='/' component={App} />
      <Route exact path='/login' component={Login} />
    </Switch>
  );
};

export default Routes;
