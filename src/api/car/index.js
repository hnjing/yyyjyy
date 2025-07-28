import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 分页查询证书列表
 */
export async function pageCars(params) {
  const res = await request.get('/system/car/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加证书
 */
export async function addCar(data) {
  const res = await request.post('/system/car', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改证书
 */
export async function updateCar(data) {
  const res = await request.put('/system/car', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除证书
 */
export async function removeCar(id) {
  const res = await request.delete('/system/car/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除证书
 */
export async function removeCars(ids) {
  const res = await request.delete('/system/car/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出证书列表
 */
export async function exportCars(params) {
  const res = await request({
    url: '/system/car/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `Car_${Date.now()}.xlsx`);
}
