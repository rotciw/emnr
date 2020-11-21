import { CourseList } from 'components/CourseList';
import React from 'react';
import Layout from 'styles/Layout';
import { Pagination } from 'components/pagination/Pagination';

const CourseListPage: React.FC = () => {
  return (
    <Layout>
      <CourseList />
      <Pagination currentPage='courses' />
    </Layout>
  );
};

export default CourseListPage;
