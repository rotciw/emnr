import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFeideLogin } from '../utils/api';
import NTNU_LOGO from '../assets/images/ntnu_logo.png';

import { LoginButton } from './Buttons';

const FeideLogin: React.FC = () => {
  const Wrapper = styled.div`
    border: 1px solid #ccc;
    padding: 50px;
    border-radius: 5px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: center;
  `;

  //TODO change to more semantic tag?
  const Title = styled.div`
    font-size: 25;
    font-weight: 200;
  `;

  const Logo = styled.img`
    width: 170px;
    margin: 0 auto;
  `;

  const [feideURI, setFeideURI] = useState<string>('');

  useEffect(() => {
    const fetchURL = async () => {
      const res = await getFeideLogin();
      setFeideURI(res);
    };
    fetchURL();
  }, []);

  console.log(feideURI);
  return (
    <Wrapper>
      <Title>TDT4290 Kundestyrt prosjekt - Gruppe 13</Title>
      <Logo src={NTNU_LOGO} />
      <LoginButton>Logg inn med Feide</LoginButton>
    </Wrapper>
  );
};

export default FeideLogin;
