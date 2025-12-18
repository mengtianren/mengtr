# @mengtr/vue3-antdv 组件库

@mengtr/vue3-antdv 是一个基于 Vue 3 和 Ant Design Vue 开发的组件库，提供了一系列常用的业务组件，用于快速构建后台管理系统页面。

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── base-table/     # 基础表格组件
│   ├── gc-form/        # 表单组件
│   ├── gc-items/       # 表单字段组件
│   │   └── editor/     # 富文本编辑器
│   ├── gc-modal/       # 模态框组件
│   ├── gc-page/        # 完整增删改查页面
│   ├── gc-search/      # 搜索组件
│   └── gc-table/       # 表格+弹窗组件
├── index.ts            # 入口文件
└── shims.d.ts          # 类型声明
```

## 组件说明

### 1. 页面组件

#### GPage / GTablePage
- **文件路径**: `components/gc-page/index.vue`
- **功能**: 完整的增删改查页面组件，集成了搜索、表格、分页、模态框等功能
- **别名**: GTablePage

### 2. 基础表格组件

#### BaseTable
- **文件路径**: `components/base-table/index.vue`
- **功能**: 基础表格组件，提供表格的基础功能

### 3. 搜索组件

#### GSearch
- **文件路径**: `components/gc-search/index.vue`
- **功能**: 搜索功能组件，支持多种搜索字段类型

### 4. 表格组件

#### GTable
- **文件路径**: `components/gc-table/index.vue`
- **功能**: 表格+弹窗组件，集成了表格和模态框功能

### 5. 模态框组件

#### GModal
- **文件路径**: `components/gc-modal/index.vue`
- **功能**: 模态框组件，用于展示表单或详情

### 6. 表单组件

#### GForm
- **文件路径**: `components/gc-form/index.vue`
- **功能**: 表单组件，用于构建表单页面
```
 <GForm  ref="formRef" v-model:formData="formData" :options="modal.form" />
 // 验证表单 formRef.value.validateFields()
 // 清除表单 formRef.value.resetFields()
```

#### GFormItem
- **文件路径**: `components/gc-items/index.vue`
- **功能**: 表单字段组件，支持多种表单字段类型
- **状态**: 即将废弃，不再推荐使用

### 7. 编辑器组件

#### GEditor
- **文件路径**: `components/gc-items/editor/index.vue`
- **功能**: 富文本编辑器组件

## 钩子函数

### useTable
- **文件路径**: `hooks/useTable.ts`
- **功能**: 分页表格数据管理钩子，处理表格数据的获取、搜索、分页等逻辑
- **参数**:
  - `getData`: 获取数据的接口函数
  - `init`: 是否初始化加载数据
  - `param`: 初始参数
  - `pageKey`: 分页参数配置
- **返回值**:
  - `tableData`: 表格数据
  - `pagination`: 分页配置
  - `selectedRowKeys`: 选中的行 keys
  - `rowSelection`: 行选择配置
  - `onSearch`: 搜索方法
  - `onReset`: 重置方法
  - `onSetParam`: 设置参数方法

### useTreeTable
- **文件路径**: `hooks/useTreeTable.ts`
- **功能**: 树状表格数据管理钩子，基于 useTable 实现
- **参数**: 与 useTable 相同
- **返回值**: 与 useTable 相同

### setTablePageKey
- **文件路径**: `hooks/useTable.ts`
- **功能**: 设置表格分页参数的 key
- **参数**:
  - `key`: 包含 page、size、records、total 的对象

## 类型定义

### IPageOptions
- **文件路径**: `types/table-page.ts`
- **功能**: 页面配置类型，包含搜索、表格、模态框等配置

### IPageOptionsJSON
- **文件路径**: `types/table-page.ts`
- **功能**: JSON 格式的页面配置类型

### FieldType
- **文件路径**: `types/table-page.ts`
- **类型**: `'number' | 'string' | 'datapicker' | 'rangepicker' | 'select' | 'treeselect'`
- **功能**: 搜索字段类型

### IPAIJSON
- **文件路径**: `types/table-page.ts`
- **功能**: JSON 格式的 API 配置类型

### IPAI
- **文件路径**: `types/table-page.ts`
- **功能**: API 配置类型，包含分页、详情、删除、修改、新增等接口

### TSearchType
- **文件路径**: `types/table-page.ts`
- **功能**: 搜索类型

### TFormItemType
- **文件路径**: `types/table-page.ts`
- **类型**: `'rangepicker' | 'datepicker' | 'component' | 'editor' | 'switch' | 'select' | 'input' | 'textarea' | 'number' | 'treeselect'  | 'object' | 'array'`
- **功能**: 表单项类型

### GetData
- **文件路径**: `types/table-type.ts`
- **功能**: 获取数据的函数类型

### TreeData
- **文件路径**: `types/table-type.ts`
- **功能**: 获取树状数据的函数类型

## 使用示例

### 安装

```bash
npm install @mengtr/vue3-antdv
```

### 全局引入

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import GcPage, { setTablePageKey } from '@mengtr/vue3-antdv'
import '@mengtr/vue3-antdv/style'
// setTablePageKey({
//   page: 'page',
//   size: 'size',
//   records: 'rows',
//   total: 'total'
// })
const app = createApp(App)
app.use(GcPage)
app.mount('#app')
```

### 按需引入

```javascript
import { GPage, GTablePage, GSearch, GTable, GModal, GEditor, GForm, BaseTable, useTable, setTablePageKey } from '@mengtr/vue3-antdv'
```

### 基础使用

#### GPage / GTablePage

