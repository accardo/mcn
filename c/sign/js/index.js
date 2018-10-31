sessionStorage.setItem('source',util.getQueryString('source'));
sessionStorage.setItem('activityId',util.getQueryString('activityId'));

var index = {
	data:{
		sessionId:'',
		html:'',
	},
	handle:function(){
		//相关操作
		var self = this;
		$('.index .btns').html(self.data.html);
		//若只有一个按钮，则居中
		setTimeout(function(){
			if($('.index .btns .half').length == 1){
				$('.index .btns .half').css('width','100%')
			}
		},50)

		//分享操作
		var share = {
			title:'优享拍客校园视频大赛报名',
			desc:'最高10000元奖金请自取',
			img: window.location.origin+'/mcn/sign/images/share.jpg'
			// img:'https://mobile.daydaycook.com.cn/logo.png'
		}
		util.wxShare(share.title,share.desc,share.img)
	},
	haveList:function(callback){
		//判断当前用户是否已上传过视频
		var self = this;
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/findVideoInfo',{
			session:self.data.sessionId,
			pageSize:10,
			pageIndex:1
		},function(res){
			if(res.code == '0000'){
				if(res.data.total > 0){
					self.data.html += '<div class="half"><a href="my.html" class="my">我的作品</a></div>';
				}
			}
			callback()
		})
	},
	init:function(){
		var self = this;
		//检测用户是否登录
		util.isLogin(function(sessionId){
			self.data.sessionId = sessionId;
			//先判断是否已上传过视频
			self.haveList(function(){
				//检测活动是否有效
				var activityId = util.getQueryString('activityId');
				if(!activityId){
					util.showToast2('获取活动失败',3000)
				}else{
					util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/checkProduct',{
						session:self.data.sessionId,
						id:activityId
					},function(res){
						if(res.code == '0000'){
							sessionStorage.setItem('upload',1)
							self.data.html+= '<div class="half"><a href="https://mobile.daydaycook.com.cn/mcn/vote/index.html" class="sign">我要投票</a></div>';
						}else{
							util.showToast2(res.message,3000)
						}
						//执行相关操作
						self.handle();
					})
				}
			})
		})

		// var _url = 'http://192.168.18.53:8090/kol/works/list';
		// var _url = 'http://10.23.116.187:8090/kol/works/list';
		// util.fetch(_url,{
		// 	state:2,
		// 	pageIndex:1,
		// 	pageSize:1,
		// 	session:'0f3fc320-daf3-4393-9553-1e493eb8bd2f'
		// },function(res){
		// 	console.log(res)
		// })

		// var params = {
		// 	state:2,
		// 	pageIndex:1,
		// 	pageSize:1,
		// 	session:'0f3fc320-daf3-4393-9553-1e493eb8bd2f'
		// }
		// axios({
		// 	url:'http://10.23.116.187:8090/kol/works/list',
		// 	method: 'post',
		// 	data: params,
		// 	changeOrigin:true,
		// 	headers:{
		// 		'Content-Type':'application/x-www-form-urlencoded'
		// 	}
		// }).then(res => {
		// 	console.log(res)
		// })

		// axios.post('http://10.23.116.187:8090/kol/works/list',{
		// 	state:2,
		// 	pageIndex:1,
		// 	pageSize:1
		// },function(res){
		// 	console.log(res)
		// })
	}
}

index.init();