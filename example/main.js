import { createApp } from 'vue'

import GUI, { setTablePageKey } from '@mengtr/vue3-element'
import '@mengtr/vue3-element/style'

import App from './App.vue'

setTablePageKey({
  page: 'page',
  size: 'size',
  records: 'rows',
  total: 'total'
})



let app = createApp(App)
  .use(GUI)
  .mount('#app')
