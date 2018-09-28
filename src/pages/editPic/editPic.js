import { quillEditor } from 'vue-quill-editor'
import util from "../../util/util";
import * as qiniu from "qiniu-js";
export default {
    data() {
        return {
          ruleForm: {
            title: '',
            cateCode1: '',
            cateCode2: '',
            homePicture: '',
            workContext: ''
          },
          session: localStorage.getItem('sessionId'),
          levelFirst: null, // 一级分类
          levelSecond: null, // 二级分类
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
          isLevel: true,
          isSave: false,
          saveText: '保存',
          saveReleaseText: '保存并发布',
          picFlag:false,//图片上传进度条
        };
    },
    created() {
      if (this.$route.name !== 'createPic') {
        this.getVideo();
      }
      this.getLevel();
    },
    methods: {
      /*
			* Description: 获取视频详情信息
			* Author: yanlichen <lichen.yan@daydaycook.com.cn>
			* Date: 2018/9/21
			*/
      getVideo() {
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/findOne`, {id: this.$route.params.id}).then(({data}) => {
          this.ruleForm = data.data;
          this.watchVideo();
        })
      },
      /*
       * Description: 一级分类
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/21
       */
      getLevel() {
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getCodeLevel`, {levelCode: ''}).then(({data}) => {
          this.levelFirst = data.data;
        })
      },
      /*
       * Description: 二级分类
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/27
       */
      getLevelTwo(value) {
        console.log(123)
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getCodeLevel`, {levelCode: value}).then(({data}) => {
          if (this.isLevel) {
            this.isLevel = false
          } else {
            this.ruleForm.cateCode2 = data.data[0].detailCode
          }
          if (this.$route.name == 'createPic') {
            this.ruleForm.cateCode2 = data.data[0].detailCode
          }
          this.levelSecond = data.data;
        })
      },
      /*
      * Description: 图片上传
      * Author: yanlichen <lichen.yan@daydaycook.com.cn>
      * Date: 2018/9/25
      */
      handlePicSuccess(res, file) {
        this.picFlag = false;
        this.qiniuUpload(res.data, file, 1);
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
            this.picFlag = false;
          }
        })
      },
      /*
       * Description: 图片格式限制
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/27
       */
      beforeUploadPic(file) {
        this.picFlag = true;
        const isJpg = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isGif = file.type === 'image/gif';
        if (!isJpg && !isPng && !isGif) {
          this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
        }
        return isJpg || isPng || isGif
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
      /*
       * Description: type -> 1 保存草稿, type -> 2 发布审核 更新保存
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/26
       */
      saveRelease(type){//保存并发布按钮
        delete this.ruleForm.createTime;
        delete this.ruleForm.publishTime;
        delete this.ruleForm.timeFrom1;
        delete this.ruleForm.timeFrom2;
        delete this.ruleForm.timeTo1;
        delete this.ruleForm.timeTo2;
        delete this.ruleForm.updateTime;
        if(!this.ruleForm.title){
            this.$message({type: 'warning', message: '请填写标题'});
            return
        }else if(!this.ruleForm.cateCode1){
            this.$message({type: 'warning', message: '请选择分类'});
            return
        }else if(!this.ruleForm.homePicture){
            this.$message({type: 'warning', message: '请上传封面图片'});
            return
        }else if(!this.ruleForm.workContext){
            this.$message({type: 'warning', message: '请填写正文'});
            return
        }
        this.$confirm('确认保存?', '确认消息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (type == 1) {
            this.ruleForm.state = 'A';
            this.saveText = '保存中...'
          } else if (type == 2) {
            this.ruleForm.state = 'W';
            this.saveReleaseText = '保存并发布中...'
          }
          this.isSave = true;
          if (this.$route.name === 'createPic') {
            this.ruleForm.workType = 1
            this.ruleForm.publishTask = 1
          }
          let urlSaveUpdate = this.$route.name !== 'createPic' ? '/kol/works/update' : '/kol/works/save'
          this.$http.httpAjax(this.$http.ajaxUrl + urlSaveUpdate, this.ruleForm).then(() => {
            if (type == 1) {
              this.saveText = '保存'
              this.$message({type: 'success', message: '保存草稿成功'});
            } else if(type == 2) {
              this.saveReleaseText = '保存并发布';
              this.$message({type: 'success', message: '保存并发布成功'});
            }
            this.isSave = false;
            this.$router.push({
              name: 'pic'
            })
          })
        }).catch(action => {
        });
      }
    },
    watch: {
      /*
      * Description: 监听 获取二级分类
      * Author: yanlichen <lichen.yan@daydaycook.com.cn>
      * Date: 2018/9/21
      */
      'ruleForm.cateCode1' (value) {
        if (value) {
          this.getLevelTwo(value)
        }
        console.log(value, '监听')
      },
    }
};
