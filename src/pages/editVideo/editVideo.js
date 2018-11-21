import edit from '@/pages/mixins/edit';
import util from "../../util/util";
import * as httpUrl from '../../util/http'
import axios from 'axios'
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
          rules: {
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' },
              { max: 20, message: '最多可输入20字', trigger: 'blur' }
            ],
            cateCode1: [
              { required: true, message: '请选择一级分类', trigger: 'change' },
            ],
            cateCode2: [
              { required: true, message: '请选择二级分类', trigger: 'change' },
            ],
            homePicture: [
              { required: true, message: '请上传视频封面', trigger: 'blur' },
            ],
            videoHref: [
              { required: true, message: '请上传视频', trigger: 'blur' },
            ],
            videoLayout: [
                { required: true, message: '请选择视频比例', trigger: 'change' }
            ],
            workDescribe: [
              { required: true, message: '请输入描述', trigger: 'blur' },
              { max: 120, message: '最多可输入120字', trigger: 'blur' }
            ],
          },
          token: '',
        };
    },
    mounted() {
        this.getStatus();
    },
    computed: {
        ajaxUrl() {
            return httpUrl.ajaxUrl
        }
    },
    methods: {
        //获取用户状态
      getStatus(){
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/checkUser`).then(({data}) => {
        if(data.code=="1001" || data.code=="1002" || data.code=="1003" ){
            localStorage.setItem('navindex','1');
            this.$message({ message: '身份认证通过才可以继续操作哦',type: 'warning',duration:1500});
            setTimeout(()=>{
              this.$router.push({
                name:'idTest'
              })
            },1500)
          }
        })
      },
      getTokenVideo(file) {
        this.videoFlag = true;
        let self = this;
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 2).then((url)=> {
                this.videoFlag = false;
                this.ruleForm.videoHref = url;
                this.getLong(url);
                // self.$nextTick(() => {
                //     let videoDom = document.getElementById('video');
                //     videoDom.addEventListener('loadedmetadata',()=> {
                //         console.log(parseInt( videoDom.duration));
                //         this.ruleForm.videoTime = parseInt( videoDom.duration);
                //     })
                // })
            });
         }) 
      },
      getLong(url){
        axios.get(`${url}?avinfo`).then(res => {
          if(res){
              this.ruleForm.videoTime = parseInt(res.data.streams[0].duration)
          }
        })
      },
      //预览视频
      palyVideo(){
        let _this = this;
        _this.shadow = true;
      },
      //关闭视频预览
      closeShadow(){
        let _this = this;
        _this.shadow = false;
        let videoDom = document.getElementsByTagName('video')[1];
        videoDom.pause();
      },
      radioStatus(){
          let _this = this;
          if(_this.ruleForm.radio == 2){
            _this.disabled = false;
          }else{
            _this.disabled = true;
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
