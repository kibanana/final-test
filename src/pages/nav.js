/////////
export default [
  {
    name: 'Home',
    path: '/',
  },
  {
    path: '/sign-up',
    name: '회원가입',
    invisibleBeforeAuth: false,
  },
  {
    path: '/sign-in',
    name: '로그인',
    invisibleBeforeAuth: false,
  },
  {
    path: '/sign-out',
    name: '로그아웃',
    invisibleBeforeAuth: true,
  },
  {
    path: '/boards',
    name: '게시판',
  },
  {
    path: '/boards/analysis',
    name: '통계',
  },
  {
    path: '/chat',
    name: '채팅',
  },
];
