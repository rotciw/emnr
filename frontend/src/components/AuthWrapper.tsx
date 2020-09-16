import React, { useEffect, useContext } from 'react';
import { getLocalToken, hasToken } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';

interface Props {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const { authProvider } = useContext(GlobalStateContext)!;
  useEffect(() => {
    const checkValidToken = async () => {
      try {
        const expired = await hasToken();
        if (!expired) {
          throw 'Expired token or not existing token';
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    };

    if (!authProvider.token) {
      checkValidToken();
      const token = getLocalToken();
      if (token) {
        authProvider.setToken(token);
      }
    }
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
