import React, { useCallback, useEffect, RefObject,useState, useRef } from 'react';
import { useHistory} from 'react-router-dom';
import styled from "styled-components";
import {Hamburger} from './Hamburger';
import {HrLineLight, FlexContainer, CenteredFlexContainer} from '../styles/Containers';
import homeIcon from '../assets/icons/home.svg';
import meIcon from '../assets/icons/me.svg';
import infoIcon from '../assets/icons/info.svg';



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

  transition: transform 0.4s ease-in-out; //ease-ease-in-out
  transform: ${({ open }) =>
    open ? "translateX(65%)" : "translateX(100%)"}; 

  @media (max-width: 576px) {
    transform: ${({ open }) =>
    open ? "translateX(0%)" : "translateX(100%)"}; 
  }
`;

//margin: 7px 0 7px 5%;

const StyledLink = styled.a`
  margin: 7px 0 7px 5%;
  width: fit-content;
  font-size: 18px;
  font-family: gilroyxbold;
  color: ${({ theme }) => theme.light}; 
  float: left;
  cursor: pointer;
  @media (max-width: 576px) {
    margin: 7px 0 7px 20%;
  }
  :hover {
    color: ${({ theme }) => theme.lightBlue};
  }
`;


const TopRow = styled.div`
  display: flex;
  align-items: center;
`;


const LogOutLink = styled(StyledLink)`
  margin-top: 10px;
  text-decoration: underline;
`;

const Icon = styled.img`
  padding: 10px;
  margin-left: 40px;
  cursor: pointer;
  width: 25px;
  :hover {
    color: ${({ theme }) => theme.lightBlue};
  }
`;



const useOnClickOutside = (
    ref: RefObject<HTMLDivElement>,
    closeMenu: () => void
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
  
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }, [ref, closeMenu]);
  };




export const Menu: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const node = useRef<HTMLDivElement>(null);
    const close = () => setOpen(false);
  
    useOnClickOutside(node, () => setOpen(false));

    const history = useHistory();
    const handleOnClick = useCallback(() => history.push('/'), [history]);
    const handleClickMe = useCallback(() => history.push('/me'), [history]);
  

   
    
    

    
  
    return (
      <div ref={node}>

        <StyledMenu open={open}>
          <TopRow>
          <Icon src={homeIcon} onClick={handleOnClick}/>
          <StyledLink onClick={handleOnClick}>Gå til forsiden</StyledLink>
          </TopRow>

          <TopRow>
          <Icon src={meIcon} onClick={handleClickMe}/>
          <StyledLink >Gå til min side</StyledLink>
          </TopRow>

          <TopRow>
          <Icon src={infoIcon} onClick={handleOnClick}/>
          <StyledLink onClick={() => close()}>Om EMNR</StyledLink> 
          </TopRow>

          <HrLineLight/>
          <LogOutLink onClick={() => close()}>Logg ut</LogOutLink>
        </StyledMenu>
        <Hamburger open={open} setOpen={setOpen} />
  
  
      </div>
    );
  };
  
