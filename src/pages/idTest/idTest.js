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
          imageUrl:''
        },
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
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
              //成功后跳转到首页
              this.$router.push({
                name:'index'
              })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
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