import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 查询租户套餐列表
 * @param {Object} query 查询参数
 * @returns {Promise}
 */
export async function listTenantPackage(query) {
  const res = await request.get('/system/tenant/package/list', {
    params: query
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询租户套餐下拉选列表
 * @returns {Promise}
 */
export async function selectTenantPackage() {
  const res = await request.get('/system/tenant/package/selectList');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询租户套餐详细
 * @param {string|number} packageId 套餐ID
 * @returns {Promise}
 */
export async function getTenantPackage(packageId) {
  const res = await request.get('/system/tenant/package/' + packageId);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 租户套餐菜单树结构
 * @param {string|number} packageId 套餐ID
 * @returns {Promise}
 */
export async function tenantPackageMenuTreeselect(packageId) {
  const res = await request.get(
    '/system/menu/tenantPackageMenuTreeselect/' + packageId
  );
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 新增租户套餐
 * @param {Object} data 套餐数据
 * @returns {Promise}
 */
export async function addTenantPackage(data) {
  const res = await request.post('/system/tenant/package', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改租户套餐
 * @param {Object} data 套餐数据
 * @returns {Promise}
 */
export async function updateTenantPackage(data) {
  const res = await request.put('/system/tenant/package', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 租户套餐状态修改
 * @param {string|number} packageId 套餐ID
 * @param {string} status 状态
 * @returns {Promise}
 */
export async function changePackageStatus(packageId, status) {
  const data = {
    packageId,
    status
  };
  const res = await request.put('/system/tenant/package/changeStatus', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除租户套餐
 * @param {string|number|Array} packageId 套餐ID
 * @returns {Promise}
 */
export async function delTenantPackage(packageId) {
  const res = await request.delete(
    '/system/tenant/package/' +
      (Array.isArray(packageId) ? packageId.join() : packageId)
  );
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出租户套餐
 * @param {Object} query 查询参数
 * @returns {Promise}
 */

export async function exportTenantPackage(params) {
  const res = await request({
    url: '/system/tenant/package/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `role_${Date.now()}.xlsx`);
}
