import { Ref } from 'vue'



export type Param = { [key: string]: unknown } | string | null
type MaybeRef<T> = T | Ref<T>;
export interface ChildState {
  search: object
  tableData: MaybeRef<Array<object>>
  selectedRowKeys: MaybeRef<Array<string | number>>
  rowSelection: MaybeRef<{
    checkStrictly: boolean
    onChange: (selectedRowKey: Array<string | number>) => void
  }>
}

export interface TableState<T = any> extends ChildState {
  pagination: T
}

interface ITableRes<T = any> {
  records: Array<T>
  total: number
  size: number
  current: number
}



export type GetData<T = any> = (params?: Param) => Promise<ITableRes<T>>
export type TreeData<T = any> = (params?: Param) => Promise<Array<T>>



export interface ITableEvent {
  onSearch: (data?: object, type?: boolean) => void
  onReset: (obj?: any) => void
  onSetParam: (param: Param, ...args: Param[]) => void
}

export interface IUseTableRes extends TableState, ITableEvent {

}


