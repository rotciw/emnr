import React from 'react';
import { Navbar } from 'components/Navbar';
import styled from 'styled-components';

const Body = styled.main`
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: 0 10%; /* Flex wraps incorrectly if padding is 0 */
`;

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <Body>{children}</Body>
    </>
  );
};
