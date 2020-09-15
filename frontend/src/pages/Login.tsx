import React from 'react';
import styled from 'styled-components';
import FeideLogin from '../components/FeideLogin';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: 'center';
    height: '100%';
  `;
  return (
    <Wrapper>
      <FeideLogin />
    </Wrapper>
  );
};

export default Login;
