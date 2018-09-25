import util from '../../util/util';
import axios from 'axios'
export default {
    data() {
      return {
        ruleForm: {
          pass: '',
          account: '',
        },
        codeText: '发送验证码',
        codeBtn: true,
        rules: {
          pass: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
          account: [
            { required: true, message: '请输入账户', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的账户', trigger: 'blur' }
          ]
        }
      };
    },
    created(){
     // this.init();
    },
    methods: {
      /*init(){
        //初始化
        this.isLogin();

      },
      //获取缓存判断用户登录信息是否有效
      isLogin(){
        let session = localStorage.getItem('sessionId');
        util.isOverdue(session).then(res => {
          if(res =='true'){
            this.$router.push({//直接跳转到首页
              name:'index'
            })
          }
        })
      },*/
      getCode() { //获取验证码
        this.codeBtn= true;
        axios.post(`${this.$http.ajaxUrl1}/member/smsCode`, {
          mobile: this.ruleForm.account
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
      resetMailTime(e) {//发送验证码倒计时
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
      submitForm(formName) { //登录
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post(`${this.$http.ajaxUrl1}/member/login`, {
              mobile: this.ruleForm.account,
              smsCode: this.ruleForm.pass
            }).then((res) => {
              console.log(res)
              if (res.data.code == 1) {
                localStorage.setItem('sessionId',res.data.data.session);
                localStorage.setItem('name',res.data.data.name);
                this.$router.push({
                  name: 'index',
                  params: {
                    name: 1
                  }
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
      linkto(){
        //跳转到注册页
        this.$router.push({
            name:'register'
        })
      }
    },
    watch: {
      'ruleForm.account' (val) {
        if (val.length == 11) {
          this.codeBtn = false
        }
      }
    }
  }
