<template>
  <!--  <a-card>-->
  <div class="gc-search">
    <a-form :colon="false">
      <a-row :gutter="24">
        <a-col v-for="(propValue, index) in searchOptions" :key="index" :md="propValue.span ||  optionsSpan || 6" :sm="24">
          <a-form-item :label="propValue.label">
            <a-input-number v-if="propValue.type.toLowerCase() === 'number'"
              v-model:value.trim="queryParam[propValue.name]" :max="99999999" :placeholder="'请输入' + propValue.label"
              :controls="false" style="width: 100%" />
            <a-input v-if="propValue.type.toLowerCase() === 'string'" v-model:value.trim="queryParam[propValue.name]"
              :placeholder="'请输入' + propValue.label" />
            <a-date-picker v-else-if="propValue.type.toLowerCase() === 'datapicker'"
              v-model:value="queryParam[propValue.name]" :picker="getPicker(getPickerProp(propValue))"
              :show-time="getShowTime(getPickerProp(propValue))" :format="getFormat(getPickerProp(propValue))"
              :value-format="getFormat(getPickerProp(propValue))" style="width: 100%" />

            <a-range-picker v-else-if="propValue.type.toLowerCase() === 'rangepicker'"
              v-model:value="queryParam[propValue.name]" :picker="getPicker(getPickerProp(propValue))"
              :show-time="getShowTime(getPickerProp(propValue))" :format="getFormat(getPickerProp(propValue))"
              :value-format="getFormat(getPickerProp(propValue))" style="width: 100%" />
            <a-select v-else-if="propValue.type.toLowerCase() === 'select'" v-model:value="queryParam[propValue.name]"
              :placeholder="'请选择' + propValue.label" :options="getOptionsProps(propValue)" />
            <a-tree-select v-else-if="propValue.type.toLowerCase() === 'treeselect'"
              v-model:value="queryParam[propValue.name]" :max-tag-count="1" :show-checked-strategy="SHOW_PARENT"
              :tree-data="[
                {
                  label: '全部',
                  value: 'tree-all',
                  children: getOptionsProps(propValue)
                }
              ]" tree-checkable tree-default-expand-all allow-clear :placeholder="'请选择' + propValue.label"
              tree-node-filter-prop="label" />
          </a-form-item>
        </a-col>
        <a-col :md="optionsSpan || 6" :sm="24">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" @click="onSearch()" :icon="h(SearchOutlined)">查询</a-button>
              <a-button @click="onReset" :icon="h(RedoOutlined)">重置</a-button>
              <a-button v-if="enableCreate" type="primary" class="create" :icon="h(PlusOutlined)"
                @click="onCreate">新增</a-button>
              <a-button v-if="enableExport" type="primary" @click="onExport()">导出</a-button>
              <a-button v-if="enableImport" type="primary" @click="onImport()">导入</a-button>
              <slot name="button"></slot>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <!--    </a-card>-->
