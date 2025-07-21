import request from '@/utils/request';
import { download, toFormData } from '@/utils/common';
import dayjs from 'dayjs';
// 查询字典类型列表
export async function listType(params) {
  const res = await request.get(`/system/dict/type/list`, { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 查询字典类型详细
export async function getType(dictId) {
  const res = await request.get(`/system/dict/type/${dictId}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 新增字典类型
export async function addType(data) {
  const res = await request.post(`/system/dict/typeEx`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 修改字典类型
export async function updateType(data) {
  const res = await request.put(`/system/dict/typeEx`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 删除字典类型
export async function delType(dictId) {
  const res = await request.delete(`/system/dict/typeEx/${dictId}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 刷新字典缓存
export async function refreshCache() {
  const res = await request.delete(`/system/dict/type/refreshCache`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 获取字典选择框列表
export async function optionselect() {
  const res = await request.get(`/system/dict/type/optionselect`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
/**
 * 导出
 */
export async function exportProject(params) {
  const res = await request({
    url: 'system/dict/type/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  download(res.data, `字典管理_${dayjs(new Date()).format('YYYYMMDDHHMMssSSS')}.xlsx`);
}
