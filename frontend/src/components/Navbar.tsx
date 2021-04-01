import React, { useCallback, useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import modalStyles from 'styles/Modals';
import styled from 'styled-components';
import Dropdown, { Option } from 'react-dropdown';
import emnrLogo from '../assets/images/emnr_long.svg';
import Searchbar from './Searchbar';
import 'react-dropdown/style.css';
import '../utils/dropdown.css';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { Menu } from './Menu';
import { NavbarButton, SortHighLowButton } from 'styles/Buttons';
import AdvancedSortForm from './AdvancedSortForm';
import Headroom from 'react-headroom';

const NavbarContainer = styled.nav`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.darkBlue};
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
  height: 60px;
`;

const NavbarUnderContainer = styled.div`
  background-color: ${({ theme }) => theme.darkBlue};
`;

const SortingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.darkBlue};
  margin: 12px 25% 0 25%;
  padding-bottom: 25px;
  @media (max-width: 768px) {
    flex-direction: column;
    margin: 12px 20% 0 20%;
  }
`;

const DropdownContainer = styled.div`
  flex: 1;
`;

const NavBarButtonContainer = styled.div`
  flex: 1;
  display: flex;
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
  z-index: 99;
`;

const TopRow = styled.div`
  /* Add support for webkit */
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
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
  { value: 'pass_rate', label: 'Strykprosent' },
];

const Navbar: React.FC = () => {
  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);

  const { queryProvider } = useContext(GlobalStateContext)!;
  const { advancedQueryProvider } = useContext(GlobalStateContext)!;

  const isOnLandingPage: boolean = useLocation().pathname === '/';

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [marginTop, setMarginTop] = useState<string>('0px');

  function toggleModalIsOpen() {
    setModalIsOpen(!modalIsOpen);
  }
  Modal.setAppElement('#root');

  const onSelect = (e: Option) => {
    queryProvider.setOrderByQuery(e.value);
  };

  const onOrderToggle = () => {
    queryProvider.setOrderToggle(!queryProvider.orderToggle);
  };

  return (
    <>
      <NavbarContainer>
        <TopRow>
          <Logo src={emnrLogo} onClick={handleOnClick} alt='Logo' />
          <Menu />
        </TopRow>
      </NavbarContainer>
      {isOnLandingPage && (
        <>
          <Headroom
            style={{
              marginTop: marginTop,
            }}
            onUnfix={() => setMarginTop('0px')}
            onPin={() => setMarginTop('60px')}
            upTolerance={20}
          >
            <NavbarUnderContainer>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModalIsOpen}
                style={modalStyles}
                contentLabel='Example Modal'
              >
                <AdvancedSortForm closeModal={toggleModalIsOpen} />
              </Modal>
              <Searchbar />
              <SortingContainer>
                <DropdownContainer>
                  <Dropdown
                    options={options}
                    onChange={(e) => onSelect(e)}
                    placeholder='Sorter..'
                    disabled={advancedQueryProvider.advancedSorting}
                  />
                </DropdownContainer>
                <SortHighLowButton
                  onClick={onOrderToggle}
                  disabled={advancedQueryProvider.advancedSorting}
                >
                  {(queryProvider.orderToggle ? 'Stigende' : 'Synkende') +
                    ` \u21C5`}
                </SortHighLowButton>
                <NavBarButtonContainer>
                  <NavbarButton onClick={toggleModalIsOpen}>
                    EMNR-sortering
                  </NavbarButton>
                </NavBarButtonContainer>
              </SortingContainer>
            </NavbarUnderContainer>
          </Headroom>
        </>
      )}
    </>
  );
};

export default Navbar;
