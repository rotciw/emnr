import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

interface PaginationProps {
  backgroundColor?: string;
}

interface PaginationInterface {
  pageNumber: number;
  currentPage: string;
}

const PaginationBtn = styled.div`
  background-color: ${(props: PaginationProps) => props.backgroundColor};
  font-family: gilroymedium;
  box-shadow: transparent 0px 0px 0px 0px, transparent 0px 0px 0px 4px,
    rgba(0, 0, 0, 0.18) 0px 2px 4px;
  border: 1px solid black;
  padding: 10px;
  min-width: 15px;
  cursor: pointer;
  margin: 0 0.25rem;
  border-radius: 10%;
  text-align: center;
  &:hover {
    background-color: ${({ theme }) => theme.lightBlue};
    box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 6px 16px;
  }
  &:focus {
    outline: 0;
  }
  &.active {
    background-color: ${({ theme }) => theme.lightBlue};
  }
`;

const PaginationButton: React.FC<PaginationInterface> = ({
  children,
  pageNumber,
  currentPage,
}) => {
  const { pageProvider } = useContext(GlobalStateContext)!;
  const [isActive, setIsActive] = useState(false);

  const handleActive = () => {
    if (currentPage === 'courses') {
      pageProvider.setPage(pageNumber);
    }
    if (currentPage === 'reviews') {
      pageProvider.setReviewPage(pageNumber);
    }
  };

  useEffect(() => {
    const checkStatus = () => {
      if (currentPage === 'courses') {
        pageProvider.page === pageNumber
          ? setIsActive(true)
          : setIsActive(false);
      }
      if (currentPage === 'reviews') {
        pageProvider.reviewPage === pageNumber
          ? setIsActive(true)
          : setIsActive(false);
      }
    };
    checkStatus();
    // eslint-disable-next-line
  }, [pageProvider.page, pageNumber, pageProvider.reviewPage]);

  return (
    <PaginationBtn
      onClick={handleActive}
      backgroundColor={isActive ? '#A8DADC' : 'white'}
    >
      {children}
    </PaginationBtn>
  );
};

export default PaginationButton;
