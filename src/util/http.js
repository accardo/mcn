import axios from 'axios'
import { Message } from 'element-ui'
import { delay } from '@/util/util'
import querystring from 'querystring';

// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/sys' : '/newfib.php'
//axios.defaults.baseURL = '/member'
// axios.defaults.timeout = process.env.TIMEOUT || 10000 // 响应时间
axios.defaults.headers['Content-Type'] = 'application/json'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.sessionid = localStorage.getItem('sessionId');

const instance = axios.create({
  // withCredentials: true, // 允许跨域 cookie
  validateStatus (status) {
    return (status >= 200 && status < 300) || (status > 400 && status < 500) // 获取服务端异常
  }
})
const Promise = require('es6-promise').Promise

instance.requestCount = 0

instance.interceptors.request.use((config) => {
  instance.requestCount++;
  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  console.log(response, 'response');
  // app 0 -> 请求错误, 2 -> 参数错误, 1-> 成功
  // web 1097 ->  登陆超时，请重新登陆, 1098 -> 信息不存在,授权失败, 1099 -> session不能为空，9999 -> 未知错误, 0000 -> 成功
  if (response.data.code == '0') {
    Message.error('请求错误')
  } else if (response.data.code == '2') {
    Message.error('参数错误')
  }
  if (response.data.code != '0000' && response.data.code != '0' && response.data.code != '1' && response.data.code != '2' &&
    response.data.code != '10001' && response.data.code != '10004' && response.data.code != '10005' &&
    response.data.code != '10013' && response.data.code != '10014') {
    Message.error(response.data.message)
    if (response.data.code == '1097') {
      location.href = '/login'
    }
   // return Promise.reject(response)
  }

  instance.requestCount--
  if (instance.requestCount === 0) {
   //  window.loading.close()
  }
  return response.data
}, (error) => {
  Message.error('网络异常')
  // window.loading.close()
  return Promise.reject(error)
})

export default instance
// get
export const _get = (req) => {
  if (typeof req === 'string') {
    return instance.get(req)
  }
  return instance.get(req.url, { params: req.data })
}
// put
export const _put = req => instance.put(req.url, req.data, req.config || {})

// app post
export const _post = (req) => {
  const sessionid = localStorage.getItem('sessionId');
  let data = Object.assign({session: sessionid}, req.data)
  console.log(data, req.url, 'app 请求地址')
  return instance.post(req.url,data, req.config || {} )
}

// 坑爹的后端 web post
export const _postU = (req) => {
  const sessionid = localStorage.getItem('sessionId');
  let data = Object.assign({session: sessionid}, req.data)
  console.log(data, req.url, 'web 请求地址')
  return instance.post(req.url,querystring.stringify(data), {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'} } )
}

// delete
export const _delete = req => instance.delete(req.url, req.config || {})

