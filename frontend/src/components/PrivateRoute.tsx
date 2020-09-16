import React from 'react';
import { Redirect, Route } from 'react-router-dom';

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
  return <Route exact={exact} path={path} component={component} />;
};

export default PrivateRoute;
