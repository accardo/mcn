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
       </div>
      <div class="module two" >
        <el-tag :type="item.state==='S'&&item.putDown!='Y'?'success':item.state==='F'&&item.putDown!='Y'?'danger':item.state==='Z'||item.putDown==='Y'?'info':''">{{(item.putDown,item.state)| formatState(item.putDown,item.state)}}</el-tag>
        <p v-if="item.state==='F' && item.noPassCause != null && item.noPassCause != ''" class="remark-font">原因：{{item.noPassCause }}</p>
        <p v-if="item.state==='F' && item.remark != null && item.remark != ''" class="remark-font">{{item.remark}}</p>
      </div>
      <div class="module two">
          <span>{{item.updateTime | formatTimeOne}}</span>
          <span>{{item.updateTime | formatTimeTwo}}</span>
      </div>
      <div class="module two">
        <!-- A草稿 -->
        <div v-if="item.state=='A'">
          <el-button size="mini" @click="edit(item.id, item.workType)" type="primary">编辑</el-button>
          <el-button size="mini" @click="publish(item.id, item.workType)" type="primary">发布</el-button>
        </div>
        <!-- W审核中 -->
        <div v-if="item.state=='W'">
          <el-button v-if="item.putDown != 'Y'" size="mini" @click="backout(item.id, item.workType)" type="warning">撤销</el-button>
        </div>
        <!-- S已发布 -->
        <div v-if="item.state=='S'">
            <el-button v-if="item.putDown != 'Y'" size="mini"  @click="outLine(item.id, item.workType)" type="danger">下线</el-button>
        </div>
        <!-- F未过审 -->
        <div v-if="item.state=='F'">
          <el-button v-if="item.putDown != 'Y'" size="mini" @click="edit(item.id, item.workType)" type="primary">编辑</el-button>
        </div>
        <!-- T定时发布 -->
        <div v-if="item.state=='T'">
          <el-button v-if="item.putDown != 'Y'" size="mini" @click="edit(item.id, item.workType)" type="primary">编辑</el-button>
        </div>
        <!-- Z已下线 -->
        <div v-if="item.state=='Z'">
          <el-button v-if="item.putDown != 'Y'" size="mini" @click="edit(item.id, item.workType)" type="primary">编辑</el-button>
        </div>
      </div>
    </div>
    <div v-if="tableData.length == 0" style="text-align:center;line-height:80px;">
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
     props: {
       isRefresh: {
         type: Boolean,
         default: false
       }
     },
     data(){
          return {}
     },
     mounted(){},
     methods: {
      //  编辑
      edit(id, workType) {
        let name = ''
        if (workType == 1) {
          name = 'editPic'
        } else if (workType == 2) {
          name = 'editVideo'
        }else if (workType == 6) {
          name = 'editRecipe'
        }
        this.$router.push({
          name,
          params: {
            id,
            workType
          }
        })
      },
      // 发布  1203 撤销发布下线 三个操作加参数 edit:'0'
      publish(id, workType) {
        let params = {
          id,
          edit:'0',
          state: 'W'
        }
        this.$confirm('确认发布信息？', '视频发布', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if(workType == 6){
            this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/cook/update`, params).then(() => {
              this.$message({type: 'success', message: '发布成功'});
              this.getTableData();
            }) 
          }else if(workType == 1 || workType == 2){
            this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
              this.$message({type: 'success', message: '发布成功'});
              this.getTableData();
            })  
          }
          
        }).catch(action => {

        });
      },
      // 撤销
      backout(id, workType) {
        let params = {
          id,
          edit:'0',
          state: 'A'
        }
        this.$confirm('确认撤销发布？', '视频发布', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if(workType == 6){
            this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/cook/update`, params).then(() => {
              this.$message({type: 'success', message: '撤销成功'});
              this.getTableData();
            })
          }else if(workType == 1 || workType == 2){
            this.$http.httpAjax(`${this.$http.ajaxUrl}/kol/works/update`, params).then(() => {
              this.$message({type: 'success', message: '撤销成功'});
              this.getTableData();
            })  
          }
          
        }).catch(action => {

        });
      },
      // 删除
      del(id) {

      },
     },
    mixins:[tableList]
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

