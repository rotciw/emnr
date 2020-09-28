import { CourseList } from 'components/CourseList';
import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FlexContainer, FlexItem } from 'styles/Containers';
import { getLocalEmail } from '../utils/api';
import { Layout } from 'styles/Layout';

/* interface CourseViewProps {
  courseName: String;
  courseCode: String;
  score: Number;
} */

export const CourseListPage: React.FC = ({children}) => {
  const code: string = useLocation().pathname.substr(8);
  const { userProvider } = useContext(GlobalStateContext)!;


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

  return (
    <Layout>
        <FlexItem>
            <h1>Du er nå logget inn</h1>
            <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
        </FlexItem>
        <FlexItem>
            <CourseList courseNames={courseNames} courseCodes={courseCodes} />
        </FlexItem>
    </Layout>
  );
};
