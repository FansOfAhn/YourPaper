import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.config.devtools = true

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app');
