import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext } from 'react';
import styled from 'styled-components';
import PaginationButton from './PaginationButton';

const PaginationWrapper = styled.div`
  padding: 2rem 0;
  display: flex;
  justify-content: center;
`;

const Separator = styled.div`
  width: 1rem;
  margin: 0 0.25rem;
`;
export const PaginationComponent: React.FC = () => {
  const { pageProvider } = useContext(GlobalStateContext)!;
  const totalPages = pageProvider.totalPage;
  const { page } = pageProvider;

  return (
    <div>
      <PaginationWrapper>
        {page !== 1 && (
          <PaginationButton pageNumber={page - 1}>&lt;</PaginationButton>
        )}
        <PaginationButton pageNumber={1}>{1}</PaginationButton>
        {page > 3 && <Separator>...</Separator>}
        {page === totalPages && totalPages > 3 && (
          <PaginationButton pageNumber={page - 2}>{page - 2}</PaginationButton>
        )}
        {page > 2 && (
          <PaginationButton pageNumber={page - 1}>{page - 1}</PaginationButton>
        )}
        {page !== 1 && page !== totalPages && (
          <PaginationButton pageNumber={page}>{page}</PaginationButton>
        )}
        {page < totalPages - 1 && (
          <PaginationButton pageNumber={page + 1}>{page + 1}</PaginationButton>
        )}
        {page === 1 && totalPages > 3 && (
          <PaginationButton pageNumber={page + 2}>{page + 2}</PaginationButton>
        )}
        {page < totalPages - 2 && <Separator>...</Separator>}
        <PaginationButton pageNumber={totalPages}>
          {totalPages}
        </PaginationButton>
        {page !== totalPages && (
          <PaginationButton pageNumber={page + 1}>&gt;</PaginationButton>
        )}
      </PaginationWrapper>
    </div>
  );
};
export const Pagination = PaginationComponent;
