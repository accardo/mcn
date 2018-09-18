<template>
    <div class="container">
        <header>
            <div class="inheader"> 
                <span>1.基本信息</span>————<span class="act">2.身份认证</span>
                <p class="fr">已有账号？<i class="act" @click="linkto()">立即登录</i></p>
            </div>
        </header>
        <section class="register-area">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="身份证姓名" prop="name">
                    <el-input  v-model="ruleForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="num">
                    <el-input  v-model="ruleForm.num" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="身份证照片" prop="imageUrl">
                   <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
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
