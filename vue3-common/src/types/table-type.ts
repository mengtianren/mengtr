import { Ref } from 'vue'


interface Page {
  [key: string]: number | undefined
}
export type Param = { [key: string]: unknown } | string | null

export interface IpageRequest {
  page: Page
  param: null | Param
}
export interface Records {
  [key: string]: string | number | boolean | undefined
}
export interface  ITablePageResponse<T = Records> {
  records: Array<T>
  total: number
  size: number
  currentPage: number
}



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

export interface TableState extends ChildState {
  pagination: any | undefined
}





export type getPage<T = Records> = (params?: IpageRequest) => Promise<ITablePageResponse<T>>
export type getTree<T = any> = (params?: Param) => Promise<Array<T>> 



export interface ITableEvent {
  onSearch: (data?: object, type?: boolean) => void
  onReset: (obj?: any) => void
  onSetParam: (param: Param, ...args: Param[]) => void
}

export interface IUseTableRes extends TableState, ITableEvent {

}


