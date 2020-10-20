import React from 'react';
import styled from "styled-components";


const StyledHamburger = styled.button<{ open: boolean }>`
  position: fixed;
  right: 3vw;
  top: 1vw;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  border: none;
  cursor: pointer;
  outline: none;
  z-index: 1;

  div {
    position: relative;
    width: 32px;
    height: 4px;
    border-radius: 10px;
    transition: all 0s linear;
    transform-origin: 1px;
    background-color: ${({ theme }) => theme.white};

    :first-child {
      transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? "0" : "1")};
      transform: ${({ open }) => (open ? "translateX(20px)" : "translateX(0)")};
    }

    :nth-child(3) {
      transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;


interface HamburgerProps {
    open: boolean;
    setOpen: (v: boolean) => void;
  }
  
export const Hamburger: React.FC<HamburgerProps> = ({
    open,
    setOpen,
  }) => {
    return (
    <StyledHamburger open={open} onClick={() => {setOpen(!open)}}>
      <div />
      <div />
      <div />
    </StyledHamburger>
      
    );
  };
  
    