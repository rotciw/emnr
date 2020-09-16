import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';

interface PrivateRouteProps {
  exact?: boolean;
  path: string;
  component: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  exact = false,
  path,
  component,
}) => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem(
    'token',
  );
  return <Route exact={exact} path={path} component={component} />;
};

export default PrivateRoute;
