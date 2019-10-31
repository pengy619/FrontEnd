<template>
    <div class="page">
        <van-cell-group>
            <van-field
                v-model="form.ChineseName"
                label="中文姓名"
                icon="clear"
                placeholder="请输入中文姓名"
                
                @click-icon="form.ChineseName = ''"
            />
            <van-field
                v-model="form.EnglishName"
                label="英文姓名"
                icon="clear"
                placeholder="请输入英文姓名"
                
                @click-icon="form.EnglishName = ''"
            />
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>证件类型</span></div>
                <div class="van-cell__value">
                    <select class="van-field__control" v-model="form.EnumIDCardType">
                        <option v-for="item in selectOptions" :key="item.value" :value="item.value">{{item.label}}</option>
                    </select>
                </div>
            </div>
            
            <van-field
                v-model="form.DocumentsID"
                label="证件号码"
                icon="clear"
                placeholder="请输入证件号码"
                
                @click-icon="form.DocumentsID = ''"
            />
            <van-field
                v-model="form.Phone"
                label="手机号"
                icon="clear"
                placeholder="请输入手机号"
                
                @click-icon="form.Phone = ''"
            />
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>旅客类型</span></div>
                <div class="van-cell__value">
                    <select class="van-field__control" v-model="form.EnumPassengersType">
                        <option value="1">成人</option>
                        <option value="2">老人</option>
                        <option value="3">儿童</option>
                    </select>
                </div>
            </div>
            <div class="van-cell van-hairline van-field van-field--has-icon">
                <div class="van-cell__title"><span>性别</span></div>
                <div class="van-cell__value" style="text-align:left">
                    <van-radio-group v-model="form.Sex">
                        <van-radio name="1" style="display:inline">男</van-radio>
                        <van-radio name="2" style="display:inline">女</van-radio>
                    </van-radio-group>
                </div>
            </div>
        </van-cell-group>
        <div class="button-wrap">
            <button class="ui-button orange full" @click="submit">保存</button>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import * as tools from '@/utils/tools'
export default {
    name:'AddTraveller',
    data(){
        return{
            form:{
                ChineseName:'',
                EnglishName:'',
                EnumIDCardType:1,
                DocumentsID:'',
                Phone:'',
                EnumPassengersType:1,
                Sex:'1',
            },
            selectOptions:[
                {
                label:'身份证',
                value:1
                },{
                    label:'护照',
                    value:2
                },{
                    label:'驾照',
                    value:3
                },{
                    label:'回乡证',
                    value:4
                },{
                    label:'其它',
                    value:5
                }
            ]
        }
    },
    watch:{
        'form.ChineseName':function(val){
            if(val){
                this.form.EnglishName=tools.strToPinyin.ConvertPinyin(val)
            }else{
                this.form.EnglishName=''
            }
        }
    },
    mounted () {
        var id=this.$route.query.id
        event.$emit('header',{
            show:true,
            title:id?'编辑常用旅客':'新增常用旅客',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        
        var editTraveller=localStorage.getItem('editTraveller')
        if(editTraveller&&id){
            editTraveller=JSON.parse(editTraveller)
            this.form.ChineseName=editTraveller.chineseName
            this.form.EnglishName=editTraveller.englishName
            this.form.EnumIDCardType=editTraveller.enumIDCardType
            this.form.DocumentsID=editTraveller.documentsID
            this.form.Phone=editTraveller.phone
            this.form.EnumPassengersType=editTraveller.enumPassengersType
            this.form.Sex=editTraveller.sex+''
        }
    },
    methods:{
        submit(){
            if(this.form.ChineseName==''){
                this.$toast('请填写中文姓名');
                return false
            }
            if(this.form.DocumentsID==''){
                this.$toast('请填写证件号码');
                return false
            }
            if(this.form.Phone==''){
                this.$toast('请填写手机号码');
                return false
            }
            var loading=this.$toast.loading({
                mask: true,
                message: '提交信息'
            });
            if(this.$route.query.id)this.form.id=this.$route.query.id
            this.http.post('H5Account/CreateUpdatePassengers',this.form)
            .then(res=>{
                if(res.data.isSuccess){
                    this.$toast.success(this.$route.query.id?'修改成功':'新增成功');
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000);   
                }else{
                    this.$toast(res.data.message||'未知错误');
                }
            })
            .finally(()=>{
                //loading.clear()
            })
            console.log(this.form)
        }
    }
}
</script>
<style lang="scss" scoped>
    .button-wrap{
        margin: 0.3rem 0.2rem;
    }
</style>
