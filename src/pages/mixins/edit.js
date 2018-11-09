import util from "../../util/util";

const edit = {
  data() {
    return {
      ruleForm: {
        title: '',
        cateCode1: '',
        cateCode2: '',
        homePicture: '',
        workContext: '',
        videoHref: '',
        remark: '',
        cookInfoRequestDTO:[],
        MediaWorksDetailRequestDTO:[],
      },
      session: localStorage.getItem('sessionId'),
      levelFirst: null, // 一级分类
      levelSecond: null, // 二级分类
      videoFlag:false,//视频上传进度条
      picFlag:false,//图片上传进度条
      isLevel: true,
      isSave: false,
      saveText: '保存',
      saveReleaseText: '保存并发布'
    }
  },
  mounted() {
    if (this.$route.name !== 'createPic' && this.$route.name !== 'createVideo' && this.$route.name !== 'createRecipe') {
      if (this.$route.name == 'createRecipe'){
        this.getDetails('cook');
      } else {
        this.getDetails('works');
      }
      
    }
    this.getLevel();
  },
  methods: {
    /*
     * Description: 图文、视频、食谱详情信息
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/21
     */
    getDetails(getUrl) {
      this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/${getUrl}/findOne`, {id: this.$route.params.id}).then(({data}) => {
        this.ruleForm = data.data;
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
      this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getCodeLevel`, {levelCode: value}).then(({data}) => {
        // console.log(data.data)
        if (this.isLevel) {
          this.isLevel = false
        } else {
          this.ruleForm.cateCode2 = data.data[0].detailCode
        }
        if (this.$route.name == 'createPic' || this.$route.name == 'createVideo'|| this.$route.name == 'createRecipe') {
          this.ruleForm.cateCode2 = data.data[0].detailCode
        }
        this.levelSecond = data.data;
      })
    },
    /*
     * Description: 图片上传   10.12上传方式修改
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/25
     */
    getTokenPic(file){
      const isJpg = file.target.files[0].type === 'image/jpeg';
      const isPng = file.target.files[0].type === 'image/png';
      const isGif = file.target.files[0].type === 'image/gif';
      if (!isJpg && !isPng && !isGif) {
        this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
        return false;
      }
      this.picFlag = true;
      this.ruleForm.homePicture = '';
      this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
          this.token =  data.data
          util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
            this.picFlag = false;
            this.ruleForm.homePicture = url
          });
       }) 
    },
    /*
       * Description: type -> 1 保存草稿, type -> 2 发布审核 更新保存
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/26
       */
    saveRelease(type, formName){
      delete this.ruleForm.createTime;
      delete this.ruleForm.publishTime;
      delete this.ruleForm.timeFrom1;
      delete this.ruleForm.timeFrom2;
      delete this.ruleForm.timeTo1;
      delete this.ruleForm.timeTo2;
      delete this.ruleForm.updateTime;
      this.$refs[formName].validate((valid) => {
       
        if (valid) {
          this.$confirm('确认保存?', '确认消息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let urlSaveUpdate = '';
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
            } else if (this.$route.name === 'createVideo') {
              this.ruleForm.workType = 2
              this.ruleForm.publishTask = 1
            }else if (this.$route.name === 'createRecipe') {
              this.ruleForm.workType = 6 
              this.ruleForm.publishTask = 1
            }
            if(this.$route.name === 'createPic' || this.$route.name === 'createVideo') {
              urlSaveUpdate = '/kol/works/save'
            } else if(this.$route.name === 'editPic' || this.$route.name === 'editVideo' ){
              urlSaveUpdate = '/kol/works/update'
            } else if(this.$route.name === 'createRecipe'){
              urlSaveUpdate = '/kol/cook/save'
            } else if(this.$route.name === 'editRecipe'){
              urlSaveUpdate = '/kol/cook/update'
            }      
            this.$http.httpAjax(this.$http.ajaxUrl + urlSaveUpdate, this.ruleForm).then(({data}) => {
              if(data.code=='0000'){
                if (type == 1) {
                  this.saveText = '保存'
                  this.$message({type: 'success', message: '保存草稿成功'});
                } else if(type == 2) {
                  this.saveReleaseText = '保存并发布';
                  this.$message({type: 'success', message: '保存并发布成功'});
                }
                this.isSave = false;
                // if (this.$route.name === 'createPic' || this.$route.name === 'editPic') {
                //   this.$router.push({
                //     name: 'pic'
                //   })
                // } else if (this.$route.name === 'createVideo' || this.$route.name === 'editVideo') {
                //   this.$router.push({
                //     name: 'video'
                //   })
                // }else if (this.$route.name === 'createRecipe' || this.$route.name === 'editRecipe') {
                //   this.$router.push({
                //     name: 'recipe'
                //   })
                // }
              }else{
                Message.error(res.data.message);
              }
             
            })
          }).catch(action => {
          });
        }
      })
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
    },
  }
}
export default edit;
