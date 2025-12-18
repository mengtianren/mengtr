<template>
  <template v-if="fields.length > 0">
      <a-row> 
       <a-col v-for="field in fields" :key="(field.name as string)" :span="field?.span || 24" >
      <!-- 数组类型 -->
      <template v-if="field.type === 'array'">
        <a-form-item :label="field.label || field.name" v-if="shouldShowField(field, formData)">
          <a-button type="dashed" @click="addArrayItem(fieldPath, field.name)">+ 添加</a-button>
        </a-form-item>


        <template v-for="(item, index) in getValue(formData, [...fieldPath, field.name]) || []" :key="index">
          <a-card :title="`${field.label || field.name} [${index}]`" size="small" style="margin-bottom: 8px;">
            <template v-for="subField in field.fields">
              <GcFormItem :disabled="disabled" v-if="shouldShowField(subField || field, formData)"
                v-model:value="formData" :fields="[subField]" :fieldPath="[...fieldPath, field.name, index]" />
            </template>
            <a-button danger type="link" @click="removeArrayItem(fieldPath, field.name, index)">删除</a-button>
          </a-card>
        </template>
      </template>

      <!-- 对象类型 -->
      <a-card v-else-if="field.type === 'object'" :title="field.label || field.name">

        <GcFormItem :disabled="disabled" v-if="shouldShowField(field, formData)" v-model:value="formData"
          :fields="field.fields" :fieldPath="[...fieldPath, field.name]" />
      </a-card>
    
      <!-- 基础类型 当值的类型为false 如果基础的disabled 为true 则禁用  如果config.disabled 为true 则隐藏 -->
      <template v-else-if="(!field.config?.disabled || false)">
      
        <a-form-item v-bind="field" :name="[...fieldPath, field.name]"
          v-if="field.type && shouldShowField(field, formData)">

          <a-date-picker v-if="field.type.toLowerCase() === 'datepicker'"
            :value="getValue(formData, [...fieldPath, field.name])"
            style="width:100%"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as any)"
            :disabled="field.disabled || disabled" />
          <a-range-picker v-else-if="field.type.toLowerCase() === 'rangepicker'"
            :value="getValue(formData, [...fieldPath, field.name])"
            style="width:100%"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as any)"
            :disabled="field.disabled || disabled" />
          <a-switch v-else-if="field.type.toLowerCase() === 'switch'"
            :checked="getValue(formData, [...fieldPath, field.name])"
            @update:checked="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as SwitchProps)"
            :disabled="field.disabled || disabled" />
          <a-select v-else-if="field.type.toLowerCase() === 'select'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as SelectProps)"
            :disabled="field.disabled || disabled" />
          <a-input v-else-if="field.type.toLowerCase() === 'input'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as InputProps)"
            :disabled="field.disabled || disabled" />
          <a-textarea v-else-if="field.type.toLowerCase() === 'textarea'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as InputProps)"
            :disabled="field.disabled || disabled" />
          <a-input-number v-else-if="field.type.toLowerCase() === 'number'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as InputNumberProps)"
            :disabled="field.disabled || disabled" />
          <a-tree-select v-else-if="field.type.toLowerCase() === 'treeselect'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config as TreeSelectProps)"
            :disabled="field.disabled || disabled" />
          <EditorPage v-else-if="field.type.toLowerCase() === 'editor'"
            :value="getValue(formData, [...fieldPath, field.name])"
            @update:value="e => setValue([...fieldPath, field.name], e)" v-bind="(field.config || {})"
            :disabled="field.disabled || disabled" />
          <component v-else-if="field.type.toLowerCase() === 'component' && (field as IComponentFormItem).component"
            :is="(field as IComponentFormItem).component" :value="getValue(formData, [...fieldPath, field.name])"
            v-model:formData="formData" @update:value="(e: any) => setValue([...fieldPath, field.name], e)"
            v-bind="(field.config as TreeSelectProps)" :disabled="field.disabled || disabled" />


        </a-form-item>
      </template>
      </a-col>
      </a-row>
  </template>
</template>



