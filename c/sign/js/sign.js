var ddc = {
	data:{
		sessionId:'',
		source:sessionStorage.getItem('source'),	//来源
		activityId:sessionStorage.getItem('activityId'),	//活动ID
		name:'',			//姓名
		sex:'',				//性别
		area:'',			//地区
		school:'',			//学校
		profession:'',		//专业
		category:'',		//类别
		theme:'',			//主题
		videoUrl:'',		//视频地址
		phone:'',			//手机号码
		btns:true,			//防止被重复点击
	},
	qiniuUpload:function(file){
		//上传
		var self = this;
		var name = +new Date();
		var qiniuPutExtra = {
			fname: name,
			params: {},
			mimeType: null
		}
		var qiniuConfig = {
			useCdnDomain: true,
			// region: 'https://up-z2.qiniup.com',
			region: qiniu.region.z2
		}
		var target = $('#toast3 .icon');
		var observable = qiniu.upload(file, name, self.data.imgToken, qiniuPutExtra, qiniuConfig);
		var subscription = observable.subscribe({
			next:function(res){
				console.log(res.total.percent)
				target.html(Math.floor(res.total.percent)+'%')
			},
			complete:function(res){
				self.data.videoUrl = 'https://mcn-video.daydaycook.com.cn/'+res.key;
				$('#sendBefore').hide();
				var target = $('#videoUrl');
				target.show();
				$('#toast3').hide();
				target.find('.videoUrl').show().html('<video src="'+ self.data.videoUrl +'"></video>')
				util.hideToast();
			},
			error:function(err){
				console.log(err)
			}
		})
	},
	handle:function(){
		//相关操作
		var self = this;
		//监听点击上传视频操作
		$('#videoForm').on('change',function(){
			var file = document.getElementById('videoForm').files[0];
			//获取七牛token
				util.showToast3('正在上传视频，请稍后',600000000);
				// console.log(file)
				util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/getQiniuToken',{
					session:self.data.sessionId
				},function(res){
					if(res.code == '0000'){
						self.data.imgToken = res.data;
						self.qiniuUpload(file)
					}
				})
		})
		//删除视频重新选择
		$('#videoUrl .close').on('click',function(){
			$('#sendBefore').show().siblings('#videoUrl').hide();
			self.data.videoUlr = '';
		})
		//省市区选择
		var area1 = new LArea();
        area1.init({
            'trigger': '#areaId', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
            'valueTo': '#value1', //选择完毕后id属性输出到该位置
            'keys': {
                id: 'id',
                name: 'name'
            }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
            'type': 1, //数据源类型
            'data': LAreaData //数据源
        })
        //提交报名信息
        $('.sign .submit').on('click',function(){
        	var name = $('#name').val();				//姓名
        	var sex = $('#genderId').val();				//性别
        	var area = $('#areaId').val();				//地区
        	var phone = $('#phone').val();				//手机号码
        	var school = $('#school').val();			//学校
        	var profession = $('#profession').val();	//专业
        	var category = $('#categoryId').val();		//类别
        	var theme = $('#theme').val();				//主题
        	var videoUlr = self.data.videoUrl;			//视频地址
        	if(!name){
        		util.showToast2('请填写姓名',1500);
        		return
        	}
        	if(sex.indexOf('选择') > -1){
        		util.showToast2('请选择性别',1500);
        		return
        	}
        	if(!util.isPhone(phone)){
        		util.showToast2('请输入正确的手机号码',1500);
        		return
        	}
        	if(!area){
        		util.showToast2('请选择地区',1500);
        		return
        	}
        	if(!school){
        		util.showToast2('请填写学校名称',1500);
        		return
        	}
        	if(!profession){
        		util.showToast2('请选择专业',1500);
        		return
        	}
        	if(category.indexOf('选择') > -1){
        		util.showToast2('请选择类别',1500);
        		return
        	}
        	if(!theme){
        		util.showToast2('请选择主题',1500);
        		return
        	}
        	if(!videoUlr){
        		util.showToast2('请选择视频或等待视频上传完毕',3000);
        		return
        	}
        	//上传数据
        	if(self.data.btns){
        		self.data.btns = false;
        		util.showToast('加载中',300000);
        		var params = {
        			session:self.data.sessionId,		//用户信息
        			userName:name,						//姓名
        			sex:sex.indexOf('男')>-1?'M':'F',	//性别
        			telNum:phone,						//手机号码
        			schoolProvince:area,				//地区
        			schoolCity:'',						//暂时为空
        			schoolName:school,					//学校名称
        			schoolSubject:profession,			//专业
        			videoType:category,					//视频类别
        			videoTitle:theme,					//主题
        			qiniuHref:videoUlr,					//视频地址
        			productId:self.data.activityId,		//活动ID
        			remark:self.data.source,			//来源
        		}
        		util.fetch(util.baseUrl().ajaxUrl3+'/mcn/school/saveUserInfo',params,function(res){
					util.hideToast();
					if(res.code == '0000'){
						window.location.href = 'success.html';
					}else{
						self.data.btns = true;
						util.showToast2(res.message,1500);
					}
				})
        	}
        })
	},
	render:function(){
		//渲染页面
		var self = this;
		self.handle();
	},
	init:function(){
		var self = this;
		//用户授权登录后判断当前用户是否已上传过作品
		util.isLogin(function(sessionId){
			//判断当前用户是否已上传过作品
			self.data.sessionId = sessionId;
			console.log(self.data.sessionId)
			self.render();
		})
	}
}

ddc.init();

var share = {
	title:'分享标题',
	desc:'描述描述描述',
	img:'https://mobile.daydaycook.com.cn/logo.png'
}
util.wxShare(share.title,share.desc,share.img)