import axios from 'axios'
import { Message } from 'element-ui'
import { delay } from '@/util/util'

// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/sys' : '/newfib.php'
//axios.defaults.baseURL = '/member'
// axios.defaults.timeout = process.env.TIMEOUT || 10000 // 响应时间
console.log(axios.defaults)
axios.defaults.headers['Content-Type'] = 'application/json'
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
  //instance.sessionid = localStorage.getItem('sessionId');
  if (response.data.result === -1) {
    if (response.data.code === 4001 || response.data.code === 4002) { // 未登录
      location.href = '/system.php'
    } else if (response.data.code === 4003) { // 未授权访问
      // window.loading.close()
      if (history.length > 1) {
        Message.error('无权限访问该页面')
        delay(0.5).then(() => {
          history.back()
        })
      } else {
        location.href = '/HelloWorld'
      }
      return Promise.reject(new Error(`NO PERMISSION: ${response.config.url} ${JSON.stringify(response.config.params)}`))
    }
    Message.error(
      response.data.msg || ((typeof response.data.data === 'string') ? response.data.data : '')
    )
    // 后端异常
    if (response.status > 400) {
      delay(0.3).then(() => {
        history.back()
      })
    }
    return Promise.reject(response)
  }

  instance.requestCount--
  if (instance.requestCount === 0) {
    // window.loading.close()
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
export const _put = req => instance.put(req.url, Object.assign({session: instance.sessionid, sessionId: instance.sessionid}, req.data), req.config || {})

// post
export const _post = (req) => {
  const sessionid = localStorage.getItem('sessionId');
  let data = Object.assign({session: sessionid, sessionId: sessionid}, req.data)
  return instance.post(req.url,data, req.config || {} )
}

// delete
export const _delete = req => instance.delete(req.url, req.config || {})

