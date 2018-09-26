<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <div class="list-item" v-for="(item, index) in tableData" :key="index">
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
      <span class="out-btn fr" @click="outLine()">下线</span>
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
            tableData: null,
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
        * 请求数据实现翻页
        * */
       getTableData() {
         this.loading = true;
         this.$http.httpAjax(this.$http.ajaxUrl + this.url, this.searchData).then((res) => {
           res.data.data.rows.forEach((item) => {
             item.signs = util.stringSplit(item.signs)
           })
           this.amount = res.data.data.total;
           this.internalPageSize = this.searchData.pageSize;
           this.tableData = res.data.data.rows;
           this.loading = false;
         })
       },
       /*
        * pageSize 改变时会触发
        * */
       handleSizeChange(size) {
         this.searchData.pageSize = size
         this.getTableData();
       },
       /*
        * currentPage 改变时会触发
        * */
       handleCurrentChange(currentPage) {
         this.searchData.pageIndex = currentPage
         this.getTableData();
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
    /* height: 120px; */
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
</style>

