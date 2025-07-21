import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 查询客户端管理列表
 * @param params 查询参数
 * @returns {Promise}
 */
export async function listClient(params) {
  const res = await request.get('/system/client/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询客户端管理详细
 * @param id 客户端ID
 * @returns {Promise}
 */
export async function getClient(id) {
  const res = await request.get('/system/client/' + id);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 新增客户端管理
 * @param data 客户端数据
 * @returns {Promise}
 */
export async function addClient(data) {
  const res = await request.post('/system/client', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改客户端管理
 * @param data 客户端数据
 * @returns {Promise}
 */
export async function updateClient(data) {
  const res = await request.put('/system/client', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除单个客户端
 * @param id 客户端ID
 * @returns {Promise}
 */
export async function delClient(id) {
  const res = await request.delete('/system/client/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除客户端
 * @param ids 客户端ID数组
 * @returns {Promise}
 */
export async function delClients(ids) {
  const res = await request.delete('/system/client/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 状态修改
 * @param clientId 客户端ID
 * @param status 状态值
 * @returns {Promise}
 */
export async function changeStatus(clientId, status) {
  const data = {
    clientId,
    status
  };
  const res = await request.put('/system/client/changeStatus', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出客户端数据
 * @param params 查询参数
 * @returns {Promise}
 */
export async function exportClient(params) {
  const res = await request({
    url: '/system/client/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `client_${Date.now()}.xlsx`);
}
