export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {// path 支持为一个 url，必须要以 http 开头
        path: 'https://pro.ant.design/docs/getting-started-cn',
        target: '_blank', // 点击新窗口打开
        name: '文档',
      },
      {
        component: './404',
      },
    ],
  },

  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/paymentRecords',
    name: '图书借阅',
    icon: 'crown',
    component: './Payment',
  },
  {
    name: '图书管理',
    icon: 'table',
    path: '/lease',
    // component: './TableList',
    routes: [
      {path: '/lease/overview', name: '全部', icon: 'crow', component: './lease/overview'},
      {path: '/lease/westernArea', name: '外文图书', icon: 'crow', component: './lease/overview'},
      {path: '/lease/eastArea', name: '中文图书', icon: 'crow', component: './lease/overview'},
    ],
  },
  {
    path: '/paymentRecords1',
    name: '用户管理',
    icon: 'crown',
    component: './Payment',
  },
  // {
  //   path: '/paymentRecords',
  //   name: '缴费单记录',
  //   icon: 'crown',
  //   component: './Payment',
  // },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
