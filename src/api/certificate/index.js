import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 分页查询证书列表
 */
export async function pageCertificates(params) {
  const res = await request.get('/system/certificate/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加证书
 */
export async function addCertificate(data) {
  const res = await request.post('/system/certificate', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改证书
 */
export async function updateCertificate(data) {
  const res = await request.put('/system/certificate', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除证书
 */
export async function removeCertificate(id) {
  const res = await request.delete('/system/certificate/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除证书
 */
export async function removeCertificates(ids) {
  const res = await request.delete('/system/certificate/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出证书列表
 */
export async function exportCertificates(params) {
  const res = await request({
    url: '/system/certificate/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `certificate_${Date.now()}.xlsx`);
}
