import axios from "axios";

const loginReg = {
  data() {
    return {
      ruleForm: {
        vcode: '',
        phone: '',
      },
      session:'',
      codeText: '发送验证码',
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
    }
  },
  mounted() {

  },
  methods: {
    /*
     * Description: 获取验证码
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/29
     */
    getCode() {
      axios.post(`${this.$http.ajaxUrl1}/member/smsCode`, {
        mobile: this.ruleForm.phone
      }).then((res) => {
        if(res.data.code==1){
          this.resetMailTime();
          this.codeBtn= true;
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
    /*
     * Description: 验证码倒计时
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/29
     */
    resetMailTime() {
      let num = 60;
      this.codeText = `已发送(${num})s`;
      let time = setInterval(() => {
        num--;
        this.codeText = `已发送(${num})s`;
        if (num == 0) {
          clearInterval(time);
          time = null;
          this.codeText = "重发验证码";
          this.codeBtn = false;
        }
      }, 1000);
    },
    /*
     * Description: 登录 验证
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/29
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post(`${this.$http.ajaxUrl1}/member/login`, {
            mobile: this.ruleForm.phone,
            smsCode: this.ruleForm.vcode
          }).then((res) => {
            if (res.data.code == 1) {
              localStorage.setItem('sessionId',res.data.data.session);
              localStorage.setItem('name',res.data.data.name);
              localStorage.setItem('navindex','1');
              if(!!res.data.data.thumb){
                localStorage.setItem('headImg',res.data.data.thumb);
              }
              this.session = res.data.data.session;
              this.getStatus();
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
          return false;
        }
      });
    },
    //获取用户状态
    getStatus(){
      this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/checkUser`).then(({data}) => {
        if(data.code == '1002'){//尚未认证，先去填写身份信息
          this.$router.push({
            name:'idTest'
          })
        }else{//其他情况跳转到首页
          this.$router.push({
            name: 'index',
            params: {
              name: 1
            }
          })
        }
      })
    }
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
export default loginReg;
