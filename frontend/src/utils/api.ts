import axios from 'axios';
import { API_URL } from '../config';

//used to retrieve feide auth url
export const getFeideLogin = () => {
  return axios
    .get(API_URL + '/auth/get_login/')
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {});
};

//used to verify successful feide login
export const verifyFeideLogin = (code: string) => {
  return axios
    .get(API_URL + '/auth/verify-token/', {
      params: {
        code: code,
      },
    })
    .then(function (response) {
      localStorage.setItem('token', 'Token ' + response.data.token);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Token ${response.data.token}`;
      return response.data.token;
    });
};

//used to verify if token is valid
export const hasToken = () => {
  if (!localStorage.getItem('token')) {
    return false;
  }
  return axios.get(API_URL + 'auth/validate-token/').then(function (response) {
    return response.data === 'False';
  });
};

//fetch local token
export const getLocalToken = () => {
  if (!!localStorage.getItem('token')) {
    return localStorage.getItem('token');
  }
};
