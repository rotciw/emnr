import React, { useEffect, useState, useContext } from 'react';
import { Course } from './Course';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { FlexContainer, StyledTable, StyledTH } from 'styles/Containers';
import styled from 'styled-components';

interface CourseListProps {
  pageNumber: number;
}

interface CourseProps {
  course_name: string;
  course_code: string;
  average_grade: number;
  credit: number;
  review_count: number;
  average_review_score: number;
}

export const EmptyResult = styled.h3`
  text-align: center;
  align-self: center;
  flex: 1;
`;

export const CourseList: React.FC = () => {
  const [courses, updateCourses] = useState<CourseProps[]>([]);
  const { pageProvider, queryProvider } = useContext(GlobalStateContext)!;

  let pageNumber = pageProvider.page;
  // Search input
  // Reset page number when searching
  let searchQuery: string = '';
  if (queryProvider.searchQuery) {
    searchQuery = queryProvider.searchQuery;
  }

  // Sorting dropdown
  let orderByQuery: string;
  queryProvider.orderByQuery
    ? (orderByQuery = queryProvider.orderByQuery)
    : (orderByQuery = 'course_name');

  let orderToggle: number;

  // The backend sorts ascending on 1 and descending on 0
  queryProvider.orderToggle ? (orderToggle = 0) : (orderToggle = 1);

  const resultLimit: number = 25;
  let start: number = (pageNumber - 1) * resultLimit;

  // this useEffect is used for resetting page number to 1 when searching
  useEffect(() => {
    pageProvider.setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const getCourses = async () => {
      await axios
        .get(
          `http://localhost:8000/course/all/?n=25&offset=${start}&search=${searchQuery}&order_by=${orderByQuery}&ascending=${orderToggle}`,
        )
        .then((res) => {
          updateCourses(res.data.data);
          pageProvider.setTotalPage(Math.ceil(res.data.count / resultLimit));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCourses();
    start += resultLimit;
  }, [pageNumber, searchQuery, orderByQuery, orderToggle]);

  return (
    <FlexContainer margin='15px 0 0 0'>
      {courses.length ? (
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
                  averageScore={currentCourse.average_review_score}
                  reviewCount={currentCourse.review_count}
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
