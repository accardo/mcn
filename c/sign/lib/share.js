//微信分享给朋友或朋友圈
function wxShare(title,desc,img,link) {
    var link = link || window.location.href;
    var encodeURL = encodeURIComponent(link);
    $.ajax({
        type: 'get',
        url: 'https://uc-api.daydaycook.com.cn/wx/signature?url='+encodeURL,
        success: function(res) {
            var data = JSON.parse(res);                   
            if(data.data){
                var obj = data.data;
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
wxShare('优享拍客，就差你一个','千万奖金等你拍','https://mobile.daydaycook.com.cn/activity/2018/08/signUp/img/share.png',location.href); // 调用微信分享