import React from 'react';
import Layout from 'styles/Layout';
import MyCoursesList from 'components/MyCoursesList';

interface MeProps {}

const MePage: React.FC<MeProps> = () => {
  return (
    <Layout padding='0 20%'>
      <MyCoursesList />
    </Layout>
  );
};

export default MePage;
