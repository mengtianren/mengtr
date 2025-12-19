<template>
  <template v-if="fields.length > 0">
    <a-row>
      <a-col v-for="field in fields" :key="(field.name as string)" :span="field?.span || 24">
        <!-- 数组类型 -->
        <template v-if="field.type === 'array'">
          <a-form-item :label="field.label || field.name" v-if="shouldShowField(field, formData)">
            <a-button type="dashed" @click="addArrayItem(field, fieldPath, field.name)">+ 添加</a-button>
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
              :value="getValue(formData, [...fieldPath, field.name])" style="width:100%"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as any)"
              :disabled="field.disabled || disabled" />
            <a-range-picker v-else-if="field.type.toLowerCase() === 'rangepicker'"
              :value="getValue(formData, [...fieldPath, field.name])" style="width:100%"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as any)"
              :disabled="field.disabled || disabled" />
            <a-switch v-else-if="field.type.toLowerCase() === 'switch'"
              :checked="getValue(formData, [...fieldPath, field.name])"
              @update:checked="e => setValue(field, [...fieldPath, field.name], e)"
              v-bind="(field.config as SwitchProps)" :disabled="field.disabled || disabled" />
            <a-select v-else-if="field.type.toLowerCase() === 'select'"
              :value="getValue(formData, [...fieldPath, field.name])"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as SelectProps)"
              :disabled="field.disabled || disabled" />
            <a-input v-else-if="field.type.toLowerCase() === 'input'"
              :value="getValue(formData, [...fieldPath, field.name])"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as InputProps)"
              :disabled="field.disabled || disabled" />
            <a-textarea v-else-if="field.type.toLowerCase() === 'textarea'"
              :value="getValue(formData, [...fieldPath, field.name])"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as InputProps)"
              :disabled="field.disabled || disabled" />
            <a-input-number v-else-if="field.type.toLowerCase() === 'number'"
              :value="getValue(formData, [...fieldPath, field.name])"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)"
              v-bind="(field.config as InputNumberProps)" :disabled="field.disabled || disabled" />
            <a-tree-select v-else-if="field.type.toLowerCase() === 'treeselect'"
              :value="getValue(formData, [...fieldPath, field.name])"
              @update:value="e => setValue(field, [...fieldPath, field.name], e)"
              v-bind="(field.config as TreeSelectProps)" :disabled="field.disabled || disabled" />
            <component v-else-if="field.type.toLowerCase() === 'component' && (field as IComponentFormItem).component"
              :is="(field as IComponentFormItem).component" :value="getValue(formData, [...fieldPath, field.name])"
              v-model:formData="formData" @update:value="(e: any) => setValue(field, [...fieldPath, field.name], e)"
              v-bind="(field.config as TreeSelectProps)" :disabled="field.disabled || disabled" />


          </a-form-item>
        </template>
      </a-col>
    </a-row>
  </template>
</template>



<script setup lang="ts">
import { computed } from 'vue';
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

import type { InputProps } from 'ant-design-vue/es/input'
import type { SelectProps } from 'ant-design-vue/es/select'
import type { InputNumberProps } from 'ant-design-vue/es/input-number'
import type { SwitchProps } from 'ant-design-vue/es/switch'
import type { TreeSelectProps } from 'ant-design-vue/es/tree-select'
import type { IFormItem, IComponentFormItem } from '@mengtr/vue3-common/lib/types/types/table-page'
import { useFormItems } from '@mengtr/vue3-common'


defineOptions({ name: 'GcFormItem' })

const formData = defineModel<{ [key: string]: any }>('value', { required: true, default: () => ({}) })

const props = withDefaults(defineProps<{
  fields: IFormItem[],
  fieldPath: (string | number)[],
  disabled: boolean
}>(), { disabled: false })

// 使用useFormItems hook
const { getValue, setValue, addArrayItem, removeArrayItem, shouldShowField } = useFormItems(
  formData,
  computed(() => props.fields),
  computed(() => props.fieldPath),
);

</script>

<style scoped lang="less"></style>