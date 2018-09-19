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
    }).then((xhr) => {
      resolve(xhr)
    }).catch((error) => {
      reject(error)
    })
  })
}
export default {
  delay,
  httpAjax
}
