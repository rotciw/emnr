import React, { useEffect, useState, useContext } from 'react';
import { MyCourse } from './MyCourse';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { FlexContainer, StyledTable, StyledTH } from 'styles/Containers';
import styled from 'styled-components';

interface Semester {
  semester: string;
  courses: MyCourseProps[];
}

interface MyCourseProps {
  course_name: string;
  course_code: string;
  semester: string;
}

export const Semester: React.FC<Semester> = ({semester, courses}) => {
  return (
    <FlexContainer margin='15px 0 0 0'>
      <StyledTable>
        <thead>
          <tr>
            <StyledTH width='25%'>Fagkode</StyledTH>
            <StyledTH width='50%' textAlign='left'>
              Fagnavn
            </StyledTH>
            <StyledTH width='25%'>Semester</StyledTH>
          </tr>
        </thead>
        <tbody>
          {courses.map((currentCourse) => {
            return (
              <MyCourse
                  courseCode={currentCourse.course_code}
                  courseName={currentCourse.course_name}
                  semester={currentCourse.semester}
              />
            )
          })}
        </tbody>
      </StyledTable>
    </FlexContainer>
  );
}