import React from 'react';
import styled from 'styled-components';
import { Course } from './Course';
import axios from 'axios';

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
}

interface CourseProps{
  courseNames: Array<String>;
  courseCodes: Array<String>;
  gradeAvgs: Array<Number>;
}

const getCourseNames = () => {
  let courseNames: Array<String> = ['itgk','java','os','progark'];
  return courseNames;
}

const getCourseCodes = () => {
  let courseCodes: Array<String> = ['TDT4110','TDT4100','TDT4186','TDT4240'];
  return courseCodes;
}

export const CourseList: React.FC<CourseListProps> = ({
  }) => {
  let courseNames: Array<String> = getCourseNames();
  let courseCodes: Array<String> = getCourseCodes();

  const getCourses = () => {
    let courseNames: String[] = [];
    let courseCodes: String[] = [];
    let gradeAvgs: Number[] = [];
  
    axios
      .get("http://localhost:8000/course/all/")
      .then(res => updateCourses({
        courseNames: res.data.names,
        courseCodes: res.data.codes,
        gradeAvgs: res.data.grades 
      }))
      .catch(err => console.log(err));
  
    let courses: CourseProps = {
      courseNames,
      courseCodes,
      gradeAvgs
    };
    
    return courses;
  }

  const [courses, updateCourses] = React.useState<CourseProps | null>(getCourses());

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