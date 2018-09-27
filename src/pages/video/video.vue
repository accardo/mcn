<template>
    <div class="container video">
        <div class="content-title">视频作品管理 </div>
        <el-tabs :tab-position="tabPosition" class="in-content">
            <el-tab-pane label="全部">
                <el-row>
                  <router-link :to="{ name: 'create'}">
                    <el-button type="primary" round size="medium" @click="addNew">新建视频作品</el-button>
                  </router-link>
                </el-row>
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 1, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="草稿">
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 2, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审核中">
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 3, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发布">
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 4, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未过审">
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 5, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已下线">
                <div class="list">
                    <table-list url="/kol/works/list" :search-data="{workType: 2, state: 6, pageIndex: 1, pageSize: 10}"></table-list>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../../../static/css/iconfont.css';
    @import './video.css';
    .el-tabs__nav-wrap::after{
        background: transparent !important;
    }
</style>

<script src="./video.js"></script>