<script setup lang="ts">
import { watch } from 'vue';
import {
  Input as AInput,
  FormItem as AFormItem,
  Switch as ASwitch,
  InputNumber as AInputNumber,
  TreeSelect as ATreeSelect,
  Select as ASelect,
  Textarea as ATextarea,
  Button as AButton,
  Card as ACard,
  DatePicker as ADatePicker,
  RangePicker as ARangePicker,
  Row as ARow,
  Col as ACol
} from 'ant-design-vue'
import { cloneDeep } from 'lodash-es';
import EditorPage from './editor/index.vue'

import type { InputProps } from 'ant-design-vue/es/input'
import type { SelectProps } from 'ant-design-vue/es/select'
import type { InputNumberProps } from 'ant-design-vue/es/input-number'
import type { SwitchProps } from 'ant-design-vue/es/switch'
import type { TreeSelectProps } from 'ant-design-vue/es/tree-select'
import type { IFormItem, IComponentFormItem } from '@mengtr/vue3-common/lib/types/types/table-page'




defineOptions({ name: 'GcFormItem' })

const formData = defineModel<{ [key: string]: any }>('value', { required: true, default: () => ({}) })

const props = withDefaults(defineProps<{
  fields: IFormItem[],
  fieldPath: (string | number)[],
  disabled: boolean
}>(), { disabled: false })

// 取值
const getValue = (obj: any, keys: (string | number)[]): any => {
  try {
    return keys.reduce((acc, key) => acc?.[key], obj)
  } catch {
    return undefined
  }
}

// 赋值
const setValue = (keys: (string | number)[], value: any): void => {
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      acc[key] = value
    } else {
      if (!(key in acc) || typeof acc[key] !== 'object') acc[key] = {}
      return acc[key]
    }
    return acc
  }, formData.value)
}

// 添加数组项
const addArrayItem = (path: (string | number)[], name: string) => {
  const fullPath = [...path, name]
  const current = getValue(formData.value, fullPath)
  const newItem = {}
  if (Array.isArray(current)) {
    current.push(newItem)
  } else {
    setValue(fullPath, [newItem])
  }
}

// 判断字段是否显示
const shouldShowField = (field: IFormItem, formData: { [key: string]: any }) => {
  if (field.dependsOn) {
    const dependentValue = getValue(formData, field.dependsOn.path);
    if (typeof field.dependsOn.value === 'string' && typeof dependentValue === 'string') {
      return dependentValue.toLowerCase() === field.dependsOn.value.toLowerCase() || dependentValue.toUpperCase() === field.dependsOn.value.toUpperCase();
    } else {
      return dependentValue === field.dependsOn.value
    }


  }
  return true;
}

// 删除数组项
const removeArrayItem = (path: (string | number)[], name: string, index: number) => {
  const fullPath = [...path, name]
  const current = getValue(formData.value, fullPath)
  if (Array.isArray(current)) {
    current.splice(index, 1)
  }
}

// 检查并触发字段的watch回调
const checkAndTriggerWatchCallbacks = (fields: IFormItem[], previousData: any = {}) => {
  fields.forEach(field => {
    // 检查当前字段是否配置了watch
    if (field.watch && field.watch.key && field.watch.callback) {
      const watchKeys = Array.isArray(field.watch.key) ? field.watch.key : [field.watch.key];

      // 检查是否有任何一个被监听的字段值发生了变化
      const hasChanged = watchKeys.some(key => {
        const currentValue = getValue(formData.value, [key]);
        const previousValue = getValue(previousData, [key]);
        return currentValue !== previousValue;
      });

      // 如果有变化，触发回调
      if (hasChanged) {
        // 确保回调是一个函数
        if (typeof field.watch.callback === 'function') {
          // 传入当前表单数据和字段信息，方便在回调中操作
          field.watch.callback({
            formData: formData.value,
            field,
          });
        }
      }
    }

    // 递归处理嵌套的字段配置
    if ((field.type === 'object' || field.type === 'array') && field.fields) {
      checkAndTriggerWatchCallbacks(field.fields, previousData);
    }
  });
};


// 监听formData变化，触发watch回调
let previousFormData = { ...formData.value };
watch(
  () => formData.value,
  (newVal) => {
    // 检查并触发所有配置了watch的字段回调
    checkAndTriggerWatchCallbacks(props.fields, previousFormData);
    // 更新之前的数据引用
    previousFormData = cloneDeep(newVal);
  },
  { deep: true, immediate: true }
);

</script>

<style scoped lang="less"></style>