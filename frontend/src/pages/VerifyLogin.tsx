import React, { useContext, useEffect } from 'react';
import qs from 'qs';
import { verifyFeideLogin } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { Redirect } from 'react-router-dom';

interface VerifyLoginProps {}

const VerifyLogin: React.FC<VerifyLoginProps> = () => {
  const { authProvider } = useContext(GlobalStateContext)!;
  useEffect(() => {
    const verifyLogin = async () => {
      const queryString = window.location.search;
      const queryParams = qs.parse(queryString);
      const code = queryParams['?code'] as string;
      try {
        const token = await verifyFeideLogin(code);
        authProvider.setToken(token);
      } catch (e) {
        console.log('login failed');
      }
    };
    if (!authProvider.token) {
      verifyLogin();
    }
  });

  let signedIn = false;

  if (authProvider.token) {
    signedIn = true;
  }

  if (signedIn) {
    return <Redirect to='/' />;
  }
  return <div>Permission denied</div>;
};

export default VerifyLogin;
