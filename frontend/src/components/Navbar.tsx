import React, { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import emnrLogo from '../assets/images/emnr_long.svg';
import { Searchbar } from './Searchbar';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { GlobalStateContext } from 'context/GlobalStateContext';
import {Menu} from './Menu';

const NavBarContainer = styled.nav`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.darkBlue};
  padding-bottom: 25px;
  position: sticky;
  top: 0;
`;

const DropdownContainer = styled.div`
  background-color: ${({ theme }) => theme.darkBlue};
  margin: 1.2% 50% 0 25%;
  @media (max-width: 768px) {
    margin: 2.2% 25% 0 20%;
  }
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
`;

const MeButton = styled.button`
  background-color: ${({ theme }) => theme.darkBlue};
  cursor: pointer;
  color: ${({ theme }) => theme.white};
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
const options = [
  { value: 'course_code', label: 'Fagkode' },
  { value: 'course_name', label: 'Fagnavn' },
  { value: 'credit', label: 'Studiepoeng' },
  { value: 'average-grade', label: 'Gj. snitt karakter' },
];

export const Navbar: React.FC = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);
  const handleClickMe = useCallback(() => history.push('/me'), [history]);

  const { queryProvider } = useContext(GlobalStateContext)!;
  const isOnLandingPage: boolean = useLocation().pathname === '/';

  const onSelect = (e: string) => {
    queryProvider.setOrderByQuery(e);
    queryProvider.setOrderToggle(!queryProvider.orderToggle);
  };

  return (
    <NavBarContainer>
      <TopRow>
        <Logo src={emnrLogo} onClick={handleOnClick} />
        <Menu></Menu>
        <MeButton onClick={handleClickMe}> Min side </MeButton>
      </TopRow>
      {isOnLandingPage && (
        <>
          <Searchbar />
          <DropdownContainer>
            <Dropdown
              options={options}
              onChange={(e) => onSelect(e.value)}
              placeholder='Sorter etter..'
            />
          </DropdownContainer>
        </>
      )}
    </NavBarContainer>
  );
};
