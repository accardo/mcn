<template>
    <div class="nav-box">
         <el-menu
            :default-active="navActive"
            class="el-menu-vertical-demo"
            :collapse="isCollapse">
                <div v-for="(item,index) in navList" :key="index">
                    <el-menu-item v-if="item.children.length == 0" :index="item.ind" @click="jump(item.link,item.ind)">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                    <el-menu-item-group v-if="item.children.length > 0">
                        <el-submenu :index="item.ind">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span v-if="!isCollapse" slot="title">{{item.title}}</span>
                            </template>
                            <el-menu-item v-for="(chidNav,indexkey) in item.children" :key="indexkey" @click="jump(chidNav.link,chidNav.ind)" :index="chidNav.ind">{{chidNav.title}}</el-menu-item>
                        </el-submenu>
                    </el-menu-item-group>
                </div>
            <div class="nav-sm" v-if="0" @click="smFun">
                <i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
            </div>
        </el-menu>
    </div>
</template>
<script>
    import { mapGetters,mapActions } from 'vuex';
     export default {
        data(){
            return {
                isCollapse:false,
                navActive:'1',
                navList:[
                    {title:'首页',ind:'1',children:[],icon:'el-icon-menu',link:'index'},
                    {title:'作品管理',ind:'2',icon:'el-icon-setting',link:'',
                        children:[
                        {title:'视频列表',ind:'2-1',children:[],icon:'',link:'video'},
                        {title:'图文列表',ind:'2-2',children:[],icon:'el-icon-menu',link:'pic'},
                    ]}

                ]
            }
        },
        created(){
            this.navActive = localStorage.getItem('navindex') || '1';
        },
        methods: {
            jump(url,navInd){
                if(navInd){
                    navInd = Object.prototype.toString.call(navInd) == '[object Array]' ? navInd[0] : navInd;
                    localStorage.setItem('navindex',navInd);
                }
                 this.$router.push({
                    name:url
                })
            },
            smFun(){
                this.isCollapse = !this.isCollapse;
            },
        },
    }
</script>
<style>
    .nav-box,.el-menu{
        position: relative;
        height: 100%;
        min-height: 100%;
    }
    .nav-sm{
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: rgb(49, 167, 235);
        cursor:pointer;
        display: none;
    }
    .nav-sm i{
        color: #fff;
    }
    .el-menu-item-group__title{
        padding: 0;
    }
</style>

