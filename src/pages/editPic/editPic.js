import classifyData from '../editVideo/a.json';
import { quillEditor } from 'vue-quill-editor'
export default {
    data() {
        return {
            ruleForm:{
                title:'',
                typeOne:'',
                typeTwo:'',
                tips:[],
                imageUrl:'https://mobile.daydaycook.com.cn/activity/2018/09/kitchen/images/share.jpg',
                videoImgUrl:'',
                videoUrl:'',
                textarea:'',
            },
            content:null,
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
            selectValue:'',
            childList:[],
            tipsOptions:[{
                value: '选项1',
                label: '111'
              }, {
                value: '选项2',
                label: '222'
              }, {
                value: '选项3',
                label: '333'
              }, {
                value: '选项4',
                label: '444'
              }, {
                value: '选项5',
                label: '4444'
            }],
            typeOptions:classifyData.data,
        };
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            //console.log(classifyData)
        },
        selectTypeOne(value){
            let self = this;
            self.typeOptions.map(item => {
                if(item.key == value){
                    self.ruleForm.typeTwo = '';
                    self.childList = item.options;
                }
            })
        },
        selectTypeTwo(value){
            let self = this;
            console.log(self.ruleForm.typeOne,self.ruleForm.typeTwo)
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.dataimageUrl = URL.createObjectURL(file.raw);
            console.log(this.ruleForm.dataimageUrl)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';//规定图片格式
            const isLt2M = file.size / 1024 / 1024 < 2;//规定图片大小

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(){//内容改变事件
        },
        back(){
            //取消
            this.$router.push({
                name:'pic'
            })
        }
    }
};