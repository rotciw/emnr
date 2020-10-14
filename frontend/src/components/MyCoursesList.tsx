import React, { useEffect, useState, useContext } from 'react';
import { Course } from './Course';
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

export const MyCoursesList: React.FC<MyCoursesListProps> = () => {
  const [ myCourses, updateMyCourses ] = useState<MyCourseProps[]>([]);

  useEffect(() => {
    const token = getLocalToken();
    axios.defaults.headers.common['Authorization'] = `${token}`;
    const getMyCourses = async () => {
      await axios
      .get(API_URL + '/course/me/')
      .then(response => {
        console.log("Hallo")
        updateMyCourses(response.data)
      })
      .catch( err => console.log(err));
    };
    getMyCourses();
  }, [])

  return (
    <FlexContainer margin='15px 0 0 0'>
      {myCourses.length ? (
        <StyledTable>
          <thead>
            <tr>
              <StyledTH width='25%'>Fagkode</StyledTH>
              <StyledTH width='50%' textAlign='left'>
                Fagnavn
              </StyledTH>
              <StyledTH width='25%'>Credit</StyledTH>
            </tr>
          </thead>
          <tbody>
            {myCourses.map((currentCourse) => {
              return (
                <Course
                  courseCode={currentCourse.course_code}
                  courseName={currentCourse.course_name}
                  credit={7}
                />
              );
            })}
          </tbody>
        </StyledTable>
      ) : (
        <EmptyResult>Beklager! Vi fant ingen data. </EmptyResult>
      )}
    </FlexContainer>
  );
};