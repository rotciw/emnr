import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useState, useContext } from 'react';
import { Pagination } from './Pagination';

interface ReviewPaginationContainerProps{
  totalPages: number
}

export const ReviewPaginationContainer: React.FC<ReviewPaginationContainerProps> = ({
  totalPages
}) => {
  const {pageReviewProvider} = useContext(GlobalStateContext)!;
  const handlePages = (updatePage: number) => pageReviewProvider.setPageReview(updatePage);
return (
    <div className="container">
      <Pagination
        page={pageReviewProvider.pageReview}
        totalPages={totalPages}
        handlePagination={handlePages}
      />
    </div>
  );
};