import { ElMessageBox } from 'element-plus';
import { logout as sendLogout } from '@/api/login/index.js';
import { removeToken } from '@/utils/token-util';

/**
 * 退出登录
 * @param route 是否使用路由跳转
 * @param from 登录后跳转的地址
 * @param push 路由跳转方法
 */
export function logout(route, from, push) {
  sendLogout().then(() => {
    removeToken();
    if (route && push) {
      push({
        path: '/login',
        query: from ? { from: encodeURIComponent(from) } : void 0
      });
      return;
    }
    // 这样跳转避免再次登录重复注册动态路由, hash 路由模式使用 location.reload();
    const BASE_URL = import.meta.env.BASE_URL;
    const url = BASE_URL + 'login';
    location.replace(from ? `${url}?from=${encodeURIComponent(from)}` : url);
  });
}

/**
 * 显示登录过期退出重新登录弹窗
 * @param from 登录后跳转的地址
 * @param push 路由跳转方法
 */
export function showLogoutConfirm(from, push) {
  ElMessageBox.close();
  ElMessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
    confirmButtonText: '重新登录',
    callback: (action) => {
      if (action === 'confirm') {
        logout(!!push, from, push);
      }
    },
    type: 'warning',
    draggable: true
  });
}

/**
 * 下载文件
 * @param url 文件地址
 * @param name 文件名
 */
export function downloadUrl(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 下载文件
 * @param data 二进制数据
 * @param name 文件名
 * @param type 文件类型
 */
export function download(data, name, type) {
  const blob = new Blob([data], { type: type || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  downloadUrl(url, name);
  URL.revokeObjectURL(url);
}

/**
 * 参数转url字符串
 * @param params 参数
 * @param url 需要拼接参数的地址
 */
export function toURLSearch(params, url) {
  if (typeof params !== 'object' || params == null) {
    return '';
  }
  const result = transformParams(params)
    .map((d) => `${encodeURIComponent(d[0])}=${encodeURIComponent(d[1])}`)
    .join('&');
  if (!url) {
    return result;
  }
  return (url.includes('?') ? `${url}&` : `${url}?`) + result;
}

/**
 * 参数转表单数据
 * @param params 参数
 */
export function toFormData(params) {
  const formData = new FormData();
  if (typeof params !== 'object' || params == null) {
    return formData;
  }
  transformParams(params).forEach((d) => {
    formData.append(d[0], d[1]);
  });
  return formData;
}

/**
 * get请求处理数组和对象类型参数
 * @param params 参数
 */
export function transformParams(params) {
  const result = [];
  if (params != null && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value != null && value !== '') {
        if (typeof value === 'object' && !isBlobFile(value)) {
          getObjectParamsArray(value).forEach((item) => {
            result.push([`${key}${item[0]}`, item[1]]);
          });
        } else {
          result.push([key, value]);
        }
      }
    });
  }
  return result;
}

/**
 * 对象转参数数组
 * @param obj 对象
 */
export function getObjectParamsArray(obj) {
  const result = [];
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value != null && value !== '') {
      const name = `[${key}]`;
      if (typeof value === 'object' && !isBlobFile(value)) {
        getObjectParamsArray(value).forEach((item) => {
          result.push([`${name}${item[0]}`, item[1]]);
        });
      } else {
        result.push([name, value]);
      }
    }
  });
  return result;
}

/**
 * 判断是否是文件
 * @param obj 对象
 */
export function isBlobFile(obj) {
  return obj != null && (obj instanceof Blob || obj instanceof File);
}

/**
 * 切换主题过渡动画
 * @param callback 执行的方法
 * @param el 过渡动画触发元素
 * @param isOut 是否是退出方向
 * @param isBody 是否在 body 上执行动画
 */
export function doWithTransition(callback, el, isOut, isBody) {
  if (!el || typeof document.startViewTransition !== 'function') {
    callback().catch((e) => console.error(e));
    return;
  }
  document.documentElement.classList.add('disabled-transition');
  el.classList.add('view-transition-trigger');
  el.style.setProperty('view-transition-name', 'view-transition-trigger');
  if (isBody) {
    document.body.style.setProperty('view-transition-name', 'body');
  }
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  document.startViewTransition(callback).ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];
    const anim = document.documentElement.animate(
      { clipPath: isOut ? [...clipPath].reverse() : clipPath },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isOut
          ? `::view-transition-old(${isBody ? 'body' : 'root'})`
          : `::view-transition-new(${isBody ? 'body' : 'root'})`
      }
    );
    anim.onfinish = () => {
      document.body.style.removeProperty('view-transition-name');
      el.style.removeProperty('view-transition-name');
      el.classList.remove('view-transition-trigger');
      document.documentElement.classList.remove('disabled-transition');
    };
  });
}

