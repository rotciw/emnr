import React, { useEffect, useState, useContext } from 'react';
import { Course } from './Course';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { FlexContainer, StyledTable, StyledTH } from 'styles/Containers';

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
  const { totalPageProvider, searchQueryProvider } = useContext(
    GlobalStateContext,
  )!;

  let searchQuery: string;

  // Reset page number when searching
  if (searchQueryProvider.searchQuery) {
    searchQuery = searchQueryProvider.searchQuery;
    pageNumber = 1;
  } else {
    searchQuery = ' ';
  }

  const resultLimit: number = 25;
  let start: number = (pageNumber - 1) * resultLimit;

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
    <FlexContainer margin='15px 10% 0 10%'>
      <StyledTable>
        <thead>
          <tr>
            <StyledTH width='25%'>Fagkode</StyledTH>
            <StyledTH width='50%' textAlign='left'>
              Fagnavn
            </StyledTH>
            <StyledTH width='25%'>Vurdering</StyledTH>
          </tr>
        </thead>
        <tbody>
          {courses.map((currentCourse) => {
            return (
              <Course
                courseCode={currentCourse.course_code}
                courseName={currentCourse.course_name}
                credit={currentCourse.credit}
              />
            );
          })}
        </tbody>
      </StyledTable>
    </FlexContainer>
  );
};
