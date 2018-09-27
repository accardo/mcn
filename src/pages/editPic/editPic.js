import util from '../../util/util';
import * as qiniu from 'qiniu-js'
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
            session: localStorage.getItem('sessionId'),
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
            picFlag:false,//图片上传进度条
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
            /*let self = this;
            self.typeOptions.map(item => {
                if(item.key == value){
                    self.ruleForm.typeTwo = '';
                    self.childList = item.options;
                }
            })*/
        },
        selectTypeTwo(value){
            let self = this;
            console.log(self.ruleForm.typeOne,self.ruleForm.typeTwo)
        },
        beforeUploadPic(file) {
            const isJpg = file.type === 'image/jpeg';
            const isPng = file.type === 'image/png';
            const isGif = file.type === 'image/gif';
            if (!isJpg && !isPng && !isGif) {
              this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
            }
            return isJpg || isPng || isGif
        },
        handlePicSuccess(res, file) {
            this.picFlag = false;
            this.qiniuUpload(res.data, file, 1);
        },
        picPercent(event, file, fileList){
            this.picFlag = true;
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
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(){//内容改变事件
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
        }
    }
};
