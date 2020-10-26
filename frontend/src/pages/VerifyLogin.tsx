import React, { useContext, useEffect } from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { verifyFeideLogin } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';

interface VerifyLoginProps {
  callback: (val?: any) => void;
}

const VerifyLogin: React.FC<VerifyLoginProps> = (props) => {
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

            props.callback();
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
  return <div>Permission denied</div>;
};

export default VerifyLogin;
