export default [
  {
    path: '/index',
    component: '/workplace/index',
    meta: { title: '首页', icon: 'IconProHomeOutlined' }
  },
  {
    path: '/car-manage',
    component: '/car-manage/index',
    meta: {
      title: '车辆管理',
      icon: 'IconProIdcardOutlined',
      hide: false
    }
  },
  {
    path: '/activities-manage',
    component: '/activities-manage/index',
    meta: {
      title: '活动管理',
      icon: 'IconProDashboardOutlined',
      hide: false
    }
  },
  {
    path: '/cert-manage',
    component: '/cert-manage/index',
    meta: {
      title: '证书管理',
      icon: 'IconProCopyOutlined',
      hide: false
    }
  },
  {
    path: '/system',
    meta: {
      hide: false,
      keepAlive: true,
      title: '系统管理',
      icon: 'IconProSettingOutlined',
      noCache: false,
      link: null
    },
    redirect: 'user',
    children: [
      {
        path: '/system/user',
        component: '/system/user/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '用户管理',
          icon: 'IconProUserOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/role',
        component: '/system/role/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '角色管理',
          icon: 'IconProIdcardOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/menu',
        component: '/system/menu/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '菜单管理',
          icon: 'IconProAppstoreOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/dept',
        component: '/system/dept/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '部门管理',
          icon: 'IconProCityOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/post',
        component: '/system/post/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '岗位管理',
          icon: 'IconProSuitcaseOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/dict',
        component: '/system/dict/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '字典管理',
          icon: 'IconProBookOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/config',
        component: '/system/config/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '参数设置',
          icon: 'IconProControlOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/notice',
        component: '/system/notice/index',
        meta: {
          hide: false,
          keepAlive: true,
          title: '通知公告',
          icon: 'IconProMessageOutlined',
          noCache: false,
          link: null
        }
      },
      {
        path: '/system/log',
        component: '/ParentView',
        meta: {
          hide: false,
          keepAlive: true,
          title: '日志管理',
          icon: 'IconProLogOutlined',
          noCache: false,
          link: null
        },
        redirect: 'operlog',
        children: [
          {
            path: '/system/log/operlog',
            component: '/monitor/operlog/index',
            meta: {
              hide: false,
              keepAlive: true,
              title: '操作日志',
              icon: 'IconProFileOutlined',
              noCache: false,
              link: null
            }
          },
          {
            path: '/system/log/logininfor',
            component: '/monitor/logininfor/index',
            meta: {
              hide: false,
              keepAlive: true,
              title: '登录日志',
              icon: 'IconProCalendarOutlined',
              noCache: false,
              link: null
            }
          }
        ]
      }
    ]
  }
];
