var _hash = location.hash;
if(_hash && _hash.indexOf('jump') > -1){
	window.location.href = (window.location.origin + window.location.pathname).replace('my.html','sign.html')
}

var my = {
	data:{
		sessionId:'',
		page:1,			//页数
	},
	getAjax:function(){
		//拉取列表
		var self = this;
		var params = {
			session:self.data.sessionId,
			pageSize:50,
			pageIndex:self.data.page
		}
		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/findVideoInfo',params,function(res){
			if(res.code == '0000'){
				if(res.data.total > 0){
					//列表返回有数据
					var list = res.data.rows;
					var _html = '';
					list.forEach(function(item){
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
						var status = '<div class="status '+ _s +'"></div>'
						var video = '<video style="object-fit: fill"><source src="'+ item.qiniuHref +'"></video>'
						_html += status+'<div class="img"><div class="icon '+ item.auditState +'"></div>'+ video +'</div>';
						_html += '<div class="title">'+ item.videoTitle +'</div>';
						_html += '<div class="icons"><span>'+ item.videoType +'</span></div>';
						_html += '</div>';
					})
					$('.scroll').append(_html)
				}
			}else if(res.code == '2002'){
				//作品为空
				$('.scroll').html('<p style="color:#fff">暂无内容</p>')
			}
		})
	},
	init:function(){
		var self = this;
		util.isLogin(function(sessionId){
			//获取列表
			self.data.sessionId = sessionId;
			self.getAjax();
		})
		//判断是否隐藏
		if(sessionStorage.getItem('upload') == 1){
			$('.my .upload').show();
		}
	}
}

my.init();

var share = {
	title:'分享标题',
	desc:'描述描述描述',
	img:'https://mobile.daydaycook.com.cn/logo.png',
	shareUrl:window.location.href+'#sign'
}
util.wxShare(share.title,share.desc,share.img,share.shareUrl)