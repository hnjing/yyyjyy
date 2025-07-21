import request from '@/utils/request';
import { download, toFormData } from '@/utils/common';
import dayjs from 'dayjs';
// 查询字典数据列表
export async function listData(params) {
  const res = await request.get(`/system/dict/data/list`, { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 查询字典数据详细
export async function getData(dictCode) {
  const res = await request.get(`/system/dict/data/${dictCode}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 根据字典类型查询字典数据信息
export async function getDicts(dictType) {
  const res = await request.get(`/system/dict/data/type/${dictType}`);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 新增字典数据
export async function addData(data) {
  const res = await request.post(`/system/dict/dataEx`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 修改字典数据
export async function updateData(data) {
  const res = await request.put(`/system/dict/dataEx`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
// 删除字典数据
export async function delData(dictCode) {
  const res = await request.delete(`/system/dict/dataEx/${dictCode}`);
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
    url: 'system/dict/data/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  download(res.data, `字典数据_${dayjs(new Date()).format('YYYYMMDDHHMMssSSS')}.xlsx`);
}
