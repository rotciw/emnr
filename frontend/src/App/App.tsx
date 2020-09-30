import React from 'react';
import { CourseListPage } from '../pages/CourseListPage';

const App: React.FC = () => {
  return (
    <div>
      <h1>Du er nå logget inn</h1>
      <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
    </div>
    <CourseListPage />
  );
};

export default App;
