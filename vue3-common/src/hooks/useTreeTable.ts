import { reactive, onMounted, toRefs, inject, unref,  } from 'vue'
import { isArray, isString, isNumber } from 'lodash-es'

import type { TreeData, ChildState, Param } from '@/types/table-type'
/**
 *
 * @param getData 获取列表接口
 * @param delData 删除列表接口
 * @returns {
 *
 * }
 */
export const useTable = (getData: TreeData, init = true, param: Param = null) => {
  /** 搜索项目 */

  const callBack = inject('callBack', (data: any[]) => { console.log(data) })

  const state = reactive<ChildState>({
    search: {},
    tableData: [],
    selectedRowKeys: [], // 被选中的列表

    /** 选中操作 */
    rowSelection: {
      checkStrictly: true,
      onChange: (selectedRowKeys: Array<string | number>) => {
        state.selectedRowKeys = selectedRowKeys
      }
    }
  })

  /** 获取基础数据 */
  const onGetTableData = () => {
    const params = isString(param) || isNumber(param) ? param : { ...param, ...state.search }
    // const params = state.search
    if (getData) {
      getData(params).then((res) => {
        console.log(isArray(res), '!!!!')
        if (!res) {
          state.tableData = []
        } else if (isArray(res)) {
          state.tableData = res
        } else {
          state.tableData = [res]
        }
        callBack(unref(state.tableData))
      })
    }

  }

  /** 搜索 */
  const onSearch = (data = {}) => {
    state.search = data
    onGetTableData()
  }
  /** 清除搜索 */
  const onReset = (obj = {}) => {
    state.search = { ...obj }
    onGetTableData()
  }
  // 设置默认值
  const onSetParam = (para: Param, ...args: Param[]) => {
    param = para
    onSearch(...args as any)
  }
  /** 如果请求存在则调用请求 */
  onMounted(() => {
    if (init) {
      onGetTableData()
    }
  })

  return {
    ...toRefs(state),
    onSearch,
    onReset,
    onSetParam,
    pagination: false as false,
  }
}
export default useTable