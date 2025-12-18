import { IFormItem } from "@/types/table-page"
/**
 * 构建初始表单数据
 * @param fields 弹窗表单字段配置项
 * @param isCreate 是否为创建操作
 * @returns 初始表单数据
 */
export const buildInitialFormData = (fields: IFormItem[], isCreate = false): Record<string, any> => {
    const result: Record<string, any> = {}
    fields.forEach(field => {
        if (!field.name) return
        if (field.type === 'object') {
            result[field.name] = buildInitialFormData(field.fields || [], isCreate)
        } else {
            result[field.name] = isCreate
                ? field.defaultValue ?? undefined
                : undefined
        }
    })

    return result
}