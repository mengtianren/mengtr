# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-05-20

### Fixed
- Element Plus gc-table 错误导入 antdv `FormExpose` 类型，改为独立接口定义
- example/data.js 缺少 `computed` 的 Vue import
- 移除所有组件中残留的 `console.log`/`console.warn` 调试语句（20+处），catch 块改为 `console.error`
- `formData.value.id` 为 0 时被误判为 falsy 导致 PUT 请求走了 POST
- Element gc-search 中 `'yearr'` 拼写错误
- Element gc-items 中 `el-button type="danger"` 无效属性
- gc-search 组件名重复定义（`defineOptions` + `export default`）

### Changed
- 三个包版本统一升级至 1.1.2
- 移除 gc-search 中被注释的旧代码和空样式块
- 删除 Element gc-search 中未使用的 `getRangePicker` 函数
- 更新 CLAUDE.md 项目文档

## [1.0.0] - 2025-12-18

### Added
- Initial release of the component library
- Added `@mengtr/vue3-common` package with common hooks and types
- Added `@mengtr/vue3-antdv` package with Ant Design Vue components
- Added `@mengtr/vue3-element` package with Element Plus components
- BaseTable component for both UI libraries
- useTable and useTreeTable hooks for data management
- Support for custom cell content via slots
- Pagination support
- Scroll and border configuration

### Changed
- Unified component API across both UI libraries
- Improved type definitions for better TypeScript support
- Fixed build issues with vite-plugin-dts
- Optimized component performance

### Fixed
- Type inference errors in Vue components
- Correctly handle empty data arrays
- Fixed scroll behavior in tables
- Resolved dependency conflicts
