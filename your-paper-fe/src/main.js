import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import axios from 'axios'
import { FIELD, SORT_P_ENUM, CRITERIA } from '../public/apis/api/paper-api.js'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$FIELD = FIELD
Vue.prototype.$CRITERIA = CRITERIA
Vue.prototype.$SORT_P_ENUM = SORT_P_ENUM

Vue.config.devtools = true


new Vue({
  FIELD,
  CRITERIA,
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app');
