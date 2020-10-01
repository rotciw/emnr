import React from 'react';
import { getLocalEmail } from 'utils/api';
import { CourseListPage } from '../pages/CourseListPage';
import { GlobalStateContext } from '../context/GlobalStateContext';

const App: React.FC = () => {
  const { userProvider } = React.useContext(GlobalStateContext)!;
  return (
    <div>
      <CourseListPage/>
    </div>
  );
};

export default App;
