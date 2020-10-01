import React from 'react';
import { Navbar } from 'components/Navbar';
import styled from 'styled-components';

interface LayoutProps {
  padding?: string;
}

const Body = styled.main`
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: ${(props: LayoutProps) => props.padding || '0 10%'}; /* Flex wraps incorrectly if padding is 0 */
`;

export const Layout: React.FC<LayoutProps> = ({ children, padding }) => {
  return (
    <>
      <Navbar />
      <Body padding={padding}>{children}</Body>
    </>
  );
};
