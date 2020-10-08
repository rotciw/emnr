import React from 'react';
import { CourseListPage } from '../pages/CourseListPage';
import { getMyCourses } from '../utils/api';

const App: React.FC = () => {
  return (
    <div>
      <button onClick={getMyCourses}>test</button>
      <CourseListPage />
    </div>
  );
};

export default App;
