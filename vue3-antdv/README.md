# @mengtr/vue3-antdv

基于 Ant Design Vue 的组件库，提供了一系列常用的业务组件，用于快速构建后台管理系统页面。

**npm地址：https://www.npmjs.com/package/@mengtr/vue3-antdv**

## 安装

```bash
pnpm add @mengtr/vue3-antdv
```

## 导出组件

| 组件名 | 别名 | 描述 |
| --- | --- | --- |
| `GPage` | `GTablePage` | 完整的增删改查页面组件 |
| `GSearch` | - | 搜索功能组件 |
| `GTable` | - | 表格+弹窗组件 |
| `GModal` | - | 模态框组件 |
| `GForm` | - | 表单组件 |
| `GFormItem` | - | 表单字段组件（即将废弃） |
| `BaseTable` | - | 基础表格组件 |

## 导出方法

| 方法名 | 描述 | 来源 |
| --- | --- | --- |
| `useTable` | 分页表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `useTreeTable` | 树状表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `setTablePageKey` | 设置分页参数映射 | 从`@mengtr/vue3-common`导入 |

## 使用示例

### 完整页面组件 GPage

```vue
<template>
  <GPage :options="pageOptions" @export="onExport" @import="onImport" />
</template>

<script setup lang="ts">
import { GPage } from '@mengtr/vue3-antdv'
import axios from 'axios'

const pageOptions = {
  search: {
    searchOptions: [
      { type: 'string', label: '名称', name: 'name', span: 6 },
      { type: 'select', label: '状态', name: 'status', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] }
    ],
    enableCreate: true,
    enableExport: true,
    enableImport: true
  },
  table: {
    columns: [
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '操作', dataIndex: 'action', key: 'action' }
    ],
    actions: [
      { label: '编辑', key: 1 },
      { label: '详情', key: 2 },
      { label: '删除', key: 3 },
      { label: '自定义', key: 4, callback: (record) => console.log('自定义操作', record) }
    ],
    initParam: {}
  },
  modal: {
    config: { title: '编辑' },
    form: {
      config: {},
      fields: [
        { type: 'input', label: '名称', name: 'name', config: { placeholder: '请输入名称' } }
      ]
    }
  },
  API: {
    getPage: (params) => axios.get('/api/list', { params }),
    detailApi: (id) => axios.get(`/api/detail/${id}`),
    delApi: (id) => axios.delete(`/api/delete/${id}`),
    putApi: (data) => axios.put('/api/update', data),
    postApi: (data) => axios.post('/api/create', data)
  }
}

const onExport = () => { /* 导出逻辑 */ }
const onImport = () => { /* 导入逻辑 */ }
</script>
```

### 搜索组件 GSearch

```vue
<template>
  <GSearch :options="searchOptions" @search="onSearch" @reset="onReset" />
</template>

<script setup lang="ts">
import { GSearch } from '@mengtr/vue3-antdv'

const searchOptions = {
  searchOptions: [
    { type: 'string', label: '名称', name: 'name' },
    { type: 'select', label: '状态', name: 'status', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] }
  ],
  enableCreate: true,
  enableExport: true
}

const onSearch = (data) => { /* 搜索逻辑 */ }
const onReset = () => { /* 重置逻辑 */ }
</script>
```

### 表格组件 GTable

```vue
<template>
  <GTable :options="tableOptions" />
</template>

<script setup lang="ts">
import { GTable } from '@mengtr/vue3-antdv'
import axios from 'axios'

const tableOptions = {
  columns: [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作', dataIndex: 'action', key: 'action' }
  ],
  actions: [
    { label: '编辑', key: 1 },
    { label: '详情', key: 2 },
    { label: '删除', key: 3 }
  ],
  data: (params) => axios.get('/api/list', { params })
}
</script>
```

### 基础表格组件 BaseTable

```vue
<template>
  <BaseTable :type="1" ref="tableRef" :options="baseTableOptions">
    <template #bodyCell="{ column, record, text, index }">
      <span v-if="column.dataIndex === 'status'">
        <a-tag :color="record.status === 1 ? 'green' : 'red'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </span>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { BaseTable, useTable } from '@mengtr/vue3-antdv'
import axios from 'axios'

const baseTableOptions = {
  columns: [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作', dataIndex: 'action', key: 'action' }
  ],
  data: (params) => axios.get('/api/list', { params }),
  initParam: {},
  rowKey: 'id'
}
</script>
```

## API 说明

### GPage / GTablePage

完整的增删改查页面组件，集成了搜索、表格、分页、模态框等功能。

#### 属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `options` | `IPageOptions` | 页面配置项，包含搜索、表格、模态框和API配置 |
| `disabled` | `boolean` | 是否禁用 |

#### 事件

| 事件名 | 描述 | 参数 |
| --- | --- | --- |
| `export` | 导出事件 | - |
| `import` | 导入事件 | - |
| `search` | 搜索事件 | `data: object` |
| `reset` | 重置事件 | - |

### GSearch

搜索功能组件，支持多种搜索字段类型。

#### 属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `options` | `ISearch` | 搜索配置项 |

#### 事件

| 事件名 | 描述 | 参数 |
| --- | --- | --- |
| `search` | 搜索事件 | `data: object` |
| `reset` | 重置事件 | - |
| `create` | 新增事件 | - |
| `export` | 导出事件 | - |
| `import` | 导入事件 | - |

### GTable

表格+弹窗组件，集成了表格和模态框功能。

#### 属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `options` | `ITable` | 表格配置项 |

### BaseTable

基础表格组件，支持分页、排序、筛选等功能。

#### 属性

| 属性 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `type` | `1 \| 2` | 表格类型，1表示普通表格，2表示树形表格 | 1 |
| `options` | `IProps` | 表格配置项 | `{}` |

#### 插槽

| 插槽名 | 描述 | 参数 |
| --- | --- | --- |
| `bodyCell` | 自定义单元格内容 | `{ column, record, text, index }` |

#### 暴露方法

| 方法名 | 描述 | 参数 |
| --- | --- | --- |
| `onSearch` | 触发搜索 | `(data?: any) => void` |
| `onReset` | 重置搜索 | `() => void` |
| `onSetParam` | 设置参数 | `(param: any) => void` |
| `search` | 搜索对象 | `Ref<object>` |
| `pagination` | 分页对象 | `Ref<object>` |

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

  watch?: {              // 监听配置
    key: string[]        // 监听字段路径
    callback: (value: any) => void  // 监听回调
  },
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
   pnpm add ant-design-vue @ant-design/icons-vue
   ```
3. 建议使用 TypeScript 开发以获得更好的开发体验
4. `GFormItem` 组件即将废弃，建议使用 `GForm` 组件替代

## 许可证

MIT
