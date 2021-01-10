import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import axios from 'axios'
import './iconfont/iconfont.css'
import echarts from 'echarts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.use(ZkTable)
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.filter('dateFormat', function (orgin) {
  const dt = new Date(orgin)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
const vm = new Vue({
  router,
  store,
  ZkTable,
  render: h => h(App)
}).$mount('#app')

export default vm
