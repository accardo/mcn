<template>
    <div class="container">
        <div class="content-title">作品管理/新建视频作品</div>
        <section class="in-content">
            <el-form :inline="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="标题" class="block" prop="title">
                    <el-input style="width:595px;" v-model="ruleForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="一级分类"  prop="cateCode1">
                     <el-select v-if="levelFirst" v-model="ruleForm.cateCode1" style="width:240px;">
                       <el-option
                         v-for="(item, index) in levelFirst"
                         :key="index"
                         :label="item.detailName"
                         :value="item.detailCode">
                       </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" prop="cateCode2">
                  <el-select v-model="ruleForm.cateCode2" style="width:240px;" >
                    <el-option
                      v-for="(item, index) in levelSecond"
                      :key="index"
                      :label="item.detailName"
                      :value="item.detailCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              <!--  <el-form-item label="标签" class="block">
                    <el-select v-model="ruleForm.tips" multiple style="width:595px;">
                        <el-option
                            v-for="item in tipsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="封面" prop="homePicture">
                  <el-upload  style="width:240px;"
                              class="avatar-uploader"
                              :action = "ajaxUrl + '/kol/works/getQiniuToken'"
                              :show-file-list="false"
                              :on-success="handlePicSuccess"
                              :before-upload="beforeUploadPic"
                              :on-progress="picPercent"
                              :data="{session}">
                    <img v-if="ruleForm.homePicture" :src="ruleForm.homePicture" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div class="progress"  v-if="picFlag == true" >
                      <i class="el-icon-loading"></i>
                    </div>
                  </el-upload>
                </el-form-item>
              <el-form-item  label="正文" prop="workContext">
                <div class="form-item">
                  <quill-editor  style="width:595px;display:inline-block;float:left"
                                 v-model="ruleForm.workContext"
                                 ref="myQuillEditor"
                                 :options="editorOption"
                  >
                  </quill-editor>
                </div>
              </el-form-item>
              <el-form-item class="block" style="padding-left:100px;">
                <el-button @click="back()">取消</el-button>
                <el-button type="primary" @click="saveRelease(1, 'ruleForm')" :loading="isSave">{{saveText}}</el-button>
                <el-button type="primary" @click="saveRelease(2, 'ruleForm')" :loading="isSave">{{saveReleaseText}}</el-button>
              </el-form-item>
            </el-form>
        </section>
    </div>
</template>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../editVideo/editVideo.css';
</style>
<style>
.el-select-dropdown__item{
    padding:0 20px !important;
}
.in-content .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.in-content .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.in-content .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.in-content .avatar {
    width: 240px;
    height: 150px;
    display: block;
}
.ql-toolbar.ql-snow{
    border:1px solid #dcdfe6;
    border-top-left-radius:4px;
    border-top-right-radius:4px;
}
.ql-container.ql-snow{
     border:1px solid #dcdfe6;
    border-bottom-left-radius:4px;
    border-bottom-right-radius:4px;
}
.form-item{
    margin-bottom:22px !important;
    overflow: hidden;
}
.form-item .label{
    width:100px;
    display: inline-block;
    text-align:right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
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

<script src="./editPic.js"></script>

