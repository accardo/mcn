<template>
   <div class="container index">
       <div class="content-title">首页 </div>
       <div class="top-area">
           <p class="top-title">最近编辑</p>
           <div class="lately">
               <div class="img fl">
                    <img src="../../../static/img/default.png" alt="">           
               </div> 
               <div>
                   <p>{{title}}</p>
                   <span class="type">{{type}}</span>
               </div>
                <span class="lately-btn fr" @click="latelyEdit()">继续编辑</span>
           </div>
       </div>
       <div class="list">
           <p class="top-title">已发布作品</p>
           <div class="list-item" v-for="(item,index) in list" :key="index">
               <p class="time-area fl" >{{item.publishTime}}</p>
               <div class="img fl">
                    <img :src="item.homePicture" alt="">           
               </div>    
               <div class="detail fl">
                   <p>
                       <span class="type">{{item.title}}</span>
                       <span class="title">{{item.signs}}</span>
                   </p>
                   <p>
                       <span class="tag">{{item.cateCode1}}</span>
                       <span class="tag">{{item.cateCode2}}</span>
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @prev-click="handleCurrentChange"
                @next-click="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20]"
                :page-size="5"
                layout="total, sizes, prev, pager, next"
                :total="totalNum">
                </el-pagination>
            </div>
       </div>
   </div>
</template>
<script src="./index.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../../../static/css/iconfont.css';
	@import './index.css';
</style>
