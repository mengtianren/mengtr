# @mengtr Components Library

这是一个基于 pnpm 工作空间的 Vue 3 业务组件库，提供配置驱动的 CRUD 页面组件，支持 Ant Design Vue 和 Element Plus 两套 UI 库。

- `@mengtr/vue3-antdv`：基于 Ant Design Vue
- `@mengtr/vue3-element`：基于 Element Plus
- `@mengtr/vue3-common`：公共逻辑、Hooks、类型定义

**npm：https://www.npmjs.com/search?q=%40mengtr**

---

## 项目结构

```
mengtr/
├── vue3-antdv/           # Ant Design Vue 组件
│   └── src/components/
│       ├── gc-page/      # GPage - 完整 CRUD 页面
│       ├── gc-search/    # GSearch - 搜索工具栏
│       ├── gc-table/     # GTable - 表格 + 弹窗
│       ├── gc-modal/     # GModal - 弹窗
│       ├── gc-form/      # GForm - 表单
│       ├── gc-items/     # GFormItem - 表单字段渲染
│       └── base-table/   # BaseTable - 基础表格
├── vue3-element/         # Element Plus 组件（同上结构）
├── vue3-common/          # 共享 Hooks、类型定义、工具函数
│   └── src/
│       ├── hooks/        # useTable, useTreeTable, useFormItems
│       ├── types/        # 完整的 TypeScript 类型定义
│       └── utils/        # buildInitialFormData
├── example/              # 使用示例
├── package.json          # 根工作空间配置
├── pnpm-workspace.yaml   # pnpm workspace 声明
└── CHANGELOG.md
```

## 安装

```bash
pnpm add @mengtr/vue3-antdv @mengtr/vue3-element @mengtr/vue3-common
```

或单独安装：

```bash
pnpm add @mengtr/vue3-antdv     # Ant Design Vue 版
pnpm add @mengtr/vue3-element   # Element Plus 版
pnpm add @mengtr/vue3-common    # 仅使用 Hooks/类型（无 UI）
```

## 使用方式

### 全局注册

```typescript
import { createApp } from 'vue'
import MengtrUi from '@mengtr/vue3-antdv'
// import MengtrUi from '@mengtr/vue3-element'
import { setTablePageKey } from '@mengtr/vue3-antdv'

// 设置后端分页字段名映射（可选，默认 page/pageSize/records/total）
setTablePageKey({
  page: 'page',
  size: 'pageSize',
  records: 'rows',
  total: 'total'
})

const app = createApp(App)
app.use(MengtrUi)
app.mount('#app')
```

### 按需导入

```vue
<script setup lang="ts">
import { GPage, GSearch, GTable, BaseTable, useTable } from '@mengtr/vue3-antdv'
</script>
```

### 注意事项

- 使用 `@mengtr/vue3-antdv` 需安装 `ant-design-vue` 和 `@ant-design/icons-vue`，并自行引入 antdv 的 CSS
- 使用 `@mengtr/vue3-element` 需安装 `element-plus` 和 `@element-plus/icons-vue`
- 要求 Vue 3.5.0+
- `GFormItem` 组件即将废弃，建议使用 `GForm` 替代

---

## 组件总览

| 组件 | 别名 | 说明 |
|------|------|------|
| `GPage` | `GTablePage` | 完整 CRUD 页面（搜索 + 表格 + 弹窗 + API） |
| `GSearch` | - | 搜索工具栏 |
| `GTable` | - | 表格 + 弹窗组合 |
| `GModal` | - | 弹窗（内置表单） |
| `GForm` | - | 表单容器与校验 |
| `GFormItem` | - | 表单字段渲染器（即将废弃） |
| `BaseTable` | - | 基础表格（含分页） |

从两套 UI 库均可导入 `useTable`、`useTreeTable`、`setTablePageKey`，内部从 `@mengtr/vue3-common` 转发。

---

## 组件详细说明

### GPage / GTablePage

完整增删改查页面，集成搜索、表格、分页、弹窗、CRUD API。

#### Props

| 属性 | 类型 | 描述 |
|------|------|------|
| `options` | `IPageOptions` | 完整页面配置（search + table + modal + API） |
| `disabled` | `boolean` | 是否禁用表单 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `export` | `data: object` | 点击导出按钮 |
| `import` | `data: object` | 点击导入按钮 |
| `search` | `data: object` | 触发搜索 |
| `reset` | - | 触发重置 |

#### Slots

| 插槽 | 参数 | 说明 |
|------|------|------|
| `#button` | `{ param }` | 搜索栏按钮区扩展开口 |

