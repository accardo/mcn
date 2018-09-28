import util from '../../util/util';
import axios from "axios/index";
export default {
    data() {
      return {
        ruleForm: {
          phone:'',
          vcode:'',
        },
        codeText:'发送验证码',
        checked: false,
        codeBtn: true,
        rules: {
          vcode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入账户', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      getCode() { //获取验证码
        this.codeBtn= true;
        axios.post(`${this.$http.ajaxUrl1}/member/smsCode`, {
          mobile: this.ruleForm.phone
        }).then((res) => {
          this.resetMailTime();
          if(res.data.code==1){
            console.log('发送验证码成功')
          }else{
            switch(res.data.code){
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
              axios.post(`${this.$http.ajaxUrl1}/member/login`, {
                mobile: this.ruleForm.phone,
                smsCode: this.ruleForm.vcode
              }).then((res) => {
                console.log(res)
                if (res.data.code == 1) {
                  localStorage.setItem('sessionId',res.data.data.session);
                  localStorage.setItem('name',res.data.data.name);
                  localStorage.setItem('navindex','1');
                  this.$router.push({
                    name:'idTest'
                  })
                } else {
                  switch(res.data.code){
                    case 0:
                      this.$message({message: '报错',type: 'error'});
                      break;
                    case 2:
                      this.$message({message: '请求参数错误',type: 'error'});
                      break;
                    case 10004:
                      this.$message({message: '验证码错误',type: 'error'});
                      break;
                    case 10009:
                      this.$message({message: '手机号注册失败',type: 'error'});
                      break;
                    case 10008:
                      this.$message({message: '用户已被锁定',type: 'error'});
                      break;
                    default:
                      this.$message({message: '未知错误',type: 'error'});
                  }
                }
              })
            } else {
              //console.log('error submit!!');
              return false;
            }
          });
        },
    },
    watch: {
      'ruleForm.phone'(val) {
        if (val.length == 11) {
          this.codeBtn = false
        }else {
          this.codeBtn = true
        }
      }
    }
}
