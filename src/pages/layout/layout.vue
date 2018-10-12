<template>
   <div class="content">
       <el-container >
            <el-header>
              <img class="fl" :src="headImg" alt="">
              <span class="fl">日日煮</span>
              <el-dropdown  @command="handleCommand" class="fr">
                <span class="el-dropdown-link">
                  {{useraccount}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu style="padding:10px 0;" slot="dropdown">
                  <el-dropdown-item command="a" style="width:120px;text-align:center">设置</el-dropdown-item>
                  <el-dropdown-item command="b" style="width:120px;text-align:center">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                     <nav-list></nav-list>
                </el-aside>
                <el-main>
                   <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/video' }">视频列表</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/editVideo' }">作品管理/新建视频作品</el-breadcrumb-item>
                    </el-breadcrumb> -->
                    <!-- <div class="content-title">页面标题 </div> -->
                   <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
   </div>
</template>
<script src="./layout.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
	  @import './layout.css';
</style>

