import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  clickHandler?: (value?: any) => void;
  children: any;
}

const StyledLoginBtn = styled.button`
  display: block;
  color: ${({theme}) => theme.light};
  background-color: ${({theme}) => theme.darkBlue};
  border: none;
  border-radius: 5px;
  padding: 15px 50px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: ${({theme}) => theme.blue};
  }
`;

const StyledCourseBtn = styled.button`
  border: 2px solid #ccc;
  text-align: center;
  background-color: ${({ theme }) => theme.white};
  width: 100%;
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

export const RateCourseButton = styled.div`
  background-color: ${({ theme }) => theme.red};
  padding: 10px 20px;
  color: white;
  border: 1px solid black;
  width: fit-content;
  font-family: gilroyxbold;
`;
