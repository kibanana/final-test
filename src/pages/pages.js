import Home from './Home';
import Signup from './Signup';
import Signin from './Signin';
import Signout from './Signout';
import BoardList from './BoardList';
import BoardView from './BoardView';
import Chat from './Chat';

//// name 삭제
export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/sign-up',
    component: Signup,
  },
  {
    path: '/sign-in',
    component: Signin,
  },
  {
    path: '/sign-out',
    component: Signout,
  },
  {
    path: '/boards',
    component: BoardList,
  },
  {
    path: '/board/:id',
    component: BoardView,
  },
  {
    path: '/chatting',
    component: Chat,
  },
];
