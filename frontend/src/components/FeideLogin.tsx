import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFeideLogin } from '../utils/api';
import emnrLoginLogo from '../assets/images/emnr_short.svg';
import { LoginButton } from '../styles/Buttons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 15vh 0 0 0;
`;

const Logo = styled.img`
  width: 25vmax;
  margin: 0 auto;
  user-select: none;
`;

const FeideLogin: React.FC = () => {
  const [feideURI, setFeideURI] = useState<string>('');

  useEffect(() => {
    const fetchURL = async () => {
      const res = await getFeideLogin();
      setFeideURI(res);
    };
    fetchURL();
  }, []);

  const handleFeideLogin = () => {
    if (feideURI) {
      window.location.assign(feideURI);
    }
  };

  return (
    <Wrapper>
      <Logo src={emnrLoginLogo} />
      <LoginButton clickHandler={handleFeideLogin}>
        Logg på (Feide)
      </LoginButton>
    </Wrapper>
  );
};

export default FeideLogin;
