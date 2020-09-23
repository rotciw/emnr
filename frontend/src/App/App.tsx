import React, { useContext } from 'react';
import { getLocalEmail } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { CourseList } from '../components/CourseList';

const getCourseNames = () => {
  let courseNames: Array<String> = ['itgk','java','os'];
  return courseNames;
}

const getCourseCodes = () => {
  let courseCodes: Array<String> = ['TDT4110','TDT4100','TDT4186'];
  return courseCodes;
}

let courseNames: Array<String> = getCourseNames();
let courseCodes: Array<String> = getCourseCodes();

const App: React.FC = () => {
  const { userProvider } = useContext(GlobalStateContext)!;
  return (
    <div>
      <h1>Du er nå logget inn</h1>
      <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
      <CourseList courseNames={courseNames} courseCodes={courseCodes}/>
    </div>
  );
};

export default App;
