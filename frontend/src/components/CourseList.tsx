import React from 'react';
import styled from 'styled-components';
import { Course } from './Course';

const Wrapper = styled.div`
  border: 1px solid #ccc;
  padding: 50px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

interface CourseListProps {
  courseNames: Array<String>;
  courseCodes: Array<String>;
}

export const CourseList: React.FC<CourseListProps> = ({
  courseNames,
  courseCodes,
  }) => {

  return (
    <Wrapper>
        <table>
          <thead>
              <tr>
                  <th>Fagnavn</th>
                  <th>Fagkode</th>
                  <th>Vurdering</th>
              </tr>
          </thead>
          <tbody>
              {
                  courseNames.map(function(currentCourseName, i){
                      return <Course courseName={currentCourseName} courseCode={courseCodes[i]} score={4.5} key={i} />;
                  })
              }
          </tbody>
          </table>

    </Wrapper>
  );
};