import request from '@/utils/request';
import { setToken } from '@/utils/token-util';
/**
 * 快捷登录
 */
export async function quickLogin(params) {
  const res = await request({
    url: '/auth/sso/quick/login',
    method: 'POST',
    data: params
  });
  if (res.data.code === 200) {
    setToken(res.data?.data?.access_token);

    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}
/**
 * 登录
 */
export async function login(data) {
  const res = await request.post(
    '/login',
    { ...data },
    {
      // const res = await request.post('/auth/sso/login', data, {
      headers: {
        isEncrypt: 'true' // 暂时注释掉
      }
    }
  );
  if (res.data.code === 200) {
    setToken(res.data?.token);
    return res.data;
  }
  return Promise.reject(res.data.msg);
}

/** 退出登录 */
export async function logout(data) {
  const res = await request.post('/logout', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 获取验证码
 */
export async function getCaptcha() {
  const res = await request.get('/captchaImage');
  if (res.data.code === 200) {
    return res;
  }
  return Promise.reject(res.data.msg);
}
/**
 * 获取验证码
 */
export async function getCodeImg() {
  const res = await request({
    url: '/auth/code',
    method: 'GET',
    headers: {
      isToken: false
    }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 获取手机验证码
 */
export async function sendSms(phone) {
  const res = await request.get(`auth/send/sms/${phone}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function appExupdatePwd(data) {
  const res = await request.post('system/appEx/updatePwd', data);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 * 登录环境配置信息
 */
export async function systemConfig(CLIENT_ID) {
  const res = await request.get(`/auth/config/${CLIENT_ID}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 * ukey登录
 */
export async function loginUkey(data) {
  const res = await request.post('/auth/ukey/login', data, {
    headers: {
      // isEncrypt: 'true'
    }
  });
  if (res.data.code === 200) {
    setToken(res.data?.data?.access_token);
    return res.data;
  }
  return res.data;
}

/**
 * 验证手机号
 */
export async function verifyPhone(phone) {
  const res = await request.get(`/auth/verifyPhone/${phone}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 * 忘记密码
 */
export async function forgotPassword(data) {
  const res = await request.post(`/auth/forgotPassword`, data, {
    headers: {
      // isEncrypt: 'true'
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 * 生成带参数的二维码
 */
export async function genQrCodeUrl(params) {
  const res = await request.get('/api/wx/mp/genQrCodeUrl', {
    params
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}
/**
 * 生成带参数的二维码
 */
export async function checkLogin(data) {
  const res = await request.get(
    `/api/wx/mp/checkLogin/${data.scene}/${data.clientId}`
  );
  if (res.data.code === 200) {
    if (res.data?.data?.access_token && res.data?.data?.sso_token) {
      setToken(res.data?.data?.access_token);
    }
    return res.data;
  }
  return res.data;
}

/**
 * 绑定手机号登录
 */
export async function bindLogin(data) {
  const res = await request.post(`/api/wx/mp/bindLogin`, data, {
    headers: {
      //isEncrypt: 'true'
    }
  });
  if (res.data.code === 200) {
    if (res.data?.data?.access_token && res.data?.data?.sso_token) {
      setToken(res.data?.data?.access_token);
    }
    return res.data;
  }
  return res.data;
}

/**
 * 绑定手机号登录-校验
 */
export async function check(data) {
  const res = await request.post(`/api/wx/mp/bindLogin/check`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}

/**
 * 解绑用户
 */
export async function unbindUser(data) {
  const res = await request.post(`/api/wx/mp/unbindUser`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}
