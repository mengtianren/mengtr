import { watch, Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { IFormItem } from '../types/table-page';

/**
 * 表单字段处理 Hook
 * 用于处理表单字段的获取值、设置值、数组操作、条件显示等逻辑
 */
export const useFormItems = (
  formData: Ref<{ [key: string]: any }>,
  fields: Ref<IFormItem[]>,
  fieldPath: Ref<(string | number)[]>,
) => {
  // 取值
  const getValue = (obj: any, keys: (string | number)[]): any => {
    try {
      return keys.reduce((acc, key) => acc?.[key], obj);
    } catch {
      return undefined;
    }
  };

  // 赋值
  const setValue = (field: IFormItem, keys: (string | number)[], value: any): void => {
    const oldValue = getValue(formData.value, keys);
    
    // 只有当值真正变化时才更新和调用callback
    if (oldValue !== value) {
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value;
        } else {
          if (!(key in acc) || typeof acc[key] !== 'object') acc[key] = {};
          return acc[key];
        }
        return acc;
      }, formData.value);
      
      if (field.callback && typeof field.callback === 'function') {
        field.callback(formData.value, field, oldValue, value);
      }
    }
  };

  // 添加数组项
  const addArrayItem = (field: IFormItem, path: (string | number)[], name: string) => {
    const fullPath = [...path, name];
    const current = getValue(formData.value, fullPath);
    const newItem = {};
    if (Array.isArray(current)) {
      current.push(newItem);
    } else {
      setValue(field, fullPath, [newItem]);
    }
  };

  // 判断字段是否显示
  const shouldShowField = (field: IFormItem, formDataValue: { [key: string]: any }) => {
    if (field.dependsOn) {
      const dependentValue = getValue(formDataValue, field.dependsOn.path);
      if (typeof field.dependsOn.value === 'string' && typeof dependentValue === 'string') {
        return dependentValue.toLowerCase() === field.dependsOn.value.toLowerCase() || 
               dependentValue.toUpperCase() === field.dependsOn.value.toUpperCase();
      } else {
        return dependentValue === field.dependsOn.value;
      }
    }
    return true;
  };

  // 删除数组项
  const removeArrayItem = (path: (string | number)[], name: string, index: number) => {
    const fullPath = [...path, name];
    const current = getValue(formData.value, fullPath);
    if (Array.isArray(current)) {
      current.splice(index, 1);
    }
  };

  // 检查并触发字段的watch回调
  const checkAndTriggerWatchCallbacks = (fieldsList: IFormItem[], previousData: any = {}) => {
    fieldsList.forEach(field => {
      // 获取当前字段值
      const currentValue = getValue(formData.value, [...fieldPath.value, field.name]);
      const oldValue = getValue(previousData, [...fieldPath.value, field.name]);
      
      // 只有当字段值变化且配置了callback时才调用
      if (field.callback && typeof field.callback === 'function' && currentValue !== oldValue) {
        field.callback(formData.value, field, oldValue, currentValue);
      }
      
      // 递归处理嵌套的字段配置
      if ((field.type === 'object' || field.type === 'array') && field.fields) {
        checkAndTriggerWatchCallbacks(field.fields, previousData);
      }
    });
  };

  // 监听formData变化，触发watch回调
  let previousFormData = cloneDeep(formData.value);
  watch(
    () => formData.value,
    (newVal) => {
      // 检查并触发所有配置了watch的字段回调
      checkAndTriggerWatchCallbacks(fields.value, previousFormData);
      // 更新之前的数据引用
      previousFormData = cloneDeep(newVal);
    },
    { deep: true, immediate: true }
  );

  return {
    getValue,
    setValue,
    addArrayItem,
    removeArrayItem,
    shouldShowField,
    checkAndTriggerWatchCallbacks
  };
};
