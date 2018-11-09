import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'    // 引入编辑器
import edit from '@/pages/mixins/edit';
import util from "../../util/util";
import * as httpUrl from '../../util/http'
export default {
    data() {
        return {
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
            cateCode1: [
              { required: true, message: '请选择一级分类', trigger: 'blur' },
            ],
            cateCode2: [
              { required: true, message: '请选择二级分类', trigger: 'blur' },
            ],
            homePicture: [
              { required: true, message: '请上传图文封面', trigger: 'blur' },
            ],
            workContext: [
              { required: true, message: '请输入正文内容', trigger: 'blur' },
            ],
          }
        };
    },
    mounted() {
      // this.getStatus();
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
      back() {//取消
        if(this.$route.params.index){
          this.$router.push({
            name:'index'
          })
        }else{
          this.$router.push({
            name:'pic'
          })
        }
      },
    },
    mixins: [edit],
};