</template>
<script setup lang="ts">
import { ref, computed, watchEffect, h } from 'vue'
import {
  TreeSelect as ATreeSelect,
  Button as AButton,
  Form as AForm,
  Input as AInput,
  DatePicker as ADatePicker,
  Select as ASelect,
  RangePicker as ARangePicker,
  Row as ARow,
  Col as aCol, FormItem as AFormItem, Space as ASpace,
  InputNumber as AInputNumber,
} from 'ant-design-vue'
import { SearchOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { isArray } from 'lodash-es'
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface'
import type { TSearchOption, IRangePickerSearchField, TDatePicker, ISearch } from "@mengtr/vue3-common/lib/types/types/table-page"
//  '../../types/table-page'

defineOptions({
  name: 'GcSearch',
})

interface IQueryParam {
  [key: string]: any
}


const SHOW_PARENT = ATreeSelect.SHOW_PARENT

/**
 * 搜索组件
 * @param options 搜索配置项
 * @returns 搜索组件实例
 * @description 搜索组件用于展示搜索表单，支持文本输入、日期选择、下拉选择等功能。
 * @param options.searchOptions 搜索选项配置项
 * @param options.enableExport 是否启用导出功能
 * @param options.enableImport 是否启用导入功能
 * @param options.enableCreate 是否启用新增功能
 */
const props = withDefaults(defineProps<{ options: ISearch }>(), {
  options: () => ({
    searchOptions: [] as TSearchOption[],
    enableExport: false,
    enableImport: false,
    enableCreate: false,
    span: 6
  })
})
const searchOptions = computed(() => props.options.searchOptions)
const enableExport = computed(() => props.options.enableExport)
const enableImport = computed(() => props.options.enableImport)
const enableCreate = computed(() => props.options.enableCreate)
const optionsSpan = computed(() => props.options.span || 6)

const emits = defineEmits(['search', 'reset', 'create', 'import', 'export'])

/**搜索的内容 */
const queryParam = ref<IQueryParam>({})



/** 填写的内容 */
const getQueryParam = computed(() => {
  const param: IQueryParam = {}
  const rangeArr: IRangePickerSearchField[] = searchOptions.value.filter((s: TSearchOption) => s.type === 'rangepicker')

  Object.keys(queryParam.value).forEach((key: string) => {
    if (isArray(queryParam.value[key]) && queryParam.value[key].find((s) => s === 'tree-all')) {
      // 不做任何处理
    } else if (queryParam.value[key] !== null && queryParam.value[key] !== undefined) {
      const isRange = rangeArr.find(s => s.name === key)
      if (isRange) {
        const [start, end] = queryParam.value[key] || []
        param[isRange.config.startKey] = start
        param[isRange.config.endKey] = end
      } else {
        param[key] = queryParam.value[key]
      }
      // 当字段为数组 且字段包含tree-all时删除tree-all
    }
  })
  return param
})







const getPickerProp = (propValue: TSearchOption) => {
  if (
    propValue.type === 'datapicker' ||
    propValue.type === 'rangepicker'
  ) {
    return propValue.picker
  }
  return undefined
}
const getOptionsProps = (propValue: TSearchOption) => {
  if (
    propValue.type === 'select' ||
    propValue.type === 'treeselect'
  ) {
    return propValue.options
  }
  return []
}


/** 显示类型 */
const getPicker = (picker?: TDatePicker): PickerMode => {
  if (picker === 'hour' || !picker) {
    return 'date'
  } else {
    return picker
  }
}

/**是否显示时间 */
const getShowTime = (picker: string | undefined) => {
  return picker === 'hour' ? { format: 'HH:mm:ss' } : false
}

/**时间相关 */
const getFormat = (picker: string | undefined) => {
  switch (picker) {
    case 'hour':
      return 'YYYY-MM-DD HH:mm:ss'
    case 'date':
      return 'YYYY-MM-DD'
    case 'month':
      return 'YYYY-MM'
    case 'year':
      return 'YYYY'
    default:
      return 'YYYY-MM-DD'
  }
}

/** 重置 */
const onReset = (obj = {}) => {
  queryParam.value = { ...obj }
  const general = searchOptions.value || []
  general.forEach((s: TSearchOption) => {
    if (s.type.toLowerCase() === 'treeselect') {
      queryParam.value[s.name] = ['tree-all']
    }
  })
  emits('reset', getQueryParam.value)
}
/**搜索 默认type= true 会清空所有搜索条件   false 为不清空 */
const onSearch = (type = true) => {
  console.log(getQueryParam.value)
  emits('search', getQueryParam.value, type)
}
/**导出 */
const onExport = () => {
  console.log('导出')
  emits('export', getQueryParam.value)
}
/**导入 */
const onImport = () => {
  console.log('导入')
  emits('import', getQueryParam.value)
}

/**新增 */
const onCreate = () => {
  emits('create')
}
/** 设置 搜素框默认值
 * type = true 会清空所有搜索条件   false 为不清空
 */
const onSetParam = (obj = {}, type = true) => {
  queryParam.value = { ...queryParam.value, ...obj }
  onSearch(type)
}

watchEffect(() => {
  queryParam.value = {}
  const general = searchOptions.value || []
  general.forEach((s: TSearchOption) => {
    if (s.type.toLowerCase() === 'treeselect') {
      queryParam.value[s.name] = ['tree-all']
    }
  })
})

defineExpose({
  onSetParam,
  onSearch,
  onReset,
  onCreate,
  onImport,
  onExport
})
</script>

<script lang="ts">
export default {
  name: 'BaseSearch'
}
</script>

<style lang="less" scoped></style>
