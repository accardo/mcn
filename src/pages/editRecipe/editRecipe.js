import * as Quill from 'quill'    // 引入编辑器
import edit from '@/pages/mixins/edit';
import util from "../../util/util";
import * as httpUrl from '../../util/http'
import axios from 'axios'
export default {
    data() {
        var checkVideoLayout = (rule, value, callback) => {
          if(this.ruleForm.videoHref != '' && !value){
            callback(new Error('请选择视频比例'));
          }else{
            callback();
          }
        };
        return {
          shadow:false, //弹窗遮罩
          videoObj:null,
          editorOption:{
              modules:{
                  toolbar:[
                      ['bold', 'italic', 'underline', 'strike', 'image', 'video'],        // toggled buttons
                      [{ 'align': [] }],
                      ['blockquote', 'code-block'],
                      [{ 'color': [] }, { 'background': [] }],
                  ]
              }
          },
          rules: {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { max: 15, message: '最多可输入15字', trigger: 'blur' }
            ],
            homePicture: [
                { required: true, message: '请上传图文封面', trigger: 'blur' },
            ],
            videoLayout:[
              { validator: checkVideoLayout, trigger: 'change' }
            ],
            workDescribe: [
                { required: true, message: '请输入描述', trigger: 'blur' },
                { max: 50, message: '最多可输入50字', trigger: 'blur' }
            ],
            firstPublish: [
              { required: true, message: '请选择内容性质', trigger: 'change' }
            ],
          }
        };
    },
    mounted() {
      this.getStatus();
      // var imgHandler = async function(state) {//富文本编辑器添加自定义上传图片
      //   if (state) {
      //     let fileInput =document.getElementById("uploadPic") //隐藏的file元素
      //     fileInput.click();
      //   }
      // }
      // this.$refs.myQuillEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
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
      //添加 1=>食材添加   2=>步骤添加
      addList(type){
          if(type==1){
            let cope = {
              cookMaterial:"",
              cookDosage:""
            }
            this.ruleForm.cookInfoRequestDTO.push(cope);
          }else if(type==2){
            let cope = {
              homePicture:"",
              workDescribe:"",
              picDetailFlag : false
            }
            this.ruleForm.mediaWorksDetailRequestDTO.push(cope);
          }
      },
      //上移
      upList(index,item,type){
          if(type == 1){
            this.ruleForm.cookInfoRequestDTO.splice(index,1);
            this.ruleForm.cookInfoRequestDTO.splice(parseInt(index)-1,0,item);
          }else if(type == 2){
            this.ruleForm.mediaWorksDetailRequestDTO.splice(index,1);
            this.ruleForm.mediaWorksDetailRequestDTO.splice(parseInt(index)-1,0,item);
          }
      },
      //下移
      downList(index,item,type){
          if(type == 1){
            this.ruleForm.cookInfoRequestDTO.splice(index,1);
            this.ruleForm.cookInfoRequestDTO.splice(parseInt(index)+1,0,item);
          }else if(type == 2){
            this.ruleForm.mediaWorksDetailRequestDTO.splice(index,1);
            this.ruleForm.mediaWorksDetailRequestDTO.splice(parseInt(index)+1,0,item);
          }
      },
      //上传视频
      getTokenVideo(file) {
         if(file.target.files[0]){
          const isJpg = file.target.files[0].type === 'image/jpeg';
          const isPng = file.target.files[0].type === 'image/png';
          const isGif = file.target.files[0].type === 'image/gif';
          if (isJpg || isPng || isGif) {
              this.$message.error('上传视频格式不正确');
              return false;
          }
          this.ruleForm.videoHref = '';
          this.videoFlag = true;
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 2).then((url)=> {
                this.videoFlag = false;
                this.ruleForm.videoHref = url;
                this.getLong(url);
            });
         }) 
        }
      },
      getLong(url){
        axios.get(`${url}?avinfo`).then(res => {
          if(res){
            this.ruleForm.videoTime = parseInt(res.data.streams[0].duration)
            console.log(this.ruleForm.videoTime)
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
      //富文本编辑器-图片上传
      // uploadPic(file){
      //   const isJpg = file.target.files[0].type === 'image/jpeg';
      //   const isPng = file.target.files[0].type === 'image/png';
      //   const isGif = file.target.files[0].type === 'image/gif';
      //   if (!isJpg && !isPng && !isGif) {
      //     this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
      //     return false;
      //   }
      //   this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
      //       this.token =  data.data
      //       util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
      //         this.addImgRange = this.$refs.myQuillEditor.quill.getSelection()
      //         this.$refs.myQuillEditor.quill.insertEmbed(this.addImgRange != null?this.addImgRange.index:0, 'image',url, Quill.sources.USER)
      //       });
      //   }) 
      // },
      //步骤列表添加图片
      getTokenPicList(file,item){
        const isJpg = file.target.files[0].type === 'image/jpeg';
        const isPng = file.target.files[0].type === 'image/png';
        const isGif = file.target.files[0].type === 'image/gif';
        if (!isJpg && !isPng && !isGif) {
            this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
            return false;
        }
        item.homePicture = '';
        item.picDetailFlag = true;
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
                item.picDetailFlag = false;
                item.homePicture = url;
            });
        }) 
      },
      //步骤列表图片删除
      delPic(item){
        item.homePicture = '';
      },
      back() {//取消
        if(this.$route.params.index){
          this.$router.push({
            name:'index'
          })
        }else{
          this.$router.push({
            name:'recipe'
          })
        }
      },
    },
    mixins: [edit],
};
