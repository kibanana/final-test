export const USER = 'USER';

export const UserBinding = user => {
  return {
    type: USER,
    currentUser: user,
  };
};
