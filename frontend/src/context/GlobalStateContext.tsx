import React, { createContext, useState, useMemo } from 'react';

interface GlobalStateContextProps {
  authProvider: AuthProviderValue;
  userProvider: UserProviderValue;
  pageProvider: PageProviderValue;
}

interface AuthProviderValue {
  token: string | null;
  setToken: (val: string) => void;
}

interface UserProviderValue {
  email: string | null;
  setEmail: (val: string) => void;
}

interface PageProviderValue {
  page: number;
  setPage: (val: number) => void;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | null>(
  null,
);

const GlobalStateProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const authProvider = useMemo(() => ({ token, setToken }), [token, setToken]);
  const userProvider = useMemo(() => ({ email, setEmail }), [email, setEmail]);
  const pageProvider = useMemo(() => ({ page, setPage }), [page, setPage]);

  return (
    <GlobalStateContext.Provider
      value={{
        authProvider,
        userProvider,
        pageProvider,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
