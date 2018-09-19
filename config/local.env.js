'use strict'
// 配置4种环境 1、url1 -> 开发环境 urlM1 -> 登陆验证 1、url2 -> 测试环境 3、url3 -> 预生产环境 url4 -> 生产环境
let domainUrl;
let domainMurl;
const isSwitch = 1;
const url1 = 'http://10.23.116.187:8090';
const urlM1 = 'https://uc-api-d.daydaycook.com.cn';

const url2 = 'https://store-wms-t.daydaycook.com.cn';
const urlM2 = 'https://uc-api-t.daydaycook.com.cn';

const url3 = 'https://store-wms-s.daydaycook.com.cn';
const urlM3 = 'https://uc-api-s.daydaycook.com.cn';

const url4 = 'https://store-wms.daydaycook.com.cn';
const urlM4 = 'https://uc-api.daydaycook.com.cn';

switch (isSwitch) {
  case 1:
    domainUrl = url1;
    domainMurl = urlM1;
    break;
  case 2:
    domainUrl = url2;
    domainMurl = urlM2;
    break;
  case 3:
    domainUrl = url3;
    domainMurl = urlM3;
    break;
  case 4 :
    domainUrl = url4;
    domainMurl = urlM4;
}
module.exports = {
  apiHost: JSON.stringify(domainUrl),
  apiHostMurl: JSON.stringify(domainMurl)
}
/*
apiHost_d: JSON.stringify('https://wms-d.daydaycook.com.cn'),
  apiHost_t: JSON.stringify('https://store-wms-t.daydaycook.com.cn'),
  apiHost_s: JSON.stringify('https://store-wms-s.daydaycook.com.cn'),
  apiHost: JSON.stringify('https://store-wms.daydaycook.com.cn'),*/
/*
let ajaxUrl  = status==0?'https://uc-api-d.daydaycook.com.cn':status==1?'https://uc-api-t.daydaycook.com.cn':status==2?'https://uc-api-s.daydaycook.com.cn':'https://uc-api.daydaycook.com.cn';		         //用户、地址
let ajaxUrl2 = status==0?'https://orders-d.daydaycook.com.cn':status==1?'https://order-api-t.daydaycook.com.cn':status==2?'https://order-api-s.daydaycook.com.cn':'https://order-api.daydaycook.com.cn';           // Order module
let ajaxUrl3 = status==0?'https://cms-d.daydaycook.com.cn':   status==1?'https://cms-t.daydaycook.com.cn':status==2?'https://cms-s.daydaycook.com.cn':'https://cms.daydaycook.com.cn';                 // CMS module
*/
