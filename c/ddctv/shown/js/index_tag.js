// _DDC.status = 1;

$(function(){

  //公共变量
  var ip = '',
    pageIndex = 1,
    pageRow = 20,
    requestId = '',
    sessionId =_DDC.getQueryString('sessionId'),
    tagName = _DDC.getQueryString('tagName'),
    contentViewCount = 0,
    contents = '',
    page = 0,
    totalPage = 0;
  var isbool = true;//触发开关，防止多次调用事件

  // 0 开发环境  1 测试环境  2 staging环境  3生产环境
  var status = _DDC.status;
  // status = 1;
  var ajaxUrl  = status==0?'https://tv-d.daydaycook.com.cn/':status==1?'https://tv-t.daydaycook.com.cn/':status==2?'https://tv-s.daydaycook.com.cn/':'https://tv.daydaycook.com.cn/';
  var ajaxUrl2  = status==0?'https://uc-api-d.daydaycook.com.cn/':status==1?'https://uc-api-t.daydaycook.com.cn/':status==2?'https://uc-api-s.daydaycook.com.cn/':'https://uc-api.daydaycook.com.cn/';
  var ajaxUrl3  = status==0?'https://mobile-dev.daydaycook.com.cn/':status==1?'https://mobile-test.daydaycook.com.cn/':status==2?'https://mobile-staging.daydaycook.com.cn/':'https://mobile.daydaycook.com.cn/';

  //初始化页面
  commonAjax('/user-tag/list-tag-hottest', 1);

  //滑动加载分页
  var winH = document.documentElement.clientHeight || document.body.clientHeight;//页面高度
  window.onscroll = function () {
    var s_t = document.documentElement.scrollTop || document.body.scrollTop;//页面滚动距离
    var doc_h = document.documentElement.scrollHeight || document.body.scrollHeight;//窗口视图高度

    if (s_t + winH + 80 >= doc_h && isbool && pageIndex < totalPage ) {
      isbool = false;
      pageIndex++;

      $('.index_tag').append('<div class="JS_show_more"><img src="./images/reload.png"></div>');
      setTimeout(function(){
        if($('.JS_most_new_btn').hasClass('active')){
          commonAjax('/user-tag/list-tag-latest', pageIndex);
        }else{
          commonAjax('/user-tag/list-tag-hottest', pageIndex);
        }
      },1000);

    }
  }

  //点击最新按钮
  $('.JS_most_new_btn').on('click', function () {
    var $this = $(this);
    $this.addClass('active').siblings('li').removeClass('active');
    $('.most_new ul').html("");
    commonAjax('/user-tag/list-tag-latest', 1);
  })

  //点击最热按钮
  $('.JS_most_hot_btn').on('click', function () {
    var $this = $(this);
    $this.addClass('active').siblings('li').removeClass('active');
    $('.most_new ul').html("");
    commonAjax('/user-tag/list-tag-hottest', 1);
  });

  //跳转
  $('.download,.thumb').on('click',function(e){
    // var userId = _DDC.getQueryString('userId');
    // if(userId){
    e.stopPropagation();
    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gfeng.daydaycook'
    // }else{
    // var _url = location.origin + '/app2/invite/inviteFriends/share.html?userId='+userId+'&inviteCode=YQ_20180904_CZ';
    // window.location.href = _url
    // }
  });

  //公共调用
  function commonAjax( url, currentPage){
    axios.post(ajaxUrl+ url,{
      ip: '',
      pageIndex: currentPage,
      pageRow: pageRow,
      requestId: requestId,
      sessionId: sessionId,
      tagName: tagName
    }).then(function(xhr) {
      $('.empty') ? $('.empty').remove() : '';
      var res = xhr.data;

      if(res && res.code == 0) {
        tagName = res.data.userTag.tagName;
        contentViewCount = res.data.userTag.contentViewCount;
        contents = res.data.contents;
        page = res.data.page;
        pageIndex = res.data.page.pageIndex;
        totalPage = res.data.page.totalPage;

        $('.JS_tagName').html(tagName);
        $('.JS_contentViewCount').html(contentViewCount);

        //渲染数据
        if(contents && contents.length > 0) {
          console.log("++++++++++++" + contents.length);
          var most_new_pic = '';
          var _thumb = '';
          var proList = '';

          contents.forEach(function (item, index, itemArr) {

            var itemArrM = itemArr[index];

            $('.JS_nickName').html(itemArrM.userRelation.userInfo.nickName);
            $('.JS_watcherCount').html(itemArrM.userRelation.userInfo.watcherCount);
            $('.JS_followerCount').html(itemArrM.userRelation.userInfo.followerCount);

            //是否有视频
            if (itemArrM.hashVideoUrl && itemArrM.hashVideoUrl == '否') {
              most_new_pic = '<img src=' + itemArrM.smallPic + ' width="100%" />';
            } else {
              most_new_pic = '<img src=' + itemArrM.smallPic + ' width="100%" />' +
                '<div class="video_btn" style="display: block;">' +
                '<i class="video_icon"></i>' +
                '<em>' + formatSeconds(itemArrM.videoDuration) + '</em>' +
                '</div>';
            }

            //是否自己点过赞
            var downlink = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gfeng.daydaycook';
            if (itemArrM.isLike == 0) {
              //未点赞
              _thumb = '<a class="thumb" href=" ' + downlink +' " target="_blank"><i class="zan"></i><em>' + itemArrM.likeCount + '</em></a>';
            } else {
              _thumb = '<a class="thumb thumbH" href=" ' + downlink +' " target="_blank"><i class="zan"></i><em>' + itemArrM.likeCount + '</em></a>';
            }

            //用户头像是否存在
            var userHeader = itemArrM.userRelation.userInfo.header ? itemArrM.userRelation.userInfo.header : './images/logo.png';

            var linkVal = ajaxUrl3 + 'app2/ddctv/shown/index.html?businessCategoryId=' + itemArrM.businessCategoryId + '&contentId=' + itemArrM.id + '&userId=' + itemArrM.userId;
            var titlelinkVal = itemArrM.title ? ajaxUrl3 + 'app2/ddctv/shown/index.html?businessCategoryId=' + itemArrM.businessCategoryId + '&contentId=' + itemArrM.id + '&userId=' + itemArrM.userId : 'javascript:;';

            var _proList = '<li class="JS_most_new_li">' +
              '        <div class="most_new_pic"><a href="' + linkVal + '">' + most_new_pic +
              '        </a></div>' +
              '        <div class="most_new_word">' +
              '          <a href="' + titlelinkVal + '"><p class="most_new_title">' + itemArrM.title + '</p></a>' +
              '          <div class="most_new_word_flex"> ' +
              '            <i class="person_icon">' +
              '              <img src=" ' + userHeader + ' " width="16px" height="16px">' +
              '            </i>' +
              '            <span class="person_name">' + itemArrM.userRelation.userInfo.nickName + '</span>' + _thumb +
              '          </div>' +
              '        </div>' +
              '      </li>';

            proList = proList + _proList;

          });

          $(".JS_most_new").append(proList);
          console.log("-----------" + $('.most_new_pic').length)
          $('.JS_show_more').hide();

          //reload
          $('.JS_most_new').imagesLoaded( function(){
            $('.JS_most_new').masonry().masonry('reload',{
              itemSelector : '.JS_most_new_li',
              gutter: 15,
              isAnimated: true,
            });
          });
        }

        isbool = true;

      }else if(res.code == '-1'){
        // $('.index_personal').hide();
        document.title = '你查看的页面已经被删除了哦';
        $('body').append('<div class="empty"><img src="images/empty.jpg"><p>你查看的页面已经被删除了哦</p></div>')
      }else{
        $('.empty') ? $('.empty').remove() : '';
        _DDC.warning(res.message || '服务器错误')
      }
    }).catch(function(err) {
      $('.empty') ? $('.empty').remove() : '';
      _DDC.warning('服务器错误')
      console.log(err)
    });
  }

  //秒数转化为分秒格式
  function formatSeconds(value) {
    var result = "";
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    if (secondTime < 60) {
      result = "00:" + convertTimeStr(secondTime);
    } else {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      result = convertTimeStr(minuteTime) + ":" + convertTimeStr(secondTime);
    }
    return result;
  }

  function convertTimeStr(value) {
    var result = "";
    if (value < 10) {
      result = "0" + value;
    } else if (value >= 10 && value < 60) {
      result = "" + value;
    }
    return result;
  }
});






