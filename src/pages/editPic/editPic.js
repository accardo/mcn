import { quillEditor } from 'vue-quill-editor'
import edit from '@/pages/mixins/edit';

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
    mounted() {},
    methods: {
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
