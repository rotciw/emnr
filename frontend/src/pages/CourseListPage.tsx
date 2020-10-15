import { CourseList } from 'components/CourseList';
import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext } from 'react';
import { Layout } from 'styles/Layout';
import { Pagination } from 'components/pagination/Pagination';

export const CourseListPage: React.FC = () => {
  const { pageProvider, totalPageProvider } = useContext(
    GlobalStateContext,
  )!;

  return (
    <Layout>
      <CourseList pageNumber={pageProvider.page} />
      <Pagination />
    </Layout>
  );
};
