import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import emnrLogo from '../assets/images/emnr_long.svg';
import { Searchbar } from './Searchbar';

const NavBarContainer = styled.nav`
  width: 100%;
  float: left;
  flex: 1;
  background-color: ${({ theme }) => theme.darkBlue};
  padding-bottom: 25px;
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
`;

export const Navbar: React.FC = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);

  return (
    <NavBarContainer>
      <Logo src={emnrLogo} onClick={handleOnClick} />
      <Searchbar />
    </NavBarContainer>
  );
};
