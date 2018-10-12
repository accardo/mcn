import { quillEditor } from 'vue-quill-editor'
import edit from '@/pages/mixins/edit';
import * as httpUrl from '../../util/http'
export default {
    data() {
        return {
          editorOption:{
              modules:{
                  toolbar:[
                      ['bold', 'italic', 'underline', 'strike', 'color','align', 'image', 'video','link'],        // toggled buttons
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
              { required: true, message: '请输入描述内容', trigger: 'blur' },
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
          if(data.code!="0000"){
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
