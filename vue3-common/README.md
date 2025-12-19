# @mengtr/vue3-common

公共的工具库和类型定义，被其他两个包依赖，提供了一系列常用的hooks和工具函数。

**npm地址：https://www.npmjs.com/package/@mengtr/vue3-common**

## 安装

```bash
pnpm add @mengtr/vue3-common
```

## 导出方法

### Hooks

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `useTable` | 分页表格数据管理钩子 | - `getData`: 数据获取函数<br>- `init`: 是否初始化加载<br>- `param`: 初始参数<br>- `pageKey`: 分页参数映射 | `{ tableData, pagination, onSearch, onReset, onSetParam, search }` |
| `useTreeTable` | 树状表格数据管理钩子 | - `getData`: 数据获取函数<br>- `init`: 是否初始化加载<br>- `param`: 初始参数 | `{ tableData, onSearch, onReset, onSetParam, search }` |
| `setTablePageKey` | 设置分页参数映射 | - `key`: 包含page、size、records、total的对象 | `void` |

### 工具函数

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `buildInitialFormData` | 构建表单初始数据 | - `fields`: 表单字段配置<br>- `data`: 初始数据 | `object` |

## 使用示例

### useTable Hook

用于管理分页表格数据，提供了数据获取、搜索、重置等功能。

```typescript
import { useTable } from '@mengtr/vue3-common'
import axios from 'axios'

// 数据获取函数
const getData = async (params: { page: { page: number; size: number }; param: any }) => {
  const response = await axios.get('/api/list', { params })
  return response.data
}

// 使用useTable钩子
const {
  tableData,     // 表格数据
  pagination,    // 分页信息
  onSearch,      // 搜索方法
  onReset,       // 重置方法
  onSetParam,    // 设置参数方法
  search         // 搜索条件
} = useTable(
  getData,       // 数据获取函数
  true,          // 是否初始化加载
  { status: 1 }, // 初始参数
  {
    page: 'page',      // 页码字段名
    size: 'pageSize',  // 每页条数字段名
    records: 'rows',   // 数据列表字段名
    total: 'total'     // 总条数字段名
  }
)

// 使用示例
onSearch({ name: 'test' })  // 搜索
onReset()                   // 重置
onSetParam({ status: 0 })   // 设置参数
```

### useTreeTable Hook

用于管理树状表格数据，提供了数据获取、搜索、重置等功能。

```typescript
import { useTreeTable } from '@mengtr/vue3-common'
import axios from 'axios'

// 数据获取函数
const getData = async (params: any) => {
  const response = await axios.get('/api/tree', { params })
  return response.data
}

// 使用useTreeTable钩子
const {
  tableData,     // 表格数据
  onSearch,      // 搜索方法
  onReset,       // 重置方法
  onSetParam,    // 设置参数方法
  search         // 搜索条件
} = useTreeTable(
  getData,       // 数据获取函数
  true,          // 是否初始化加载
  { parentId: 0 } // 初始参数
)

// 使用示例
onSearch({ name: 'test' })  // 搜索
onReset()                   // 重置
onSetParam({ parentId: 1 }) // 设置参数
```

### setTablePageKey 函数

用于全局设置分页参数映射，影响所有使用useTable钩子的组件。

```typescript
import { setTablePageKey } from '@mengtr/vue3-common'

// 设置全局分页参数映射
setTablePageKey({
  page: 'page',      // 页码字段名
  size: 'pageSize',  // 每页条数字段名
  records: 'rows',   // 数据列表字段名
  total: 'total'     // 总条数字段名
})
```

### buildInitialFormData 函数

用于构建表单初始数据，根据字段配置和初始数据生成表单数据。

```typescript
import { buildInitialFormData } from '@mengtr/vue3-common'

// 表单字段配置
const fields = [
  { type: 'input', label: '名称', name: 'name', config: { placeholder: '请输入名称' } },
  { type: 'select', label: '状态', name: 'status', config: { options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] } },
  { type: 'object', label: '扩展信息', name: 'ext', fields: [{ type: 'input', label: '字段1', name: 'field1' }] },
  { type: 'array', label: '列表数据', name: 'list', fields: [{ type: 'input', label: '名称', name: 'name' }] }
]

// 初始数据
const initialData = {
  name: '测试',
  status: 1,
  ext: { field1: '值1' },
  list: [{ name: '项1' }, { name: '项2' }]
}

// 构建表单初始数据
const formData = buildInitialFormData(fields, initialData)

// 输出结果
console.log(formData)
// {
//   name: '测试',
//   status: 1,
//   ext: { field1: '值1' },
//   list: [{ name: '项1' }, { name: '项2' }]
// }
```

