import tableList from '@/components/tableList'
import listData from './list.json';
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
        util.httpAjaxU('/kol/works/list', params).then((res) => {
          res.data.rows.forEach((item) => {
            item.signs = util.stringSplit(item.signs)
          })
          this.recentList = res.data.rows;
        })
      },
      outLine(id){//视频下线
          const h = this.$createElement;
          this.$msgbox({
              title: '下线作品',
              message: h('p', null, [
                  h('span', null, '下线后，作品将不会显示在APP上，粉丝也看不到了，真的要将作品下线吗？ '),
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                  if(action === 'confirm'){
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '执行中...';
                      done();//done用于关闭提示弹窗，请求成功后执行
                  }else{
                      done();
                  }
              }
          }).then(() => {
              this.$message({
                  type: 'info',
                  message: '操作成功'
              });
          });
      },
      /*
       * Description: 编辑跳转 id -> 作品id; workType -> 1、图文类型 2、视频类型
       * Author: yanlichen <lichen.yan@daydaycook.com.cn>
       * Date: 2018/9/21
       */
      latelyEdit(id, workType){
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
            workType
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
