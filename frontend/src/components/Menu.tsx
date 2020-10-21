import React, { useCallback, useEffect, RefObject,useState, useRef } from 'react';
import emnrLogo from '../assets/images/emnr_long.svg';
import { useHistory} from 'react-router-dom';
import styled from "styled-components";
import {Hamburger} from './Hamburger';




const StyledMenu = styled.nav<{ open: boolean }>`
  top: 0;
  left: 0;
  height: 15%; 
  width: 100%;
  position: fixed;
  background-color: ${({ theme }) => theme.blue};
  z-index: 1;

  display: flex;
  flex-direction: column;
  padding: 100px 0;

  transition: transform 0.4s ease-in-out; //ease-ease-in-out
  transform: ${({ open }) =>
    open ? "translateX(0)" : "translateX(100%)"}; 

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  padding: 7px 120px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.white}; 
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.lightBlue};
  }
`;

const LogOutLink = styled(StyledLink)`
  margin-top: 60px;
  text-decoration: underline;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Logo = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 100px;
`;

const Divider = styled.div`
  width: 1px;
  background-color: black;
  margin-left: 20px;
  margin-right: 20px;
  height: 1cm;
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
  

      // <Logo src={emnrLogo} onClick={handleOnClick} />
  
    return (
      <div ref={node}>

        <StyledMenu open={open}>
          <StyledLink onClick={handleOnClick}>Gå til forsiden</StyledLink>
          <StyledLink onClick={handleClickMe}>Gå til min side</StyledLink>
          <StyledLink onClick={() => close()}>Om EMNR</StyledLink>
          <LogOutLink onClick={() => close()}>Logg ut</LogOutLink>
        </StyledMenu>
        <Hamburger open={open} setOpen={setOpen} />
  
  
      </div>
    );
  };
  
