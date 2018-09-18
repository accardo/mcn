export default {
    data() {
        return {
            tabPosition: 'top',
            currentPage:1,
        };
    },
    methods: {
        handleSizeChange(val) {//分页
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {//分页
            console.log(`当前页: ${val}`);
        },
        addNew(){//新建视频
            //跳转到新建页面
            this.$router.push({
                name:'editPic'
            })
        }
    }
};