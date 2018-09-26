import axios from 'axios'
import querystring from 'querystring';
import { Message } from 'element-ui'

let _url = window.location.href;
// 0开发环境  1测试环境  2stagng环境  3生产环境
let status = (_url.indexOf('127') > -1 || _url.indexOf('localhost') > -1) ?
  0 : _url.indexOf('mobile-test') > -1 ?
    1 : _url.indexOf('mobile-staging') > -1 ?
      2 : 3;
    status = 0;		//手动干扰

// web 端地址 http://10.23.116.187:8090 http://192.168.18.53:8090
export const ajaxUrl  = status == 0 ? 'http://10.23.116.187:8090' : status == 1 ?
  '-' : status == 2 ?
    '-' : '-';

// app 端地址
export const ajaxUrl1 = status == 0 ? 'https://uc-api-d.daydaycook.com.cn' : status == 1 ?
  '-' : status== 2 ?
    '-' : '-';

// web端请求封装 querystring.stringify 序列化 from data 形式
export const httpAjax = function (url, data) {
  const sessionid = localStorage.getItem('sessionId');
  let params = Object.assign({session: sessionid || ''}, data)
  return new Promise((resolve, reject) => {
    axios.post(url, querystring.stringify(params)).then((res)=> {
        resolve(res)
        if (res.data.code == '1097' || res.data.code == '1098' || res.data.code == '1099') {
          location.href = '/login'
          Message.error(res.data.message)
        } else if(res.data.code == '9999'){
          Message.error(res.data.message)
        }
      })
    }).catch((error)=> {
      reject(error);
    })
}
