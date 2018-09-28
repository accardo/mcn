<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <div class="list-item" v-if="tableData.length != 0" v-for="(item, index) in tableData" :key="index">
      <p class="time-area fl" >
        <span>{{item.publishTimeLong | formatTimeOne}}</span>
        <span>{{item.publishTimeLong | formatTimeTwo}}</span>
      </p>
      <div class="img fl">
        <img :src="item.homePicture" alt="">
      </div>
      <div class="detail fl">
        <p>
          <span class="type">{{item.workType | formatLabel}}</span>
          <span class="title">{{item.title}}</span>
        </p>
        <p>
          <el-tag class="tag-signs" type="success" size="small" v-for="(itemSigns, index) in item.signs" :key="index">{{itemSigns}}</el-tag>
        </p>
        <p>
          <i class="iconfont icon-browse fl"></i><em class="fl">{{item.readNum}}</em>
          <i class="iconfont icon-like fl"></i><em class="fl">{{item.praiseNum}}</em>
          <i class="iconfont icon-message fl"></i><em class="fl">{{item.commentNum}}</em>
          <i class="iconfont icon-share fl"></i><em class="fl">{{item.shareNum}}</em>
        </p>
      </div>
      <el-button class="fr" size="mini" @click="outLine(item.id)" type="danger">下线</el-button>
    </div>
     <div v-if="tableData.length == 0" style="text-align:center;line-height:60px;">
      <i class="iconfont icon-wushuju"></i>暂无数据
    </div>
    <div class="block fr">
      <el-pagination
        :current-page.sync="internalCurrentPage"
        :page-size="internalPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="amount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>

  import util from '@/util/util';
  export default {
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
     data(){
          return {
            loading: false,
            amount: null,
            internalPageSize: 10,
            internalCurrentPage: 1,
            tableData:  [],
          }
     },
     mounted(){
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
           if (res.data.data.rows.length > 0) {
             res.data.data.rows.forEach((item) => {
               item.signs = util.stringSplit(item.signs)
             })
           }
           this.amount = res.data.data.total;
           this.internalPageSize = this.searchData.pageSize;
           this.tableData = res.data.data.rows;
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
        * Description: 视频下线
        * Author: yanlichen <lichen.yan@daydaycook.com.cn>
        * Date: 2018/9/27
        */
       outLine(id){
         let params = {
           id,
           state: 'Z'
         }
         this.$confirm('下线后，作品将不会显示在APP上，粉丝也看不到了，真的要将作品下线吗？', '下线作品', {
           distinguishCancelAndClose: true,
           confirmButtonText: '确定',
           cancelButtonText: '取消'
         }).then(() => {
           this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
             this.$message({type: 'success', message: '下线成功'});
             this.getTableData();
           })
         }).catch(action => {

         });
       },
     },
    filters:{
      formatTimeOne(str) {
        function setv(v){v = v < 10?'0' + v : v; return v; }
        let v = new Date(str)
        let y = v.getFullYear()   //年
        let mt = v.getMonth() + 1 //上个月
        let d = v.getDate()      //天getDate.getDate()
        return y + '/' + mt + '/' + d
      },
      formatTimeTwo(str) {
        function setv(v){v = v < 10?'0' + v : v; return v; }
        var v = new Date(str)
        var h = v.getHours()
        var mn = v.getMinutes()
        return setv(h) + ':' + setv(mn)
      },
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
</script>
<style scoped>
  @import '../../static/css/common.css';
  @import '../../static/css/iconfont.css';
  .list-item{
    margin-bottom: 15px;
    overflow: hidden;
  }
  .list-item .time-area{
    width: 100px;
    font-size: 14px;
  }
  .list-item .time-area span {
    display: block;
  }
  .list-item .time{
    font-size: 14px;
  }
  .list-item .img{
    width: 200px;
    height: 115px;
    position: relative;
    overflow: hidden;
  }
  .list-item .img img{
    width: 100%;
    height: 100%;
  }
  .list-item .detail {
    margin-left: 10px;
  }
  .list-item .detail p{
    margin: 0；
  }
  .detail p{
    margin-bottom: 15px;
  }
  .detail .type{
    background: #409EFF;
    height: 24px;
    line-height: 24px;
    text-align: center;
    padding: 0 8px;
    font-size: 14px;
    margin-right: 10px;
    color: #fff;
    display: inline-block;
  }
  .detail .title{
    font-size: 14px;
  }
  .detail .tag{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0 8px;
    border: #ccc solid 1px;
  }
  .detail em{
    height: 16px;
    line-height: 16px;
    font-style: normal;
    font-size: 12px;
    margin-right: 10px;
  }
  .out-btn{
    width: 60px;
    text-align: center;
    cursor: pointer;
    color: #f56c6c;
    font-size: 14px;
  }
  .block{
    display: block;
    margin-top: 10px;
  }
  .tag-signs {
    margin-right: 10px;
  }
  .icon-wushuju{
    font-size: 26px;
    color: #333;
  }
</style>

