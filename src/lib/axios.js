import axios from 'axios';
import config from '../config';
import cookies from '../lib/cookies';

export const emailVerify = (email => axios.post(`${config.API_URL}/auth/sign-up/verify`, { email }));

export const signUp = (param) => axios.post(`${config.API_URL}/auth/sign-up`, { ...param });

export const signIn = (param) => axios.post(`${config.API_URL}/auth/sign-in`, { ...param });

export const boardList = (param) => {
  const { sortKey, searchString } = param;
  let queryString = '';
  if (sortKey && searchString) {
    queryString = `?sortKey=${sortKey}&searchString=${searchString}`;
  }
  else if (sortKey) {
    queryString = `?sortKey=${sortKey}`;
  }
  else if (searchString) {
    queryString = `?searchString=${searchString}`;
  }

  // const keys = Object.keys(param)
  // if (keys.length > 0) {
  //   keys.forEach((key, index) => {
  //     if (index === 0) queryString += '?'
  //     else queryString += '&'
  //     queryString += `${key}=${param[key]}`
  //   })
  // }

  return axios.get(`${config.API_URL}/boards${queryString}`);
}

export const board = (boardId) => axios.get(`${config.API_URL}/boards/${boardId}`);

export const boardListAnalyze = () => axios.get(`${config.API_URL}/boards/analysis`);


export const boardCreate = (param) => axios.post(`${config.API_URL}/boards`, { ...param }, { headers: {Authorization: `Bearer ${cookies.get('token')}`} });

export const boardUpdate = (boardId, param) => axios.patch(`${config.API_URL}/boards/${boardId}`, { ...param }, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardDelete = boardId => axios.delete(`${config.API_URL}/boards/${boardId}`, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardLike = (boardId) => axios.post(`${config.API_URL}/boards/${boardId}/like`, {}, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardLikeCancel = (boardId) => axios.delete(`${config.API_URL}/boards/${boardId}/like/cancel`, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardReport = (boardId, param) => axios.post(`${config.API_URL}/boards/${boardId}/report`, { ...param }, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardCommentCreate = (boardId, value) => axios.post(`${config.API_URL}/boards/${boardId}/comment`, { value }, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardCommentUpdate = (boardId, commentId, value) => axios.patch(`${config.API_URL}/boards/${boardId}/comment/${commentId}`, { value }, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardCommentDelete = (boardId, commentId) => axios.delete(`${config.API_URL}/boards/${boardId}/comment/${commentId}`, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});

export const boardCommentReport = (boardId, commentId, param) => axios.post(`${config.API_URL}/boards/${boardId}/comment/${commentId}/report`, { ...param }, { headers: {Authorization: `Bearer ${cookies.get('token')}`}});
