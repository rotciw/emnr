import React from 'react';
import styled from "styled-components";
import {Hamburger} from './Hamburger';
import { useEffect, RefObject,useState, useRef } from "react";


const StyledMenu = styled.nav<{ open: boolean }>`
  top: 0;
  left: 0;
  height: 3%; 
  width: 100%;
  position: fixed;
  background-color: ${({ theme }) => theme.blue};
  z-index: 1;

  display: flex;
  flex-direction: column;
  padding: 80px 0;

  transition: transform 0.4s ease-in-out; //ease-ease-in-out
  transform: ${({ open }) =>
    open ? "translateX(0)" : "translateX(100%)"}; //endret fra -100 til 100 

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  padding: 3px 100px;
  font-size: 18px;
  color: ${({ theme }) => theme.white}; 

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

  
    return (
      <div ref={node}>
        <StyledMenu open={open}>
          <StyledLink>Gå til forsiden</StyledLink>
          <StyledLink>Gå til min side</StyledLink>
          <StyledLink>Logg ut</StyledLink>
        </StyledMenu>
        <Hamburger open={open} setOpen={setOpen} />
      </div>
    );
  };
  
