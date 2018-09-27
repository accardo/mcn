<template>
    <div class="container">
        <header>
            <div class="inheader"> 
                <span>1.基本信息</span>————<span class="act">2.身份认证</span>
                <p class="fr">已有账号？<i class="act" @click="linkto()">立即登录</i></p>
            </div>
        </header>
        <section class="register-area" v-if="formShow">
            <!-- 认证不通过显示 -->
            <div v-if="remarkShow">
                <i class="el-icon-circle-close"></i><p class="tips">认证不通过。原因：{{ruleForm.remark}}</p>
            </div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="身份证姓名" prop="name">
                    <el-input  v-model="ruleForm.idCardName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="num">
                    <el-input  v-model="ruleForm.idCardNum" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="身份证照片" prop="imageUrl">
                   <el-upload
                        class="avatar-uploader"
                        action="/kol/works/getQiniuToken"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :data="{session}">
                        <img v-if="ruleForm.idCardPhoto" :src="ruleForm.idCardPhoto" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p>手持身份证照片</p>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">完成</el-button>
                    <el-button @click="skip()">跳过</el-button>
                </el-form-item>
            </el-form>
        </section>
        <!-- 等待后台审核状态 -->
        <section class="warting" v-if="loadingStatus">
            <i class="el-icon-edit-outline"></i><p class="tips">已提交审核，请耐心等待</p>
            <el-button type="primary" @click="skip()">返回</el-button>
        </section>
        <!-- 认证通过 -->
        <section class="success" v-if="successStatus">
            <i class="el-icon-circle-check"></i><p class="tips">认证通过，您可以发表作品了！</p>
            <el-button type="primary" @click="skip()">返回</el-button>
        </section>
    </div>
</template>

<script src="./idTest.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../register/register.css';
	@import 'idTest.css';
</style>
<style>
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
