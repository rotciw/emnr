import Loading from 'components/Loading';
import qs from 'qs';
import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { verifyFeideLogin } from '../utils/api';

interface VerifyLoginProps {
}

const VerifyLogin: React.FC<VerifyLoginProps> = () => {
  const { authProvider, userProvider } = useContext(GlobalStateContext)!;
  useEffect(() => {
    const verifyLogin = async () => {
      const queryString = window.location.search;
      const queryParams = qs.parse(queryString);
      const code = queryParams['?code'] as string;
      try {
        if (!authProvider.token) {
          const { token, email } = await verifyFeideLogin(code);
          if (token) {
            authProvider.setToken(token);
            userProvider.setEmail(email);
          }
        }
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
  return <Loading />;
};

export default VerifyLogin;
