// _DDC.status = 1;
var $video = $('.video');
var ddc = {
	data:{
		play:false,				//是否播放视频
		contentId:_DDC.getQueryString('contentId'),
		businessCategoryId:_DDC.getQueryString('businessCategoryId'),
		smallPic:'',
		title:'',
		tagList:'',
		summary:'',
		type:'',
		contentDetailList:'',
		contentFoodList:'',
		video:'',
		contentSource:0,		//0 待定  1非轮播图    2顶部是轮播图
		shareInfo:{},			//分分享信息
	},
	baseUrl:function(){
        // 0 开发环境  1 测试环境  2 staging环境  3生产环境
        var status = _DDC.status;
        var ajaxUrl  = status==0?'https://tv-d.daydaycook.com.cn/':status==1?'https://tv-t.daydaycook.com.cn/':status==2?'https://tv-s.daydaycook.com.cn/':'https://tv.daydaycook.com.cn/';
        var ajaxUrl2  = status==0?'https://uc-api-d.daydaycook.com.cn/':status==1?'https://uc-api-t.daydaycook.com.cn/':status==2?'https://uc-api-s.daydaycook.com.cn/':'https://uc-api.daydaycook.com.cn/';
        return {
        	ajaxUrl:ajaxUrl,
        	ajaxUrl2:ajaxUrl2
        }
    },
	init:function(){
		var self = this;
		axios.post(self.baseUrl().ajaxUrl+'top-content/view',{
            contentId:self.data.contentId,
            businessCategoryId:self.data.businessCategoryId,
            sessionId:''
		}).then(function(xhr) {
			var res = xhr.data;
			if(res && res.code == 0){
				//顶部图片
				document.title = res.data.title;
				//页面显示样式  1非轮播   2轮播图
				self.data.contentSource = res.data.contentSource;
				//缩略图
				self.data.smallPic = res.data.smallPic;
				//页面标题
				self.data.title = res.data.title;
				//tags标签
				self.data.tagList = res.data.tagList;
				//简介
				self.data.summary = res.data.summary;
				//图片列表
				self.data.contentDetailList = res.data.contentDetailList;
				//类型
				self.data.type = res.data.type;
				//视频地址
				self.data.video = res.data.video;
				self.data.contentText = res.data.contentText;
				if(res.data.skuList) self.data.skuList = self.changeSkuList(res.data.skuList);
				if(res.data.contentFoodList) self.data.contentFoodList = res.data.contentFoodList;
				//头像
				self.data.header = res.data.header;
				//昵称
				self.data.nickName = res.data.nickName;
				//分享信息
				self.data.shareInfo = {
					title:res.data.title,
					desc:res.data.summary,
					img:res.data.smallPic,
					link:location.href
				}
				//页面渲染
				self.render();
				//埋点
				gio('page.set', {'h5_contentid': self.data.contentId, 'h5_contentname': res.data.title});
			}else if(res.code == '-1'){
				$('.index').hide();
				document.title = '你查看的页面已经被删除了哦';
				$('body').append('<div class="empty"><img src="images/empty.jpg"><p>你查看的页面已经被删除了哦</p></div>')
			}else{
				_DDC.warning(res.message || '服务器错误')
			}
        }).catch(function(err) {
        	_DDC.warning('服务器错误')
        	console.log(err)
        })
		//页面初始化之前先与app交互
	},
	changeSkuList(list){
		//修改返回的商品列表格式
		var self = this;
		var _list = [];
		var max = 0;
		list.forEach(function(item){
			max = accAdd(max,item.maxCmmission)
			var _filter = _list.filter(function(ele){
				if(ele.itemId == item.itemId){
					return ele
				}
			})
			if(_filter.length > 0){
				_list.map(function(ele2){
					if(ele2.itemId == _filter[0].itemId){
						ele2.skuId == ele2.skuId+','+_filter[0].skuId
					}
				})
			}else{
				_list.push(item)
			}
		})
		//最高可赚
		// var _zhuan = $('.zhuan');
		// _zhuan.find('span').html(max);
		// if(list && list.length > 0 && max > 0){
		// 	_zhuan.css('display','block')
		// }
		return _list
	},
	render:function(){
		//渲染页面
		var self = this;
		//头部渲染
		self.renderHeader();
		//标题
		$('.title').append(self.data.title);
		//标签
		if(self.data.tagList && self.data.tagList.length > 0){
			var _taglist = '';
			self.data.tagList.forEach(function(item){
				_taglist = _taglist + '<span>#'+ item.name +'</span>'
			})
			$('.tags').html(_taglist)
		}
		//简介
		if(self.data.summary){
			$('.summary').html(self.data.summary);
		}

		//普通图文
		if(self.data.contentDetailList && self.data.contentDetailList.length > 1 && self.data.type==1 && self.data.contentSource == 1){
			var _list = '';
			self.data.contentDetailList.forEach(function(item){
				var _img = item.image?'<div class="item img"><img src="'+ item.image +'"></div>':'';
				var _detail = item.detail?'<div class="item word">'+ item.detail +'</div>':'';
				_list = _list + _img + _detail;
			})
			if(_list){
				$('.list').html(_list);
			}
		}

		//食材
		if(self.data.contentFoodList && self.data.contentFoodList.length > 0 && self.data.type == 2 && self.data.contentSource == 1){
			var _foodList = '';
			self.data.contentFoodList.forEach(function(item){
				_foodList = _foodList + '<div class="item"><div class="left">'+ item.name +'</div><div class="left">'+ item.count +'</div></div>';
			})
			$('.material').append(_foodList).css('display','block');
		}

		//做菜步骤
		if(self.data.contentDetailList && self.data.contentDetailList.length > 0 && self.data.type==2){
			//修改数据格式
			self.data.contentDetailList.map(function(item) {
                item.first = item.groupTitle.split('/')[0];
                item.last = item.groupTitle.split('/')[1];
            })
			var _list = '';
			self.data.contentDetailList.forEach(function(item){
				var _title = '<div class="title2">'+ item.first +'<text>/'+ item.last +'</text></div>';
				var _img = item.image?'<div class="imgs"><img src="'+ item.image +'" alt=""></div>':'';
				var _detail = item.detail?'<div class="word">'+ item.detail +'</div>':'';
				_list = _list + _title + '<div class="main">' + _img + _detail + '</div>';
			})
			if(_list){
				$('.step').html(_list).css('display','block');
			}
		}
		//商品列表
		if(self.data.skuList && self.data.skuList.length > 0){
			var _skuList = '';
			self.data.skuList.forEach(function(item){
				var _item = '<div class="item" data-productId="'+ item.itemId +'">';
					_item += '<img src="'+ item.productImg +'" alt="">';
					_item += '<div class="title two-line">'+ item.productName +'</div>';
					_item += '<div class="price">';
					_item += '<span class="price">￥'+ item.marketPrice +'</span>';
					// _item += '<span class="price2">￥234</span>';
					_item += '<div class="buy right">立即购买</div>';
					_item += '</div>';
					_item += '</div>';
				_skuList = _skuList + _item;
			})
			$('.products').html(_skuList);
		}
		//分享
		self.wxShare(self.data.shareInfo.title,self.data.shareInfo.desc,self.data.shareInfo.img,self.data.shareInfo.link); // 调用微信分享
		//后台传过来图文
		$('.contentText').html(self.data.contentText);
		//若在日日煮app中，隐藏头部打开按钮
		if(_DDC.inApp()){
			$('.download').hide();
			$('.swiper-container,.video').css('margin','0');
		}
		//操作
		self.handle();
	},
	renderHeader:function(){
		//专门针对头部渲染
		var self = this;
		if(self.data.contentSource == 1){
			//非轮播图
			if(self.data.smallPic && !self.data.play){
				var _icon = self.data.video?'<div class="icon"></div>':'';
				$video.html('<img src="'+ self.data.smallPic +'">'+_icon);
			}
			if(self.data.play && $video.find('video').length == 0){
				$video.html('<video autoplay="autoplay" src="'+ self.data.video +'" controls="controls">您的浏览器不支持视频播放</video>');
			}
		}else{
			//轮播图
			var _html = '';
			self.data.contentDetailList.forEach(function(item){
				_html += '<div class="swiper-slide"><img src="'+ item.image +'?imageslim"></div>';
			})
			$('.swiper-container .swiper-wrapper').html(_html);
			$('.swiper-container').show();
			$('.video').hide();
			$('.content').hide();
			new Swiper('.swiper-container', {
      			pagination: {
        			el: '.swiper-pagination',
      			},
    		});
    		//用户头像
    		$('.users').html('<img src="'+ self.data.header +'">' + self.data.nickName).show();
    		//后台传过来图文
			$('.contentText').html(self.data.contentDetailList[0].detail);
		}
	},
	handle:function(){
		//相关操作方法绑定
		var self = this;
		$video.on('click',function(){
			if(self.data.video){
				self.data.play = true;
				self.renderHeader();
			}
		})
		$('.products .item').on('click',function(){
			var productId = $(this).attr('data-productId');
			var shareCode = _DDC.getQueryString('shareCode');
			var skuId;
			self.data.skuList.map(function(item){
				if(item.itemId == productId){
					skuId = item.skuId;
				}
			})
			window.location.href = location.origin + '/shop/#/productdetail?productId='+ productId +'&shareCode='+ shareCode +'&skuId='+skuId;	
		})
		//跳转
		$('.download').on('click',function(){
			// var userId = _DDC.getQueryString('userId');
			// if(userId){
				window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gfeng.daydaycook'
			// }else{
    			// var _url = location.origin + '/app2/invite/inviteFriends/share.html?userId='+userId+'&inviteCode=YQ_20180904_CZ';
    			// window.location.href = _url
			// }
		})
	},
	//微信分享给朋友或朋友圈
	wxShare:function(title,desc,img,link) {
		var self = this;
	    var link = link || window.location.href;
	    var encodeURL = encodeURIComponent(link);
	    $.ajax({
	        type: 'get',
	        url: self.baseUrl().ajaxUrl2+'/wx/signature?url='+encodeURL,
	        success: function(res) {
	            var data = JSON.parse(res);                 
	            if(data.data){
	                var obj = data.data;
	                // console.log(obj)
	                var thisId = obj.appId;
	                var thisTimestamp = obj.timestamp;
	                var thisNonceStr = obj.nonceStr;
	                var thisSignature = obj.signature;
	                // console.log(wx)
	                wx.config({
	                    debug: false,
	                    appId: thisId,
	                    timestamp: thisTimestamp,
	                    nonceStr: thisNonceStr,
	                    signature: thisSignature,
	                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
	                });

	                wx.ready(function() {
	                    // 获取“分享到朋友圈” 按钮点击状态及自定义分享内容接口
	                    wx.onMenuShareTimeline({
	                        title: title, // 分享标题
	                        link: link,
	                        imgUrl: img, // 分享图标
	                        success: function() {},
	                        cancel: function() {}
	                    });       

	                    // 获取“ 分享给朋友” 按钮点击状态及自定义分享内容接口
	                    wx.onMenuShareAppMessage({
	                        title: title, // 分享标题
	                        desc: desc, // 分享描述
	                        link: link,
	                        imgUrl: img, // 分享图标
	                        type: '', // 分享类型,music、video或link，不填默认为link
	                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	                        success: function() {},
	                        cancel: function() {}
	                    });
	                });
	            }                                                      
	        },
	        error:function(err){
	            console.log('分享接口出错')
	        }
	    });
	}
}
ddc.init();