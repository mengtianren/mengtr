<template>
  <template v-if="fields.length > 0">
    <el-row>
      <el-col v-for="field in fields" :key="(field.name as string)" :span="field?.span || 24">
        <!-- 数组类型 -->
        <template v-if="field.type === 'array'">
          <el-form-item :label="field.label || field.name" v-if="shouldShowField(field, formData)">
            <el-button type="primary" @click="addArrayItem(field,fieldPath, field.name)">+ 添加</el-button>
          </el-form-item>


          <template v-for="(item, index) in getValue(formData, [...fieldPath, field.name]) || []" :key="index">
            <el-card :title="`${field.label || field.name} [${index}]`" size="small" style="margin-bottom: 8px;">
              <template v-for="subField in field.fields">
                <GcFormItem :disabled="disabled" v-if="shouldShowField(subField || field, formData)"
                  v-model:value="formData" :fields="[subField]" :fieldPath="[...fieldPath, field.name, `${index}`]" />
              </template>
              <el-button danger type="danger" @click="removeArrayItem(fieldPath, field.name, index)">删除</el-button>
            </el-card>
          </template>
        </template>

        <!-- 对象类型 -->
        <el-card v-else-if="field.type === 'object'" :title="field.label || field.name">

          <GcFormItem :disabled="disabled" v-if="shouldShowField(field, formData)" v-model:value="formData"
            :fields="field.fields" :fieldPath="[...fieldPath, field.name]" />
        </el-card>

        <!-- 基础类型 当值的类型为false 如果基础的disabled 为true 则禁用  如果config.disabled 为true 则隐藏 -->
        <template v-else-if="(!field.config?.disabled || false)">

          <el-form-item v-bind="field" :prop="[...fieldPath, `${field.name}`]"
            v-if="field.type && shouldShowField(field, formData)">
            <el-date-picker v-if="field.type.toLowerCase() === 'datepicker'"
              :modelValue="getValue(formData, [...fieldPath, field.name])" style="width:100%"
              @update:modelValue="e => setValue(field, [...fieldPath, field.name], e)" v-bind="(field.config as any)"
              :disabled="field.disabled || disabled" />
            <el-date-picker v-else-if="field.type.toLowerCase() === 'rangepicker'"
              :modelValue="getValue(formData, [...fieldPath, field.name])" style="width:100%"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-switch v-else-if="field.type.toLowerCase() === 'switch'"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-select v-else-if="field.type.toLowerCase() === 'select'"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-input v-else-if="field.type.toLowerCase() === 'input'"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-input v-else-if="field.type.toLowerCase() === 'textarea'" type="textarea"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-input-number v-else-if="field.type.toLowerCase() === 'number'"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <el-tree-select v-else-if="field.type.toLowerCase() === 'treeselect'"
              :modelValue="getValue(formData, [...fieldPath, field.name])"
              @update:modelValue="e => setValue(field,[...fieldPath, field.name], e)" :data="field.config?.treeData || []"
              :props="field.config?.fieldNames || { label: 'label', value: 'value', children: 'children' }"
              :check-strictly="field.config?.showCheckedStrategy ? true : false" v-bind="(field.config || {})"
              :disabled="field.disabled || disabled" />
            <component v-else-if="field.type.toLowerCase() === 'component' && (field as IComponentFormItem).component"
              :is="(field as IComponentFormItem).component" :value="getValue(formData, [...fieldPath, field.name])"
              v-model:formData="formData" @update:value="(e: any) => setValue(field,[...fieldPath, field.name], e)"
              v-bind="(field.config || {})" :disabled="field.disabled || disabled" />


          </el-form-item>
        </template>
      </el-col>
    </el-row>
  </template>
</template>



<script setup lang="ts">
import { computed } from 'vue';
import { ElFormItem, ElDatePicker, ElSwitch, ElSelect, ElInput, ElInputNumber, ElTreeSelect, ElCard, ElButton, ElRow, ElCol } from 'element-plus'

import type { IFormItem, IComponentFormItem } from '@mengtr/vue3-common/lib/types/types/table-page'
import { useFormItems } from '@mengtr/vue3-common'


defineOptions({ name: 'GcFormItem' })

const formData = defineModel<{ [key: string]: any }>('value', { required: true, default: () => ({}) })

const props = withDefaults(defineProps<{
  fields: IFormItem[],
  fieldPath: (string)[],
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