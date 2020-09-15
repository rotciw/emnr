import React, { useState } from 'react';
import styled from 'styled-components';
import NTNU_LOGO from '../../assets/images/ntnu_logo.png';

import { LoginButton } from './Buttons';

const FeideLogin: React.FC = () => {
  return (
    <>
      <h1>Feide Login</h1>
      <LoginButton>Login</LoginButton>
    </>
  );
};

export default FeideLogin;
