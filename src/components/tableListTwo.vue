<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <div class="item-title">
        <div class="module one">内容</div>
        <div class="module two">发布状态</div>
        <div class="module two">更新时间</div>
        <div class="module two">操作</div>
    </div>
    <div class="list-item" v-if="tableData.length != 0" v-for="(item, index) in tableData" :key="index">
      <div class="module one">
          <div class="img fl">
              <img :src="item.homePicture" alt="">
          </div>
            <div class="detail fl">
              <p>
                  <span class="type fl">{{item.workType | formatLabel}}</span>
                  <span class="title fl">{{item.title}}</span>
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
       </div>
      <div class="module two" >
        <el-tag :type="item.state==='S'?'success':item.state==='F'?'danger':item.state==='Z'?'info':''">{{item.state | formatState}}</el-tag>
        <p v-if="item.state==='F'" class="remark-font">原因：{{item.remark}}</p>
      </div>
      <div class="module two">
          <span>{{item.updateTime | formatTimeOne}}</span>
          <span>{{item.updateTime | formatTimeTwo}}</span>
      </div>
      <div class="module two">
        <!-- A草稿 -->
        <div v-if="item.state=='A'">
          <span class="blue-btn" @click="edit(item.id, item.workType)">编辑</span>
          <span class="blue-btn" @click="publish(item.id)">发布</span>
        </div>
        <!-- W审核中 -->
        <div v-if="item.state=='W'">
          <span class="blue-btn" @click="backout(item.id)">撤销</span>
        </div>
        <!-- S已发布 -->
        <div v-if="item.state=='S'">
           <span class="red-btn" @click="outLine(item.id)">下线</span>
        </div>
        <!-- F未过审 -->
        <div v-if="item.state=='F'">
          <span class="blue-btn" @click="edit(item.id, item.workType)">编辑</span>
        </div>
        <!-- T定时发布 -->
        <div v-if="item.state=='T'">
           <span class="blue-btn" @click="edit(item.id, item.workType)">编辑</span>
        </div>
        <!-- Z已下线 -->
        <div v-if="item.state=='Z'">
          <span class="blue-btn" @click="edit(item.id, item.workType)">编辑</span>
          <!--<span class="red-btn" @click="del(item.id)">删除</span>-->
        </div>
      </div>
    </div>
    <div v-if="tableData.length == 0" style="text-align:center;line-height:80px;">
      <i class="iconfont icon-wushuju"></i>暂无数据
    </div>
    <div class="block fr">
      <el-pagination
        :current-page.sync="internalCurrentPage"
        :page-sizes="[5, 10, 20]"
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
            tableData: [],
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
           if (res.data.data.rows.length > 0 ) {
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
      //  编辑
      edit(id, workType) {
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
      },
      // 发布
      publish(id) {
        let params = {
          id,
          state: 'W'
        }
        this.$confirm('确认发布信息？', '视频发布', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
            this.$message({type: 'success', message: '发布成功'});
            this.getTableData();
          })
        }).catch(action => {

        });
      },
      // 撤销
      backout(id) {
        let params = {
          id,
          state: 'A'
        }
        this.$confirm('确认撤销发布？', '视频发布', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
            this.$message({type: 'success', message: '撤销成功'});
            this.getTableData();
          })
        }).catch(action => {

        });
      },
      // 下线
      outLine(id) {
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
      // 删除
      del(id) {

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
      },
      formatState(str) {
        let state = '';
        switch (str){
          case 'A': state = '草稿';  break;
          case 'W': state = '审核中';  break;
          case 'S': state = '已发布';  break;
          case 'F': state = '未过审';  break;
          case 'T': state = '定时发布';  break;
          case 'Z': state = '已下线';  break;
        }
        return state
      }
    }
   }
</script>
<style scoped>
  @import '../../static/css/common.css';
  @import '../../static/css/iconfont.css';
  .item-title{
    background: #ecf5ff;
    height: 30px;
    width: 100%;
    font-size: 0;
    line-height: 30px;

}
.item-title .module{
    font-size: 14px;
}
.list-item{
    margin-bottom: 10px;
    font-size: 0;
    margin: 10px 0 0 0;
    overflow: hidden;
}
.module{
    float: left;
    height: 100%;
    font-size: 14px;
    box-sizing: border-box;

}
.module.one{
    width: 52%;
    padding-left: 20px;
}
.module.two{
    width: 16%;
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
.list-item .img  .time{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #000;
    color: #fff;
    font-size: 12px;
    padding: 4px;
    height: 16px;
    line-break: 16px;
}
.list-item .detail {
    margin-left: 10px;
}
.list-item .detail p{
    margin: 0；
}
.detail p{
    margin-bottom: 15px;
    overflow: hidden;
}
.detail .title{
    width: 192px;
    overflow: hidden;
    display: inline-block;
    font-size: 14px;
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
    margin-right: 5px;
}
.remark-font{
    color: #606266;
    font-size: 12px;
    margin-top: 10px;
}
.blue-btn{
    color:#409EFF;
    display: inline-block;
    margin-right:10px;
    text-align: center;
    cursor: pointer;
}
.red-btn{
    display: inline-block;
    text-align: center;
    cursor: pointer;
    color: #f56c6c;
}
.block{
    display: block;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-right: 20px;
}
.tag-signs {
  margin-right: 10px;
}
.icon-wushuju{
  font-size: 26px;
  color: #333;
}
</style>

