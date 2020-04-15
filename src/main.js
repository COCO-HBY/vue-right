import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import { Message } from 'element-ui'
import Popup from './components/pop/popup.js'

Vue.config.productionTip = false;

//配置请求的根路径
axios.defaults.baseURL= 'http://192.168.0.105:8088/';
// axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// 路由请求拦截
axios.interceptors.request.use(function(config){
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

// 路由响应拦截
// axios.interceptors.response.use(
//   response => {
//       if (response.code !== 200) {
//           if (response.data.code === 401) {
//               window.location.href = '/login'
//           } else {
//               return Message.error(response.message)
//           }
//       } else {
//           return response.data
//       }
//   },
//   error => {
//       return Promise.reject(error.response) // 返回接口返回的错误信息
//   })
Vue.prototype.$http = axios;
Vue.prototype.$popup = Popup.install

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
