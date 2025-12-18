import type { Param, GetData } from '@/types/table-type'

/* =========================
 * 基础公共类型
 * ========================= */

export type Recordable<T = any> = Record<string, T>

/* =========================
 * Search 搜索区
 * ========================= */

export type TDatePicker = 'hour' | 'date' | 'month' | 'year'

export type TSearchType =
  | 'number'
  | 'string'
  | 'datapicker'
  | 'rangepicker'
  | 'select'
  | 'treeselect'

export interface IBaseSearchField {
  type: TSearchType
  name: string
  label: string
  span?: number
  /** UI 私有参数 */
  ui?: {
    antdv?: Recordable
    element?: Recordable
  }
}

export interface INumberSearchField extends IBaseSearchField {
  type: 'number'
}

export interface IStringSearchField extends IBaseSearchField {
  type: 'string'
}

export interface IDataPickerSearchField extends IBaseSearchField {
  type: 'datapicker'
  picker: TDatePicker
}

export interface IRangePickerSearchField extends IBaseSearchField {
  type: 'rangepicker'
  picker: TDatePicker
  config: {
    startKey: string
    endKey: string
  }
}

export interface ISelectSearchField extends IBaseSearchField {
  type: 'select' | 'treeselect'
  options: Array<{
    label: string
    value: string | number
  }>
}

export type TSearchOption =
  | INumberSearchField
  | IStringSearchField
  | IDataPickerSearchField
  | IRangePickerSearchField
  | ISelectSearchField

export interface ISearchEvent {
  onSearch?: (params?: Recordable) => void
  onReset?: () => void
  onCreate?: () => void
  onImport?: () => void
  onExport?: () => void
}

export interface ISearchExpose {
  onSetParam: () => void
  onSearch: (force?: boolean) => void
  onReset: () => void
  onCreate: () => void
  onImport: () => void
  onExport: () => void
}

export interface ISearch {
  searchOptions: TSearchOption[]
  enableExport?: boolean
  enableImport?: boolean
  enableCreate?: boolean
  span?: number
}

/* =========================
 * Table 表格
 * ========================= */

export interface ITableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  render?: (row: Recordable) => any
}

export type IAction =
  | {
      key: 1 | 2 | 3
      label: string
      labelShow?: boolean
      className?: string
      local?: boolean
      config?: {
        key: string
        value: string | number
      }
    }
  | {
      key: Exclude<number, 1 | 2 | 3>
      label: string
      labelShow?: boolean
      className?: string
      local?: boolean
      config?: {
        key: string
        value: string | number
      }
      callback: (row: Recordable) => void
    }

export interface ITable {
  className?: string
  columns: ITableColumn[]
  actions: IAction[]
  initParam: Param
  rowKey?: string
  bordered?: boolean
  init?: boolean
  pageKey?: {
    page?: string
    size?: string
    records?: string
  }
}

/* =========================
 * Form 表单
 * ========================= */

export type TFormItemType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'treeselect'
  | 'switch'
  | 'datepicker'
  | 'rangepicker'
  | 'editor'
  | 'component'
  | 'object'
  | 'array'

export interface IBaseFormItem {
  type: TFormItemType
  name: string
  label?: string
  span?: number
  defaultValue?: any
  disabled?: boolean

  dependsOn?: {
    path: string[]
    value: any
  }

  watch?: {
    key: string[]
    callback: (value: any) => void
  },
  config?: Recordable
}

export interface IInputFormItem extends IBaseFormItem {
  type: 'input'
}

export interface ITextareaFormItem extends IBaseFormItem {
  type: 'textarea'
}

export interface INumberFormItem extends IBaseFormItem {
  type: 'number'
}

export interface ISelectFormItem extends IBaseFormItem {
  type: 'select' | 'treeselect'
  options: Array<{ label: string; value: string | number }>
}

export interface ISwitchFormItem extends IBaseFormItem {
  type: 'switch'
}

export interface IDatePickerFormItem extends IBaseFormItem {
  type: 'datepicker'
}

export interface IRangePickerFormItem extends IBaseFormItem {
  type: 'rangepicker'
}

export interface IEditorFormItem extends IBaseFormItem {
  type: 'editor'
}

export interface IComponentFormItem extends IBaseFormItem {
  type: 'component'
  component: string
}

export interface IObjectFormItem extends IBaseFormItem {
  type: 'object'
  fields: IFormItem[]
}

export interface IArrayFormItem extends IBaseFormItem {
  type: 'array'
  fields: IFormItem[]
}

export type IFormItem =
  | IInputFormItem
  | ITextareaFormItem
  | INumberFormItem
  | ISelectFormItem
  | ISwitchFormItem
  | IDatePickerFormItem
  | IRangePickerFormItem
  | IEditorFormItem
  | IComponentFormItem
  | IObjectFormItem
  | IArrayFormItem

/* =========================
 * Modal 弹窗
 * ========================= */

export interface IModalForm {
  config: {
    labelCol?: { span: number }
    wrapperCol?: { span: number }
  }
  fields: IFormItem[]
}

export interface IModal {
  hide?: boolean
  initParam?: Param | {}
  callback?: (data: any) => void
  config?: {
    title?: string
    width?: number | string
  }
  form: IModalForm
}

/* =========================
 * API & Page
 * ========================= */

export interface IPAI {
  getPage: GetData<any>
  detailApi: (id: number) => Promise<Recordable>
  delApi: (id: number) => Promise<any>
  putApi: (data: any) => Promise<any>
  postApi: (data: any) => Promise<any>
}

export interface IBasePageOptions {
  search: ISearch
  table: ITable
  modal: IModal
}

export interface IPageOptions extends IBasePageOptions {
  API: IPAI
}

/* =========================
 * JSON API（低代码 / 配置化）
 * ========================= */

export interface IPAIJSON {
  getPage: string
  detailApi: string
  delApi: string
  putApi: string
  postApi: string
}

export interface IPageOptionsJSON extends IBasePageOptions {
  API: IPAIJSON
}
