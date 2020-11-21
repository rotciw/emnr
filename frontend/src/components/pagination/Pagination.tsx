import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import PaginationButton from './PaginationButton';

interface PaginationProps {
  currentPage: string;
}

const PaginationWrapper = styled.div`
  padding: 1rem 0 2rem 0;
  display: flex;
  justify-content: center;
`;

const Separator = styled.div`
  width: 1rem;
  margin: 0 0.25rem;
`;

export const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
}) => {
  const { pageProvider } = useContext(GlobalStateContext)!;
  const [page, setPage] = useState<number>(pageProvider.page);
  const [totalPages, setTotalPages] = useState<number>(pageProvider.totalPage);

  useEffect(() => {
    if (currentPage === 'courses') {
      setTotalPages(pageProvider.totalPage);
      setPage(pageProvider.page);
    }
    if (currentPage === 'reviews') {
      setTotalPages(pageProvider.totalReviewPage);
      setPage(pageProvider.reviewPage);
    }
  }, [currentPage, pageProvider.totalPage, pageProvider.totalReviewPage]);

  return (
    <div>
      <PaginationWrapper>
        {page !== 1 && (
          <PaginationButton
            currentPage={currentPage}
            pageNumber={page - 1}
          >
            &lt;
          </PaginationButton>
        )}
        <PaginationButton currentPage={currentPage} pageNumber={1}>
          {1}
        </PaginationButton>
        {page > 3 && <Separator>...</Separator>}
        {page === totalPages && totalPages > 3 && (
          <PaginationButton currentPage={currentPage} pageNumber={page - 2}>
            {page - 2}
          </PaginationButton>
        )}
        {page > 2 && (
          <PaginationButton currentPage={currentPage} pageNumber={page - 1}>
            {page - 1}
          </PaginationButton>
        )}
        {page !== 1 && page !== totalPages && (
          <PaginationButton currentPage={currentPage} pageNumber={page}>
            {page}
          </PaginationButton>
        )}
        {page < totalPages - 1 && (
          <PaginationButton currentPage={currentPage} pageNumber={page + 1}>
            {page + 1}
          </PaginationButton>
        )}
        {page === 1 && totalPages > 3 && (
          <PaginationButton currentPage={currentPage} pageNumber={page + 2}>
            {page + 2}
          </PaginationButton>
        )}
        {page < totalPages - 2 && <Separator>...</Separator>}
        {totalPages !== 1 && (
          <PaginationButton currentPage={currentPage} pageNumber={totalPages}>
            {totalPages}
          </PaginationButton>
        )}
        {page !== totalPages && (
          <PaginationButton currentPage={currentPage} pageNumber={page + 1}>
            &gt;
          </PaginationButton>
        )}
      </PaginationWrapper>
    </div>
  );
};
export const Pagination = PaginationComponent;
