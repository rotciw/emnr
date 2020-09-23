import React, { useContext } from 'react';
import { getLocalEmail } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { CourseList } from '../components/CourseList';

const App: React.FC = () => {
  const { userProvider } = useContext(GlobalStateContext)!;
  return (
    <div>
      <h1>Du er nå logget inn</h1>
      <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
      <CourseList/>
    </div>
  );
};

export default App;
