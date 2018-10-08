import tableList from '@/components/tableListTwo'
import util from '@/util/util';
export default {
    data() {
        return {
          activeName: '1',
          listData: {
            state: 1,
            workType: 2,
            pageIndex: 1,
            pageSize: 10
          },
          isRefresh: false,
          session: localStorage.getItem('sessionId'),
        };
    },
    components:{
        tableList
    },
    mounted(){
      this.getStatus();
      /*
       * 初始化数据
       * */
      this.$nextTick(function () {
        this.isRefresh = true
      });
    },
    methods: {
      //获取用户状态
      getStatus(){
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/checkUser`).then(({data}) => {
          if(data.code!="0000"){
            localStorage.setItem('navindex','1');
            this.$router.push({
              name:'idTest'
            })
          }
        })
      },
      /*
       * Description: 切换tab
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/27
       */
      handleClick(tab) {
        this.listData = {
          workType: 2,
          pageIndex: 1,
          pageSize: 10
        }
        switch(Number(tab.name)){
          case 1:
            this.listData.state = 1;
            break;
          case 2:
            this.listData.state = 2
            break;
          case 3:
            this.listData.state = 3;
            break;
          case 4:
            this.listData.state = 4;
            break;
          case 5:
            this.listData.state = 5;
            break;
          case 6:
            this.listData.state = 6
            break;
          default:
            this.$message({message: '未知错误',type: 'error'});
        }
        this.isRefresh = true
        console.log(tab.name, this.listData, '123')
      }
    }
};
