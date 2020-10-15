import React from 'react';
import FeideLogin from '../components/FeideLogin';
import { CenteredFlexContainer, ShapeContainer } from 'styles/Containers';
import { Circle, BottomRightTriangle } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import { Layout } from 'styles/Layout';
import { MyCoursesList } from 'components/MyCoursesList'

interface MeProps {}

const MePage: React.FC<MeProps> = () => {
  return (
    <Layout padding='0 20%'>
      <MyCoursesList />
    </Layout>
  );
};

export default MePage;
