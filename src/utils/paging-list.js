/**
 * 匹配返回表格数据格式
 * @param {*} dataList
 * @param {*} list
 * @param {*} count
 * @returns
 */
export function setPageList(dataList, list, count) {
  let dd = JSON.parse(JSON.stringify(dataList));
  let ss = {
    list: dd[list],
    count: dd[count]
  };
  return ss;
}
