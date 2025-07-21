import request from '@/utils/request';
import { mapTree } from '@hnjing/zxzy-admin-plus/es';
import { toFormData } from '@/utils/common';
import { API_BASE_URL } from '@/config/setting';

/**
 * 获取当前登录用户的个人信息/权限/角色
 */
export async function getUserInfo() {
  const res = await request.get('/getInfo');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 获取当前登录用户的菜单
 */
export async function getUserMenu() {
  const res = await request.get('/getRouters');
  if (res.data.code === 200 && res.data.data) {
    const temp = res.data.data;
    // 一级菜单去掉父级
    temp.forEach((item, i) => {
      if (item.path === '/') {
        const child = item.children[0];
        temp[i] = {
          ...child,
          path: child.path?.startsWith?.('/') ? child.path : `/${child.path}`,
          hidden: item.hidden || child.hidden
        };
      }
    });
    // 修改图标
    return mapTree(temp, (item) => {
      const meta =
        (item.meta && typeof item.meta === 'string'
          ? JSON.parse(item.meta)
          : item.meta) || {};
      const temp = {
        ...item,
        meta: {
          ...meta,
          icon: meta.icon ? (ruoYiIcons[meta.icon] ?? meta.icon) : meta.icon
        }
      };
      return temp;
    });
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改当前登录用户的密码
 */
export async function updatePassword(data) {
  const res = await request.put('/system/user/profile/updatePwd', data, {
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    }
  });
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/** 若依默认菜单图标名称 */
export const ruoYiIcons = {
  system: 'SettingOutlined',
  user: 'UserOutlined',
  peoples: 'IdcardOutlined',
  'tree-table': 'AppstoreOutlined',
  tree: 'CityOutlined',
  post: 'SuitcaseOutlined',
  dict: 'BookOutlined',
  edit: 'ControlOutlined',
  message: 'MessageOutlined',
  log: 'LogOutlined',
  form: 'FileOutlined',
  logininfor: 'CalendarOutlined',
  monitor: 'DashboardOutlined',
  online: 'ConnectionOutlined',
  job: 'TimerOutlined',
  druid: 'FundOutlined',
  server: 'AnalysisOutlined',
  redis: 'ClusterOutlined',
  'redis-list': 'DatabaseOutlined',
  tool: 'AppstoreAddOutlined',
  build: 'FormOutlined',
  code: 'CodeOutlined',
  swagger: 'LinkOutlined',
  guide: 'LinkOutlined',
  '#': 'StarOutlined'
};
