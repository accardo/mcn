import tableList from '@/components/tableListTwo'
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
        addNew(){//新建视频
            //跳转到新建页面
            this.$router.push({
                name:'editPic'
            })
        }
    }
};