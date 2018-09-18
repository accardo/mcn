// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import Axios from 'axios';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import util from './util/util';
import  VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = Axios;
Vue.use(VueQuillEditor)

router.beforeEach((to, from, next) => {
	let session = localStorage.getItem('sessionId');
	if(to.meta.power){  //登录后 访问的页面
		util.isOverdue(session).then(res => {
			if(res === 'true'){
				next();
			}else{
				next({path: '/login'});
			}
		})
	}else{
		next();
	}
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  // render: (createElement) => createElement(App),
  router,
  store,
  components: { App },	
  template: '<App/>'
})/*.$mount('#app')*/
