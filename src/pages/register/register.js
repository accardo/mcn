import util from '../../util/util';
export default {
    data() {
      var checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
          this.codeBtn = true;
        } else if(value.length != 11){
          callback(new Error('请输入正确的手机号'));
          this.codeBtn = true;
        }else {
          this.codeBtn = false;
          callback();
        }
      };
      var checkVcode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          phone:'',
          vcode:'',
        },
        codeText:'发送验证码',
        checked:true,
        codeBtn:true,
        rules: {
            phone: [
                { validator: checkPhone, trigger: 'blur' }
              ],
            vcode: [
                { validator: checkVcode, trigger: 'blur' }
            ]
        }
      };
    },
    methods: {
        getCode(){//获取验证码
            let that = this;
            that.codeBtn = true;
            let params = {
              mobile: that.ruleForm.phone
            }
            util.$ajax(`${util.ajaxUrl}/member/smsCode`,params,'post').then(res => {
               if(res.code != 1){
                switch(res.code){
                  case 0:
                    this.$message({message: '报错',type: 'error'});
                    break;
                  case 2:
                    this.$message({message: '请求参数错误',type: 'error'});
                    break;
                  case 10004:
                    this.$message({message: '短信验证码验证失败',type: 'error'});
                    break;
                  case 10005:
                    this.$message({message: '短信发送异常',type: 'error'});
                    break;
                  case 10013:
                    this.$message({message: '1分钟内只能发送一次',type: 'error'});
                    break;
                  case 10014:
                    this.$message({message: '短信验证码过期',type: 'error'});
                    break;
                  default:
                    this.$message({message: '未知错误',type: 'error'});
                }
               }
            })
            that.resetMailTime();
        },
        resetMailTime: function(e) {//发送验证码倒计时
          let num = 60,
          that = this;
          that.codeText = num + "秒后重新发送";
          let time = setInterval(function() {
              num--;
              that.codeText = num + "秒后重新发送";
              if (num == 0) {
                  clearInterval(time);
                  time = null;
                  that.codeText = "重发验证码";
                  that.codeBtn = false;
              }
          }, 1000);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.checked==true){
                  let that = this;
                  let params = {
                    mobile: that.ruleForm.phone,
                    smsCode: that.ruleForm.vcode
                  }
                  //提交注册信息
                  util.$ajax(`${util.ajaxUrl}/member/register`,params,'post').then(res => {
                    if(res.code==1){
                      localStorage.setItem('sessionId',res.data.session);
                      localStorage.setItem('name',res.data.name);
                      this.$router.push({
                        name:'idTest'
                      })
                    }else{
                      switch(res.code){
                        case 0:
                          this.$message({message: '报错',type: 'error'});
                          break;
                        case 2:
                          this.$message({message: '请求参数错误',type: 'error'});
                          break;
                        case 10004:
                          this.$message({message: '验证码错误',type: 'error'});
                          break;
                        case 10001:
                          this.$message({message: '手机号已被注册',type: 'error'});
                          break;
                        case 10013:
                          this.$message({message: '注册失败',type: 'error'});
                          break;
                        default:
                          this.$message({message: '未知错误',type: 'error'});
                      }
                    }
                  }) 
                }else{
                  this.$message({message: '需要同意协议',type: 'warning'});
                }
            } else {
                return false;
            }
            });
        },
        linkto() {
            //跳转到登录页
            this.$router.push({
                name:'login'
            })
        }
    }
  }