import util from '../../util/util';
import classifyData from './a.json';

export default {
    data() {
        return {
            ruleForm:{
                title:'',
                typeOne:'',
                typeTwo:'',
                tips:[],
                imageUrl:'https://mobile.daydaycook.com.cn/activity/2018/09/kitchen/images/share.jpg',
                videoImgUrl:'',
                videoUrl:'',
                textarea:'',
                radio:'1',   //发布类型：现在发布、规定时间发布
                date:'',    //发布日期
                time:'',    //发布日期
            },
            selectValue:'',
            childList:[],
            tipsOptions:[{
                value: '选项1',
                label: '111'
              }, {
                value: '选项2',
                label: '222'
              }, {
                value: '选项3',
                label: '333'
              }, {
                value: '选项4',
                label: '444'
              }, {
                value: '选项5',
                label: '4444'
            }],
            typeOptions:classifyData.data,
            dialogFormVisible:false,   //弹窗默认关闭
            disabled:true,   // 弹窗日期选择默认禁止
            pickerOptionsDate:{//日期选择今天以及之后的日期
                disabledDate(time) {
                    let afterTime = new Date().setHours(17, 0, 0, 0);
                    let nowTime = new Date().getTime();
                    if(nowTime>afterTime){//可选日期从明日
                        return time.getTime() < Date.now();
                    }else{//可选日期从当日
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            },
            timeObject:{
                selectableRange: ''
            }
        };
    },
    created() {
        this.init();
        this.timeRange();
        this.timeObject.selectableRange =  this.timeRange();
    },
    methods: {
        init(){
            //console.log(classifyData)
        },
        selectTypeOne(value){
            let self = this;
            self.typeOptions.map(item => {
                if(item.key == value){
                    self.ruleForm.typeTwo = '';
                    self.childList = item.options;
                }
            })
        },
        selectTypeTwo(value){
            let self = this;
            console.log(self.ruleForm.typeOne,self.ruleForm.typeTwo)
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.dataimageUrl = URL.createObjectURL(file.raw);
            console.log(this.ruleForm.dataimageUrl)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';//规定图片格式
            const isLt2M = file.size / 1024 / 1024 < 2;//规定图片大小

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        radioStatus(){
            let that = this;
            if(that.ruleForm.radio == 2){
                that.disabled = false;
            }else{
                that.disabled = true;
            }
        },
        dateChange(){//用户选取日期
            let a =new Date();
            let b =new Date(Date.parse(this.ruleForm.date.replace(/-/g,"/")));
            let c = '';
            if(b>a){
                c = '00:00:00-23:59:59';
            }else{
                let NowgetHours = new Date().getHours(); 
                if(NowgetHours>=0 && NowgetHours<9){
                    c = '16:00:00-23:59:59';
                }else{
                    c = this.timeRange();
                }  
            }
            this.timeObject.selectableRange = c;
        },
        timeRange(){//计算发布时间区域
            let a = '';
            let NowgetHours = new Date().getHours(); //获取当前小时数(0-23)
            let afterTime = new Date().setHours(17, 0, 0, 0);
            let nowTime = new Date().getTime();
            let getMinutes = new Date().getMinutes(); //获取当前分钟数(0-59)
            let getSeconds = new Date().getSeconds(); //获取当前秒数(0-59)
            let getHours = NowgetHours+2;
            getHours = NowgetHours.toString().length==1?'0'+getHours:getHours;
            getMinutes = getMinutes.toString().length==1?'0'+getMinutes:getMinutes;
            getSeconds = getSeconds.toString().length==1?'0'+getSeconds:getSeconds;
            if(nowTime>afterTime){//可选日期从明日
                a = '00:00:00-23:59:59';
            }else{//可选日期从当日
                if(NowgetHours>=0 && NowgetHours<9){
                    a = '16:00:00-23:59:59';
                }else{
                    a = getHours+':'+getMinutes+':'+getSeconds +'-23:59:59';
                }
            }
            return a;
        },
        timeChange(){//用户选取时间
            console.log(this.ruleForm.time)
        },
        back(){
            //取消
            this.$router.push({
                name:'video'
            })
        },
        saveRelease(){//保存并发布按钮
            this.dialogFormVisible = true;
        },
        saveData(){
            console.log(this.ruleForm.date);
        }
    }
};