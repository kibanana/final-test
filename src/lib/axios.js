import axios from 'axios';
import config from '../config';

export const emailVerify = (email => {
  return axios.post(`${config.API_URL}/auth/sign-up/verify`, {
    email,
  });
});

export const signUp = (param) => {
  return axios.post(`${config.API_URL}/auth/sign-up`, {
    ...param,
  });
};

export const signIn = (param) => {
  return axios.post(`${config.API_URL}/auth/sign-in`, {
    ...param,
  });
};