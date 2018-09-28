<template>
    <div class="container">
        <div class="content-title">作品管理/新建视频作品</div>
        <section class="in-content">
            <el-form v-if="ruleForm" :inline="true" :model="ruleForm" status-icon ref="ruleForm" label-width="100px">
                <el-form-item label="标题" class="block">
                    <el-input style="width:595px;" v-model="ruleForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="一级分类">
                     <el-select v-if="levelFirst" v-model="ruleForm.cateCode1" style="width:240px;" placeholder="请选择">
                       <el-option
                         v-for="(item, index) in levelFirst"
                         :key="index"
                         :label="item.detailName"
                         :value="item.detailCode">
                       </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                     <el-select v-model="ruleForm.cateCode2" style="width:240px;" >
                        <el-option
                          v-for="(item, index) in levelSecond"
                          :key="index"
                          :label="item.detailName"
                          :value="item.detailCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频封面">
                   <el-upload  style="width:240px;"
                        class="avatar-uploader"
                        action="/kol/works/getQiniuToken"
                        :show-file-list="false"
                        :on-success="handlePicSuccess"
                        :before-upload="beforeUploadPic"
                        :data="{session}"
                        :on-progress="picPercent">
                        <img v-if="ruleForm.homePicture" :src="ruleForm.homePicture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="progress"  v-if="picFlag == true" >
                            <i class="el-icon-loading"></i>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="视频">
                    <el-upload  style="width:240px;"
                        class="avatar-uploader"
                        action="/kol/works/getQiniuToken"
                        :show-file-list="false"
                        :on-success="handleVideoSuccess"
                        :before-upload="beforeUploadVideo"
                        :data="{session}"
                        :on-progress="videoPercent">
                      <video class="avatar" v-if="ruleForm.videoHref" :src="ruleForm.videoHref" controls="controls">
                        Your browser does not support the video tag.
                      </video>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="progress"  v-if="videoFlag == true" >
                            <i class="el-icon-loading"></i>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="描述" class="block">
                    <el-input
                        style="width: 590px;"
                        rows="4"
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="ruleForm.remark">
                    </el-input>
                </el-form-item>
                <el-form-item class="block" style="padding-left:100px;">
                    <el-button @click="back()">取消</el-button>
                    <el-button type="primary" @click="saveRelease(1)" :loading="isSave">{{saveText}}</el-button>
                    <el-button type="primary" @click="saveRelease(2)" :loading="isSave">{{saveReleaseText}}</el-button>
                </el-form-item>
                <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="45%">
                    <el-form >
                        <el-form-item style=" display: block">
                            <el-radio v-model="ruleForm.radio" label="1" @change="radioStatus()">现在发布</el-radio>
                        </el-form-item>
                        <el-form-item>
                            <el-radio :span="6" v-model="ruleForm.radio" label="2" class="fl radio" @change="radioStatus()">定时发布</el-radio>
                            <el-col :span="8">
                                <el-date-picker type="date" placeholder="选择日期"  :editable="false"
                                v-model="ruleForm.date" :disabled="disabled" style="width: 100%;"
                                :picker-options="pickerOptionsDate" @change="dateChange()"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="1" style="text-align:center;">-</el-col>
                            <el-col :span="8">
                                <el-time-picker type="fixed-time" placeholder="选择时间"
                                v-model="ruleForm.time" :disabled="disabled" style="width: 100%;"
                                :picker-options="timeObject" @change="timeChange()"
                                value-format="HH:mm:ss" format="HH:mm:ss"></el-time-picker>
                            </el-col>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveData()">确 认</el-button>
                    </div>
                </el-dialog>
            </el-form>
        </section>
        <div class="shadow" v-if="shadow">
            <div class="video-window">
                <video class="watch-video" :src="ruleForm.videoHref" controls="controls"></video>
                <i @click="closeShadow()" class="el-icon-circle-close-outline close-icon"></i>
            </div>

        </div>
    </div>
</template>
<style scoped>
    @import '../../../static/css/common.css';
    @import './editVideo.css';
</style>
<style>
.el-select-dropdown__item{
    padding:0 20px !important;
}
.avatar-uploader{
    position: relative;
    width: 240px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.avatar {
    width: 240px;
    height: 150px;
    display: block;
}
.progress{
    width:100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    border-radius: 6px;
    background:#fff;
}
.progress i{
    font-size:40px;
    color:#409EFF;
    position: absolute;
    left: 50%;
    top:50%;
    margin-left:-20px;
    margin-top:-20px;
}
</style>

<script src="./editVideo.js"></script>