#### IPageOptions 类型

```typescript
interface IPageOptions {
  search: ISearch       // 搜索配置
  table: ITable         // 表格配置
  modal: IModal         // 弹窗配置
  API: IPAI             // CRUD API 接口
}

interface IPAI {
  getPage: (params) => Promise<ITablePageResponse>  // 分页列表
  detailApi?: (id) => Promise<any>                   // 详情
  delApi?: (id) => Promise<any>                      // 删除
  putApi?: (data) => Promise<any>                    // 更新
  postApi?: (data) => Promise<any>                   // 新增
}
```

---

### GSearch

搜索工具栏，支持多种字段类型。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `options` | `ISearch` | - | 搜索配置项 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `search` | `data: object, type: boolean` | 搜索（type=false 时不重置分页） |
| `reset` | - | 重置搜索条件 |
| `create` | - | 新增按钮 |
| `export` | `data: object` | 导出 |
| `import` | `data: object` | 导入 |

#### Expose

| 方法 | 说明 |
|------|------|
| `onSearch(type?)` | 手动触发搜索 |
| `onReset()` | 手动重置 |
| `onSetParam(obj, type?)` | 设置搜索参数 |
| `onCreate()` | 触发新增 |

#### ISearch 类型

```typescript
interface ISearch {
  searchOptions: TSearchOption[]   // 搜索字段配置
  enableExport?: boolean           // 显示导出按钮
  enableImport?: boolean           // 显示导入按钮
  enableCreate?: boolean           // 显示新增按钮
  span?: number                    // 字段栅格宽度（默认 6）
}
```

#### TSearchOption 字段类型

| 类型 | 接口 | 额外字段 |
|------|------|---------|
| `'string'` | `IStringSearchField` | - |
| `'number'` | `INumberSearchField` | - |
| `'datapicker'` | `IDataPickerSearchField` | `picker: 'hour' \| 'date' \| 'month' \| 'year'` |
| `'rangepicker'` | `IRangePickerSearchField` | `picker`, `config: { startKey, endKey }` |
| `'select'` | `ISelectSearchField` | `options: { label, value }[]` |
| `'treeselect'` | `ISelectSearchField` | `options: { label, value }[]` |

---

### GTable

表格 + 弹窗组合组件，内部集成 `BaseTable` 和 `GModal`，通过 key 1/2/3 分别绑定编辑/详情/删除操作。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `options` | `IPageOptions` | - | 页面配置（取其中 table + modal + API） |
| `type` | `1 \| 2` | 1 | 1=编辑模式，2=只读模式 |

#### Expose

| 方法 | 说明 |
|------|------|
| `onCreate()` | 打开新增弹窗 |
| `onSearch(data?)` | 触发表格搜索 |
| `onReset(obj?)` | 重置表格搜索 |

#### ITable 类型

```typescript
interface ITable {
  columns: ITableColumn[]       // 列配置
  actions: IAction[]            // 操作按钮配置
  initParam?: Param             // 初始查询参数
  rowKey?: string               // 行 key（默认 'id'）
  bordered?: boolean            // 是否显示边框
  init?: boolean                // 是否初始化加载
  pageKey?: { page?, size?, records? }  // 分页字段映射
}

interface ITableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  render?: (row) => any
}

type IAction = {
  key: 1 | 2 | 3               // 1=编辑, 2=详情, 3=删除
  label: string
  labelShow?: boolean           // true=显示文字, false=仅图标
  local?: boolean               // true=前端填充不调详情接口
  config?: { key, value }       // 条件显隐
  className?: string
} | {
  key: number                   // 4+ = 自定义操作
  label: string
  callback: (row) => void       // 需要自定义回调
  labelShow?: boolean
  local?: boolean
  config?: { key, value }
  className?: string
}
```

#### Slots

| 插槽 | 参数 | 说明 |
|------|------|------|
| `#bodyCell` | `{ column, record, text, index }` | 自定义单元格（同 antdv/element 原生） |
| `#action` | `{ record }` | 操作列最前面插入 |
| `#actionBefore` | `{ record }` | 操作列 actions 数组前 |
| `#actionAfter` | `{ record }` | 操作列 actions 数组后 |

---

### GModal

弹窗组件，内置 `GForm` 表单。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `options` | `IModal` | - | 弹窗配置 |
| `data` | `Record<string, any>` | `{}` | 编辑时填充数据 |
| `open` | `boolean` | `false` | v-model 双向绑定弹窗显隐 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `ok` | `formData: object` | 点击确认（校验通过后触发） |
| `cancel` | - | 点击取消 |

