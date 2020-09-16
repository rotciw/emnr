import React from 'react';
import styled from 'styled-components';
import FeideLogin from '../components/FeideLogin';

interface LoginProps {}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: 'center';
  height: '100%';
`;

const Login: React.FC<LoginProps> = () => {
  return (
    <Wrapper>
      <FeideLogin />
    </Wrapper>
  );
};

export default Login;
