/**
 * 登录用户状态管理
 */
import { defineStore } from 'pinia';
import { toTree, mapTree, isExternalLink } from '@hnjing/zxzy-admin-plus/es';
import { getUserInfo, getUserMenu } from '@/api/layout';
import menuList from '../../router/modules/index';

export const useUserStore = defineStore('user', {
  state: () => ({
    /** 当前登录用户的信息 */
    info: null,
    /** 当前登录用户的菜单 */
    menus: null,
    /** 当前登录用户的权限 */
    authorities: [],
    /** 当前登录用户的角色 */
    roles: [],
    /** 字典数据缓存 */
    dicts: {},
    /** 菜单切换 */
    menusSwitch: false
  }),
  actions: {
    /**
     * 请求登录用户的个人信息/权限/角色/菜单
     */
    async fetchUserInfo() {
      // todo:模版使用的是固定菜单，项目使用时注意使用接口数据
      // const { menus, homePath } = formatMenus(menuList);
      // this.setMenus(menus);

      const result = await getUserInfo().catch((e) => console.error(e));
      if (!result) {
        return {};
      }
      // 用户信息
      this.setInfo(result.user);
      // 用户权限
      this.authorities = result.permissions;
      // 用户角色
      this.roles = result.roles;
      // // 用户菜单
      const userMenu = await getUserMenu().catch((e) => console.error(e));
      if (!userMenu) {
        return {};
      }
      const { menus, homePath } = formatMenus(userMenu);
      this.setMenus(menus);
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setInfo(value) {
      this.info = value;
    },
    /**
     * 更新菜单数据
     */
    setMenus(menus) {
      this.menus = menus;
    },
    /**
     * 菜单切换
     */
    setMenusSwitch(value) {
      this.menusSwitch = value;
    },
    /**
     * 更新菜单的徽章
     * @param path 菜单地址
     * @param value 徽章值
     * @param type 徽章类型
     */
    setMenuBadge(path, value, type) {
      this.menus = mapTree(this.menus, (m) => {
        if (path === m.path) {
          const meta = m.meta || {};
          return {
            ...m,
            meta: {
              ...meta,
              props: {
                ...meta.props,
                badge: value == null ? void 0 : { value, type }
              }
            }
          };
        }
        return m;
      });
    },
    /**
     * 更新字典数据
     */
    setDicts(value, code) {
      if (code == null) {
        this.dicts = value;
        return;
      }
      this.dicts[code] = value;
    }
  }
});

export function formatMenus(data, childField = 'children') {
  let homePath;
  let homeTitle;
  const menus = mapTree(
    data,
    (item, _index, parent) => {
      const meta = item.meta;
      const { path, rPath } = formatPath(item.path, parent?.path, item.query);
      const menu = {
        path: path,
        component: formatComponent(item.component),
        meta: {
          hide: !!item.hidden,
          keepAlive: !meta.noCache,
          routePath: rPath,
          ...meta
        }
      };
      const children = item[childField]
        ? item[childField].filter((d) => !(d.meta?.hide ?? d.hide))
        : void 0;
      if (!children?.length) {
        if (!homePath && menu.path && !isExternalLink(menu.path)) {
          homePath = menu.path;
          homeTitle = menu.meta?.title;
        }
      } else {
        const childPath = children[0].path;
        if (childPath) {
          if (!menu.redirect) {
            menu.redirect = childPath;
          }
          if (!menu.path) {
            menu.path = childPath.substring(0, childPath.lastIndexOf('/'));
          }
        }
      }
      if (!menu.path) {
        console.error('菜单path不能为空且要唯一:', item);
        return;
      }
      return menu;
    },
    childField
  );
  return { menus, homePath, homeTitle };
}

/**
 * 组件路径处理以兼容若依默认数据
 * @param component 组件路径
 */
function formatComponent(component) {
  if (!component || component === 'Layout') {
    return;
  }
  if (isExternalLink(component)) {
    return component;
  }
  return component.startsWith('/') ? component : `/${component}`;
}

/**
 * 菜单地址处理以兼容若依
 * @param mPath 菜单地址
 * @param pPath 父级菜单地址
 * @param query 路由参数
 */
function formatPath(mPath, pPath, query) {
  if (!mPath || isExternalLink(mPath)) {
    return { path: mPath };
  }
  const path = !pPath || mPath.startsWith('/') ? mPath : `${pPath}/${mPath}`;
  if (query) {
    try {
      const params = new URLSearchParams(JSON.parse(query)).toString();
      if (params) {
        return { path: `${path}?${params}`, rPath: path };
      }
    } catch (e) {
      console.error(e);
    }
  }
  return { path };
}