#### IModal 类型

```typescript
interface IModal {
  hide?: boolean                         // 隐藏弹窗（表格内内联表单场景）
  initParam?: Param                      // 初始化附加参数
  callback?: (formData) => void          // 弹窗打开时的回调
  config?: { title?: string, width?: number | string }
  form: IModalForm                       // 表单配置
}

interface IModalForm {
  config: { labelCol?, wrapperCol? }
  fields: IFormItem[]                    // 表单字段配置
}
```

---

### GForm

表单容器，负责校验和字段渲染。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `formData` | `object` | `{}` | v-model 表单数据 |
| `options` | `IModalForm` | - | 表单配置 |
| `disabled` | `boolean` | `false` | 是否禁用 |

#### Expose

| 方法 | 说明 |
|------|------|
| `validateFields()` | 校验所有字段，通过返回 Promise |
| `resetFields()` | 重置表单到初始状态 |

---

### BaseTable

基础表格组件，封装了 `a-table` / `el-table` 和分页器。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `1 \| 2` | 1 | 1=分页表格，2=树形表格 |
| `options` | `IProps` | `{}` | 表格配置 |

#### Slots

| 插槽 | 参数 | 说明 |
|------|------|------|
| `#bodyCell` | `{ column, record, text, index }` | 自定义单元格 |

#### Expose

| 方法 | 说明 |
|------|------|
| `onSearch(data?)` | 触发搜索 |
| `onReset(obj?)` | 重置搜索 |
| `onSetParam(param)` | 设置参数 |
| `search` | 当前搜索条件（Ref） |
| `pagination` | 分页状态（Ref） |

#### IProps 类型

```typescript
interface IProps<T = any, P = any> {
  columns: P[]                     // 列配置
  data: T                          // 数据获取函数
  initParam?: any                  // 初始查询参数
  rowKey?: string                  // 行 key
  scroll?: { x?, y? }             // 滚动配置
  bordered?: boolean               // 边框
  init?: boolean                   // 是否初始化加载
}
```

---

## FormItem 表单字段

### 字段类型一览

```typescript
type TFormItemType =
  | 'input'        // 文本输入框
  | 'textarea'     // 文本域
  | 'number'       // 数字输入框
  | 'select'       // 下拉选择器
  | 'treeselect'   // 树形选择器
  | 'switch'       // 开关
  | 'datepicker'   // 日期选择器
  | 'rangepicker'  // 日期范围选择器
  | 'component'    // 自定义组件
  | 'object'       // 嵌套对象
  | 'array'        // 动态数组
```

### 基础接口

```typescript
interface IBaseFormItem {
  type: TFormItemType
  name: string                     // 字段名（支持路径）
  label?: string                   // 标签
  span?: number                    // 栅格宽度（默认 24）
  defaultValue?: any               // 创建时的默认值
  disabled?: boolean               // 禁用
  dependsOn?: {                    // 条件显隐
    path: string[]                 // 依赖字段路径
    value: any                     // 等于该值时显示
  }
  config?: Record<string, any>     // 透传给 UI 组件的属性
}
```

### 各类型字段的 config 说明

`config` 属性会直接透传给底层的 UI 组件，以下是各类型的常用参数：

| 字段类型 | 常用 config 参数 |
|----------|----------------|
| `input` | `placeholder`, `maxlength`, `show-count` |
| `textarea` | `placeholder`, `rows`, `maxlength` |
| `number` | `placeholder`, `min`, `max`, `step` |
| `select` | `placeholder`, `mode`（multiple/tags）, `allow-clear` |
| `treeselect` | `treeData`, `fieldNames`, `showCheckedStrategy`, `check-strictly` |
| `switch` | `checked-children`, `un-checked-children` |
| `datepicker` | `format`, `value-format`, `placeholder`, `disabled-date` |
| `rangepicker` | `format`, `value-format`, `separator` |
| `component` | 透传自定义组件的 props |

### 嵌套字段

```typescript
// 对象类型（group）
interface IObjectFormItem extends IBaseFormItem {
  type: 'object'
  fields: IFormItem[]      // 子字段
}

// 数组类型（动态列表）
interface IArrayFormItem extends IBaseFormItem {
  type: 'array'
  fields: IFormItem[]      // 子字段模板
}
```

### 表单校验

通过 `rules` 字段配置校验规则，格式与对应 UI 库一致：

