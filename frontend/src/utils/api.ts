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

//used to verify if token is valid
export const hasToken = () => {
  if (!localStorage.getItem('token')) {
    return false;
  }
  return axios.get(API_URL + 'auth/validate_token/').then(function (response) {
    return response.data === 'False';
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

export const getMyCourses = () => {
  const token = getLocalToken();
  axios.defaults.headers.common['Authorization'] = `${token}`;
  return axios
    .get(API_URL + '/course/me/')
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {});
};