## 类型定义

### GetData

数据获取函数类型，用于普通表格。

```typescript
export type GetData<T = any> = (params: { page: { page: number; size: number }; param: any }) => Promise<{ [key: string]: any } & { records: T[]; total: number }>
```

### TreeData

数据获取函数类型，用于树状表格。

```typescript
export type TreeData<T = any> = (params: any) => Promise<T[]>
```

### IProps

表格配置项类型。

```typescript
export interface IProps<T = any, P = any> {
    columns: P[]           // 表格列配置
    data: T                // 数据获取函数
    initParam?: any        // 初始化参数
    rowKey?: string        // 行键
    scroll?: { x?: number; y?: number }  // 滚动配置
    bordered?: boolean     // 是否显示边框
    init?: boolean         // 是否初始化数据
}
```

## FormItem 类型

### TFormItemType

表单字段类型枚举：

```typescript
export type TFormItemType =
  | 'input'        // 输入框
  | 'textarea'     // 文本域
  | 'number'       // 数字输入框
  | 'select'       // 下拉选择器
  | 'treeselect'   // 树状选择器
  | 'switch'       // 开关
  | 'datepicker'   // 日期选择器
  | 'rangepicker'  // 日期范围选择器
  | 'component'   // 自定义组件
  | 'object'       // 对象类型（嵌套表单）
  | 'array'        // 数组类型（动态表单）
```

### IBaseFormItem

基础表单字段接口：

```typescript
export interface IBaseFormItem {
  type: TFormItemType     // 字段类型
  name: string            // 字段名
  label?: string          // 标签名
  span?: number           // 占用列数
  defaultValue?: any      // 默认值
  disabled?: boolean      // 是否禁用

  dependsOn?: {           // 依赖条件
    path: string[]        // 依赖字段路径
    value: any            // 依赖字段值
  }

  callback?: (formData: Recordable, field: IFormItem, oldValue?: any, newValue?: any) => void
  config?: Recordable     // 额外配置
}
```

### IFormItem

表单字段联合类型：

```typescript
export type IFormItem =
  | IInputFormItem        // 输入框
  | ITextareaFormItem     // 文本域
  | INumberFormItem       // 数字输入框
  | ISelectFormItem       // 下拉选择器
  | ISwitchFormItem       // 开关
  | IDatePickerFormItem   // 日期选择器
  | IRangePickerFormItem  // 日期范围选择器
  | IComponentFormItem    // 自定义组件
  | IObjectFormItem       // 对象类型（嵌套表单）
  | IArrayFormItem        // 数组类型（动态表单）
```

## 搜索类型

### TSearchType

搜索字段类型枚举：

```typescript
export type TSearchType =
  | 'number'       // 数字类型
  | 'string'       // 字符串类型
  | 'datapicker'   // 日期选择器
  | 'rangepicker'  // 日期范围选择器
  | 'select'       // 下拉选择器
  | 'treeselect'   // 树状选择器
```

### TSearchOption

搜索字段联合类型：

```typescript
export type TSearchOption =
  | INumberSearchField       // 数字类型搜索字段
  | IStringSearchField       // 字符串类型搜索字段
  | IDataPickerSearchField   // 日期选择器搜索字段
  | IRangePickerSearchField  // 日期范围选择器搜索字段
  | ISelectSearchField       // 下拉选择器搜索字段
```

### ISearch

搜索配置接口：

```typescript
export interface ISearch {
  searchOptions: TSearchOption[]  // 搜索字段配置
  enableExport?: boolean         // 是否启用导出
  enableImport?: boolean         // 是否启用导入
  enableCreate?: boolean         // 是否启用新增
  span?: number                  // 搜索字段占用列数
}
```

## 注意事项

1. 确保你的项目使用 Vue 3.5.0 或以上版本
2. 确保正确安装了依赖：
   ```bash
   pnpm add vue lodash-es
   ```
3. 建议使用 TypeScript 开发以获得更好的开发体验
4. `useTable` 和 `useTreeTable` 钩子需要在 Vue 3 的 `setup` 函数或组件中使用

## 许可证

MIT
