import React from 'react';
import styled from 'styled-components';
import { CourseButton } from './Buttons';

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

const handleCourseClick = () => {
    console.log("Trykk på fag 1");
}

export const CourseList: React.FC<CourseListProps> = ({
  }) => {
  return (
    <Wrapper>
        <CourseButton clickHandler={handleCourseClick}>
            Fag 1
        </CourseButton>
    </Wrapper>
  );
};