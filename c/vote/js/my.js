var my = {
	data:{
		sessionId:'',
		page:1,			//页数
		clickBtn:true,	//防止重复点击
		list:[],
		userName:'',	//用户信息
	},
	handle:function(){
		//相关操作
		var self = this;
		var share = {
			title:self.data.userName?self.data.userName+'的作品':'DDCTV优享拍客校园短视频大赛投票开启',
			desc:'10月17日正式开启',
			img: window.location.origin+'/mcn/vote/images/share.jpg'
		}
		util.wxShare(share.title,share.desc,share.img)
	},
	render:function(){
		var self = this;
		var _html = '';
		self.data.list.forEach(function(item){
			_html += '<div class="item">';
			var _s = (function(){
				if(item.auditState == 'W'){
					//待审核
					return 's2'
				}else if(item.auditState == 'S'){
					//审核通过
					return 's1'
				}else if(item.auditState == 'F'){
					//未通过
					return 's3'
				}
			})();
			// var status = '<div class="status '+ _s +'"></div>';
			var video = '<video style="object-fit: fill" controls="controls" src="'+ item.qiniuHref +'"></video>';
			// var video = '<video style="object-fit: fill"><source src="'+ item.qiniuHref +'"></video>';
			_html += status+'<div class="img"><div class="icon '+ item.auditState +'"></div>'+ video +'</div>';
			_html += '<div class="title">'+ item.videoTitle +'</div>';
			_html += '<div class="icons"><span>'+ item.videoType +'</span></div>';
			// if(item.auditState == 'S') _html += '<div class="remain">还剩<span>7天</span>可以拉票哦！</div>';
			// if(item.auditState == 'S') _html += '<div class="rank">视频排名<span>第234名</span></div>';
			//1:投票 2：投票结束 3：已投票
			// item.voteState = 1;		//临时
			var voteState = (function(){
				if(item.voteState == 1){
					return '<div class="btn" onClick="goVote('+ item.id +',this)">投票</div>'
				}else if(item.voteState == 2){
					return '<div class="btn2">投票结束</div>'
				}else if(item.voteState == 3){
					return '<div class="btn2">已投票</div>'
				}
			})();
			var btns = '<div class="btns">'+ voteState +'</div>'
			if(item.auditState == 'S') _html += '<div class="vote2"><div class="num"><span>'+ item.netBallots +'</span>票</div>'+ btns +'</div>';
			_html += '</div>';
		})
		$('.scroll').html(_html);
	},
	getAjax:function(){
		//拉取列表
		var self = this;
		var params = {
			session:util.getQueryString('sessionId') || self.data.sessionId,
			pageSize:10,
			pageIndex:self.data.page
		}
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/findVideoInfo',params,function(res){
			if(res.code == '0000'){
				if(res.data.total > 0){
					//列表返回有数据
					var list = res.data.rows;
					self.data.list = self.data.list.concat(list);
					self.render();
					if(self.data.list.length < res.data.total){
						//请求下一页
						self.data.page++
						self.getAjax();
					}
				}
			}else{
				//作品为空
				$('.user').html('<p style="color:#fff">'+ res.message +'</p>');
				$('.list').hide();
			}
		})
	},
	getUserInfo:function(){
		//获取用户信息
		var self = this;
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/findUserBaseInfo',{
			session:util.getQueryString('sessionId') || self.data.sessionId
		},function(xhr){
			if(xhr.code == '0000'){
				var res = xhr.data;
				$('.user .school').html(res.schoolName);
				self.data.userName = res.userName;
				$('.user .name').html(res.userName);
				document.title = res.userName+'的作品';
				self.handle();
			}else{
				util.showToast2(xhr.message,1500)
			}
		})
		//获取用户头像
		axios.post(util.baseUrl().ajaxUrl2+'/member/get',{
			session:util.getQueryString('sessionId') || self.data.sessionId
		}).then(function(xhr){
			if(xhr.status == 200){
				var res = xhr.data;
				if(res.code == 1){
					if(res.data.thumb){
						$('.my .user .header').html('<img src="'+ res.data.thumb +'">')
					}
				}
			}
		})
	},
	init:function(){
		var self = this;
		util.isLogin(function(sessionId){
			self.data.sessionId = sessionId;
			//获取列表
			self.getAjax();
			//获取用户信息
			self.getUserInfo();
			//相关操作
			self.handle();
		})
	}
}


//去投票
var clickBtn = true;
function goVote(id,that){
	//用户投票
	if(clickBtn){
		clickBtn = false;
		$('.loading').show();
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/updateVote',{
			session:my.data.sessionId,
			id:id
		},function(xhr){
			$('.loading').hide();
			clickBtn = true;
			if(xhr.code == '0000'){
				//更新视图
				that.setAttribute('class','btn2')
				that.innerHTML = '已投票';
				$('.vote-success').show();
				var _that = that.parentNode.parentNode.firstChild.firstChild
				var _num = Number(_that.innerHTML)+1;
				_that.innerHTML = _num;				
			}else{
				//更新视图
				// that.setAttribute('class','btn')
				// that.innerHTML = '投票';
				//作品为空
				util.showToast2(xhr.message,1500)
			}
		})
	}
}

my.init();