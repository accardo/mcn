/*
 * Description: 格式化 2018/01/01
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
const formatTimeOne = (str) => {
  function setv(v){v = v < 10?'0' + v : v; return v; }
  let v = new Date(str)
  let y = v.getFullYear()   //年
  let mt = v.getMonth() + 1 //上个月
  let d = v.getDate()      //天getDate.getDate()
  return y + '/' + setv(mt) + '/' + setv(d)
}
/*
 * Description: 格式化 12:00
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
const formatTimeTwo = (str) => {
  function setv(v){v = v < 10?'0' + v : v; return v; }
  var v = new Date(str)
  var h = v.getHours()
  var mn = v.getMinutes()
  return setv(h) + ':' + setv(mn)
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
 * Description: 显示内容过滤
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/9/29
 */
const formatState = (str) => {
  let state = '';
  switch (str){
    case 'A': state = '草稿';  break;
    case 'W': state = '审核中';  break;
    case 'S': state = '已发布';  break;
    case 'F': state = '未过审';  break;
    case 'T': state = '定时发布';  break;
    case 'Z': state = '已下线';  break;
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