```typescript
{
  label: '名称',
  name: 'name',
  type: 'input',
  rules: [{ required: true, message: '请输入名称' }]
}
```

### 条件显隐（dependsOn）

```typescript
{
  label: '具体原因',
  name: 'reason',
  type: 'input',
  dependsOn: {
    path: ['type'],        // 监听 formData.type
    value: 'other'         // 当 type === 'other' 时显示
  }
}
```

### 值变更监听（callback）

```typescript
{
  label: '省',
  name: 'province',
  type: 'select',
  options: [...],
  callback: (formData, field, oldValue, newValue) => {
    // 当 province 变化时，清空 city
    formData.city = undefined
  }
}
```

---

## Hooks

### useTable

分页表格数据管理。

```typescript
const {
  tableData,          // Ref<Array> - 表格数据
  pagination,         // 分页配置
  search,            // Ref<object> - 搜索条件
  selectedRowKeys,   // 选中行 keys
  rowSelection,      // 行选择配置
  onSearch,          // (data?, reset?) => void
  onReset,           // (obj?) => void
  onSetParam,        // (param, ...args) => void
} = useTable(
  getData,           // (params) => Promise<ITablePageResponse>
  init?,             // boolean - 是否初始化加载（默认 true）
  param?,            // Param - 初始参数
  pageKey?           // IPageKey - 分页字段映射（默认使用 setTablePageKey 全局配置）
)
```

### useTreeTable

树形/非分页表格数据管理（内部复用 useTable 逻辑，无分页）。

```typescript
const { tableData, onSearch, onReset, onSetParam } = useTreeTable(
  getData,           // (params?) => Promise<T[]>
  init?,             // boolean
  param?             // Param
)
// 注意: pagination 返回 false
```

### useFormItems

表单字段值管理 Hook（GFormItem 内部使用，也可单独使用）。

```typescript
const { getValue, setValue, addArrayItem, removeArrayItem, shouldShowField } = useFormItems(
  formData,          // Ref<object>
  fields,            // Ref<IFormItem[]>
  fieldPath          // Ref<(string | number)[]>
)
```

| 方法 | 说明 |
|------|------|
| `getValue(obj, keys)` | 按路径取值 |
| `setValue(field, keys, value)` | 按路径赋值，自动触发 callback |
| `addArrayItem(field, path, name)` | 数组字段新增一项 |
| `removeArrayItem(path, name, index)` | 数组字段删除指定项 |
| `shouldShowField(field, formData)` | 根据 dependsOn 判断是否显隐 |

### setTablePageKey

全局设置后端分页字段映射，一次设置全局生效。

**默认值：**
```typescript
{ page: 'page', size: 'size', records: 'records', total: 'total' }
```

**自定义示例：**
```typescript
setTablePageKey({ page: 'pageNum', size: 'pageSize', records: 'rows', total: 'totalCount' })
```

### buildInitialFormData

根据字段配置递归构建表单初始数据。

```typescript
buildInitialFormData(fields: IFormItem[], isCreate = false): Record<string, any>
// isCreate = true 时使用 field.defaultValue，否则值为 undefined
```

---

## 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm run build:all

# 构建单个包
pnpm build:common     # @mengtr/vue3-common
pnpm build:antdv      # @mengtr/vue3-antdv
pnpm build:element    # @mengtr/vue3-element

# 发布
pnpm pub:all          # 自动 commit + 发布三个包
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `build:common` | 构建 common 包 |
| `build:antdv` | 构建 antdv 包 |
| `build:element` | 构建 element 包 |
| `build:all` | 按顺序构建所有包 |
| `pub:common` | 发布 common 包 |
| `pub:antdv` | 发布 antdv 包 |
| `pub:element` | 发布 element 包 |
| `pub:all` | git commit + 发布所有包 |

---

## 完整类型索引

```
@mengtr/vue3-common 导出类型:
  IPageOptions / IPageOptionsJSON    页面配置
  IPAI / IPAIJSON                    CRUD API 接口
  IBasePageOptions                   页面基础配置（无 API）
  ISearch / TSearchOption            搜索配置
  ITable / ITableColumn / IAction    表格配置
  IModal / IModalForm                弹窗配置
  IFormItem / IFormItem 联合类型      表单字段配置
  IBaseFormItem                      表单字段基础接口
  IProps                             表格组件 Props
  GetData / TreeData                 数据获取类型
  ITablePageResponse                 分页响应类型
  IUseTableRes / ITableEvent         useTable 返回/事件类型
  TFormItemType / TSearchType        字段类型枚举
```

---

## 许可证

MIT
