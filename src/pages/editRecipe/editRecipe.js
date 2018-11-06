import * as Quill from 'quill'    // 引入编辑器
import edit from '@/pages/mixins/edit';
import util from "../../util/util";
import * as httpUrl from '../../util/http'
export default {
    data() {
        return {
          shadow:false, //弹窗遮罩
          videoObj:null,
          editorOption:{
              modules:{
                  toolbar:[
                      ['bold', 'italic', 'underline', 'strike', 'color', 'image', 'video','link'],        // toggled buttons
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
            workDescribe: [
                { required: true, message: '请输入描述', trigger: 'blur' },
                { max: 50, message: '最多可输入50字', trigger: 'blur' }
            ],
          }
        };
    },
    mounted() {
      //this.getStatus();
      var imgHandler = async function(state) {//富文本编辑器添加自定义上传图片
        if (state) {
          let fileInput =document.getElementById("uploadPic") //隐藏的file元素
          fileInput.click();
        }
      }
      this.$refs.myQuillEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
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
                name:"",
                dosage:""
            }
            this.ruleForm.foodList.push(cope);
          }else if(type==2){
            let cope = {
                href:"",
                text:""
            }
            this.ruleForm.stepsList.push(cope);
          }
      },
      //上移
      upList(index,item,type){
          if(type == 1){
            this.ruleForm.foodList.splice(index,1);
            this.ruleForm.foodList.splice(parseInt(index)-1,0,item);
          }else if(type == 2){
            this.ruleForm.stepsList.splice(index,1);
            this.ruleForm.stepsList.splice(parseInt(index)-1,0,item);
          }
      },
      //下移
      downList(index,item,type){
          if(type == 1){
            this.ruleForm.foodList.splice(index,1);
            this.ruleForm.foodList.splice(parseInt(index)+1,0,item);
          }else if(type == 2){
            this.ruleForm.stepsList.splice(index,1);
            this.ruleForm.stepsList.splice(parseInt(index)+1,0,item);
          }
      },
      //上传视频
      getTokenVideo(file) {
        this.ruleForm.videoHref = '';
        this.videoFlag = true;
        let self = this;
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 2).then((url)=> {
                this.videoFlag = false;
                this.ruleForm.videoHref = url;
                self.$nextTick(() => {
                    let videoDom = document.getElementById('video');
                    videoDom.addEventListener('loadedmetadata',()=> {
                        console.log('加载完成');
                        console.log(videoDom.duration);
                    })
                })
            });
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
      uploadPic(file){
        const isJpg = file.target.files[0].type === 'image/jpeg';
        const isPng = file.target.files[0].type === 'image/png';
        const isGif = file.target.files[0].type === 'image/gif';
        if (!isJpg && !isPng && !isGif) {
          this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
          return false;
        }
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
              this.addImgRange = this.$refs.myQuillEditor.quill.getSelection()
              this.$refs.myQuillEditor.quill.insertEmbed(this.addImgRange != null?this.addImgRange.index:0, 'image',url, Quill.sources.USER)
            });
        }) 
      },
      onEditorChange(){//内容改变事件
        // console.log(this.ruleForm.workContext)
      },
      //步骤列表添加图片
      getTokenPicList(file,item){
        const isJpg = file.target.files[0].type === 'image/jpeg';
        const isPng = file.target.files[0].type === 'image/png';
        const isGif = file.target.files[0].type === 'image/gif';
        if (!isJpg && !isPng && !isGif) {
            this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
            return false;
        }
        item.href = '';
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
            this.token =  data.data
            util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
                item.href = url
            });
        }) 
      },
      //步骤列表图片删除
      delPic(item){
        item.href = '';
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
