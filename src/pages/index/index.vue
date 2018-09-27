<template>
   <div class="container index">
       <div class="content-title">首页 </div>
       <div class="top-area"  v-if="recentList.length != 0">
           <p class="top-title">最近编辑</p>
           <div class="lately" v-for="(item, index) in recentList" :key="index">
             <div class="img fl">
               <img :src="item.homePicture" alt="">
             </div>
             <div>
               <p>
                 <span><span class="type">{{item.workType | formatLabel}}</span></span>
                 <span>{{item.title}}</span>
               </p>
               <el-tag type="success" size="small" v-for="(itemSigns, index) in item.signs" :key="index">{{itemSigns}}</el-tag>
             </div>
             <el-button class="fr" size="small" type="primary" @click="latelyEdit(item.id, item.workType,'1')">继续编辑</el-button>
           </div>
       </div>
       <div class="list">
         <p class="top-title">已发布作品</p>
         <table-list url="/kol/works/list" :search-data="{state: 4, pageIndex: 1, pageSize: 10}"></table-list>
       </div>
   </div>
</template>
<script src="./index.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
	  @import './index.css';
</style>
