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
          isRefresh: false
        };
    },
    components:{
        tableList
    },
    mounted(){
      /*
       * 初始化数据
       * */
      this.$nextTick(function () {
        this.isRefresh = true
      });
    },
    methods: {
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
