<template>
    <BaseTable :type="type" ref="tableRef" :options="tableOptions">
        <template #bodyCell="{ column, record, text, index }">
            <slot name="bodyCell" :column="column" :record="record" :text="text" :index="index"></slot>
            <template v-if="column.property === 'action'">
                <el-space>
                    <slot name="action" :record="record"></slot>
                    <slot name="actionBefore" :record="record"></slot>
                    <template v-for="(item, i) in tableActions" :key="i">
                        <a v-if="(!isEmpty(item.config) && record[item.config?.key] === item?.config?.value) || isEmpty(item.config)"
                            :title="item.label" :class="['gc-table-button', item.key === 3 && 'error', item.className]"
                            @click="onActionClick(item, record)">
                            <template v-if="!item.labelShow">
                                <Edit style="width: 1em; height: 1em;" v-if="item.key === 1" />
                                <Share style="width: 1em; height: 1em; " v-else-if="item.key === 2" />
                                <Delete style="width: 1em; height: 1em;" v-else-if="item.key === 3" />
                            </template>
                            <template v-if="item.labelShow">
                                {{ item.label }}
                            </template>
                        </a>
                    </template>
                    <slot name="actionAfter" :record="record"></slot>

                </el-space>
            </template>
        </template>
    </BaseTable>
    <template v-if="!isEmpty(modal) || !modal?.hide">
        <el-dialog class="gc-modal" :width="modal?.config?.width || 1200" v-bind="modalConfig" :modelValue="open !== 0" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="onModalCancel"
            destroy-on-close>
            <GcForm v-model:formData="formData" :options="modal.form" ref="formRef" :disabled="open !== 1" />
            <template #footer v-if="open === 1">
                <div class="gc-modal-footer">
                    <el-button @click="onModalCancel">取消</el-button>
                    <el-button type="primary" @click="onModalOk">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </template>

</template>

<script setup lang="ts">

import { ElDialog, ElButton, ElSpace, ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Share, Delete } from '@element-plus/icons-vue'
import { computed, ref, nextTick } from 'vue'
import { cloneDeep, isEmpty } from 'lodash-es'

import type { FormExpose } from 'ant-design-vue/es/form/Form'

import BaseTable from '@/components/base-table/index.vue'
import GcForm from '@/components/gc-form/index.vue'
import { buildInitialFormData } from '@mengtr/vue3-common'
import type { IPageOptions, IAction } from '@mengtr/vue3-common/lib/types/types/table-page'
import type { TreeData, GetData, ITableEvent } from '@mengtr/vue3-common/lib/types/types/table-type'
import type { IProps } from '@mengtr/vue3-common/lib/types/types/table-props'





defineOptions({
    name: "GcTable"

})
const props = withDefaults(defineProps<{ options: IPageOptions, type: 1 | 2 }>(), {
    type: 1
})
const emits = defineEmits<{
    searchOnSearch: []
}>()
const table = computed(() => props.options.table)

const tableActions = computed(() => table.value?.actions || [])

const tableOptions = computed<IProps<TreeData | GetData>>(() => ({
    ...props.options.table,
    data: API.value?.getPage as any
}))

const modal = computed(() => props.options.modal)
const modalConfig = computed(() => {
    const args = open.value === 2 ? { footer: null } : {}
    return { ...modal.value?.config, ...args }
})

const API = computed(() => props.options.API)


const open = ref(0)
const formRef = ref<FormExpose>()
const tableRef = ref()


const formData = ref<{ [key: string]: any }>({})


// 初始化数据
const getInitData = () => {
    if (!isEmpty(modal.value.initParam)) {
        return cloneDeep(modal.value.initParam)
    }
    return {}
}
// modal打开回调函数
const getCallback = () => {
    if (modal.value.callback && typeof modal.value.callback === 'function') {
        modal.value.callback(formData.value)
    }
}


const onCreate = () => {
    console.log('新增', buildInitialFormData(modal.value.form.fields, true))
    open.value = 1
    formData.value = buildInitialFormData(modal.value.form.fields, true)
    nextTick(() => {
        formData.value = { ...formData.value, ...getInitData() }
        getCallback()
    })
}
const onActionClick = (config: IAction, item: Record<string, any>) => {
    const { key, local = false } = config
    const callback = 'callback' in config ? config.callback : null;

    const { id } = item
    switch (key) {
        case 1:
            if (local) {
                open.value = 1
                formData.value = buildInitialFormData(modal.value.form.fields)
                nextTick(() => {
                    formData.value = { ...cloneDeep(item), ...getInitData() }
                    getCallback()
                })
                return
            }

            console.log('编辑')
            API.value.detailApi(id).then((res) => {
                console.log(res)
                open.value = 1
                // 解决初始化后数据没同步进去问题
                formData.value = buildInitialFormData(modal.value.form.fields)
                nextTick(() => {
                    formData.value = { ...res, ...getInitData() }
                    getCallback()
                })
            })
            break
        case 2:
            if (local) {
                open.value = 2
                formData.value = buildInitialFormData(modal.value.form.fields)
                nextTick(() => {
                    formData.value = { ...cloneDeep(item), ...getInitData() }
                    getCallback()
                })
                return
            }


            API.value.detailApi(id).then((res) => {
                open.value = 2
                formData.value = buildInitialFormData(modal.value.form.fields)
                nextTick(() => {
                    formData.value = { ...res, ...getInitData() }
                    getCallback()
                })
            })
            console.log('查看')
            break
        case 3:
            ElMessageBox.confirm('确定删除吗？', '删除后不可恢复',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    return API.value.delApi(id).then(() => {
                        ElMessage.success('删除成功')
                        emits('searchOnSearch')
                    })
                })

            console.log('删除')
            break
        default:
            if (callback && typeof callback === 'function') {
                callback(item)
            }
            break
    }
}

const onModalOk = async () => {
    if (open.value === 1 && formRef.value) {
        try {
            await formRef.value.validateFields()
            console.log(formData)
            if (formData.value.id) await API.value.putApi(formData.value)
            if (!formData.value.id) await API.value.postApi(formData.value)
            await formRef.value.resetFields()
            open.value = 0
            emits('searchOnSearch')
            ElMessage.success('操作成功')
        } catch (error) {
            console.log(error)
        }
    } else {
        open.value = 0
    }
}

const onModalCancel = () => {
    if (formRef.value) {
        console.log(1)
        formRef.value.resetFields()
    }
    open.value = 0
}

const onSearch: ITableEvent["onSearch"] = (data) => {
    if (tableRef.value) {
        tableRef.value.onSearch(data)
    }
}
const onReset: ITableEvent["onReset"] = (obj) => {
    if (tableRef.value) {
        tableRef.value.onReset(obj)

    }
}




defineExpose({
    onCreate,
    onSearch,
    onReset
})



</script>