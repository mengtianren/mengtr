<template>
  <div class="gc-table">
    <a-table :pagination="pagination" :dataSource="tableData" :columns="centerColumns" size="small" :rowKey="rowKey"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : '')" :scroll="scroll"
      :bordered="bordered">
      <template #bodyCell="{ column, record, text, index }">
        <slot name="bodyCell" :column="column" :record="record" :text="text" :index="index"></slot>
      </template>
      <template v-if="tableData.length > 0" #summary>
        <slot name="summary"></slot>
      </template>
    </a-table>

  </div>
</template>

<script setup lang="ts">
import { unref,computed } from 'vue'
import { useTable,useTreeTable } from '@mengtr/vue3-common'
import type { IProps } from '@mengtr/vue3-common/lib/types/types/table-props'
import type { GetData, TreeData } from '@mengtr/vue3-common/lib/types/types/table-type'
import { Table as ATable } from 'ant-design-vue'
import { ColumnProps } from "ant-design-vue/es/table";

defineOptions({
  name: "BaseTable"
})
const props = withDefaults(defineProps<{ options: IProps<GetData | TreeData>, type: 1 | 2 }>(), {
  options: () => ({}) as IProps<GetData | TreeData>,
  type: 1
})


/**
 * 表格组件
 * @param options 表格配置项
 * @returns 表格组件实例
 * @description 表格组件用于展示数据列表，支持分页、排序、筛选等功能。
 * @param options.columns 表格列配置项
 * @param options.data 表格数据获取函数，返回 Promise 类型，包含分页数据
 * @param options.initParam 初始化参数，用于表格数据获取函数
 * @param options.rowKey 表格行键，用于唯一标识每一行数据
 * @param options.bordered 是否显示边框
 * @param options.init 是否初始化表格数据
 * @param options.scroll 表格滚动配置项
 */

const bordered = computed(() => props.options.bordered)
const rowKey = computed(() => props.options.rowKey)
const scroll = computed(() => props.options.scroll)
// const data = computed(() => props.options.data)
const init = computed(() => props.options.init)
const initParam = computed(() => props.options.initParam)



const columns = computed<ColumnProps<any>[]>(() => props.options.columns || [])
const centerColumns = computed<ColumnProps<any>[]>(() => columns.value.map((s) => {
  if (s.align) return s
  return { ...s, align: 'center' }
}))



const useNewtable = () => {
  if (props.type === 1) {
    return useTable(
    props.options.data as GetData,
    unref(init),
    unref(initParam))
  }
  return useTreeTable(
    props.options.data as TreeData,
    unref(init),
    unref(initParam))
}


const { tableData, onSearch, onReset, onSetParam, search, pagination } = useNewtable(
)

defineExpose({
  onSearch,
  onReset,
  onSetParam,
  search,
  pagination
})



</script>
