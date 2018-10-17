import navList from '@/components/navlist.vue';
export default {
    data(){
        return {
            useraccount:localStorage.getItem('name'),
            headImg: localStorage.getItem('headImg')?localStorage.getItem('headImg'):'https://mobile.daydaycook.com.cn/shop/static/img/logo.png',
        }
    },
    components:{
        navList,

    },
    created() {
        if(this.$route.query.name == 1){
            this.$router.push({
                name:'index'
            })
        }
    },
    methods:{
        handleCommand(command) {
            if(command==='a'){
                this.$router.push({
                    name:'idTest'
                })
            }else {
                console.log('退出')
                localStorage.removeItem('sessionId');
                localStorage.removeItem('name');
                localStorage.removeItem('navindex');
                this.$router.push({
                    name:'login'
                })
            }
        }
    }
}