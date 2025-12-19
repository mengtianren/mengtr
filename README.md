# @mengtr Components Library

这是一个基于pnpm工作空间的Vue 3组件库，包含三个主要的子包：
- `@mengtr/vue3-antdv`：基于Ant Design Vue的组件库
- `@mengtr/vue3-element`：基于Element Plus的组件库
- `@mengtr/vue3-common`：公共的工具库和类型定义

**npm地址：https://www.npmjs.com/search?q=%40mengtr**


## 项目结构

```
mengtr/
├── vue3-antdv/           # 基于Ant Design Vue的组件库
│   ├── src/
│   │   ├── components/   # 组件目录
│   │   ├── types/        # 类型定义
│   │   └── index.ts      # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── vue3-element/         # 基于Element Plus的组件库
│   ├── src/
│   │   ├── components/   # 组件目录
│   │   ├── types/        # 类型定义
│   │   └── index.ts      # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── vue3-common/          # 公共工具库和类型定义
│   ├── src/
│   │   ├── hooks/        # Vue 3 Hooks
│   │   ├── types/        # 类型定义
│   │   └── index.ts      # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── package.json          # 根项目配置
└── pnpm-workspace.yaml   # pnpm工作空间配置
```

## 安装

### 安装整个组件库

```bash
pnpm add @mengtr/vue3-antdv @mengtr/vue3-element @mengtr/vue3-common
```

### 单独安装某个子包

```bash
# 安装基于Ant Design Vue的组件库
pnpm add @mengtr/vue3-antdv

# 安装基于Element Plus的组件库
pnpm add @mengtr/vue3-element

# 安装公共工具库
pnpm add @mengtr/vue3-common
```

## 包说明

### 1. @mengtr/vue3-common

公共的工具库和类型定义，被其他两个包依赖。

#### 导出方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `useTable` | 分页表格数据管理钩子 | - `getData`: 数据获取函数<br>- `init`: 是否初始化加载<br>- `param`: 初始参数<br>- `pageKey`: 分页参数映射 | `{ tableData, pagination, onSearch, onReset, onSetParam, search }` |
| `useTreeTable` | 树状表格数据管理钩子 | - `getData`: 数据获取函数<br>- `init`: 是否初始化加载<br>- `param`: 初始参数 | `{ tableData, onSearch, onReset, onSetParam, search }` |
| `setTablePageKey` | 设置分页参数映射 | - `key`: 包含page、size、records、total的对象 | `void` |
| `buildInitialFormData` | 构建表单初始数据 | - `fields`: 表单字段配置<br>- `data`: 初始数据 | `object` |

#### 使用示例

```typescript
import { useTable, setTablePageKey } from '@mengtr/vue3-common'

// 设置分页参数映射
setTablePageKey({
  page: 'page',
  size: 'pageSize',
  records: 'rows',
  total: 'total'
})

// 使用useTable钩子
const { tableData, pagination, onSearch, onReset } = useTable(
  (params) => axios.get('/api/list', { params }), // 数据获取函数
  true, // 是否初始化加载
  { status: 1 } // 初始参数
)

// 使用useTreeTable钩子
const { tableData, onSearch, onReset } = useTreeTable(
  (params) => axios.get('/api/tree', { params }), // 数据获取函数
  true, // 是否初始化加载
  { parentId: 0 } // 初始参数
)
```

### 2. @mengtr/vue3-antdv

基于Ant Design Vue的组件库，提供了一系列常用的业务组件。

#### 导出组件

| 组件名 | 别名 | 描述 |
| --- | --- | --- |
| `GPage` | `GTablePage` | 完整的增删改查页面组件 |
| `GSearch` | - | 搜索功能组件 |
| `GTable` | - | 表格+弹窗组件 |
| `GModal` | - | 模态框组件 |
| `GForm` | - | 表单组件 |
| `GFormItem` | - | 表单字段组件（即将废弃） |
| `BaseTable` | - | 基础表格组件 |

#### 导出方法

| 方法名 | 描述 | 来源 |
| --- | --- | --- |
| `useTable` | 分页表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `useTreeTable` | 树状表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `setTablePageKey` | 设置分页参数映射 | 从`@mengtr/vue3-common`导入 |

#### 使用示例

```vue
<template>
  <!-- GPage 完整增删改查页面 -->
  <GPage :options="pageOptions" @export="onExport" @import="onImport" />
  
  <!-- GSearch 搜索功能组件 -->
  <GSearch :options="searchOptions" @search="onSearch" @reset="onReset" />
  
  <!-- GTable 表格+弹窗组件 -->
  <GTable :options="tableOptions" />
  
  <!-- BaseTable 基础表格组件 -->
  <BaseTable :type="1" ref="tableRef" :options="baseTableOptions">
    <template #bodyCell="{ column, record, text, index }">
      <!-- 自定义单元格内容 -->
      <span v-if="column.dataIndex === 'status'">
        <a-tag :color="record.status === 1 ? 'green' : 'red'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </span>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { GPage, GSearch, GTable, BaseTable, useTable } from '@mengtr/vue3-antdv'
import axios from 'axios'

// GPage 配置示例
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

// GSearch 配置示例
const searchOptions = {
  searchOptions: [
    { type: 'string', label: '名称', name: 'name' },
    { type: 'select', label: '状态', name: 'status', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] }
  ],
  enableCreate: true,
  enableExport: true
}

// GTable 配置示例
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

// BaseTable 配置示例
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

// 事件处理
const onExport = () => { /* 导出逻辑 */ }
const onImport = () => { /* 导入逻辑 */ }
const onSearch = (data) => { /* 搜索逻辑 */ }
const onReset = () => { /* 重置逻辑 */ }
</script>
```

