import edit from '@/pages/mixins/edit';
import util from "../../util/util";
export default {
    data() {
        return {
          shadow:false, //弹窗遮罩
          dialogFormVisible:false,   //弹窗默认关闭
          disabled:true,   // 弹窗日期选择默认禁止
          pickerOptionsDate:{//日期选择今天以及之后的日期
              disabledDate(time) {
                  let afterTime = new Date().setHours(17, 0, 0, 0);
                  let nowTime = new Date().getTime();
                  if(nowTime>afterTime){//可选日期从明日
                      return time.getTime() < Date.now();
                  }else{//可选日期从当日
                      return time.getTime() < Date.now() - 8.64e7;
                  }
              }
          },
          timeObject:{
              selectableRange: ''
          },
        };
    },
    mounted() {},
    methods: {
      /*
       * Description: 视频上传
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/25
       */
      handleVideoSuccess(res, file) {
        util.qiniuUpload(res.data, file, 2).then((url)=> {
          this.videoFlag = false;
          this.ruleForm.videoHref = url
        });
      },
      videoPercent(event, file, fileList){
        this.videoFlag = true;
      },
      /*
       * Description: 视频格式限制
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/27
       */
      beforeUploadVideo(file) {
        const isMp4 = file.type === 'video/mp4';
        if (!isMp4) {
          this.$message.error('视频格式为MP4格式');
        }
        return isMp4
      },
      //预览视频
      watchVideo(){
        let _this = this;
        this.$nextTick(() => {
            let videoDom = document.getElementsByTagName('video')[0];
            videoDom.onplay=function(){
                videoDom.pause();
                _this.shadow = true;
            }
        })
      },
      //关闭视频预览
      closeShadow(){
        let _this = this;
        _this.shadow = false;
        let videoDom = document.getElementsByTagName('video')[1];
        videoDom.pause();
      },
      radioStatus(){
          let that = this;
          if(that.ruleForm.radio == 2){
              that.disabled = false;
          }else{
              that.disabled = true;
          }
      },
      dateChange(){//用户选取日期
          let a =new Date();
          let b =new Date(Date.parse(this.ruleForm.date.replace(/-/g,"/")));
          let c = '';
          if(b>a){
              c = '00:00:00-23:59:59';
          }else{
              let NowgetHours = new Date().getHours();
              if(NowgetHours>=0 && NowgetHours<9){
                  c = '16:00:00-23:59:59';
              }else{
                  c = this.timeRange();
              }
          }
          this.timeObject.selectableRange = c;
      },
      timeRange(){//计算发布时间区域
          let a = '';
          let NowgetHours = new Date().getHours(); //获取当前小时数(0-23)
          let afterTime = new Date().setHours(17, 0, 0, 0);
          let nowTime = new Date().getTime();
          let getMinutes = new Date().getMinutes(); //获取当前分钟数(0-59)
          let getSeconds = new Date().getSeconds(); //获取当前秒数(0-59)
          let getHours = NowgetHours+2;
          getHours = NowgetHours.toString().length==1?'0'+getHours:getHours;
          getMinutes = getMinutes.toString().length==1?'0'+getMinutes:getMinutes;
          getSeconds = getSeconds.toString().length==1?'0'+getSeconds:getSeconds;
          if(nowTime>afterTime){//可选日期从明日
              a = '00:00:00-23:59:59';
          }else{//可选日期从当日
              if(NowgetHours>=0 && NowgetHours<9){
                  a = '16:00:00-23:59:59';
              }else{
                  a = getHours+':'+getMinutes+':'+getSeconds +'-23:59:59';
              }
          }
          return a;
      },
      timeChange(){//用户选取时间
          console.log(this.ruleForm.time)
      },
      back(){//取消
        if(this.$route.params.index){
            this.$router.push({
                name:'index'
            })
        }else{
            this.$router.push({
                name:'video'
            })
        }
      },
    },
    mixins: [edit]
};
