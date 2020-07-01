import Home from './Home';
import Signup from './Signup';
import Signin from './Signin';
import Signout from './Signout';
import BoardList from './BoardList';
import BoardView from './BoardView';
import BoardAnalysis from './BoardAnalysis';
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
    exact: true,
  },
  {
    path: '/board/:id',
    component: BoardView,
  },
  // board create, update, delete는 별도의 페이지 이동 없이 처리한다.
  {
    path: '/boards/analysis',
    component: BoardAnalysis,
  },
  {
    path: '/chatting',
    component: Chat,
  },
];
