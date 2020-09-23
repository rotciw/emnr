import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  clickHandler?: (value?: any) => void;
  children: string;
}

const StyledLoginBtn = styled.button`
  display: block;
  border: 2px solid #ccc;
  padding: 5px 15px 5px 15px;
  text-align: center;
  :hover {
    background-color: #44c802;
    color: white;
    border: 2px solid white;
  }
`;

const StyledCourseBtn = styled.button`
  border: 2px solid #ccc;
  text-align: center;
  background-color: #ddd;
  :hover {
    background-color: #ccc;
    color: white;
    border: 2px solid #ccc;
  }
`;

export const LoginButton: React.FC<ButtonProps> = ({
  clickHandler,
  children,
}) => {
  return <StyledLoginBtn onClick={clickHandler}>{children}</StyledLoginBtn>;
};

export const CourseButton: React.FC<ButtonProps> = ({
  clickHandler,
  children,
}) => {
  return <StyledCourseBtn onClick={clickHandler}>{children}</StyledCourseBtn>;
};
