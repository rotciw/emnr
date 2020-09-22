import React, { useContext } from 'react';
import { getLocalEmail } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';

const App: React.FC = () => {
  const { userProvider } = useContext(GlobalStateContext)!;
  return (
    <div>
      <h1>Du er nå logget inn</h1>
      <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
    </div>
  );
};

export default App;
