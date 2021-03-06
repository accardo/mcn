import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('@/pages/index/index.vue');
const Login = () => import('@/pages/login/login.vue');              //登录
const Register = () => import('@/pages/register/register.vue');     //注册-基本信息
const IdTest = () => import('@/pages/idTest/idTest.vue');             //身份认证
const Video = () => import('@/pages/video/video.vue');                //视频管理
const Layout = () => import('@/pages/layout/layout.vue');
const EditVideo = () => import('@/pages/editVideo/editVideo.vue');   //添加、修改视频
const Pic = () => import('@/pages/pic/pic.vue');   //图片管理
const EditPic = () => import('@/pages/editPic/editPic.vue');   //添加、修改图片
const Recipe = () => import('@/pages/recipe/recipe.vue');   //食谱管理
const EditRecipe = () => import('@/pages/editRecipe/editRecipe.vue');   //添加、修改管理


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    { path: '/',                  name: 'login',              component: Login, meta: { power: false, } },
    {
      path:'/layout',
      name:'layout',
      component:Layout,
      meta: {power: true, },
      children:[
        { path: '/index',              name: 'index',              component: Index,meta: {power: true, } },
        { path: '/video',              name: 'video',              component: Video,meta: {power: true, } },
        { path: '/createVideo',        name: 'createVideo',        component: EditVideo,meta: {power: true, }  },
        { path: '/editVideo/:id',      name: 'editVideo',          component: EditVideo,meta: {power: true, }  },
        { path: '/pic',                name: 'pic',                component: Pic,meta: {power: true, } },
        { path: '/createPic',          name: 'createPic',          component: EditPic,meta: {power: true, } },
        { path: '/editPic',            name: 'editPic',            component: EditPic,meta: {power: true, } },
        { path: '/recipe',             name: 'recipe',             component: Recipe,meta: {power: true, } },
        { path: '/createRecipe',       name: 'createRecipe',       component: EditRecipe,meta: {power: true, } },
        { path: '/editRecipe',         name: 'editRecipe',         component: EditRecipe,meta: {power: true, } },
      ]
    },
    { path: '/login',              name: 'login',              component: Login,meta: {power: false, }  },
    { path: '/register',           name: 'register',           component: Register ,meta: {power: false, } },
    { path: '/idTest',             name: 'idTest',             component: IdTest,meta: {power: false, } },
  ]
})
