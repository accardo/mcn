import axios from "axios";
import loginReg from '@/pages/mixins/loginReg'
export default {
    data() {
      return {
        session: localStorage.getItem('sessionId')?localStorage.getItem('sessionId'):'',
      };
    },
    created(){},
    mounted() {
      this.isLogin();
    },
    methods: {
      //获取用户登录状态
      isLogin(){
        axios.post(`${this.$http.ajaxUrl1}/member/islogin`, {
          session: this.session
        }).then((res) => {
          if(res.data.code == 1 && res.data.data == 1 ){ //返回为1时已登录，直接跳转至首页
            this.$router.push({
              name: 'index',
              params: {
                name: 1
              }
            })
          }
        })
      },
    },
    watch: {},
    mixins: [loginReg]
  }
