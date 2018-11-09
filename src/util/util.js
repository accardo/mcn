import Vue from 'vue'
import * as qiniu from "qiniu-js";
import { Message } from 'element-ui'

export function delay (time) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time * 1000)
  })
}
export function httpAjax(url, data) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http._post({
      url,
      data
    }).then((data) => {
      resolve(data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export function httpAjaxU(url, data) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http._postU({
      url,
      data
    }).then((data) => {
      resolve(data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/*
 * Description: 字符串转数组 逗号形式
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/20
 */
export function stringSplit(data) {
  return data && data.split(',')
}

/*
 * Description: 图片 视频 七牛 绝对路径
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/28
 */
export function imgUrl() {
  return 'https://mcn-video.daydaycook.com.cn/'
}

/*
 * Description: 七牛文件上传
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/28
 */
export function qiniuUpload(token, file, type) {
  return new Promise((resolve) => {
  
    let { name } =file;
    let d =name.split('.');
    let t = new Date().getTime();
    name = `${parseInt(Math.random()*100)}${t}.${d[1]}`;
    let qiniuPutExtra = {
      fname: "",
      params: {},
      mimeType: null
    };
    let qiniuConfig = {
      useCdnDomain: true,
      region: qiniu.region.z2
    };
    let observable = qiniu.upload(file, name, token, qiniuPutExtra, qiniuConfig);
    observable.subscribe({
      error(){
        if (type == 1) {
          Message.error('图片上传失败，请稍后再试');
        } else if(type === 2) {
          Message.error('视频上传失败，请稍后再试');
        }
      },
      complete(res){
        resolve(imgUrl() + res.key)
      }
    })
  })
}
export default {
  delay,
  httpAjax,
  httpAjaxU,
  stringSplit,
  imgUrl,
  qiniuUpload,
}
