import navList from '@/components/navlist.vue';
export default {
    data(){
        return {
            useraccount:'18516061111',
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
                this.$router.push({
                    name:'login'
                })
            }
        }
    }
}