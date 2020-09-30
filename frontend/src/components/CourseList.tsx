import React, { useEffect, useState } from 'react';
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

export const CourseList: React.FC<CourseListProps> = ({
  }) => {

  const [courses, updateCourses] = useState<CourseProps>({courseNames: [''],courseCodes: [''],gradeAvgs: [0]});

  useEffect (() => {
    const getCourses = async () => {
      axios
      .get("http://localhost:8000/course/all/")
      .then(res => updateCourses({
          courseNames: [res.data[0].course_name,res.data[1].course_name],
          courseCodes: [res.data[0].course_code,res.data[1].course_code],
          gradeAvgs: [res.data[0].average_grade,res.data[1].average_grade]
        }))
        .catch(err => console.log(err));
        
      console.log(courses)
    }
    getCourses();
  }, []);

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
            courses.courseNames.map(function(currentCourseName, i){
              return <Course courseName={currentCourseName} courseCode={courses.courseCodes[i]} score={courses.gradeAvgs[i]} key={i} />;
            })
          }
        </tbody>
      </table>
    </Wrapper>
  );
};