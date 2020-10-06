import React from 'react';
import { CourseListPage } from '../pages/CourseListPage';
import { GlobalStateContext } from '../context/GlobalStateContext';

const App: React.FC = () => {
  return (
    <div>
      <CourseListPage />
    </div>
  );
};

export default App;
