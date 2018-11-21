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
			title:'DDCTV优享拍客校园短视频大赛投票开启',
			desc:'10月17日正式开启',
			img: window.location.origin+'/mcn/vote/images/share.jpg'
		}
		util.wxShare(share.title,share.desc,share.img)
	},
	haveList:function(callback2){
		//判断当前用户是否已上传过视频
		var self = this;
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/findVideoInfo',{
			session:self.data.sessionId,
			pageSize:10,
			pageIndex:1
		},function(res){
			if(res.code == '0000'){
				if(res.data.total > 0){
					self.data.html += '<div class="half"><a href="my.html?sessionId='+ self.data.sessionId +'" class="my">我的作品</a></div>';
				}
			}
			callback2()
		},'POST')
	},
	init:function(){
		var self = this;
		//检测用户是否登录
		util.isLogin(function(sessionId){
			self.data.sessionId = sessionId;
			//先判断是否已上传过视频
			self.haveList(function(){
				self.data.html = '<div class="half"><a href="vote.html" class="sign">我要投票</a></div>'+self.data.html;
				//执行相关操作
				self.handle();
			})
		})
	}
}

index.init();