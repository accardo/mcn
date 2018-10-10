import tableList from '@/components/tableList'
import util from '@/util/util';

export default {
    data(){
        return {
          recentList: [], // 最新编辑 只取一条
        }
    },
    components:{
      tableList
    },

    mounted(){
      this.getStatus();
      this.getRecentList();
    },
    methods:{
      //获取用户状态
      getStatus(){
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/user/checkUser`).then(({data}) => {
          if(data.code!="0000"){
            localStorage.setItem('navindex','1');
            this.$message({ message: '身份认证通过才可以继续操作哦',type: 'warning',duration:1500});
            //成功后跳转到首页
            setTimeout(()=>{
              this.$router.push({
                name:'idTest'
              })
            },1500)
          }
        })
      },

      /*
       * Description: 最新编辑 只要一条数据
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/20
       */
      getRecentList() {
        let params = {
          state: 2,
          pageIndex: 1,
          pageSize: 1,
        }
        this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/list`,params).then((res) => {
          res.data.data.rows.forEach((item) => {
            item.signs = util.stringSplit(item.signs)
          })
          this.recentList = res.data.data.rows;
        })
      },
      /*
       * Description: 编辑跳转 id -> 作品id; workType -> 1、图文类型 2、视频类型
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/21
       */
      latelyEdit(id, workType, index){
        let name = ''
        if (workType == 1) {
          name = 'editPic'
        } else if (workType == 2) {
          name = 'editVideo'
        }
        this.$router.push({
          name,
          params: {
            id,
            workType,
            index
          }
        })
      }
    }
}
