<template>
    <div class="container video">
        <div class="content-title">图文作品管理 </div>
        <el-tabs :tab-position="tabPosition"  class="in-content">
            <el-tab-pane label="全部">
                <el-row>
                    <el-button type="primary" size="medium" round @click="addNew()">新建图文作品</el-button>
                    <span class="fr" style="line-height:36px">共2条</span>
                </el-row>
                <div class="list">   
                    <div class="item-title">
                        <div class="module one">内容</div>
                        <div class="module two">发布状态</div>
                        <div class="module two">更新时间</div>
                        <div class="module two">操作</div>
                    </div>    
                    <div class="list-item">
                        <div class="module one">
                            <div class="img fl">
                                <img src="../../../static/img/default.png" alt="">
                                <span class="time">8888</span>           
                            </div> 
                             <div class="detail fl">
                                <p>
                                    <span class="type fl">视频</span>
                                    <span class="title fl" title="标题标题标题标题标题标题标题标题标题标">标题标题标题标题标题标题标题标题标题标</span>
                                </p>
                                <p>
                                    <span class="tag">11111</span>
                                    <span class="tag">22222</span>
                                </p>
                                <p>
                                    <i class="iconfont icon-browse fl"></i><em class="fl">1111</em>
                                    <i class="iconfont icon-like fl"></i><em class="fl">1111</em>
                                    <i class="iconfont icon-message fl"></i><em class="fl">1111</em>
                                    <i class="iconfont icon-share fl"></i><em class="fl">1111</em>
                                </p>
                            </div>
                        </div>
                        <div class="module two" >
                            已发布
                        </div>
                        <div class="module two">
                            <p class="time">2018/09/10<br>20:22</p>
                        </div>
                        <div class="module two">
                            <span class="blue-btn">修改</span>
                            <span class="red-btn">下线</span>
                        </div>
                        
                    </div>
                    <div class="block fr">
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20]"
                        :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="草稿">草稿</el-tab-pane>
            <el-tab-pane label="审核中">审核中</el-tab-pane>
            <el-tab-pane label="已发布">已发布</el-tab-pane>
            <el-tab-pane label="未过审">未过审</el-tab-pane>
            <el-tab-pane label="已下线">已下线</el-tab-pane>
        </el-tabs>
         
    </div>
</template>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../../../static/css/iconfont.css';
    @import '../video/video.css';
    .el-tabs__nav-wrap::after{
        background: transparent !important;
    }
</style>

<script src="./pic.js"></script>

