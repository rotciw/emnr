import React from 'react';
import styled from 'styled-components';

interface LayoutProps {
  clickHandler?: (value?: any) => void;
  children: any;
}

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexItem = styled.div`
  flex: 1;
`;

// const StyledLoginBtn = styled.button`
//   display: block;
//   border: 2px solid #ccc;
//   padding: 5px 15px 5px 15px;
//   text-align: center;
//   :hover {
//     background-color: #44c802;
//     color: white;
//     border: 2px solid white;
//   }
// `;

// const StyledCourseBtn = styled.button`
//   border: 2px solid #ccc;
//   text-align: center;
//   background-color: ${({ theme }) => theme.white};
//   width: 100%;
//   :hover {
//     background-color: #ccc;
//     color: white;
//     border: 2px solid #ccc;
//   }
// `;

// export const LoginButton: React.FC<ButtonProps> = ({
//   clickHandler,
//   children,
// }) => {
//   return <StyledLoginBtn onClick={clickHandler}>{children}</StyledLoginBtn>;
// };

// export const CourseButton: React.FC<ButtonProps> = ({
//   clickHandler,
//   children,
// }) => {
//   return <StyledCourseBtn onClick={clickHandler}>{children}</StyledCourseBtn>;
// };
