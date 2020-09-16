import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { GlobalStateContext } from '../context/GlobalStateContext';

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
  const { authProvider } = useContext(GlobalStateContext)!;

  if (authProvider.token) {
    return <Route exact={exact} path={path} component={component} />;
  }
  return <Redirect to='/login' />;
};

export default PrivateRoute;
