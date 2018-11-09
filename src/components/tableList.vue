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
          <!-- <el-tag class="tag-signs" type="success" size="small" v-for="(itemSigns, index) in item.signs" :key="index">{{itemSigns}}</el-tag> -->
          <el-tag class="tag-signs" type="success" size="small" v-if="item.cateCode1">{{item.cateCode1}}</el-tag>
          <el-tag class="tag-signs" type="success" size="small" v-if="item.cateCode2">{{item.cateCode2}}</el-tag>
        </p>
        <p>
          <i class="iconfont icon-browse fl"></i><em class="fl">{{item.readNum}}</em>
          <i class="iconfont icon-like fl"></i><em class="fl">{{item.praiseNum}}</em>
          <i class="iconfont icon-message fl"></i><em class="fl">{{item.commentNum}}</em>
          <i class="iconfont icon-share fl"></i><em class="fl">{{item.shareNum}}</em>
        </p>
      </div>
      <el-button class="fr" size="mini" @click="outLine(item.id, item.workType)" type="danger">下线</el-button>
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
import tableList from '@/pages/mixins/tableList'
  export default {
    data(){
      return {}
    },
    mounted(){},
    methods: {},
    mixins: [tableList]
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

