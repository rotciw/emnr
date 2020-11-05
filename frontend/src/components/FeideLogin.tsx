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

const MottoText = styled.p`
  font-family: gilroyxbold;
  font-style: italic;
  color: ${({ theme }) => theme.darkBlue};
  max-width: 30vmax;
  margin: -10px auto 3vh auto;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 14px;
  }
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
      <MottoText>Hjelp til å velge NTNU-emner, for og av studenter</MottoText>
      <LoginButton clickHandler={handleFeideLogin}>Logg på (Feide)</LoginButton>
    </Wrapper>
  );
};

export default FeideLogin;
