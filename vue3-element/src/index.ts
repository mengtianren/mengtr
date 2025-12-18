// src/index.ts
import type { App } from 'vue';
// 增删改查完整页面 start
import GPage from '@/components/gc-page/index.vue';
// 增删改查完整页面 end

import GSearch from '@/components/gc-search/index.vue';
import GTable from '@/components/gc-table/index.vue';
import GModal from '@/components/gc-modal/index.vue';
import GForm from '@/components/gc-form/index.vue';
import BaseTable from '@/components/base-table/index.vue';
// 即将废弃 不再导出
import GFormItem from '@/components/gc-items/index.vue';


/**
 * 分页表格构建 useTable
 * @param getData 分页表格数据请求函数
 * @param init 是否初始化
 * @param param 分页表格参数
 * @param pageKey 分页参数
 * setTablePageKey
 */
export { useTable, setTablePageKey,useTreeTable } from '@mengtr/vue3-common'
// 非分页表格构建

declare module 'vue' {
  export interface GlobalComponents {
    BaseTable: typeof BaseTable;
    GSearch: typeof GSearch;
    GTable: typeof GTable;
    GModal: typeof GModal;
    GForm: typeof GForm;
    GPage: typeof GPage;
    GTablePage: typeof GPage;

  }
}


// 按需导入用
const install = (app: App): App => {
  app.component('GTablePage', GPage); // 完整增删改查页面
  app.component('GPage', GPage); // 完整增删改查页面
  app.component('GSearch', GSearch); // 搜索功能页面
  app.component('GTable', GTable);    // 表格+弹窗页面
  app.component('GModal', GModal);    // 弹窗页面 需要使用modal 
  app.component('GForm', GForm);       // 表单页面
  app.component('GFormItem', GFormItem); // 表单字段组件
  app.component("BaseTable", BaseTable); // 基础表格组件

  return app;
};

export { GPage, GPage as GTablePage, GSearch, GTable, GModal, GForm, GFormItem, BaseTable };
// 全局导入用
export default {
  install,
};
