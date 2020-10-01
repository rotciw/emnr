import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useState, useContext } from 'react';
import { Pagination } from './Pagination';
//import GlobalStateContext from '../../context/GlobalStateContext'


export const PaginationContainer: React.FC = () => {
  const {pageProvider} = useContext(GlobalStateContext)!;
  const totalPages = 15;
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