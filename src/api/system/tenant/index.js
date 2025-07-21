import request from '@/utils/request';
import { download, toFormData, checkDownloadRes } from '@/utils/common';

/**
 * 查询租户列表
 * @param {Object} query 查询参数
 * @returns {Promise}
 */
export async function listTenant(query) {
  const res = await request.get('/system/tenant/list', { params: query });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询所有客户端
 * @param {Object} query 查询参数
 * @returns {Promise}
 */
export async function listClientAll(query) {
  const res = await request.get('/system/client/list/all', { params: query });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 租户客户端关联新增/修改
 * @param {Object} data 关联数据
 * @returns {Promise}
 */
export async function updateClientAndTenant(data) {
  const res = await request.post('/system/tenant/client/link', data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 租户关联客户端回显
 * @param {string|number} id 租户ID
 * @returns {Promise}
 */
export async function getTenantLinkList(id) {
  const res = await request.get('/system/tenant/link/list/' + id);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询租户详细
 * @param {string|number} id 租户ID
 * @returns {Promise}
 */
export async function getTenant(id) {
  const res = await request.get('/system/tenant/' + id);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 新增租户
 * @param {Object} data 租户数据
 * @returns {Promise}
 */
export async function addTenant(data) {
  const res = await request.post('/system/tenant', data, {
    headers: {
      isEncrypt: false,
      repeatSubmit: false
    }
  });
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改租户
 * @param {Object} data 租户数据
 * @returns {Promise}
 */
export async function updateTenant(data) {
  const res = await request.put('/system/tenant', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 租户状态修改
 * @param {string|number} id 租户ID
 * @param {string|number} tenantId 租户编号
 * @param {string} status 状态
 * @returns {Promise}
 */
export async function changeTenantStatus(id, tenantId, status) {
  const data = {
    id,
    tenantId,
    status
  };
  const res = await request.put('/system/tenant/changeStatus', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除租户
 * @param {string|number|Array} id 租户ID
 * @returns {Promise}
 */
export async function delTenant(id) {
  const res = await request.delete(
    '/system/tenant/' + (Array.isArray(id) ? id.join() : id)
  );
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 动态切换租户
 * @param {string|number} tenantId 租户编号
 * @returns {Promise}
 */
export async function dynamicTenant(tenantId) {
  const res = await request.get('/system/tenant/dynamic/' + tenantId);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 清除动态租户
 * @returns {Promise}
 */
export async function dynamicClear() {
  const res = await request.get('/system/tenant/dynamic/clear');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 同步租户套餐
 * @param {string|number} tenantId 租户编号
 * @param {string|number} packageId 套餐ID
 * @returns {Promise}
 */
export async function syncTenantPackage(tenantId, packageId) {
  const data = {
    tenantId,
    packageId
  };
  const res = await request.get('/system/tenant/syncTenantPackage', {
    params: data
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 同步租户字典
 * @returns {Promise}
 */
export async function syncTenantDict() {
  const res = await request.get('/system/tenant/syncTenantDict');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出租户数据
 * @param params 查询参数
 * @returns {Promise}
 */
export async function exportTenant(params) {
  const res = await request({
    url: '/system/tenant/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  await checkDownloadRes(res);
  download(res.data, `tenant_${Date.now()}.xlsx`);
}
