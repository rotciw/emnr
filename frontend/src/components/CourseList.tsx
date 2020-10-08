import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Course } from './Course';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';

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

interface CourseProps {
  course_name: string;
  course_code: string;
  average_grade: number;
  credit: number;
}

export const CourseList: React.FC<CourseListProps> = ({ pageNumber }) => {
  const [courses, updateCourses] = useState<CourseProps[]>([]);

  const resultLimit: number = 25;
  let start: number = (pageNumber - 1) * resultLimit;

  const { totalPageProvider, searchQueryProvider } = useContext(
    GlobalStateContext,
  )!;
  let searchQuery = searchQueryProvider.searchQuery
    ? searchQueryProvider.searchQuery
    : '';

  useEffect(() => {
    const getCourses = async () => {
      await axios
        .get(
          `http://localhost:8000/course/all/?n=25&offset=${start}&search=${searchQuery}`,
        )
        .then((res) => {
          updateCourses(res.data.data);
          totalPageProvider.setTotalPage(
            Math.ceil(res.data.count / resultLimit),
          );
        })
        .catch((err) => console.log(err));
    };
    getCourses();
    start += resultLimit;
  }, [pageNumber, searchQuery]);

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
          {courses.map((currentCourse) => {
            return (
              <Course
                courseName={currentCourse.course_name}
                courseCode={currentCourse.course_code}
                gradeAvg={currentCourse.average_grade}
                credit={currentCourse.credit}
              />
            );
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};
