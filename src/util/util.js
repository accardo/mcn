import axios from 'axios';

// 0开发环境  1测试环境  2stagng环境  3生产环境
status = 0;		//手动干扰
let ajaxUrl  = status==0?'https://uc-api-d.daydaycook.com.cn':status==1?'https://uc-api-t.daydaycook.com.cn':status==2?'https://uc-api-s.daydaycook.com.cn':'https://uc-api.daydaycook.com.cn';		         //用户、地址
let ajaxUrl2 = status==0?'https://orders-d.daydaycook.com.cn':status==1?'https://order-api-t.daydaycook.com.cn':status==2?'https://order-api-s.daydaycook.com.cn':'https://order-api.daydaycook.com.cn';           // Order module
let ajaxUrl3 = status==0?'https://cms-d.daydaycook.com.cn':   status==1?'https://cms-t.daydaycook.com.cn':status==2?'https://cms-s.daydaycook.com.cn':'https://cms.daydaycook.com.cn';                 // CMS module


/*
接口请求方法
url: 接口请求地址
method:默认get 请求
params: 请求参数
*/
let $ajax = (url = '',params ={},method ='get') => {
    return new Promise((resolve,reject) => {
        axios[method](url,params).then(res => {
            if(res.data){
                resolve(res.data);
            }else{
                reject('接口请求失败')
            }
        }).catch(error => {
            console.log(error,'错误信息');
            reject(error);
        })
    })
}

/*
获取当前时间
*/
let returnTime = () => {
	let myDate = new Date();
	let getFullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
 	let getMonth =  myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
 	let getDate = myDate.getDate(); //获取当前日(1-31)
 	let getHours = myDate.getHours(); //获取当前小时数(0-23)
 	let getMinutes = myDate.getMinutes(); //获取当前分钟数(0-59)
 	let getSeconds = myDate.getSeconds(); //获取当前秒数(0-59)
 	getMonth = getMonth.toString().length==1?'0'+getMonth:getMonth;
 	getDate = getDate.toString().length==1?'0'+getDate:getDate;
 	getHours = getHours.toString().length==1?'0'+getHours:getHours;
 	getMinutes = getMinutes.toString().length==1?'0'+getMinutes:getMinutes;
 	getSeconds = getSeconds.toString().length==1?'0'+getSeconds:getSeconds;
     //return getFullYear+'/'+getMonth+'/'+getDate+' '+getHours+':'+getMinutes+':'+getSeconds
     return getHours+':'+getMinutes+':'+getSeconds
}

// 校验是否登录
let isOverdue = (session) =>{
    let id =  session || localStorage.getItem('sessionId');
    return new Promise((resolve,reject) => {
        if(!id) { resolve('') }
        else{
            let params = {
                session:id
            }
            $ajax(`${ajaxUrl}/member/islogin`,params,'post').then(res => {
                if(res.data == 1){
                    localStorage.setItem('isLogin',true);
                    resolve('true')
                }else{
                    localStorage.setItem('isLogin',false);
                    resolve('');
                }
            }).catch(error =>{
                resolve('');
            })
            
        }
   })
}

export default {
    ajaxUrl,
    $ajax,
    returnTime,
    isOverdue
}