### 3. @mengtr/vue3-element

基于Element Plus的组件库，提供了与`@mengtr/vue3-antdv`相同的组件API，但使用Element Plus实现。

#### 导出组件

| 组件名 | 别名 | 描述 |
| --- | --- | --- |
| `GPage` | `GTablePage` | 完整的增删改查页面组件 |
| `GSearch` | - | 搜索功能组件 |
| `GTable` | - | 表格+弹窗组件 |
| `GModal` | - | 模态框组件 |
| `GForm` | - | 表单组件 |
| `GFormItem` | - | 表单字段组件（即将废弃） |
| `BaseTable` | - | 基础表格组件 |

#### 导出方法

| 方法名 | 描述 | 来源 |
| --- | --- | --- |
| `useTable` | 分页表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `useTreeTable` | 树状表格数据管理钩子 | 从`@mengtr/vue3-common`导入 |
| `setTablePageKey` | 设置分页参数映射 | 从`@mengtr/vue3-common`导入 |

#### 使用示例

```vue
<template>
  <!-- GPage 完整增删改查页面 -->
  <GPage :options="pageOptions" @export="onExport" @import="onImport" />
  
  <!-- GSearch 搜索功能组件 -->
  <GSearch :options="searchOptions" @search="onSearch" @reset="onReset" />
  
  <!-- GTable 表格+弹窗组件 -->
  <GTable :options="tableOptions" />
  
  <!-- BaseTable 基础表格组件 -->
  <BaseTable :type="1" ref="tableRef" :options="baseTableOptions">
    <template #bodyCell="{ column, record, text, index }">
      <!-- 自定义单元格内容 -->
      <span v-if="column.property === 'status'">
        <el-tag :type="record.status === 1 ? 'success' : 'danger'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </span>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { GPage, GSearch, GTable, BaseTable, useTable } from '@mengtr/vue3-element'
import axios from 'axios'

// 配置与@mengtr/vue3-antdv相同
const pageOptions = {
  // ... 配置内容与@mengtr/vue3-antdv相同
}

const searchOptions = {
  // ... 配置内容与@mengtr/vue3-antdv相同
}

const tableOptions = {
  // ... 配置内容与@mengtr/vue3-antdv相同
}

const baseTableOptions = {
  // ... 配置内容与@mengtr/vue3-antdv相同
}

// 事件处理
const onExport = () => { /* 导出逻辑 */ }
const onImport = () => { /* 导入逻辑 */ }
const onSearch = (data) => { /* 搜索逻辑 */ }
const onReset = () => { /* 重置逻辑 */ }
</script>
```

## 组件详细说明

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

## 开发

### 安装依赖

```bash
pnpm install
```

### 构建所有包

```bash
pnpm run build
```

### 单独构建某个包

```bash
# 构建vue3-antdv包
pnpm --filter @mengtr/vue3-antdv run build

# 构建vue3-element包
pnpm --filter @mengtr/vue3-element run build

# 构建vue3-common包
pnpm --filter @mengtr/vue3-common run build
```

### 发布包

```bash
# 发布所有包
pnpm publish -r

# 单独发布某个包
pnpm --filter @mengtr/vue3-antdv publish
```

## 类型定义

### IProps

表格配置项类型：

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

### GetData

数据获取函数类型：

```typescript
export type GetData<T = any> = (params: { page: { page: number; size: number }; param: any }) => Promise<{ [key: string]: any } & { records: T[]; total: number }>
```

### TreeData

树状数据获取函数类型：

```typescript
export type TreeData<T = any> = (params: any) => Promise<T[]>
```

## 注意事项

1. 确保你的项目使用Vue 3.5.0或以上版本
2. 确保正确安装了对应的UI库依赖：
   - 使用`@mengtr/vue3-antdv`时，需要安装`ant-design-vue`和`@ant-design/icons-vue`
   - 使用`@mengtr/vue3-element`时，需要安装`element-plus`和`@element-plus/icons-vue`
3. 建议使用pnpm作为包管理器，以获得最佳的工作空间支持
4. `GFormItem`组件即将废弃，建议使用`GForm`组件替代
5. 组件库提供了完整的TypeScript类型定义，建议使用TypeScript开发以获得更好的开发体验

## 许可证

MIT
