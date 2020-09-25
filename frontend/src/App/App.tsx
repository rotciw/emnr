import React, { useContext } from 'react';
import { getLocalEmail } from '../utils/api';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { CourseList } from '../components/CourseList';
import { FlexContainer, FlexItem } from '../styles/Containers';
import { Navbar } from '../components/Navbar';

const getCourseNames = () => {
  let courseNames: Array<String> = ['itgk', 'java', 'os', 'progark'];
  return courseNames;
};

const getCourseCodes = () => {
  let courseCodes: Array<String> = ['TDT4110', 'TDT4100', 'TDT4186', 'TDT4240'];
  return courseCodes;
};

let courseNames: Array<String> = getCourseNames();
let courseCodes: Array<String> = getCourseCodes();

const App: React.FC = ({ children }) => {
  const { userProvider } = useContext(GlobalStateContext)!;
  return (
    <FlexContainer>
      <Navbar />
      <FlexItem>
        <h1>Du er nå logget inn</h1>
        <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
      </FlexItem>
      <FlexItem>
        <CourseList courseNames={courseNames} courseCodes={courseCodes} />
      </FlexItem>
      {children}
    </FlexContainer>
  );
};

export default App;
