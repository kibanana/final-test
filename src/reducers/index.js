import { combineReducers } from 'redux';
import { USER } from '../actions';
import cookies from '../lib/cookies';

const userStore = (state = { currentUser: cookies.get('token') ? {} : null }, action) => {
  switch (action.type) {
    case USER: 
      return {
        ...state,
        currentUser: action.currentUser,
      }
    default:
      return state;
  }
};

export default combineReducers({
  userStore,
});
