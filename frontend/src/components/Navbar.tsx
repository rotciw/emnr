import React, { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import emnrLogo from '../assets/images/emnr_long.svg';
import { Searchbar } from './Searchbar';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { GlobalStateContext } from 'context/GlobalStateContext';

const NavBarContainer = styled.nav`
  width: 100%;
  float: left;
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

  const isOnLandingPage:boolean = useLocation().pathname === ("/");

  const onSelect = (e: string) => {
    queryProvider.setOrderByQuery(e);
    queryProvider.setOrderToggle(!queryProvider.orderToggle);
  };

  return (
    <NavBarContainer>
      <Logo src={emnrLogo} onClick={handleOnClick} />
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