/**
 * url地址下载文件
 * @param url url地址
 * @param name 文件名
 */
export function urlDownload(url, name) {
  const baseApiImg = localStorage.getItem('baseApiImg');
  // let uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL + url;

  let uploadUrl = `${baseApiImg}profile/download/${url}`;
  let fileName = `${name}_${dayjs(new Date()).format(
    'YYYYMMDDHHMMssSSS'
  )}.xlsx`;
  const x = new XMLHttpRequest();
  x.open('GET', uploadUrl, true);
  x.responseType = 'blob';
  x.onload = function () {
    const uploadUrl = window.URL.createObjectURL(x.response);
    const a = document.createElement('a');
    a.href = uploadUrl;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
    // 然后移除
  };
  x.send();
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
}

/**
 * Get date range shortcuts for element-plus date picker
 * @param {Array} types 需要返回的快捷方式类型
 * @param {string} format 返回的时间格式，默认为 "YYYY-MM-DD HH:mm"
 * @returns {Array} Array of shortcut objects
 */
export function getDateShortcuts(types, format = 'YYYY-MM-DD HH:mm') {
  const shortcuts = {
    today: {
      text: '今天',
      value: () => {
        const today = new Date();
        return [dayjs(today).format(format), dayjs(today).format(format)];
      }
    },
    thisWeek: {
      text: '本周',
      value: () => {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() + 1); // 设置为本周一
        const end = new Date(now);
        end.setDate(now.getDate() + (5 - now.getDay())); // 设置为本周五
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    thisMonth: {
      text: '本月',
      value: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    lastWeek: {
      text: '上周',
      value: () => {
        const now = new Date();
        const day = now.getDay();
        const daysToSubtract = day === 0 ? 6 : day - 1 + 7;

        const start = new Date(now);
        start.setDate(now.getDate() - daysToSubtract);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    // 上一月
    lastMonth: {
      text: '上月',
      value: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    thisQuarter: {
      text: '本季度',
      value: () => {
        const now = new Date();
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), currentQuarter * 3, 1);
        const end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    lastWorkDay: {
      text: '最近工作日',
      value: () => {
        const lastWorkDay = getLastWorkDay();
        return [
          dayjs(lastWorkDay).format(format),
          dayjs(lastWorkDay).format(format)
        ];
      }
    },
    nearlyMonth: {
      text: '最近一个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 1);
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    },
    lastThreeMonths: {
      text: '最近三个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        return [dayjs(start).format(format), dayjs(end).format(format)];
      }
    }
  };
  // 设置默认值为所有快捷方式的key
  const typeKeys = types || Object.keys(shortcuts);

  return typeKeys.map((type) => shortcuts[type]);
}

/**
 * 格式化日期
 * @param {Date|string} date 日期对象或日期字符串
 * @param {string} format 日期格式，默认为 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format);
}

export function disabledDate(time) {
  const day = time.getDay();
  // 禁用周末（星期六和星期天）
  return day === 6 || day === 0; // 在JavaScript中，0代表星期天，6代表星期六
}

export function getLastWorkDay() {
  let today = new Date(); // 获取当前日期
  today.setHours(0, 0, 0, 0); // 将时间设置为当天开始时间，避免时区问题

  let yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // 得到昨天的日期

  // 循环直到找到工作日
  while (disabledDate(yesterday)) {
    yesterday.setDate(yesterday.getDate() - 1); // 如果是周末，则继续往前找
  }

  return yesterday; // 返回Date对象
}
export function formatYMD(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * 格式化数字，添加千位分隔符
 * @param {number} num 需要格式化的数字
 * @param {boolean} useK 是否使用 "K" 格式
 * @returns {string} 格式化后的字符串
 */
export function formatNumberWithCommas(num, useK = false) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '暂无数据';
  }
  if (useK && num >= 1000) {
    const kValue = (num / 1000).toFixed(0);
    return kValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'K';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 检查下载文件的请求结果
 * @param res 请求结果
 */
export async function checkDownloadRes(res) {
  if (res.headers['content-type'].startsWith('application/json')) {
    const json = await res.data.text();
    return Promise.reject(
      new Error(JSON.parse(json).msg || '系统未知错误，请反馈给管理员')
    );
  }
  return true;
}
