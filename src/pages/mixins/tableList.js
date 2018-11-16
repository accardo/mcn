import util from '@/util/util';

const tableList = {
  props: {
    url: {
      type: String,
      default: '',
    },
    searchData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      amount: null,
      internalPageSize: 10,
      internalCurrentPage: 1,
      tableData:  [],
    }
  },
  mounted() {
    /*
    * 初始化数据
    * */
    this.$nextTick(function () {
      this.getTableData();
    });
  },
  methods: {
    /*
     * Description: 请求数据翻页
     * Author: yanlichen <lichen.yan@daydaycook.com.cn>
     * Date: 2018/9/27
     */
    getTableData() {
      this.loading = true;
      this.$http.httpAjax(this.$http.ajaxUrl + this.url, this.searchData).then((res) => {
        if(res.data.data){
          if (res.data.data.rows.length > 0) {
            res.data.data.rows.forEach((item) => {
              item.signs = util.stringSplit(item.signs)
            })
          }
          this.amount = res.data.data.total;
          this.tableData = res.data.data.rows;
        }
        this.internalPageSize = this.searchData.pageSize;
        this.loading = false;
      })
    },
    /*
		 * Description: pageSize 改变时会触发
		 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
		 * Date: 2018/9/27
		 */
    handleSizeChange(size) {
      this.searchData.pageSize = size
      this.getTableData();
    },
    /*
		 * Description: currentPage 改变时会触发
		 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
		 * Date: 2018/9/27
		 */
    handleCurrentChange(currentPage) {
      this.searchData.pageIndex = currentPage
      this.getTableData();
    },
    /*
	 * Description: 下线
	 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
	 * Date: 2018/9/27
	 */
    outLine(id,type){
      let params = {
        id,
        state: 'Z'
      }
      this.$confirm('下线后，作品将不会显示在APP上，粉丝也看不到了，真的要将作品下线吗？', '下线作品', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if(type == 6){//食谱类型 下线
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/cook/update`, params).then(() => {
            this.$message({type: 'success', message: '下线成功'});
            this.getTableData();
          })
        }else{//视频 图文下线
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
            this.$message({type: 'success', message: '下线成功'});
            this.getTableData();
          })
        }
        
      }).catch(action => {

      });
    },
  },
  watch: {}
}
export default tableList;
