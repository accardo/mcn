/*
 * Description: 格式化 2018/01/01 更改：如果str为null 前端显示-
 * Author: fangqiyue 
 * Date: 2018/12/03  
 */
const formatTimeOne = (str) => {
  if(str){
    function setv(v){v = v < 10?'0' + v : v; return v; }
    let v = new Date(str)
    let y = v.getFullYear()   //年
    let mt = v.getMonth() + 1 //上个月
    let d = v.getDate()      //天getDate.getDate()
    return y + '/' + setv(mt) + '/' + setv(d)
  }else{
    return '-'
  }
}
/*
 * Description: 格式化 12:00 更改：如果str为null 前端显示-
 * Author: fangqiyue 
 * Date: 2018/12/03  
 */
const formatTimeTwo = (str) => {
  if(str){
    function setv(v){v = v < 10?'0' + v : v; return v; }
    var v = new Date(str)
    var h = v.getHours()
    var mn = v.getMinutes()
    return setv(h) + ':' + setv(mn)
  }else{
    return '-'
  }
}
/*
 * Description: 区分图文和视频 add食谱
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
const formatLabel = (str) => {
  let tempStr = ''
  if (str == 1) {
    tempStr = '图文';
  } else if (str == 2) {
    tempStr = '视频';
  }else if (str == 6) {
    tempStr = '食谱';
  }
  return tempStr
}
/*
 * Description: 显示内容过滤 新增：如果str2为Y 强制显示已下线 然后再去判断str1
 * Author: fang
 * Date: 2018/11/29
 */
const formatState = (str1,str2) => {
  let state = '';
  if(str2 == 'Y'){
    state = '已下线';
  }else{
    if(str1 === 'A'){
      state = '草稿';
    }else if(str1 === 'W'){
      state = '审核中';
    }else if(str1 === 'S'){
      state = '已发布';
    }else if(str1 === 'F'){
      state = '未过审';
    }else if(str1 === 'T'){
      state = '定时发布';
    }else if(str1 === 'Z'){
      state = '已下线';
    }
  }
  return state
}
/*
 * Description: 全局过滤器导出
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
export default {
  formatTimeOne,
  formatTimeTwo,
  formatLabel,
  formatState
}
