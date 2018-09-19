// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import { Message } from 'element-ui'
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import * as http from '@/util/http';
import  VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import util from "./util/util";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = http
Vue.use(VueQuillEditor)

/*
 * Description: 判断session是否过期 0 -> 未登录 ， 1 -> 已登陆
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/19
 */
router.beforeEach((to, from, next) => {
  if (to.meta.power) {
    util.httpAjax('/member/islogin').then((res) => {
      if(res.code == 1) {
        if (res.data == 1) {
          return false
        }else {
          Message.error('session过期请重新登陆！');
        }
      } else if(res.code == 0) {
        Message.error('接口错误！');
      } else if (res.code == 2) {
        Message.error('请求参数错误！');
      }
      localStorage.clear()
      next({path: '/login'});
    })
  }
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
