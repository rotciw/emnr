import React, { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Dropdown, { Option } from 'react-dropdown';
import emnrLogo from '../assets/images/emnr_long.svg';
import Searchbar from './Searchbar';
import 'react-dropdown/style.css';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { Menu } from './Menu';

const NavBarContainer = styled.nav`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.darkBlue};
  position: sticky;
  position: -webkit-sticky;
  top: 0;
`;

const DropdownContainer = styled.div`
  background-color: ${({ theme }) => theme.darkBlue};
  margin: 1.2% 40% 0 25%;
  padding-bottom: 25px;
  @media (max-width: 768px) {
    margin: 2.2% 25% 0 20%;
  }
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
`;

const TopRow = styled.div`
  /* Add support for webkit */
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  flex-direction: row;
  vertical-align: center;
  justify-content: space-between;
  z-index: 2;
`;

const options = [
  { value: 'course_code', label: 'Emnekode' },
  { value: 'course_name', label: 'Emnenavn' },
  { value: 'average_review_score', label: 'Gjennomsnittlig vurdering' },
  { value: 'review_count', label: 'Antall vurderinger' },
  { value: 'credit', label: 'Studiepoeng' },
  { value: 'average_grade', label: 'Karaktersnitt' },
  { value: 'pass_rate', label: 'Strykprosent'}
];

const Navbar: React.FC = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);

  const { queryProvider } = useContext(GlobalStateContext)!;
  const isOnLandingPage: boolean = useLocation().pathname === '/';

  const onSelect = (e: Option) => {
    queryProvider.setOrderByQuery(e.value);
    queryProvider.setOrderToggle(!queryProvider.orderToggle);
    queryProvider.orderToggle ? (e.label += ` \u25B2`) : (e.label += ` \u25BC`);
  };

  return (
    <NavBarContainer>
      <TopRow>
        <Logo src={emnrLogo} onClick={handleOnClick} />
        <Menu />
      </TopRow>
      {isOnLandingPage && (
        <>
          <Searchbar />
          <DropdownContainer>
            <Dropdown
              options={options}
              onChange={(e) => onSelect(e)}
              placeholder='Sorter etter..'
            />
          </DropdownContainer>
        </>
      )}
    </NavBarContainer>
  );
};

export default Navbar;
