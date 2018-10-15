<template>
    <div class="container">
        <header>
            <div class="inheader">
                <span class="act">身份认证</span>
                <!-- <p class="fr">已有账号？<router-link :to="{name: 'login'}">立即登录</router-link></p> -->
            </div>
        </header>
        <section class="register-area" v-if="formShow">
            <!-- 认证不通过显示 -->
            <div v-if="remarkShow">
                <i class="el-icon-circle-close"></i><p class="tips">认证不通过。原因：{{ruleForm.remark}}</p>
            </div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="姓名" prop="idCardName">
                    <el-input  v-model="ruleForm.idCardName"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="idCardNum">
                    <el-input maxlength="18" v-model="ruleForm.idCardNum"></el-input>
                </el-form-item>
                 <el-form-item label="身份证照片" prop="idCardPhoto"   class="uploadFile">
                    <input type="file" @change="getTokenPic" class="fileInput">
                    <div class="fileBox">
                        <i v-if="ruleForm.idCardPhoto==''" class="el-icon-plus"></i>
                        <img v-if="ruleForm.idCardPhoto" :src="ruleForm.idCardPhoto" class="avatar">
                        <div class="progress"  v-if="picFlag == true" >
                            <i class="el-icon-loading"></i>
                        </div>
                    </div>
                </el-form-item>
                <p class="uploadFileTip">手持身份证照片</p>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">完成</el-button>
                  <router-link :to="{name: 'index'}"> <el-button type="primary">跳过</el-button></router-link>
                </el-form-item>
            </el-form>
        </section>
        <!-- 等待后台审核状态 -->
        <section class="warting" v-if="loadingStatus">
          <i class="el-icon-edit-outline"></i><p class="tips">已提交审核，请耐心等待</p>
          <router-link :to="{name: 'index'}"> <el-button type="primary">返回</el-button></router-link>
        </section>
        <!-- 认证通过 -->
        <section class="success" v-if="successStatus">
          <i class="el-icon-circle-check"></i><p class="tips">认证通过，您可以发表作品了！</p>
          <router-link :to="{name: 'index'}"> <el-button type="primary">返回</el-button></router-link>
        </section>
    </div>
</template>

<script src="./idTest.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
    @import '../register/register.css';
	@import 'idTest.css';
</style>
<style >
.register-area .avatar {
  width: 100%;
  height: 100%;
  display: block;
}
.uploadFile .el-form-item__content{
    width: 240px;
    height: 150px;
} 
</style>
