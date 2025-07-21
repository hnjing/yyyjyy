import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 分页查询活动列表
 */
export async function pageActivitys(params) {
  const res = await request.get('/system/activity/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加岗位
 */
export async function addActivity(data) {
  const res = await request.post('/system/activity', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改岗位
 */
export async function updateActivity(data) {
  const res = await request.put('/system/activity', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除岗位
 */
export async function removeActivity(id) {
  const res = await request.delete('/system/activity/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除岗位
 */
export async function removeActivitys(ids) {
  const res = await request.delete('/system/activity/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出岗位列表
 */
export async function exportActivitys(params) {
  const res = await request({
    url: '/system/activity/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `activity_${Date.now()}.xlsx`);
}

/**
 * 查询岗位列表
 */
export async function listActivitys(params) {
  const res = await request.get('/system/activity/optionselect', {
    params
  });
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
