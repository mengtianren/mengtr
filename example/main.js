import { createApp } from 'vue'

import MengtrUi, { setTablePageKey } from '@mengtr/vue3-antdv'
import '@mengtr/vue3-antdv/style'

import App from './App.vue'

setTablePageKey({
  page: 'page',
  size: 'size',
  records: 'rows',
  total: 'total'
})



let app = createApp(App)
  .use(MengtrUi)
  .mount('#app')
