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
  credit: Array<Number>;
}

export const CourseList: React.FC<CourseListProps> = ({
  }) => {

  let namesTemp:Array<String> = [];
  let codesTemp:Array<String> = [];
  let gradesTemp:Array<Number> = [];
  let creditTemp:Array<Number> = [];
  
  const [courses, updateCourses] = useState<CourseProps>({courseNames: [''],courseCodes: [''],gradeAvgs: [0],credit: [0]});

  useEffect (() => {
    const getCourses = async () => {
      axios
      .get("http://localhost:8000/course/all/")
      .then(res => {
        for(let i = 0; i < 25; i++){
          namesTemp.push(res.data[i].course_name);
          codesTemp.push(res.data[i].course_code);
          gradesTemp.push(res.data[i].average_grade);
          creditTemp.push(res.data[i].credit);
        }
        return res;
      })
      .then(res => updateCourses({
          courseNames: namesTemp,
          courseCodes: codesTemp,
          gradeAvgs: gradesTemp,
          credit: creditTemp
        }))
        .catch(err => console.log(err));        
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
                <th>Gjennomsnittskarakter</th>
                <th>Studiepoeng</th>
            </tr>
        </thead>
        <tbody>
          {
            courses.courseNames.map(function(currentCourseName, i){
              return <Course courseName={currentCourseName} courseCode={courses.courseCodes[i]} gradeAvg={courses.gradeAvgs[i]} credit={courses.credit[i]} key={i} />;
            })
          }
        </tbody>
      </table>
    </Wrapper>
  );
};