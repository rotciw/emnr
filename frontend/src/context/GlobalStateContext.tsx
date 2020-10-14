import React, { createContext, useState, useMemo } from 'react';

interface GlobalStateContextProps {
  authProvider: AuthProviderValue;
  userProvider: UserProviderValue;
  pageProvider: PageProviderValue;
  totalPageReviewProvider: TotalPageReviewProviderValue;
  pageReviewProvider: PageReviewProviderValue;
  totalPageProvider: TotalPageProviderValue;
  queryProvider: QueryProviderValue;
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

interface TotalPageProviderValue {
  totalPage: number;
  setTotalPage: (val: number) => void;
}

interface QueryProviderValue {
  searchQuery: string | null;
  setSearchQuery: (val: string) => void;
  orderByQuery: string | null;
  setOrderByQuery: (val: string) => void;
  orderToggle: boolean;
  setOrderToggle: (val: boolean) => void;
}

interface PageReviewProviderValue {
  pageReview: number;
  setPageReview: (val: number) => void;
}

interface TotalPageReviewProviderValue {
  totalPageReview: number;
  setTotalPageReview: (val: number) => void;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | null>(
  null,
);

const GlobalStateProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [pageReview, setPageReview] = useState<number>(1);
  const [totalPageReview, setTotalPageReview] = useState<number>(1);
  const [orderByQuery, setOrderByQuery] = useState<string | null>(null);
  const [orderToggle, setOrderToggle] = useState(false);

  const authProvider = useMemo(() => ({ token, setToken }), [token, setToken]);
  const userProvider = useMemo(() => ({ email, setEmail }), [email, setEmail]);
  const pageProvider = useMemo(() => ({ page, setPage }), [page, setPage]);
  const totalPageProvider = useMemo(() => ({ totalPage, setTotalPage }), [
    totalPage,
    setTotalPage,
  ]);
  const pageReviewProvider = useMemo(() => ({ pageReview, setPageReview }), [pageReview, setPageReview]);
  const totalPageReviewProvider = useMemo(() => ({ totalPageReview, setTotalPageReview }), [
    totalPageReview,
    setTotalPageReview,
  ]);
  const queryProvider = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      orderByQuery,
      setOrderByQuery,
      orderToggle,
      setOrderToggle,
    }),
    [
      searchQuery,
      setSearchQuery,
      orderByQuery,
      setOrderByQuery,
      orderToggle,
      setOrderToggle,
    ],
  );

  return (
    <GlobalStateContext.Provider
      value={{
        authProvider,
        userProvider,
        pageProvider,
        totalPageProvider,
        pageReviewProvider,
        totalPageReviewProvider,
        queryProvider,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
