import util from '../../util/util';
import * as qiniu from 'qiniu-js'
export default {
    data() {
        return {
          ruleForm: {
            cateCode1: '',
            cateCode2: '',
            homePicture: '',
          },
          session: localStorage.getItem('sessionId'),
          levelFirst: null, // 一级分类
          levelSecond: null, // 二级分类
          selectValue:'',
          childList:[],
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
          isLevel: true,
          isSave: false,
          saveText: '保存',
          saveReleaseText: '保存并发布'
        };
    },
    mounted() {
      this.getVideo();
      this.getLevel();
    },
    methods: {
      /*
			 * Description: 获取视频详情信息
			 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
			 * Date: 2018/9/21
			 */
      getVideo() {
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/findOne`, {id: this.$route.params.id}).then(({data}) => {
          this.ruleForm = data.data;
        })
      },
      /*
       * Description: 一级分类
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/21
       */
      getLevel() {
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getCodeLevel`, {levelCode: ''}).then(({data}) => {
          this.levelFirst = data.data;
        })
      },
      /*
       * Description: 手动 获取二级分类
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/21
       */
      selectLevel(value){
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getCodeLevel`, {levelCode: value}).then(({data}) => {
          if (this.isLevel) {
            this.isLevel = false
          } else {
            this.ruleForm.cateCode2 = data.data[0].detailCode
          }
          this.levelSecond = data.data;
        })
      },
      selectTypeTwo(value){
         /* let self = this;
          console.log(self.ruleForm.typeOne,self.ruleForm.typeTwo)*/
      },
      /*
       * Description: 图片上传
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/25
       */
      handlePicSuccess(res, file) {
        this.qiniuUpload(res.data, file, 1);
      },
      /*
       * Description: 视频上传
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/25
       */
      handleVideoSuccess(res, file) {
        this.qiniuUpload(res.data, file, 2);
      },
      //七牛文件上传
      qiniuUpload(token, file, type){
        let self = this;
        let { name } =file;
        let d =name.split('.');
        let t = new Date().getTime();
        name = `${d[0]}${t}.${d[1]}`;
        let qiniuPutExtra = {
          fname: "",
          params: {},
          mimeType: null
        };
        let qiniuConfig = {
          useCdnDomain: true,
          region: qiniu.region.z2
        };
        let observable = qiniu.upload(file.raw, name, token, qiniuPutExtra, qiniuConfig);
        observable.subscribe({
          error(){
            if (type == 1) {
              self.$message({message: '图片上传失败，请稍后再试',type: 'error'});
            } else if(type === 2) {
              self.$message({message: '视频上传失败，请稍后再试',type: 'error'});
            }
          },
          complete(res){
            if (type == 1) {
              self.ruleForm.homePicture = util.imgUrl() + res.key
            } else if (type == 2) {
              self.ruleForm.videoHref = util.imgUrl() + res.key
            }
          }
        })
      },
      /*
       * Description: 图片格式限制
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/27
       */
      beforeUploadPic(file) {
        const isJpg = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isGif = file.type === 'image/gif';
        if (!isJpg && !isPng && !isGif) {
          this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
        }
        return isJpg || isPng || isGif
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
      back(){
          //取消
          this.$router.push({
              name:'video'
          })
      },
      /*
       * Description: type -> 1 保存草稿, type -> 2 发布审核
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/26
       */
      saveRelease(type){//保存并发布按钮
        delete this.ruleForm.createTime;
        delete this.ruleForm.publishTime;
        delete this.ruleForm.timeFrom1;
        delete this.ruleForm.timeFrom2;
        delete this.ruleForm.timeTo1;
        delete this.ruleForm.timeTo2;
        delete this.ruleForm.updateTime;
        this.$confirm('确认保存?', '确认消息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (type == 1) {
            this.ruleForm.state = 'A';
            this.saveText = '保存中...'
          } else if (type == 2) {
            this.ruleForm.state = 'W';
            this.saveReleaseText = '保存并发布中...'
          }
          this.isSave = true;
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, this.ruleForm).then(() => {
            if (type == 1) {
              this.saveText = '保存'
              this.$message({type: 'success', message: '保存草稿成功'});
            } else if(type == 2) {
              this.saveReleaseText = '保存并发布';
              this.$message({type: 'success', message: '保存并发布成功'});
            }
            this.isSave = false;
          })
        }).catch(action => {

        });
      },
      saveData(){
          console.log(this.ruleForm.date);
      }
    },
    watch: {
      'ruleForm.cateCode1' (value) {
        this.selectLevel(value)
        console.log(value, '监听')
      },
      'ruleForm.cateCode2' (value) {
        /*console.log(value)
          this.ruleForm.cateCode2 = null
          this.ruleForm.cateCode2 = this.levelSecond[0].detailCode*/
      }
    }
};
