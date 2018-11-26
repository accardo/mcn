// _DDC.status = 1;
var ddc = {
	data:{
	  ip: '',
    pageIndex: 1,
    pageRow: 20,
    requestId: '',
    sessionId:_DDC.getQueryString('sessionId'),
    tagName:_DDC.getQueryString('tagName'),
    contentViewCount: 0,
    contents: '',
	},
  baseUrl:function(){
    // 0 开发环境  1 测试环境  2 staging环境  3生产环境
    var status = _DDC.status;
    // status = 3;
    var ajaxUrl  = status==0?'https://tv-d.daydaycook.com.cn/':status==1?'https://tv-t.daydaycook.com.cn/':status==2?'https://tv-s.daydaycook.com.cn/':'https://tv.daydaycook.com.cn/';
    var ajaxUrl2  = status==0?'https://uc-api-d.daydaycook.com.cn/':status==1?'https://uc-api-t.daydaycook.com.cn/':status==2?'https://uc-api-s.daydaycook.com.cn/':'https://uc-api.daydaycook.com.cn/';
    return {
      ajaxUrl:ajaxUrl,
      ajaxUrl2:ajaxUrl2
    }
  },
  init: function(){
    var self = this;
    /*axios.post(self.baseUrl().ajaxUrl+'/user-tag/list-tag-latest',{
      ip: '',
      pageIndex: self.data.pageIndex,
      pageRow: self.data.pageRow,
      requestId: self.data.requestId,
      sessionId: self.data.sessionId,
      tagName: self.data.tagName
    }).then(function(xhr) {
      var res = xhr.data;
      if(res && res.code == 0) {
        console.log(res)
        self.data.tagName = res.data.userTag.tagName;
        self.data.contentViewCount = res.data.userTag.contentViewCount;
        self.data.contents = res.data.contents;




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
    })*/

    self.render();

  },
  render: function(){
    //渲染页面
    var self = this;

    //操作
    self.handle();

    //瀑布流
    $('.JS_most_new').masonry({
      //columnWidth: '',
      itemSelector: '.JS_most_new li',
      fixedSpacing : 20,
      isAnimated: true
  });

  },
	handle:function(){
		//相关操作方法绑定
		var self = this;

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
	}

}
ddc.init();
