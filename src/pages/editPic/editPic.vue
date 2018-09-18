<template>
    <div class="container">
        <div class="content-title">作品管理/新建视频作品</div>
        <section class="in-content">
            <el-form :inline="true" :model="ruleForm" status-icon ref="ruleForm" label-width="100px">
                <el-form-item label="标题" class="block">
                    <el-input style="width:595px;" v-model="ruleForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="一级分类">
                     <el-select v-model="ruleForm.typeOne" @change="selectTypeOne" style="width:240px;">
                       <el-option
                            v-for="item in typeOptions"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                     <el-select v-model="ruleForm.typeTwo" @change="selectTypeTwo" style="width:240px;">
                        <el-option
                            v-for="item in childList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签" class="block">
                    <el-select v-model="ruleForm.tips" multiple style="width:595px;">
                        <el-option
                            v-for="item in tipsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封面">
                   <el-upload  style="width:240px;"
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <div class="form-item">
                    <span class="label fl">正文</span>
                    <quill-editor  style="width:595px;display:inline-block;float:left"
                        v-model="content" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
                </div>
                
               
               
                <el-form-item class="block" style="padding-left:100px;">
                    <el-button @click="back()">取消</el-button>
                    <el-button type="primary">保存</el-button>
                    <el-button type="primary">保存并发布</el-button>
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
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.avatar {
    width: 150px;
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
</style>

<script src="./editPic.js"></script>

