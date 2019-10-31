<template>
    <div class="page">
        <div class="setting-wrap">
            <van-cell-group>
                <van-field
                    v-model="form.Name"
                    label="中文姓名"
                    icon="clear"
                    placeholder="请输入中文姓名"
                    
                    @click-icon="form.Name = ''"
                />
                <van-field
                    v-model="form.EnglishName"
                    label="英文姓名"
                    icon="clear"
                    placeholder="请输入英文姓名"
                    @click-icon="form.EnglishName = ''"
                />
                <div class="van-cell van-hairline van-field van-field--has-icon">
                    <div class="van-cell__title"><span>性别</span></div>
                    <div class="van-cell__value" style="text-align:left">
                        <van-radio-group v-model="form.Sex">
                            <van-radio name="1" style="display:inline">男</van-radio>
                            <van-radio name="2" style="display:inline">女</van-radio>
                        </van-radio-group>
                    </div>
                </div>
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
                <div class="van-cell van-hairline van-field van-field--has-icon">
                    <div class="van-cell__title"><span>绑定手机号</span></div>
                    <div class="van-cell__value">
                        {{info.mobilePhone.replace(info.mobilePhone.substr(3,4),'****')}}
                    </div>
                </div>
                <van-cell title="修改登录密码" @click="$router.push('/FindPassword?edit=true')" is-link />
            </van-cell-group>
        </div>
        <div class="button-wrap">
            <button class="ui-button orange full" v-b-loading="submitLoading" @click="submit">保存</button>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import * as tools from '@/utils/tools'
export default {
    name:'Setting',
    data(){
        return{
            form:{
                Name:'',
                EnglishName:'',
                Sex:'1',
                EnumIDCardType:1,
                DocumentsID:'',
                ProvinceName:'',
                CityName:'',
                DistrictName:'',
            },
            info:{
                mobilePhone:'',
            },
            submitLoading:false,
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
    mounted () {
        event.$emit('header',{
            show:true,
            title:'设置',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        this.getMyinfo()
    },
    watch:{
        'form.Name':function(val){
            if(val){
                this.form.EnglishName=tools.strToPinyin.ConvertPinyin(val)
            }else{
                this.form.EnglishName=''
            }
        }
    },
    methods:{
        getMyinfo(){
            this.http.post('H5Account/MyCenter')
            .then(res=>{
                this.form.Name=res.data.object.name
                this.form.EnglishName=res.data.object.englishName
                this.form.EnumIDCardType=res.data.object.enumIDCardType||1
                this.form.DocumentsID=res.data.object.documentsID
                this.form.Sex=''+res.data.object.sex
                this.info.mobilePhone=res.data.object.mobilePhone
            })
        },
        submit(){
            this.submitLoading=true
            this.http.post('H5Account/EditUserInfo',this.form)
            .then(res=>{
                if(res.data.isSuccess){
                    this.$toast.success('保存成功');
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000);
                }else{
                    this.$toast(res.data.message);
                }
                this.submitLoading=false
            })
            .catch(err=>{
                this.submitLoading=false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .setting-wrap{
        background: #fff;
    }
    .button-wrap{
        margin: 0.3rem 0.2rem;
    }
    select{
        font-size: 0.14rem
    }
</style>
