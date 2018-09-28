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
