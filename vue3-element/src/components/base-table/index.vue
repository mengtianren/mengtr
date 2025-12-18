<template>
  <div class="gc-table">
    <el-table :data="tableData" style="width: 100%" :rowKey="rowKey"
      :row-class-name="({ rowIndex }) => (rowIndex % 2 === 1 ? 'table-striped' : '')" :border="bordered">
      <el-table-column v-for="item in centerColumns" :key="item.dataIndex || item.key"
        :prop="item.dataIndex || item.key" :label="item.title" :width="item.width">
        <template #default="{ row, column, $index }">
          <slot name="bodyCell" :column="column" :record="row" :text="row[column.property]" :index="$index">
            <template v-if="item?.customRender">
              {{ item.customRender({ text: row[column.property] || '' }) }}
            </template>
           <template v-else>
             {{ row[column.property] || '' }}
           </template>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="gc-table-pagination">
      <el-pagination v-if="pagination" v-model:current-page="pagination.current" :page-size="pagination.pageSize"
        size="default" layout="slot, prev, pager, next, sizes" :total="pagination.total"
        :page-sizes="pagination.pageSizeOptions" @size-change="e => pagination.onChange(pagination.current, e)"
        @current-change="e => pagination.onChange(e, pagination.pageSize)">
        <template #default>总条数：{{ pagination.total || 0 }}</template>
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { unref, computed } from 'vue'
import { useTable, useTreeTable } from '@mengtr/vue3-common'
import type { IProps } from '@mengtr/vue3-common/lib/types/types/table-props'
import type { GetData, TreeData } from '@mengtr/vue3-common/lib/types/types/table-type'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

interface ColumnProps {
  title: string,
  dataIndex?: string,
  key?: string,
  width: number | string
  align?: string
  customRender?: (h: any) => any
}


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
const init = computed(() => props.options.init)
const initParam = computed(() => props.options.initParam)



const columns = computed<ColumnProps[]>(() => props.options.columns || [])
const centerColumns = computed<ColumnProps[]>(() => columns.value.map((s) => {
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

const { tableData, onSearch, onReset, onSetParam, search, pagination } = useNewtable()

defineExpose({
  onSearch,
  onReset,
  onSetParam,
  search,
  pagination
})
</script>
<style scoped lang="less">
.gc-table-pagination {
  margin-top: 24px;
  text-align: right;
}
</style>
