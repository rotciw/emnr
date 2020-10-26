import React from 'react';
import Navbar from 'components/Navbar';
import styled from 'styled-components';

interface LayoutProps {
  padding?: string;
}

const Body = styled.main`
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: ${(props: LayoutProps) =>
    props.padding || '0 20%'}; /* Flex wraps incorrectly if padding is 0 */
  @media (max-width: 768px) {
    padding: 0 3%;
  }
`;

const Layout: React.FC<LayoutProps> = ({ children, padding }) => {
  return (
    <>
      <Navbar />
      <Body padding={padding}>{children}</Body>
    </>
  );
};

export default Layout;
