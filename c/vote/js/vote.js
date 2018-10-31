var vote = {
	data:{
		sessionId:'',
		page1:1,			//页数
		total1:0,			//总数
		loadNext1:true,		//是否可以加载下一页

		page2:1,			//页数
		total2:0,			//总数
		loadNext2:true,		//是否加载下一页
		voteList:[],		//已投列表
	},
	handle:function(){
		//* 相关操作 *//

		//分享
		var self = this;
		var share = {
			title:'DDCTV优享拍客校园短视频大赛投票开启',
			desc:'10月17日正式开启',
			img: window.location.origin+'/mcn/vote/images/share.jpg'
		}
		util.wxShare(share.title,share.desc,share.img)

		//tab切换
		$('.vote .tab li').on('click',function(){
			//设置标题
			document.title = $(this).html();
			$(this).addClass('on').siblings().removeClass('on');
			var index = $(this).index();
			if(index == 0){
				$('.vote .list1').show();
				$('.vote .list2').hide();
			}else{
				$('.vote .list1').hide();
				$('.vote .list2').show();
			}
			//改变可能的数据
			$('.item').each(function(){
				var _self = $(this);
				var id = $(this).attr('id');
				id = id.replace('vote','');
				self.data.voteList.forEach(function(item){
					if(item.id == id){
						_self.find('.btns').html('<div class="btn2">已投票</div>');
						_self.find('.vote2').find('span').html(item.num);
					}
				})
			})
		})

		//监听滚动1
		$('.list1').on('scroll',function(res){
			var _height = $('.list1 .scroll').height() - res.target.clientHeight;
			if(_height - res.target.scrollTop < 200 && $('.list1 .item').length < self.data.total1){
				if(self.data.loadNext1){
					self.data.loadNext1 = false;
					self.data.page1++
					self.getAjax();
				}
			}
		})

		//监听滚动2
		$('.list2').on('scroll',function(res){
			var _height = $('.list2 .scroll').height() - res.target.clientHeight;
			if(_height - res.target.scrollTop < 200 && $('.list2 .item').length < self.data.total2){
				if(self.data.loadNext2){
					self.data.loadNext2 = false;
					self.data.page2++
					self.getAjax2();
				}
			}
		})

		//我的作品跳转
		$('.vote-icon').on('click',function(){
			location.href = location.origin+'/mcn/vote/my.html?sessionId='+self.data.sessionId
		})
	},
	render1:function(){
		//渲染列表
		var self = this;
		if(self.data.list1.length > 0){
			//最新作品渲染
			
		}
	},
	getAjax2:function(){
		//总人气榜
		var self = this;
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/voteVideoInfo',{
			session:self.data.sessionId,
			pageSize:10,
			pageIndex:self.data.page2,
			flag:2,							// 1最新发布；2人气排行
		},function(res){
			self.data.loadNext2 = true;
			if(res.code == '0000'){
				if(res.data.total > 0){
					//列表返回有数据
					self.data.total2 = res.data.total;
					var list = res.data.rows;
					var _html = '';
					var _len = $('.list2 .item').length;
					list.forEach(function(item){
						_html += '<div class="item" id="vote'+ item.id +'">';
						_len++;
						var video = '<video style="object-fit: fill" controls="controls" src="'+ item.qiniuHref +'"></video>';
						_html += '<div class="nums">'+ _len +'</div><div class="img"><div class="icon S"></div>'+ video +'</div>';
						_html += '<div class="title">'+ item.videoTitle +'</div>';
						_html += '<div class="icons"><span>'+ item.videoType +'</span></div>';
						_html += '<div class="remain">'+ item.userName +'</div>';
						_html += '<div class="rank">'+ item.schoolName +'</div>';
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
						_html += '<div class="vote2"><div class="num"><span>'+ item.netBallots +'</span>票</div>'+ btns +'</div>';
						_html += '</div>';
					})
					$('.list2 .scroll').append(_html);
				}
			} else {
				util.showToast2(res.message,1500)
			}
		})
	},
	getAjax:function(){
		//最新作品
		var self = this;
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/voteVideoInfo',{
			session:self.data.sessionId,
			pageSize:10,
			pageIndex:self.data.page1,
			flag:1,							// 1最新发布；2人气排行
		},function(res){
			self.data.loadNext1 = true;
			if(res.code == '0000'){
				if(res.data.total > 0){
					//列表返回有数据
					self.data.total1 = res.data.total;
					var list = res.data.rows;
					var _html = '';
					var _len = $('.list1 .item').length;
					list.forEach(function(item){
						_html += '<div class="item" id="vote'+ item.id +'">';
						_len++;
						var video = '<video style="object-fit: fill" controls="controls" src="'+ item.qiniuHref +'"></video>';
						_html += '<div class="nums">'+ _len +'</div><div class="img"><div class="icon S"></div>'+ video +'</div>';
						_html += '<div class="title">'+ item.videoTitle +'</div>';
						_html += '<div class="icons"><span>'+ item.videoType +'</span></div>';
						_html += '<div class="remain">'+ item.userName +'</div>';
						_html += '<div class="rank">'+ item.schoolName +'</div>';
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
						_html += '<div class="vote2"><div class="num"><span>'+ item.netBallots +'</span>票</div>'+ btns +'</div>';
						_html += '</div>';
					})
					$('.list1 .scroll').append(_html);
				}
			}else{
				util.showToast2(res.message,1500)
			}
		})
	},
	init:function(){
		var self = this;
		util.isLogin(function(sessionId){
			self.data.sessionId = sessionId;
			//最新作品
			self.getAjax();
			//总人气榜单
			self.getAjax2();
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
			session:vote.data.sessionId,
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
				//更新已投票列表
				vote.data.voteList.push({
					id:id,
					num:_num
				})		
			}else{
				// that.setAttribute('class','btn')
				// that.innerHTML = '投票';	
				//作品为空
				util.showToast2(xhr.message,1500)
			}
		})
	}
}

vote.init();