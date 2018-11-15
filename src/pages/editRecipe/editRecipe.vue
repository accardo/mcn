<template>
    <div class="container">
        <div class="content-title">食谱管理/新建食谱作品</div>
        <section class="in-content">
            <el-form :inline="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="标题" class="block" prop="title">
                    <el-input style="width:595px;" maxlength="15" v-model="ruleForm.title" auto-complete="off"></el-input>
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
               <!-- <el-form-item label="标签" prop="tips" class="block">
                    <el-select v-model="ruleForm.tips" multiple style="width:595px;">
                        <el-option
                            v-for="item in tipsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="封面" prop="homePicture"  class="uploadFile">
                    <input type="file" @change="getTokenPic" class="fileInput">
                    <div class="fileBox">
                        <i v-if="ruleForm.homePicture==''" class="el-icon-plus"></i>
                        <img v-if="ruleForm.homePicture" :src="ruleForm.homePicture" class="avatar">
                        <div class="progress"  v-if="picFlag == true" >
                            <i class="el-icon-loading"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="视频预览" prop="videoHref" class="uploadFile">
                    <input type="file" @change="getTokenVideo" class="fileInput">
                    <div class="fileBox">
                        <i v-if="ruleForm.videoHref==''" class="el-icon-plus"></i>
                        <video class="avatar" v-if="ruleForm.videoHref" :src="ruleForm.videoHref" id="video">
                            Your browser does not support the video tag.
                        </video>
                        <div class="progress"  v-if="videoFlag == true" >
                            <i class="el-icon-loading"></i>
                        </div>
                        <div class="play-icon" @click="palyVideo()" v-if="ruleForm.videoHref">
                            <i class="iconfont icon-bofang"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="描述" class="block" prop="workDescribe">
                    <el-input
                        style="width: 598px;"
                        rows="4"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="50"
                        v-model="ruleForm.workDescribe">
                    </el-input>
                </el-form-item>
                <el-form-item label="食材" class="block" style="margin-bottom:5px;">
                    <el-button type="primary" size="small" plain @click="addList(1)">添加</el-button>
                </el-form-item>
                <div class="food-list" v-for="(item,index) in ruleForm.cookInfoRequestDTO">
                    <span>名称</span>
                    <el-form-item class="min-item"
                    :prop="'cookInfoRequestDTO.' + index + '.cookMaterial'"
                    :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                        <el-input size="small" placeholder="请输入名称" v-model="item.cookMaterial"></el-input>
                    </el-form-item>
                    <span>用量</span>
                    <el-form-item class="min-item"
                    :prop="'cookInfoRequestDTO.' + index + '.cookDosage'"
                    :rules="{required: true, message: '用量不能为空', trigger: 'blur'}">
                        <el-input size="small" placeholder="请输入用量" v-model="item.cookDosage"></el-input>
                    </el-form-item>
                    <el-button type="text" v-if="index!=0" @click="upList(index,item,1)">上移</el-button>
                    <el-button type="text" v-if="index!=ruleForm.cookInfoRequestDTO.length-1" @click="downList(index,item,1)">下移</el-button>
                    <el-button type="text" class="del"  @click="ruleForm.cookInfoRequestDTO.splice(index, 1)">删除</el-button>
                </div>
                <el-form-item  label="步骤详情" prop="workContext" style="margin-top:20px;margin-bottom:0;">
                    <div class="form-item">
                    <quill-editor  style="width:595px;display:inline-block;float:left"
                            v-model="ruleForm.workContext"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @change="onEditorChange($event)">
                    </quill-editor>
                    <input type="file" @change="uploadPic" id="uploadPic" style="display:none;">
                    </div>
                </el-form-item>
                <el-form-item label="步骤" class="block" prop="" style="margin-bottom:5px;">
                    <el-button type="primary" size="small" plain @click="addList(2)">添加</el-button>
                </el-form-item>
                <div class="steps-list" v-for="(item,index) in ruleForm.mediaWorksDetailRequestDTO" :key="index">
                    <div class="uploadFile">
                        <input type="file" @change="getTokenPicList($event,item)" class="fileInput">
                        <div class="fileBox">
                            <i v-if="item.homePicture==''" class="el-icon-plus"></i>
                            <img v-if="item.homePicture" :src="item.homePicture" class="avatar">
                        </div>
                        <div class="delete" v-if="item.homePicture!=''" @click="delPic(item)">+</div>
                    </div>
                    <el-form-item
                    :prop="'mediaWorksDetailRequestDTO.' + index + '.workDescribe'"
                    :rules="{required: true, message: '内容不能为空', trigger: 'blur'}">
                        <el-input v-model="item.workDescribe" style="width: 300px;height:150px;" rows="6"
                            type="textarea" resize = "none" placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <div class="steps-btn">
                        <el-button type="text" v-if="index!=0" @click="upList(index,item,2)">上移</el-button>
                        <el-button type="text" v-if="index!=ruleForm.mediaWorksDetailRequestDTO.length-1" @click="downList(index,item,2)">下移</el-button>
                        <el-button type="text" class="del" @click="ruleForm.mediaWorksDetailRequestDTO.splice(index, 1)">删除</el-button>
                    </div>
                </div>
                <el-form-item class="block" style="padding-left:100px;">
                    <el-button @click="back()">取消</el-button>
                    <el-button type="primary" @click="saveRelease(1, 'ruleForm')" :loading="isSave">{{saveText}}</el-button>
                    <el-button type="primary" @click="saveRelease(2, 'ruleForm')" :loading="isSave">{{saveReleaseText}}</el-button>
                </el-form-item>
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
    @import '../editVideo/editVideo.css';
    @import '../../../static/css/iconfont.css';
    @import './editRecipe.css';
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
.uploadFile .el-form-item__content{
    width: 240px;
    height: 150px;
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
.uploadFile{
    position: relative;
    width: 340px;
    height: 150px;
    margin-bottom: 20px;
}
.uploadFile .fileInput{
    width: 240px;
    height: 150px;
    cursor: pointer;
    position: absolute;
    top:0;
    opacity: 0;
    z-index: 9;
}
.uploadFile .fileBox{
    width: 240px;
    height: 150px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    top:0;
    overflow: hidden; 
}
.uploadFile .delete{
    position: absolute;
    top:-8px;
    right: -8px;
    z-index: 19;
    font-size:16px;
    width:20px;
    height: 20px;
    line-height:16px;
    text-align:center;
    background:#F56C6C;
    color:#fff;
    border-radius:50%;
    cursor: pointer;
}
.ql-editor{
    min-height:120px;
}
.ql-picker-label{
    line-height:24px;
}
.ql-tooltip.ql-editing{
    left: 0 !important;
}
.steps-list .el-textarea__inner{
    line-height: 1.7;
}
</style>
<script src="./editRecipe.js"></script>

