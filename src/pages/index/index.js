import listData from './list.json';
export default {
    data(){
        return {
            title:'标题标题标题标题标题标题',
            type:'视频',
            currentPage:1,
            list:[],    //获取到的列表
            totalNum:0, //数据总条数
        }
    },
    components:{
    },
    created(){
        this.list = listData.obj.rows;
        this.totalNum = listData.obj.total;
        //console.log(this.list);
        console.log(this.totalNum);
    },
    methods:{
        init(){
            
        },
        getListData(){//获取首页数据

        },
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
        handleSizeChange(val) {//分页
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {//分页
            console.log(`当前页: ${val}`);
        },
        latelyEdit(){
            console.log('继续编辑');
        }
    }
}