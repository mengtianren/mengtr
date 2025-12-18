# @mengtr Components Library

这是一个基于pnpm工作空间的Vue 3组件库，包含两个主要的子包：
- `@mengtr/vue3-antdv`：基于Ant Design Vue的组件库
- `@mengtr/vue3-element`：基于Element Plus的组件库
- `@mengtr/vue3-common`：公共的工具库和类型定义

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

## 使用

### 基本使用

#### @mengtr/vue3-antdv

```vue
<template>
  <BaseTable :type="type" ref="tableRef" :options="tableOptions">
    <template #bodyCell="{ column, record, text, index }">
      <slot name="bodyCell" :column="column" :record="record" :text="text" :index="index"></slot>
      <template v-if="column.dataIndex === 'action'">
        <!-- 自定义操作按钮 -->
      </template>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { BaseTable } from '@mengtr/vue3-antdv'
</script>
```

#### @mengtr/vue3-element

```vue
<template>
  <BaseTable :type="type" ref="tableRef" :options="tableOptions">
    <template #bodyCell="{ column, record, text, index }">
      <slot name="bodyCell" :column="column" :record="record" :text="text" :index="index"></slot>
      <template v-if="column.property === 'action'">
        <!-- 自定义操作按钮 -->
      </template>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { BaseTable } from '@mengtr/vue3-element'
</script>
```

### 使用公共Hooks

```vue
<template>
  <!-- 组件模板 -->
</template>

<script setup lang="ts">
import { useTable, useTreeTable } from '@mengtr/vue3-common'

const { tableData, onSearch, onReset, pagination } = useTable(
  getData,
  true,
  initParam
)
</script>
```

## 组件列表

### BaseTable

基础表格组件，支持分页、排序、筛选等功能。

#### 属性

| 属性 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| type | `1 \| 2` | 表格类型，1表示普通表格，2表示树形表格 | 1 |
| options | `IProps` | 表格配置项 | `{}` |

#### 插槽

| 插槽名 | 描述 | 参数 |
| --- | --- | --- |
| bodyCell | 自定义单元格内容 | `{ column, record, text, index }` |

#### 暴露方法

| 方法名 | 描述 | 参数 |
| --- | --- | --- |
| onSearch | 触发搜索 | `(data?: any) => void` |
| onReset | 重置搜索 | `() => void` |
| onSetParam | 设置参数 | `(param: any) => void` |
| search | 搜索对象 | `Ref<object>` |
| pagination | 分页对象 | `Ref<object>` |

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

## 注意事项

1. 确保你的项目使用Vue 3.5.0或以上版本
2. 确保正确安装了对应的UI库依赖：
   - 使用`@mengtr/vue3-antdv`时，需要安装`ant-design-vue`和`@ant-design/icons-vue`
   - 使用`@mengtr/vue3-element`时，需要安装`element-plus`和`@element-plus/icons-vue`
3. 建议使用pnpm作为包管理器，以获得最佳的工作空间支持

## 许可证

MIT
