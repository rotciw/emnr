import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import emnrLogo from '../assets/images/emnr_long.svg';
import { Searchbar } from './Searchbar';

const NavBarContainer = styled.nav`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.darkBlue};
  padding-bottom: 25px;
  position: sticky;
  top: 0;
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
`;

const MeButton = styled.button`
  background-color: ${({ theme }) => theme.darkBlue};
  cursor: pointer;
  color: white;
  font-family: gilroymedium;
  outline: none;
  border: none;
  :hover {
    background-color: ${({ theme }) => theme.blue};
  }
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  vertical-align: center;
  justify-content: space-between;
`;

export const Navbar: React.FC = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);
  const handleClickMe = useCallback(() => history.push('/me'), [history]);

  return (
    <NavBarContainer>
      <TopRow id='top-row'>
        <Logo src={emnrLogo} onClick={handleOnClick} />
        <MeButton onClick={handleClickMe}> Min side </MeButton>
      </TopRow>
      <Searchbar />
    </NavBarContainer>
  );
};
