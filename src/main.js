// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as http from '@/util/http';
import  VueQuillEditor from 'vue-quill-editor';
import * as filters from '@/util/filters'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = http
Vue.use(VueQuillEditor)

/*
 * Description: 全局过滤器 多个注册
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
Object.keys(filters.default).forEach((key) => {
  Vue.filter(key,filters.default[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
