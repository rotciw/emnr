import React from 'react';
import FeideLogin from '../components/FeideLogin';
import { CenteredFlexContainer, ShapeContainer } from 'styles/Containers';
import { Circle, BottomRightTriangle } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import { Layout } from 'styles/Layout';

interface MeProps {}

const MePage: React.FC<MeProps> = () => {
  return (
    <Layout padding='0 20%'>
      <p>Velkommen til min side.</p>
    </Layout>
  );
};

export default MePage;
