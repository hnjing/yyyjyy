import request from '@/utils/request';
// 修改配置显示页数
export async function updateUserSetting(params) {
  const res = await request.get(`/system/userEx/updateUserSetting`, { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return res.data;
}
// 关键词联想
export async function associate(data) {
  const res = await request.post(`/system/general/associate`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 上传文件
 * @param file 文件
 */
export async function uploadFile(file, config) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post('/common/upload', formData, config);
  if (res.data.code === 200 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
// 留痕
export async function logList(data) {
  const res = await request.post(`/log/ops/query`, data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(res.data.msg);
}
