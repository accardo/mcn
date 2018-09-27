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
      this.getRecentList();
    },
    methods:{
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
    },
    filters: {
      formatLabel(str) {
        let tempStr = ''
        if (str == 1) {
          tempStr = '图文';
        } else if (str == 2) {
          tempStr = '视频';
        }
        return tempStr
      }
    }
}
