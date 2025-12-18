<template>
    <el-form :label-col="form.config.labelCol || { span: 2 }" v-bind="form.config" ref="formRef" :model="formData"
        :disabled="disabled">
        <GcFormItem v-model:value="formData" :fields="form.fields" :fieldPath="[]" :disabled="disabled" />
    </el-form>
    
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElForm } from 'element-plus'
import type { IModalForm } from '@mengtr/vue3-common/lib/types/types/table-page'
import GcFormItem from '@/components/gc-items/index.vue'

defineOptions({
    name: "GcForm"
})

const formData = defineModel('formData', {
    type: Object,
    default: () => ({})
})
/**
 * @param options.config 弹窗表单配置项
 * @param options.fields 弹窗表单字段配置项
 */
const props = withDefaults(defineProps<{ options: IModalForm, disabled?: boolean }>(), {
    options: () => ({
        config: {
            labelCol: { span: 2 }
        },
        fields: []
    }),
    disabled: false
})

const form = computed(() => props.options)
const formRef = ref()
// 验证表单
const validateFields = async () => {
    if (formRef.value) {
        return formRef.value.validate()
    }
}
// 清除表单数据
const resetFields = () => {
    if (formRef.value) {
        formRef.value.resetFields()

    }
}
defineExpose({
    validateFields,
    resetFields
})

</script>

<style scoped lang="less"></style>