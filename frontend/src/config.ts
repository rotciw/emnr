const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://emnr-tdt4252.herokuapp.com'
    : 'http://localhost:8000';

export default API_URL;
