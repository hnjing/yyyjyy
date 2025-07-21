import { reactive } from 'vue';

/**
 * 表单数据hook
 * @param initValue 默认值
 */
export function useFormData(initValue) {
  /** 表单数据 */
  const form = reactive({ ...initValue });

  /** 重置为初始值 */
  const resetFields = (field) => {
    const keys = Object.keys(form);
    if (typeof field === 'string' && field) {
      if (keys.includes(field)) {
        form[field] = initValue ? initValue[field] : void 0;
      }
      return;
    }
    keys.forEach((key) => {
      form[key] = initValue ? initValue[key] : void 0;
    });
  };

  /** 赋值不改变字段 */
  const assignFields = (data, excludes) => {
    Object.keys(form).forEach((key) => {
      if (!excludes?.includes?.(key)) {
        form[key] = data[key];
      }
    });
  };

  /** 赋值某字段 */
  const setFieldValue = (field, value) => {
    form[field] = value;
  };

  const result = [form, resetFields, assignFields, setFieldValue];
  // 支持对象解构以兼容旧版
  Object.assign(result, {
    form,
    resetFields,
    assignFields
  });
  return result;
}
