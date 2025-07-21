/**
 * axios实例
 */
import axios from 'axios';
import { unref } from 'vue';
import { ElMessageBox } from 'element-plus/es';
import { API_BASE_URL, LAYOUT_PATH } from '@/config/setting';
import router from '@/router';
import { getToken, setToken } from './token-util';
import { logout, toURLSearch } from './common';
import { CLIENT_ID } from '@/config/setting';
import cache from '@/utils/cache';
import {
  encryptBase64,
  encryptWithAes,
  generateAesKey,
  decryptWithAes,
  decryptBase64
} from '@/utils/crypto';
import { encrypt, decrypt } from '@/utils/jsencrypt';

const encryptHeader = 'encrypt-key';

/** 创建axios实例 */
const service = axios.create({
  baseURL: API_BASE_URL
});

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加token到header
    const token = getToken();

    // 是否需要加密
    const isEncrypt = config.headers?.isEncrypt === 'true';

    // 是否需要防止数据重复提交
    const isRepeatSubmit = config.headers?.repeatSubmit === false;

    if (token && config.headers) {
      config.headers['Authorization'] = token;
      config.headers['ClientId'] = CLIENT_ID;
    }
    // get请求处理数组和对象类型参数
    if (config.method === 'get' && config.params) {
      config.url = toURLSearch(config.params, config.url);
      config.params = {};
    }
    if (
      !isRepeatSubmit &&
      (config.method === 'post' || config.method === 'put')
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime()
      };
      const sessionObj = cache.session.getJSON('sessionObj');
      if (
        sessionObj === undefined ||
        sessionObj === null ||
        sessionObj === ''
      ) {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 500; // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message);
          return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON('sessionObj', requestObj);
        }
      }
    }

    // 如果开启了参数加密
    if (import.meta.env.VITE_APP_ENCRYPT === 'true') {
      // 当开启参数加密
      if (isEncrypt && (config.method === 'post' || config.method === 'put')) {
        // 生成一个 AES 密钥
        const aesKey = generateAesKey();
        config.headers[encryptHeader] = encrypt(encryptBase64(aesKey));
        (config.headers['Content-Type'] = 'application/json;charset=UTF-8'), // 修改请求头
          (config.data =
            typeof config.data === 'object'
              ? encryptWithAes(JSON.stringify(config.data), aesKey)
              : encryptWithAes(config.data, aesKey));
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  (res) => {
    if (import.meta.env.VITE_APP_ENCRYPT === 'true') {
      // 加密后的 AES 秘钥
      const keyStr = res.headers[encryptHeader];
      // 加密
      if (keyStr != null && keyStr != '') {
        const data = res.data;
        // 请求体 AES 解密
        const base64Str = decrypt(keyStr);
        // base64 解码 得到请求头的 AES 秘钥
        const aesKey = decryptBase64(base64Str.toString());
        // aesKey 解码 data
        const decryptData = decryptWithAes(data, aesKey);
        // 将结果 (得到的是 JSON 字符串) 转为 JSON
        res.data = JSON.parse(decryptData);
      }
    }
    // 登录过期处理
    if (res.data?.code === 401) {
      const { path, fullPath } = unref(router.currentRoute);
      if (path == LAYOUT_PATH) {
        logout(true, void 0, router.push);
      } else if (path !== '/login') {
        ElMessageBox.close();
        ElMessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
          confirmButtonText: '重新登录',
          callback: (action) => {
            if (action === 'confirm') {
              logout(false, fullPath);
            }
          },
          type: 'warning',
          draggable: true
        });
      }
      return Promise.reject(new Error(res.data.msg));
    }
    // 续期token
    const newToken = res.headers['authorization'];
    if (newToken) {
      setToken(newToken);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
