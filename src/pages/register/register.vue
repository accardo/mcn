<template>
    <div class="container">
        <header>
            <div class="inheader">
                <span class="act">1.基本信息</span>————<span>2.身份认证</span>
                <p class="fr">已有账号？<router-link :to="{name: 'login'}" class="act">立即登录</router-link></p>
            </div>
        </header>
        <section class="register-area">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone" maxlength="11" placeholder=""></el-input>
                    <el-button type="primary" class="btn" @click.prevent="getCode()" :disabled="codeBtn">{{ codeText }}</el-button>
                    <p>作为登录账号，请填写未被日日煮公众平台注册的手机号</p>
                </el-form-item>
                <el-form-item label="验证码" prop="vcode">
                    <el-input  v-model="ruleForm.vcode" auto-complete="off"></el-input>
                </el-form-item>
                <el-checkbox class="check" v-model="checked">我同意并遵守《日日煮公众平台协议》</el-checkbox>
                <el-form-item>
                    <el-button type="primary" :disabled="!checked" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>
<script src="./register.js"></script>
<style scoped>
    @import '../../../static/css/common.css';
	@import './register.css';
</style>
