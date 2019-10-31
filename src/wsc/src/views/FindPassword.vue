<template>
    <div class="page">
        <div v-if="stage==1">
            <van-cell-group>
                <van-field
                    v-model="form.MobilePhone"
                    placeholder="手机号"
                    :disabled="type=='0'"
                />
                <van-field
                    v-model="form.Code"
                    placeholder="手机验证码"
                     type="tel"
                    @click-icon="form.Code = ''">
                    <span slot="button" class="get-code" :class="{'disabled':getCodeDisabled}" @click="getVerifyCode" v-b-loading="getCodeLoading">{{getCodeText}}</span>
                    <!-- <span  class="theme-orange">获取验证码</span> -->
                </van-field>
                <van-field
                    v-model="form.Password"
                    placeholder="6-12位密码，必须包含字母及数字"
                     type="password"
                    @click-icon="form.Password = ''"
                />
                <van-field
                    v-model="form.ConfirmPassword"
                    placeholder="再次确认密码"
                    type="password"
                    @click-icon="form.ConfirmPassword = ''"
                />
                
            </van-cell-group>
            <div class="button-wrap">
                <button class="ui-button orange full" v-b-loading="submitLoading" @click="submit">{{submitLoading?'正在提交':'完成设置'}}</button>
            </div>
        </div>
        <div v-if="stage==2" class="success-wrap">
            <van-icon name="checked" />
            <h4>新密码设置成功!</h4>
            <div class="tip">{{countdown}}秒后将返回登录界面，或现在去 <span class="theme-color" @click="goLigin">登录</span></div>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
export default {
    name:'FindPassword',
    data(){
        return{
            form:{
                MobilePhone:'',
                Code:'',
                Password:'',
                ConfirmPassword:'',
            },
            getCodeLoading:false,
            getCodeDisabled:false,
            getCodeText:'获取验证码',
            countDownStart:180,
            submitLoading:false,
            stage:1,
            countdown:5,
            type:'0',
        }
    },
    mounted () {
        event.$emit('header',{
            show:true,
            title:this.$route.query.edit?'找回密码':'设置新密码',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        this.type=this.$route.query.type||'0'
        if(this.type=='0'){
           this.http.post('H5Account/MyCenter')
            .then(res=>{
                this.form.MobilePhone=res.data.object.mobilePhone
            }) 
        }
        
    },
    methods:{
        getVerifyCode(){
            if(this.getCodeLoading||this.getCodeDisabled){
                return false
            }
            
            this.getCodeLoading=true
            this.http.post('/H5Account/GetVerifyCode',{
                PhoneNumber:this.form.MobilePhone
            }).then(res=>{
                if(res.data.isSuccess){
                    this.getCodeDisabled=true
                    this.countDown()
                    this.$toast('验证码已发送至短信，请查看');
                }
                this.getCodeLoading=false
            })
            .finally(()=>{
                this.getCodeLoading=false
            })
        },
        countDown(){
            var countdown=setInterval(()=>{
                this.countDownStart--
                this.getCodeText=this.countDownStart+'秒后重试'
                if(this.countDownStart==0){
                    this.getCodeDisabled=false
                    this.getCodeText="获取验证码"
                    this.countDownStart=180
                    clearInterval(countdown)
                }
            },1000)
        },
        submit(){
            if(this.form.MobilePhone==''){
                this.$toast('请填写手机号');
                return false
            }
            if(this.form.Code==''){
                this.$toast('请填写验证码');
                return false
            }
            if(this.form.Password==''){
                this.$toast('请填写密码');
                return false
            }
            if(!this.form.Password.match(/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){6,12}$/)){
                this.$toast('密码为6-12位，必须包含字母及数字且以字母开头')
                return false
            }
            if(this.form.Password!==this.form.ConfirmPassword){
                this.$toast('两次密码不一致');
                return false
            }
            this.submitLoading=true
            this.http.post('H5Account/MemberResetPwd',this.form)
            .then(res=>{
                if(res.data.isSuccess){
                    this.stage=2
                   var cd=setInterval(()=>{
                        this.countdown--
                        if(this.countdown==0){
                            clearInterval(cd)
                            localStorage.removeItem('token')
                            this.$router.replace('/login')
                        }
                    },1000)
                }else{
                    this.$toast(res.data.message)
                }
            })
            .finally(()=>{
                this.submitLoading=false
            })
            
            
        },
        goLigin(){
            this.$router.replace('/login')
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/style/theme.scss";
    .button-wrap{
        margin: 0.3rem 0.2rem;
    }
    .success-wrap{
        height: 100%;
        background: #fff;
        position: relative;
        @include flex-center;
        flex-direction: column;
        i{
            font-size: 0.8rem;
            color: $theme-green;
            margin-top: -1rem
        }
        h4{
            color: $theme-green;
            font-size: 0.2rem;
        }
        .tip{
            position: absolute;
            bottom: 1rem;
            left: 0;
            text-align: center;
            width: 100%;
            color: $gray-text
        }
    }
    .get-code{
        color: $theme-orange1;
        &.disabled{
            color: $gray-text
        }
    }
</style>
