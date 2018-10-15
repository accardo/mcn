import edit from '@/pages/mixins/edit';
import util from '../../util/util';
import * as httpUrl from '../../util/http'
export default {
    data() {
      return {
        ruleForm: {
          idCardName:'',
          idCardNum:'',
          idCardPhoto:'',
          remark:'',
          checkState:'W'
        },
        session: localStorage.getItem('sessionId'),
        formShow: false, //表单显示   1002尚未认证 1001 审核未通过
        remarkShow: false, //1001审核未通过 显示原因
        loadingStatus:false,   //等待审核状态
        successStatus: false,  //审核成功状态
        picFlag:false,//图片上传进度条
        rules: {
          idCardName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          idCardNum: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { min: 15, max: 18, message: '请输入正确的身份证', trigger: 'blur' }
          ],
          idCardPhoto: [
            { required: true, message: '请上传身份证', trigger: 'change' },
          ]
        }, 
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
            if(data.code=="0000"){//审核通过
              this.successStatus = true;
            }else if(data.code=="1001"){//审核未通过
              this.formShow = true;
              this.remarkShow = true;
              this.ruleForm = data.data;
              this.ruleForm.checkState = 'W'
            }else if(data.code=="1003"){//资料审核中
              this.loadingStatus = true;
            }else{//尚未认证
              this.$message({ message: '您需要先通过身份认证',type: 'warning',duration:1500});
              this.formShow = true;
            }
          })
        },
        getTokenPic(file){
          const isJpg = file.target.files[0].type === 'image/jpeg';
          const isPng = file.target.files[0].type === 'image/png';
          const isGif = file.target.files[0].type === 'image/gif';
          if (!isJpg && !isPng && !isGif) {
            this.$message.error('上传图片不正确，只能上传 jpg、png、gif格式');
            return false;
          }
          this.picFlag = true;
          this.ruleForm.idCardPhoto = '';
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/getQiniuToken`, { session: localStorage.getItem('sessionId')}).then(({data}) => {
              this.token =  data.data
              util.qiniuUpload(this.token, file.target.files[0], 1).then((url)=> {
                this.picFlag = false;
                this.ruleForm.idCardPhoto = url
              });
           }) 
        },
        submitForm(formName) {
          delete this.ruleForm.remark;
            this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/updatePersonal`, this.ruleForm).then(({data}) => {
                if(data.code = '0000'){
                  this.$message({ message: '身份证信息提交成功',type: 'success',duration:1500});
                  //成功后跳转到首页
                  setTimeout(()=>{
                    this.$router.push({
                      name:'index'
                    })
                  },1500)
                }else if(data.code = '1001'){
                  this.$message({ message: data.message, type: 'error', duration:1500});
                }
              })
            } else {
                return false;
            }
            });
        },
    }
  }
