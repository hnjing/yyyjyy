import request from '@/utils/request';

/**
 * 分页查询字典数据
 */
export async function pageDictionaryData(params) {
  const res = await request.get('/system/dictionary-data/page', { params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询字典数据列表
 */
export async function listDictionaryData(params) {
  const res = await request.get(`/system/dict/data/type/${params.dictCode}`);
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加字典数据
 */
export async function addDictionaryData(data) {
  const res = await request.post('/system/dictionary-data', data);
  if (res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改字典数据
 */
export async function updateDictionaryData(data) {
  const res = await request.put('/system/dictionary-data', data);
  if (res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除字典数据
 */
export async function removeDictionaryData(id) {
  const res = await request.delete('/system/dictionary-data/' + id);
  if (res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除字典数据
 */
export async function removeDictionaryDataBatch(data) {
  const res = await request.delete('/system/dictionary-data/batch', { data });
  if (res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
