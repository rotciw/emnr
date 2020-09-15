import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { verifyFeideLogin } from '../utils/api';
import { Redirect } from 'react-router-dom';

interface VerifyLoginProps {}

const VerifyLogin: React.FC<VerifyLoginProps> = () => {
  useEffect(() => {
    const verifyLogin = async () => {
      const queryString = window.location.search;
      const queryParams = qs.parse(queryString);
      const code = queryParams['?code'] as string;
      try {
        const response = await verifyFeideLogin(code);
        console.log('logged in');
      } catch (e) {
        console.log(e);
        console.log('login failed');
      }
    };
    verifyLogin();
  });
  return <div>Hei fra verifylogin</div>;
};

export default VerifyLogin;
