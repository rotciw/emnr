import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useState, useContext } from 'react';
import { Pagination } from './Pagination';
//import GlobalStateContext from '../../context/GlobalStateContext'

interface PaginationContainerProps{
  totalPages: number
}

export const PaginationContainer: React.FC<PaginationContainerProps> = ({
  totalPages
}) => {
  const {pageProvider} = useContext(GlobalStateContext)!;
  const handlePages = (updatePage: number) => pageProvider.setPage(updatePage);
return (
    <div className="container">
      <Pagination
        page={pageProvider.page}
        totalPages={totalPages}
        handlePagination={handlePages}
      />
    </div>
  );
};