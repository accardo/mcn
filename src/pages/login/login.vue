<template>
    <div class="container">
        <header>
            <span class="fl"><img class="logo" src="static/img/logo1.png" alt=""></span>
            <span class="fr register" @click="linkto()">
              <router-link :to="{name: 'register'}">立即注册</router-link>
            </span>
        </header>

        <section class="login-area">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-form">
                <h2>登录</h2>
                <el-form-item prop="phone">
                    <el-input type="text" v-model="ruleForm.phone" auto-complete="off" maxLength="11" placeholder="请输入手机号" :clearable="false"></el-input>
                    <el-button class="code-btn" @click.prevent="getCode()" :disabled="codeBtn">{{ codeText }}</el-button>
                </el-form-item>
                <el-form-item prop="vcode">
                    <el-input type="text" v-model="ruleForm.vcode" auto-complete="off" placeholder="请输入验证码"  :clearable="false"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="footer">
            <div class="top">
                <img class="fl logo" src="../../../static/img/logo2.png" alt="">
                用美食连接极致生活
            </div>
            <div class="bottom">

            </div>
        </section>
    </div>

</template>
<script src="./login.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
	@import './login.css';
</style>
<style>
    .login-btn{
        width: 280px;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(44deg, #0080FD 0%, #43B1F1 100%);
        box-shadow: 0 4px 8px 0 rgba(67,177,241,0.30);
        border-radius: 100px;
        padding:0;
        border:none;
        font-size:16px;
        font-weight:normal;
    }
    .login-area .el-input__inner{
        border-radius:100px;
    }
</style>


