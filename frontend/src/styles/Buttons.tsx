import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  clickHandler?: (value?: any) => void;
  children: any;
}

const StyledLoginBtn = styled.button`
  display: block;
  color: ${({ theme }) => theme.light};
  background-color: ${({ theme }) => theme.darkBlue};
  border: none;
  border-radius: 5px;
  padding: 15px 50px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: ${({ theme }) => theme.blue};
  }
`;

const StyledCourseBtn = styled.button`
  display: flex;
  border: 2px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.white};
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.19);
  margin: 5px 0;
  padding: 10px 5px;
  width: 100%;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.lightBlue};
    color: black;
    border: 2px solid black;
  }
`;

export const NavbarButton = styled.button`
  color: ${({ theme }) => theme.light};
  background-color: ${({ theme }) => theme.blue};
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  margin: 0 0 0 12px;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: ${({ theme }) => theme.lightBlue};
    color: ${({ theme }) => theme.darkBlue}
  }
  @media (max-width: 768px){
    margin: 12px 0 0 0;
  }
`;

export const SortFormButton = styled.button`
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.lightBlue};
  border: solid 2px ${({ theme }) => theme.lightBlue};
  border-radius: 3px;
  padding: 4px 4px;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: ${({ theme }) => theme.lightlightBlue};
    color: ${({ theme }) => theme.darkBlue};
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