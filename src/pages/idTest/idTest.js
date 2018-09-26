import util from '../../util/util';
import * as qiniu from 'qiniu-js'
export default {
    data() {
      var checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证姓名'));
        } else {
          callback();
        }
      };
      var checkNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号码'));
        }else if( value.length != 18 ){
          callback(new Error('身份证长度不正确'));
        } else {
          callback();
        }
      };
      var checkImg = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传身份证照片'));
        }else {
          callback();
        }
      };
      return {
        ruleForm: {
          name:'',
          num:'',
          imageUrl:'',
        },
        session: localStorage.getItem('sessionId'),
        rules: {
            name: [
              { validator: checkName, trigger: 'blur' }
              ],
            num: [
              { validator: checkNum, trigger: 'blur' }
            ],
            imageUrl:[
              { validator: checkImg, trigger:'change'}
            ]
        }
      };
    },
    mounted() {
      this.getStatus();
    },
    methods: {
       //获取用户状态
        getStatus(){
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/checkUser`, this.ruleForm).then(({data}) => {
            
          })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/updatePersonal`, this.ruleForm).then(({data}) => {
                this.$message({ message: '身份证信息提交成功',type: 'success',duration:1500});
                //成功后跳转到首页
                setTimeout(()=>{
                  this.$router.push({
                    name:'index'
                  })
                },1500)
              })
            } else {
                return false;
            }
            });
        },
        //七牛文件上传
        qiniuUpload(token, file){
          let self = this;
          let { name } =file;
          let d =name.split('.');
          let t = new Date().getTime();
          name = `${d[0]}${t}.${d[1]}`;
          let qiniuPutExtra = {
            fname: "",
            params: {},
            mimeType: ''
          };
          let qiniuConfig = {
            useCdnDomain: true,
            region: qiniu.region.z2
          };
          let observable = qiniu.upload(file.raw, name, token, qiniuPutExtra, qiniuConfig);
          observable.subscribe({
            error(){
              self.$message({message: '图片上传失败，请稍后再试',type: 'error'});
            },
            complete(res){
              self.ruleForm.imageUrl = util.imgUrl() + res.key
            }
          })
        },
        handleAvatarSuccess(res, file) {
          this.qiniuUpload(res.data, file);
        },
        beforeAvatarUpload(file) {
          // const isJPG = file.type === 'image/jpeg';//规定图片格式
          // const isLt2M = file.size / 1024 / 1024 < 2;//规定图片大小
  
          // if (!isJPG) {
          //   this.$message.error('上传图片只能是 JPG 格式!');
          // }
          // if (!isLt2M) {
          //   this.$message.error('上传图片大小不能超过 2MB!');
          // }
          // return isJPG && isLt2M;
        },
        linkto() {
            //跳转到登录页
            this.$router.push({
                name:'login'
            })
        },
        skip() {
          //跳过身份认证
          this.$router.push({
            name:'index'
        })
        }
    }
  }