import React from 'react';
import FeideLogin from '../components/FeideLogin';
import { CenteredFlexContainer, ShapeContainer } from 'styles/Containers';
import { Circle, BottomRightTriangle } from 'styles/Shapes';

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  return (
    <CenteredFlexContainer>
      <FeideLogin />
      <ShapeContainer>
        <Circle color='#E63946' bottom='-7vmin' left='-10vmin' size='50vmin'/>
        <BottomRightTriangle color='#1D3557' bottom='0' right='0' size='40vmin'/>
      </ShapeContainer>
    </CenteredFlexContainer>
  );
};

export default LoginPage;
