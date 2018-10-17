<template>
    <div class="container video">
        <div class="content-title">视频作品管理 </div>
        <el-tabs v-model="activeName" class="in-content" @tab-click="handleClick">
            <el-tab-pane label="全部" name="1">
                <el-row>
                  <router-link :to="{ name: 'createVideo'}">
                    <el-button type="primary" round size="medium">新建视频作品</el-button>
                  </router-link>
                </el-row>
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 1" :search-data="listData"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="草稿" name="2">
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 2" :search-data="listData"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审核中" name="3">
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 3" :search-data="listData"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发布" name="4">
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 4" :search-data="listData"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未过审" name="5">
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 5" :search-data="listData"></table-list>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已下线" name="6">
                <div class="list">
                    <table-list url="/kol/works/list" :is-refresh.sync="isRefresh" v-if="listData.state == 6" :search-data="listData"></table-list>
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

