import { quillEditor } from 'vue-quill-editor'
import edit from '@/pages/mixins/edit';
import * as httpUrl from '../../util/http'
export default {
    // components: {
    //   quillEditor
    // },
    data() {
        return {
          editorOption:{
              modules:{
                  toolbar:[
                      ['bold', 'italic', 'underline', 'strike', 'color', 'image', 'video','link'],        // toggled buttons
                      [{ 'align': [] }],
                      ['blockquote', 'code-block'],
                      [{ 'color': [] }, { 'background': [] }],
                      // [{'size':['smale',false,'large','huge']}],
                      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
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
