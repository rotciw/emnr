import React from 'react';
import styled from "styled-components";
import {defaultTheme} from '../styles/theme';
import Hamburger from './Hamburger';
import { useEffect, RefObject,useState, useRef } from "react";


const StyledMenu = styled.nav<{ open: boolean }>`
  top: 0;
  left: 0;
  height: 10%; 
  width: 100%;
  position: fixed;
  background-color:  #457B9D;
  z-index: 1;

  display: flex;
  flex-direction: column;
  padding: 5rem 0;

  transition: transform 0.5s ease-in-out;
  transform: ${({ open }) =>
    open ? "translateX(0)" : "translateX(100%)"}; //endret fra -100 til 100

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  padding: 0rem 2rem;
  font-size: 2rem;
  color: ${defaultTheme.red}; //fiks
  text-decoration: none;

  :hover {
    color: ${defaultTheme.lightBlue}; //fiks
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

const Menu = () => {
    const [open, setOpen] = useState<boolean>(false);
    const node = useRef<HTMLDivElement>(null);
    const close = () => setOpen(false);
  
    useOnClickOutside(node, () => setOpen(false));
  
    return (
      <div ref={node}>
        <StyledMenu open={open}>
          <StyledLink onClick={() => close()}>Gå til min side</StyledLink>
          <StyledLink onClick={() => close()}>Gå til tilbake til forsiden</StyledLink>
          <StyledLink onClick={() => close()}>Logg ut</StyledLink>
        </StyledMenu>
        <Hamburger open={open} setOpen={setOpen} />
      </div>
    );
  };
  
  export default Menu;
  

