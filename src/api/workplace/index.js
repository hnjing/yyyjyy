import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 首页接口
 */
export async function pageHomeDetail(params) {
  const res = await request.post('/system/homeDetail/stat', params);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 二维码详情接口
 * @param {*} params 
 * userId 
 * @returns 
 */
export async function getQrCodeInfo(params) {
  const res = await request.post('/system/homeDetail/qrCodeInfo', params);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}