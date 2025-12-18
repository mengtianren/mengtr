import { reactive, onMounted, inject, unref, toRefs } from 'vue'
import { isString, isNumber } from 'lodash-es'
import type { GetData, Param, TableState, IUseTableRes } from '@/types/table-type'


interface IPageKey {
  page: string
  size: string
  records?: string
  total?: string
}
let tableKey = { page: 'page', size: 'size', records: 'records', total: 'total' }
/**
 * 
 * @param page 分页参数
 * @param size 分页参数
 * @param records 列表参数
 * @param total 总条数参数
 */
export const setTablePageKey = (key: IPageKey) => {
  tableKey.page = key.page || tableKey.page
  tableKey.size = key.size || tableKey.size
  tableKey.records = key.records || tableKey.records
  tableKey.total = key.total || tableKey.total
  console.warn('tableKey', key)
}

/**
 *
 * @param getData 获取列表接口
 * @param init
 * @param param
 * @returns {
 *
 * }
 */



export const useTable = (getData: GetData, init: boolean = true, param: Param, pageKey = tableKey): IUseTableRes => {
  /** 搜索项目 */
  const callBack = inject('callBack', (data: any[]) => { console.log(data) })
  const state = reactive<TableState>({
    search: {},
    tableData: [],
    selectedRowKeys: [], // 被选中的列表
    pagination: {
      size: 'default',
      // position: ['bottomCenter'],
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showTotal: (total: number) => `共${total}条数据`,
      onChange: (page: number, pageSize: number) => {
        /** 页码发生变化时候 */
        onTableChange(page, pageSize)
      }
    },
    /** 选中操作 */
    rowSelection: {
      checkStrictly: true,
      onChange: (selectedRowKey: Array<string | number>) => {
        state.selectedRowKeys = selectedRowKey
      }
    }
  })

  /** 获取基础数据 */
  const onGetTableData = () => {
    const { pagination: { current, pageSize: size } = {} } = state
    const paramObj = isString(param) || isNumber(param) ? param : { ...param, ...state.search }

    const params = {
      page: {
        [pageKey.page]: current,
        [pageKey.size]: size
      },
      param: paramObj
    }
    if (!getData) return console.error('API.getPage参数不存在')
    getData(params).then((res) => {
      state.tableData = (res as any)[pageKey.records]
      if (state.pagination) {
        state.pagination.total = (res as any)[pageKey.total]
        state.pagination.pageSize = size as number
        state.pagination.current = current as number
      }
      callBack(unref(state.tableData))
    })
  }

  /** 搜索 */
  const onSearch = (data = {}, reset = true) => {
    if (reset) {
      if (state.pagination) {
        state.pagination.current = 1
        state.pagination.pageSize = 10
      }

    }
    state.search = data
    onGetTableData()
  }
  /** 清除搜索 */
  const onReset = (obj = {}) => {
    if (state.pagination) {
      state.pagination.current = 1
      state.pagination.pageSize = 10
    }

    state.search = { ...obj }
    onGetTableData()
  }
  const onSetParam = (para: Param, ...args: Param[]) => {
    param = para
    onSearch(...args as any)
  }

  /** 页码切换 */
  const onTableChange = (page: number, pageSize: number) => {
    if (state.pagination) {
      state.pagination.pageSize = pageSize
      state.pagination.current = page
    }

    onGetTableData()
  }

  /** 如果请求存在则调用请求 */
  onMounted(() => {
    if (init) {
      onGetTableData()
    }
  })

  return {
    ...toRefs(state),
    pagination: state.pagination as any,
    onSearch,
    onReset,
    onSetParam
  }
}
export default useTable