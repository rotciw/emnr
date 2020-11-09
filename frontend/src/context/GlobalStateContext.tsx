import React, { createContext, useState, useMemo } from 'react';

interface GlobalStateContextProps {
  authProvider: AuthProviderValue;
  userProvider: UserProviderValue;
  pageProvider: PageProviderValue;
  queryProvider: QueryProviderValue;
  advancedQueryProvider: AdvancedQueryProviderValue;
  refreshProvider: RefreshProviderValue;
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

interface AdvancedQueryProviderValue {
  advancedSorting: boolean;
  setAdvancedSorting: (val: boolean) => void;
  advancedSortChangedFlag: boolean; // Value is meaningless, is only used to update search. Is flipped every time advanced sorting is changed.
  setAdvancedSortChangedFlag: (val: boolean) => void;

  diffHigh: boolean;
  setDiffHigh: (val: boolean) => void;
  diffWeight: number;
  setDiffWeight: (val: number) => void;

  gradeHigh: boolean;
  setGradeHigh: (val: boolean) => void;
  gradeWeight: number;
  setGradeWeight: (val: number) => void;

  scoreHigh: boolean;
  setScoreHigh: (val: boolean) => void;
  scoreWeight: number;
  setScoreWeight: (val: number) => void;

  passRateHigh: boolean;
  setPassRateHigh: (val: boolean) => void;
  passRateWeight: number;
  setPassRateWeight: (val: number) => void;

  workLoadHigh: boolean;
  setWorkLoadHigh: (val: boolean) => void;
  workLoadWeight: number;
  setWorkLoadWeight: (val: number) => void;
}

interface RefreshProviderValue {
  postReviewHaveRefreshed: boolean;
  setPostReviewHaveRefreshed: (val: boolean) => void;
  deleteReviewHaveRefreshed: boolean;
  setDeleteReviewHaveRefreshed: (val: boolean) => void;
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
  const [orderByQuery, setOrderByQuery] = useState<string | null>(null);
  const [orderToggle, setOrderToggle] = useState(false);

  //Advanced query provider
  const [advancedSorting, setAdvancedSorting] = useState<boolean>(false);
  const [advancedSortChangedFlag, setAdvancedSortChangedFlag] = useState<
    boolean
  >(false);
  const [diffHigh, setDiffHigh] = useState<boolean>(true);
  const [diffWeight, setDiffWeight] = useState<number>(0);
  const [gradeHigh, setGradeHigh] = useState<boolean>(true);
  const [gradeWeight, setGradeWeight] = useState<number>(0);
  const [scoreHigh, setScoreHigh] = useState<boolean>(true);
  const [scoreWeight, setScoreWeight] = useState<number>(0);
  const [passRateHigh, setPassRateHigh] = useState<boolean>(true);
  const [passRateWeight, setPassRateWeight] = useState<number>(0);
  const [workLoadHigh, setWorkLoadHigh] = useState<boolean>(true);
  const [workLoadWeight, setWorkLoadWeight] = useState<number>(0);
  const [postReviewHaveRefreshed, setPostReviewHaveRefreshed] = useState<
    boolean
  >(false);
  const [deleteReviewHaveRefreshed, setDeleteReviewHaveRefreshed] = useState<
    boolean
  >(false);

  const authProvider = useMemo(() => ({ token, setToken }), [token, setToken]);
  const userProvider = useMemo(() => ({ email, setEmail }), [email, setEmail]);
  const pageProvider = useMemo(
    () => ({ page, setPage, totalPage, setTotalPage }),
    [page, setPage, totalPage, setTotalPage],
  );
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
  const advancedQueryProvider = useMemo(
    () => ({
      advancedSorting,
      setAdvancedSorting,
      advancedSortChangedFlag,
      setAdvancedSortChangedFlag,
      diffHigh,
      setDiffHigh,
      diffWeight,
      setDiffWeight,
      gradeHigh,
      setGradeHigh,
      gradeWeight,
      setGradeWeight,
      scoreHigh,
      setScoreHigh,
      scoreWeight,
      setScoreWeight,
      passRateHigh,
      setPassRateHigh,
      passRateWeight,
      setPassRateWeight,
      workLoadHigh,
      setWorkLoadHigh,
      workLoadWeight,
      setWorkLoadWeight,
    }),
    [
      advancedSorting,
      setAdvancedSorting,
      advancedSortChangedFlag,
      setAdvancedSortChangedFlag,
      diffHigh,
      setDiffHigh,
      diffWeight,
      setDiffWeight,
      gradeHigh,
      setGradeHigh,
      gradeWeight,
      setGradeWeight,
      scoreHigh,
      setScoreHigh,
      scoreWeight,
      setScoreWeight,
      passRateHigh,
      setPassRateHigh,
      passRateWeight,
      setPassRateWeight,
      workLoadHigh,
      setWorkLoadHigh,
      workLoadWeight,
      setWorkLoadWeight,
    ],
  );

  const refreshProvider = useMemo(
    () => ({
      postReviewHaveRefreshed,
      setPostReviewHaveRefreshed,
      deleteReviewHaveRefreshed,
      setDeleteReviewHaveRefreshed,
    }),
    [
      postReviewHaveRefreshed,
      setPostReviewHaveRefreshed,
      deleteReviewHaveRefreshed,
      setDeleteReviewHaveRefreshed,
    ],
  );

  return (
    <GlobalStateContext.Provider
      value={{
        authProvider,
        userProvider,
        pageProvider,
        queryProvider,
        advancedQueryProvider,
        refreshProvider,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
