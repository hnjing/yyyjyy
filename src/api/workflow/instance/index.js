import request from '@/utils/request';

/**
 * 查询运行中实例列表
 * @param query
 * @returns {*}
 */
export function pageByRunning(query) {
  return request({
    url: '/workflow/instance/pageByRunning',
    method: 'get',
    params: query
  });
}

/**
 * 查询已完成实例列表
 * @param query
 * @returns {*}
 */
export function pageByFinish(query) {
  return request({
    url: '/workflow/instance/pageByFinish',
    method: 'get',
    params: query
  });
}

/**
 * 通过业务id获取历史流程图
 */
export function flowImage(businessId) {
  return request({
    url: `/workflow/instance/flowImage/${businessId}` + '?t' + Math.random(),
    method: 'get'
  });
}

/**
 * 分页查询当前登录人单据
 * @param query
 * @returns {*}
 */
export function pageByCurrent(query) {
  return request({
    url: '/workflow/instance/pageByCurrent',
    method: 'get',
    params: query
  });
}

/**
 * 撤销流程
 * @param data 参数
 * @returns
 */
export function cancelProcessApply(data) {
  return request({
    url: `/workflow/instance/cancelProcessApply`,
    method: 'put',
    data: data
  });
}

/**
 * 获取流程变量
 * @param instanceId 实例id
 * @returns
 */
export function instanceVariable(instanceId) {
  return request({
    url: `/workflow/instance/instanceVariable/${instanceId}`,
    method: 'get'
  });
}

/**
 * 删除
 * @param instanceIds 流程实例id
 * @returns
 */
export function deleteByInstanceIds(instanceIds) {
  return request({
    url: `/workflow/instance/deleteByInstanceIds/${instanceIds}`,
    method: 'delete'
  });
}

/**
 * 作废流程
 * @param data 参数
 * @returns
 */
export function invalid(data) {
  return request({
    url: `/workflow/instance/invalid`,
    method: 'post',
    data: data
  });
}
