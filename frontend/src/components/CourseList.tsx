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
  pageNumber: number;
}

interface CourseProps{
  course_name: string;
  course_code: string;
  average_grade: number;
  credit: number;
}

export const CourseList: React.FC<CourseListProps> = ({
  pageNumber,
  }) => {

  const [courses, updateCourses] = useState<CourseProps[]>([]);

  const resultLimit:number = 25;
  let start:number = (pageNumber-1)*resultLimit;

  useEffect (() => {
    
    const getCourses = async () => {
      await axios
      .get("http://localhost:8000/course/all/?n=25&offset="+start)
      .then(res => {
        updateCourses(res.data);
      })
        .catch(err => console.log(err));        
    }
    getCourses();
    start += resultLimit;
  }, [pageNumber]); 

  return (
    <Wrapper>
      <table>
        <thead>
            <tr>
                <th>Fagnavn</th>
                <th>Fagkode</th>
                <th>Gjennomsnittskarakter</th>
                <th>Studiepoeng</th>
            </tr>
        </thead>
        <tbody>
          {
            courses.map(currentCourse => { 
              return <Course courseName={currentCourse.course_name} courseCode={currentCourse.course_code} gradeAvg={currentCourse.average_grade} credit={currentCourse.credit}/>;
            })
          }
        </tbody>
      </table>
    </Wrapper>
  );
};