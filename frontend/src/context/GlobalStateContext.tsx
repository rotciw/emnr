import React, { createContext, useState, useMemo } from 'react';

interface GlobalStateContextProps {
  authProvider: AuthProviderValue;
  userProvider: UserProviderValue;
}

interface AuthProviderValue {
  token: string | null;
  setToken: (val: string) => void;
}

interface UserProviderValue {
  email: string | null;
  setEmail: (val: string) => void;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | null>(
  null,
);

const GlobalStateProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const authProvider = useMemo(() => ({ token, setToken }), [token, setToken]);
  const userProvider = useMemo(() => ({ email, setEmail }), [email, setEmail]);

  return (
    <GlobalStateContext.Provider
      value={{
        authProvider,
        userProvider,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
