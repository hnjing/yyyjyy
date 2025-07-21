import request from '@/utils/request';

/**
 * 查询流程分类列表
 * @param query
 * @returns {*}
 */
export function listCategory(query) {
  return request({
    url: '/workflow/category/list',
    method: 'get',
    params: query
  });
}

/**
 * 查询流程分类详细
 * @param categoryId
 */
export function getCategory(categoryId) {
  return request({
    url: '/workflow/category/' + categoryId,
    method: 'get'
  });
}

/**
 * 新增流程分类
 * @param data
 */
export function addCategory(data) {
  return request({
    url: '/workflow/category',
    method: 'post',
    data: data
  });
}

/**
 * 修改流程分类
 * @param data
 */
export function updateCategory(data) {
  return request({
    url: '/workflow/category',
    method: 'put',
    data: data
  });
}

/**
 * 删除流程分类
 * @param categoryId
 */
export function delCategory(categoryId) {
  return request({
    url: '/workflow/category/' + categoryId,
    method: 'delete'
  });
}

/**
 * 获取流程分类树列表
 * @param query 流程实例id
 * @returns
 */
export function categoryTree(query) {
  return request({
    url: `/workflow/category/categoryTree`,
    method: 'get',
    params: query
  });
}
