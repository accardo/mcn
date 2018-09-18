<template>
    <div class="container">
        <header>
            <span class="fl top">DDC公众平台</span>
            <span class="fr top" @click="linkto()"><i class="el-icon-setting"></i>立即注册</span>
        </header>

        <section class="login-area">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-form">
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="ruleForm.account" auto-complete="off" maxLength="11"></el-input>
                    <el-button type="primary" class="btn" @click.prevent="getCode()" :disabled="codeBtn">{{ codeText }}</el-button>
                </el-form-item>
                <el-form-item label="验证码" prop="pass">
                    <el-input type="text" v-model="ruleForm.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </section>
        
    </div>
    
</template>
<script src="./login.js"></script>  
<style scoped>
    @import '../../../static/css/common.css';
	@import './login.css';
</style>

