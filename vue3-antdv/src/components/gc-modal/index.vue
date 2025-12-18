<template>
    <a-modal :width="modal.config?.width || 1200" v-bind="modal.config" :open="open" destroy-on-close @ok="onModalOk"
        class="gc-modal" @cancel="onModalCancel">
        <GcForm ref="formRef" v-model:formData="formData" :options="modal.form" />
    </a-modal>
</template>

<script setup lang="ts">
import { buildInitialFormData } from '@mengtr/vue3-common'
import GcForm from "@/components/gc-form/index.vue"
import { cloneDeep, isEmpty } from 'lodash-es'
import { ref, watch, computed, nextTick } from 'vue'
import type { IModal } from '@mengtr/vue3-common/lib/types/types/table-page'
import type { FormExpose } from 'ant-design-vue/es/form/Form'
import type { ModalProps } from 'ant-design-vue/es/modal'
import {
    Modal as AModal,
} from 'ant-design-vue'

defineOptions({
    name: "GcModal"
})


const open = defineModel('open', {
    type: Boolean,
    default: false
})
/**
 * 弹窗组件
 * @param options 弹窗配置项
 * @returns 弹窗组件实例
 * @description 弹窗组件用于展示弹窗表单，支持文本输入、日期选择、下拉选择等功能。
 * @param options.config 弹窗配置项
 * @param options.config.title 弹窗标题
 * @param options.config.width 弹窗宽度
 * @param options.form 弹窗表单配置项
 * @param options.form.config 弹窗表单配置项
 * @param options.form.fields 弹窗表单字段配置项
 */
const props = withDefaults(defineProps<{ options: IModal, data: Record<string, any> }>(), {
    options: () => ({
        config: {
            title: "操作"
        } as ModalProps,
        form: {
            config: {
                labelCol: { span: 2 }
            },
            fields: []
        }
    }),
    data: () => ({})
})

const modal = computed(() => props.options)

const formRef = ref<FormExpose>()
const formData = ref<{ [key: string]: any }>({})

const emits = defineEmits<{
    'ok': [Record<string, any>],
    'cancel': []
}>()


const onModalOk = async () => {
    if (formRef.value) {
        try {
            await formRef.value.validateFields()
            emits('ok', formData.value)
        } catch (error) {
            console.log(error)
        }
    }



}
const onModalCancel = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('cancel')
    open.value = false
}
watch(() => open.value, (newVal) => {
    if (newVal) {
        formData.value = buildInitialFormData(props.options.form.fields, true)
        nextTick(() => {
            if (!isEmpty(props.data)) {
                formData.value = cloneDeep(props.data)
            }
        })
    }
})

</script>

<style scoped lang="less"></style>