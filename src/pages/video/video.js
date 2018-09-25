import tableList from '@/components/tableListTwo'
import util from '@/util/util';
export default {
    data() {
        return {
            tabPosition: 'top',
            currentPage:1,
        };
    },
    components:{
        tableList
    },
    methods: {
        outLine(id){//视频下线
            const h = this.$createElement;
            this.$msgbox({
                title: '下线作品',
                message: h('p', null, [
                    h('span', null, '下线后，作品将不会显示在APP上，粉丝也看不到了，真的要将作品下线吗？ '),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if(action === 'confirm'){
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        done();//done用于关闭提示弹窗，请求成功后执行
                    }else{
                        done();
                    }
                }   
            }).then(action => {
                this.$message({
                    type: 'info',
                    message: '操作成功'
                });
            });
        },
        del(id){//视频删除
            const h = this.$createElement;
            this.$msgbox({
                title: '删除作品',
                message: h('p', null, [
                    h('span', null, '删除后，作品就再也找不到了，真的要删除吗？'),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if(action === 'confirm'){
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        done();//done用于关闭提示弹窗，请求成功后执行
                    }else{
                        done();
                    }
                }   
            }).then(action => {
                this.$message({
                    type: 'info',
                    message: '操作成功'
                });
            });
        },
        addNew(){//新建视频
            //跳转到新建页面
            this.$router.push({
                name:'editVideo'
            })
        }
    }
};