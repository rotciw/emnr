import axios from 'axios';
import API_URL from '../config';

// used to retrieve feide auth url
export const getFeideLogin = () => {
  return axios
    .get(`${API_URL}/auth/get_login/`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {});
};

// used to verify successful feide login
export const verifyFeideLogin = (code: string) => {
  return axios
    .get(`${API_URL}/auth/verify_token/`, {
      params: {
        code,
      },
    })
    .then(function (response) {
      localStorage.setItem('token', `Token ${response.data.token}`);
      localStorage.setItem('email', response.data.email);
      axios.defaults.headers.common.Authorization = `Token ${response.data.token}`;
      return { token: response.data.token, email: response.data.email };
    });
};

// fetch local token
export const getLocalToken = () => {
  let validated = false;
  if (localStorage.getItem('token') && getLocalEmail()) {
    const token = localStorage.getItem('token');
    const email = getLocalEmail();
    if (email)
    axios.defaults.headers.common.Authorization = `${token}`;
    validateToken(email!).then((res: boolean) => {
      validated = res
      if (!validated){
        localStorage.clear();
        window.history.pushState({}, '', '/login');
        window.location.reload();
      }
    });
    return token;
  }
};

export const validateToken = (email: string) => {
  return axios
    .get(`${API_URL}/auth/validate_token/`, {
      params: {
        email,
      },
    })
    .then(function (response) {
      console.log("response: " + response.data);
      if (response.data === 'True'){
        return true;
      } else {
        return false;
      }
    });
}

export const getLocalEmail = () => {
  if (localStorage.getItem('email')) {
    return localStorage.getItem('email');
  }
};
