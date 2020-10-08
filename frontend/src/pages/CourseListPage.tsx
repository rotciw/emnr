import { CourseList } from 'components/CourseList';
import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext } from 'react';
import { Layout } from 'styles/Layout';
import { PaginationContainer } from 'components/pagination/PaginationContainer';

export const CourseListPage: React.FC = () => {
  const { pageProvider, totalPageProvider } = useContext(
    GlobalStateContext,
  )!;

  return (
    <Layout>
      <CourseList pageNumber={pageProvider.page} />
      <PaginationContainer totalPages={totalPageProvider.totalPage} />
    </Layout>
  );
};
