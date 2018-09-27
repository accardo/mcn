import Vue from 'vue'
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
export function imgUrl() {
  return 'https://mcn-video.daydaycook.com.cn/'
}
export default {
  delay,
  httpAjax,
  httpAjaxU,
  stringSplit,
  imgUrl,
}
