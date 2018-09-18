import util from '../../util/util';
export default {
    data() {
      var account = (rule, value, callback) =>{
          if(value === ''){
            callback(new Error('请输入账户'));
            this.codeBtn = true;
          }else if(value.length != 11){
            callback(new Error('请输入正确的账户'));
            this.codeBtn = true;
          }else{
            this.codeBtn = false;
            callback();
          }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      }
      return {
        ruleForm: {
          pass: '',
          account: '',
        },
        codeText:'发送验证码',
        codeBtn:true,
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          account: [
            { validator: account, trigger: 'blur' }
          ]
        }
      };
    },
    created(){
      this.init();
    },
    methods: {
      init(){
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
      },
      getCode(){//获取验证码
        let _this = this;
        _this.codeBtn = true;
        let params = {
          mobile: _this.ruleForm.account
        }
        util.$ajax(`${util.ajaxUrl}/member/smsCode`,params,'post').then(res => {
          _this.resetMailTime();
          if(res.code==1){
            console.log('发送验证码成功')
          }else{
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
      submitForm(formName) {//登录
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _this = this; 
            let params = {
              mobile: _this.ruleForm.account,
              smsCode: _this.ruleForm.pass
            }
            util.$ajax(`${util.ajaxUrl}/member/login`,params,'post').then(res => {//验证验证码并登陆
              if(res.code==1){
                localStorage.setItem('sessionId',res.data.session);
                localStorage.setItem('name',res.data.name);
                //跳转到首页
                _this.$router.push({
                  name:'layout',
                  query:{
                    name:1
                  }
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
      resetForm(formName) {//重置
        this.$refs[formName].resetFields();
      },
      linkto(){
        //跳转到注册页
        this.$router.push({
            name:'register'
        })
      }
    }
  }