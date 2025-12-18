<template>
  <div class="gc-page">
    <GcSearch :options="GcSearchOptions" :ref="el => GcSearchRef = el" @search="onGcSearchSearch"
      @reset="onGcSearchReset" @create="onGcSearchCreate" @import="onGcSearchImport" @export="onGcSearchExport">
      <template #button>
        <slot name="button"></slot>
      </template>
    </GcSearch>
    <GcTable :type="type" :options="GcTableOptions" :ref="el => GcTableRef = el" @searchOnSearch="onGcTableSearch">
      <template #bodyCell="{ column, record, text, index }">
        <slot name="bodyCell" :column="column" :record="record" :text="text" :index="index"></slot>
      </template>
      <template #action="{ record }">
        <slot name="action" :record="record"></slot>
      </template>
      <template #actionBefore="{ record }">
        <slot name="actionBefore" :record="record"></slot>
      </template>
      <template #actionAfter="{ record }">
        <slot name="actionAfter" :record="record"></slot>
      </template>
    </GcTable>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GcSearch from '@/components/gc-search/index.vue'
import GcTable from '@/components/gc-table/index.vue'
import  type { IPageOptions } from '@mengtr/vue3-common/lib/types/types/table-page'


defineOptions({
  name: "GcTablePage"
})



// 包含api search table modal
const props = withDefaults(defineProps<{ options: IPageOptions, type: 1 | 2 }>(), {
  options: () => ({}) as IPageOptions,
  type: 1
})
// 抛出的方法
const emits = defineEmits(["import", "export"])

  //  搜索dom
    const GcSearchRef = ref()
    // 表格dom
    const GcTableRef = ref()

    // 搜索的参数
    const GcSearchOptions = computed(() => props.options.search)
    // 表格接收的参数
    const GcTableOptions = computed(() => props.options)
    // 搜索dom 的搜索按钮
    const onGcSearchSearch = (type = true) => {
        if (GcTableRef.value) {
            GcTableRef.value?.onSearch(type)
        }
    }
    // 搜索dom 的重置按钮
    const onGcSearchReset = () => {
        if (GcTableRef.value) {
            GcTableRef.value?.onReset()
        }
    }
    // 搜索dom 的创建按钮
    const onGcSearchCreate = () => {
        if (GcTableRef.value) {
            GcTableRef.value?.onCreate()
        }
    }
    // 搜索dom 的导入按钮
    const onGcSearchImport = (data: unknown) => {
        emits('import', data)
    }
    // 搜索dom 的导出按钮
    const onGcSearchExport = (data: unknown) => {
        emits('export', data)
    }
    // 表格dom 回调搜索栏
    const onGcTableSearch = (type = true) => {
        if (GcSearchRef.value) {
            GcSearchRef.value?.onSearch(type)
        }
    }


defineExpose({
  onSearchRefSearch: onGcTableSearch,
  onSearchSearch: onGcSearchSearch
})


</script>