```vue
<template>
  <GPage :options="pageOptions" @export="onExport" @import="onImport" />
  <!-- 或 -->
  <GTablePage :options="pageOptions" @export="onExport" @import="onImport" />
</template>

<script setup lang="ts">
import { GPage } from '@mengtr/vue3-antdv'

const pageOptions = {
  search: {
    searchOptions: [
      { type: 'string', label: '名称', name: 'name',span: 6 },
      { type: 'select', label: '状态', name: 'status', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] }
    ],
    enableCreate: true,
    enableExport: true
    enableImport: true
  },
  table: {
    columns: [
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '状态', dataIndex: 'status', key: 'status' }
    ],
    actions: [
      { label: '编辑', key: 1 },
      { label: '详情', key: 2 },
      { label: '删除', key: 3 },
      { label: '自定义', key: 4, callback:()=> {} },
    ],
    initParam: {}
  },
  modal: {
    config: { title: '编辑' },
    form: {
      config: {},
      fields: [
        { type: 'input', label: '名称', name: 'name',config:{} }
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
// 导入
const onImport = () => {}
// 导出
const onExport = () => {}

</script>
```

#### GSearch

```vue
<template>
  <GSearch :options="searchOptions" @search="onSearch" @reset="onReset" @export="onExport" @import="onImport" />
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

const onSearch = (data, type) => {
  console.log('搜索', data, type)
}

const onReset = () => {
  console.log('重置')
}
// 导入
const onImport = () => {}
// 导出
const onExport = () => {}
</script>
```

#### GTable

```vue
<template>
  <GTable :options="tableOptions" />
</template>

<script setup lang="ts">
import { GTable } from '@mengtr/vue3-antdv'

const tableOptions = {
  columns: [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status' }
  ],
  actions: [
    { label: '编辑', key: 1 },
    { label: '详情', key: 2 },
    { label: '删除', key: 3 },
    
  ],
  data: (params) => axios.get('/api/list', { params })
}
</script>
```

#### useTable

```typescript
import { useTable } from '@mengtr/vue3-antdv'

const { tableData, pagination, onSearch, onReset } = useTable(
  (params) => axios.get('/api/list', { params }), // 获取数据的接口
  true, // 是否初始化加载
  {}, // 初始参数
  { page: 'page', size: 'pageSize', records: 'list', total: 'total' } // 分页参数映射
)
```

## 类型说明

### 搜索选项类型 (TSearchOption)

```typescript
// 数字类型
{ type: 'number', label: 'ID', name: 'id' }

// 字符串类型
{ type: 'string', label: '名称', name: 'name' }

// 日期选择器
{ type: 'datapicker', label: '创建时间', name: 'createTime', picker: 'date' }

// 范围选择器
{ type: 'rangepicker', label: '时间范围', name: 'timeRange', picker: 'date', config: { startKey: 'startTime', endKey: 'endTime' } }

// 下拉选择器
{ type: 'select', label: '状态', name: 'status', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] }

// 树状选择器
{ type: 'treeselect', label: '分类', name: 'category', options: [{ value: 1, label: '分类1', children: [{ value: 2, label: '分类2' }] }] }
```

### 表单项类型 (IFormItem)

```typescript
// 输入框
{ type: 'input', label: '名称', name: 'name', config: { placeholder: '请输入名称' } }

// 文本域
{ type: 'textarea', label: '描述', name: 'description', config: { rows: 4 } }

// 数字输入框
{ type: 'number', label: '数量', name: 'count', config: { min: 0 } }

// 开关
{ type: 'switch', label: '状态', name: 'status' }

// 日期选择器
{ type: 'datepicker', label: '创建时间', name: 'createTime', config: { picker: 'date' } }

// 范围选择器
{ type: 'rangepicker', label: '时间范围', name: 'timeRange', config: { picker: 'date' } }

// 下拉选择器
{ type: 'select', label: '状态', name: 'status', config: { options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] } }

// 树状选择器
{ type: 'treeselect', label: '分类', name: 'category', config: { treeData: [{ value: 1, title: '分类1' }] } }

// 富文本编辑器
{ type: 'editor', label: '内容', name: 'content' }


// 对象类型（嵌套表单）
{ type: 'object', label: '扩展信息', name: 'ext', fields: [{ type: 'input', label: '字段1', name: 'field1' }] }

// 数组类型（动态表单）
{ type: 'array', label: '列表数据', name: 'list', fields: [{ type: 'input', label: '名称', name: 'name' }] }

// 组件类型（自定义组件）
{ type: 'component', component: '具体组件', label: '自定义组件', name: 'customComponent', config: {} }
```

## 注意事项

1. 组件库基于 Vue 3 和 Ant Design Vue 开发，使用前请确保已安装相关依赖
2. 组件库提供了完整的类型定义，建议使用 TypeScript 开发以获得更好的开发体验
3. 组件库支持按需引入，可根据需要引入所需组件
4. 组件库的 API 设计遵循了 Ant Design Vue 的设计风格，使用时可参考 Ant Design Vue 的文档
5. GFormItem 组件即将废弃，不再推荐使用，建议使用 GForm 组件替代
6. 对于复杂的业务场景，可通过扩展组件或自定义钩子函数来满足需求

## 版本更新

- **v1.0.0**: 初始版本，包含基础组件和钩子函数
  - 页面组件：GPage、GTablePage
  - 搜索组件：GSearch
  - 表格组件：GTable、BaseTable
  - 模态框组件：GModal
  - 表单组件：GForm、GFormItem（即将废弃）
  - 编辑器组件：GEditor
  - 钩子函数：useTable、useTreeTable、setTablePageKey


