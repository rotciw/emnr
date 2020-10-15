import React, { useEffect, useState, useContext } from 'react';
import { Semester } from './Semester';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { FlexContainer, StyledTable, StyledTH } from 'styles/Containers';
import styled from 'styled-components';
import { getLocalToken } from '../utils/api';
import { API_URL } from '../config';
import { EmptyResult } from '../components/CourseList';

interface MyCoursesListProps {}
interface MyCourseProps {
  course_name: string;
  course_code: string;
  semester: string;
}
interface Semesters {
  [semester: string]: MyCourseProps[];
}



export const MyCoursesList: React.FC<MyCoursesListProps> = () => {
  const [ myCourses, updateMyCourses ] = useState<MyCourseProps[]>([]);
  const [ mySemesters, updateMySemesters ] = useState<Semesters>({});   //<MySemesterProps | undefined>(undefined);

  useEffect(() => {
    const token = getLocalToken();
    axios.defaults.headers.common['Authorization'] = `${token}`;
    const getMyCourses = async () => {
      await axios
      .get(API_URL + '/course/me/')
      .then(response => {

        const allMyCourses = response.data;
        const sortedCourses = allMyCourses.reduce(
          (semesters: any, course: any) => {
          if (!semesters[course.semester]) semesters[course.semester] = [];
          semesters[course.semester].push(course);
          return semesters;
        }, {});
        updateMySemesters(sortedCourses)
        updateMyCourses(response.data)
      })
      .catch( err => console.log(err));
    };
    getMyCourses();
  }, [])
  console.log(mySemesters)
  return (
    <FlexContainer margin='15px 0 0 0'>
      <StyledTable>
        {Object.entries(mySemesters).map (([semester, courses]) => {
              return (
                <Semester semester={semester} courses={courses} />
              )
              
            })}
      </StyledTable>
    </FlexContainer>
  );
};