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
    .get(API_URL + '/auth/verify_token/', {
      params: {
        code: code,
      },
    })
    .then(function (response) {
      localStorage.setItem('token', 'Token ' + response.data.token);
      localStorage.setItem('email', response.data.email);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Token ${response.data.token}`;
      return { token: response.data.token, email: response.data.email };
    });
};

//fetch local token
export const getLocalToken = () => {
  if (!!localStorage.getItem('token')) {
    return localStorage.getItem('token');
  }
};

export const getLocalEmail = () => {
  if (!!localStorage.getItem('email')) {
    return localStorage.getItem('email');
  }
};
