# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [1.0.0] - 2025-12-18

### Added
- Initial release
- BaseTable component
- useTable and useTreeTable hooks
- Type definitions for all components
- Support for pnpm workspaces
- Build configuration for all packages
