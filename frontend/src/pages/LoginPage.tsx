import React from 'react';
import FeideLogin from '../components/FeideLogin';
import { CenteredFlexContainer, ShapeContainer } from 'styles/Containers';
import { Circle, BottomRightTriangle } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme'

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  return (
    <CenteredFlexContainer>
      <FeideLogin />
      <ShapeContainer>
        <Circle color={defaultTheme.red} bottom='-7vmin' left='-10vmin' size='50vmin'/>
        <BottomRightTriangle color={defaultTheme.darkBlue} bottom='0' right='0' size='40vmin'/>
      </ShapeContainer>
    </CenteredFlexContainer>
  );
};

export default LoginPage;
