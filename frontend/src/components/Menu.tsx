import React, {
  useCallback,
  useEffect,
  RefObject,
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { HrLineLight } from '../styles/Containers';
import { Hamburger } from './Hamburger';
import homeIcon from '../assets/icons/home.svg';
import meIcon from '../assets/icons/me.svg';
import infoIcon from '../assets/icons/info.svg';
import guidelinesIcon from '../assets/icons/rules.svg';

const StyledMenu = styled.nav<{ open: boolean }>`
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: ${({ theme }) => theme.blue};
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  transition: transform 0.4s ease-in-out;
  transform: ${({ open }) => (open ? 'translateX(75%)' : 'translateX(100%)')};

  @media (max-width: 1000px) {
    transform: ${({ open }) => (open ? 'translateX(68%)' : 'translateX(100%)')};
  }

  @media (max-width: 576px) {
    transform: ${({ open }) => (open ? 'translateX(0%)' : 'translateX(100%)')};
  }
`;

const HrLineLightScaled = styled(HrLineLight)`
  @media (max-width: 1000px) {
    width: 29%;
    margin: 10px 0 0 10px;
  }

  @media (max-width: 576px) {
    width: 90%;
    margin: 10px 0 0 10px;
  }
`;

const StyledLink = styled.a`
  margin: 1px;
  width: fit-content;
  font-size: 18px;
  font-family: gilroyxbold;
  color: ${({ theme }) => theme.light};
  float: left;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.lightBlue};
  }
`;

const LogOutLink = styled(StyledLink)`
  margin: 25px 0 0 40px;
  text-decoration: underline;
  @media (max-width: 576px) {
    margin-left: 20px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  padding: 10px;
  margin-left: 2%;
  width: 25px;
`;

const useOnClickOutside = (
  ref: RefObject<HTMLDivElement>,
  closeMenu: () => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      closeMenu();
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, closeMenu]);
};

export const Menu: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const node = useRef<HTMLDivElement>(null);

  useOnClickOutside(node, () => setOpen(false));

  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);
  const handleClickMe = useCallback(() => history.push('/me'), [history]);
  const handleClickGuidelines = useCallback(() => history.push('/guidelines'),[history]);
  const handleClickAbout = useCallback(() => history.push('/about'), [history]);
  const handleClickLogOut = useCallback(() => {
    history.push('/login');
    localStorage.clear();
  }, [history]);

  return (
    <div ref={node}>
      <StyledMenu open={open}>
        <FlexContainer>
          <Icon src={homeIcon} alt='Home icon' />
          <StyledLink onClick={handleOnClick}>Gå til forsiden</StyledLink>
        </FlexContainer>

        <FlexContainer>
          <Icon src={meIcon} alt='Me icon' />
          <StyledLink onClick={handleClickMe}>Gå til min side</StyledLink>
        </FlexContainer>

        <FlexContainer>
          <Icon src={guidelinesIcon} alt='Guidelines icon' />
          <StyledLink onClick={handleClickGuidelines}>Regler for bruk av siden</StyledLink>
        </FlexContainer>


        <FlexContainer>
          <Icon src={infoIcon} alt='Info icon' />
          <StyledLink onClick={handleClickAbout}>Om EMNR</StyledLink>
        </FlexContainer>

        <HrLineLightScaled />
        <LogOutLink onClick={handleClickLogOut}>Logg ut</LogOutLink>
      </StyledMenu>

      <Hamburger open={open} setOpen={setOpen} />
    </div>
  );
};
