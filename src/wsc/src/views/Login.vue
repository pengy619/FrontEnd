<template>
    <div class="page" style="margin-top:0">
        <div class="login-wrap">
            <div class="logo">
                
            </div>
            <div class="form">
                <div class="form-row">
                    <div class="form-icon">
                        <i class="iconfont icon-shouji"></i>
                    </div>
                    <div class="form-field">
                        <input type="tel" v-model="form.username" placeholder="手机号码">
                        <span v-if="loginType==1" class="get-code" :class="{'disabled':getCodeDisabled}" @click="getVerifyCode" v-b-loading="getCodeLoading">{{getCodeText}}</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-icon">
                        <i class="iconfont icon-mima"></i>
                    </div>
                    <div class="form-field" v-if="loginType==1">
                        <input type="tel" v-model="form.password" placeholder="验证码">
                    </div>
                    <div class="form-field" v-if="loginType==2">
                        <input type="password" v-model="form.password" placeholder="密码">
                    </div>
                </div>
                <div class="form-row" style="margin-top:0.1rem">
                    <div class="form-icon">
                    </div>
                    <div class="form-field" style="text-align:right">
                        <span class="theme-color" @click="$router.push('/FindPassword?type=1')">忘记密码？</span>
                    </div>
                </div>
            </div>
            <div class="button">
                <button class="ui-button full theme-blue round shadow" v-b-loading="submitLoading" @click="login">{{submitLoading?'正在登陆':'立即登录'}}</button>
            </div>
            <div class="footer-btn" @click="changeLoginType">
                账号登录
            </div>
        </div>
    </div>
</template>

<script>
import event from '../vuex/eventCenter';
import {mapState} from "vuex"
import { Toast } from 'vant';
export default {
    name: 'Login',
    data () {
        return {
            form:{
                username:'',
                password:'',
                grant_type:'password',
                CommunityShopId:this.$route.query.CommunityShopId
            },
            remember:false,
            getCodeLoading:false,
            getCodeDisabled:false,
            getCodeText:'获取验证码',
            countDownStart:180,
            submitLoading:false,
            loginType:1,
            branchAndShop:null
        }
    },
    mounted(){
        event.$emit('header',{
            show:false,
        })
        this.branchAndShop=JSON.parse(localStorage.getItem('branchAndShop'))
        this.form.CommunityShopId=this.branchAndShop.CommunityShopId
    },
    methods:{
        login(){
            if(this.submitLoading)return false
            var url;
            if(this.form.username==''){
                this.$toast('请填写手机号');
                return false
            }
            
            if(this.form.password==''){
                this.$toast('请填写密码');
                return false
            }
            this.submitLoading=true
            if(this.loginType==1){
                this.form.mode=3
            }
            this.http.post('/account/authorize',this.form).then(res=>{
                if(res.data.access_token){
                    localStorage.setItem('token',res.data.token_type+' '+res.data.access_token)
                    var BranchId=this.branchAndShop.BranchId
                    var CommunityShopId=this.branchAndShop.CommunityShopId
                    this.$router.push({
                        path: '/GroupLine/GroupLineIndex',
                        query:{
                            BranchId,
                            CommunityShopId
                        }
                    })
                }else{
                    this.$toast.fail(res.data.message);
                }
            }).catch(err=>{
                
            }).finally(()=>{
                this.submitLoading=false
            })
        },
        getVerifyCode(){
            if(this.form.username==''){
                this.$toast('请填写手机号');
                return false
            }
            if(this.getCodeLoading||this.getCodeDisabled){
                return false
            }
            
            this.getCodeLoading=true
            this.http.post('/H5Account/GetVerifyCode',{
                PhoneNumber:this.form.username
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
        changeLoginType(){
            this.loginType=this.loginType==1?2:1
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/style/theme.scss";
    .login-wrap{
        width: 100%;
        height: 100%;
        background: #fff;
        background-image: url(../assets/login_bg.jpg);
        background-repeat: no-repeat;
        background-size:100%;
        background-position-y: -10%;
        overflow:hidden;
        .logo{
            text-align: center;
            margin-top:0.75rem;
            min-height: 0.9rem;
            img{
                width: 36%
            }
        }
        .form{
            width: 80%;
            margin:1.4rem auto 0.3rem auto;
            .form-row{
                display: flex;
                height: 0.33rem;
                .form-icon{
                    @include flex-center;
                    width: 0.25rem;
                    i{
                        font-size: 0.25rem;
                        color: $theme-blue1
                    }
                }
                .form-field{
                    flex: 1;
                    margin-left: 0.1rem;
                    color: $normal-text;
                    position: relative;
                    input{
                        width: 100%;
                        height: 0.33rem;
                        line-height: 0.3rem;
                        border: 0;
                        border-bottom: 1px solid lighten($theme-blue1, 20%);
                        color: $normal-text;
                        border-radius: 0;
                        -webkit-appearance:none;
                        outline: none;
                        &:focus{
                            border-bottom: 1px solid lighten($theme-blue1, 0%);
                        }
                        &:disabled{
                            background: transparent
                        }
                    }
                    &.between-center{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .get-code{
                        position: absolute;
                        right: 0;
                        top: 0.08rem;
                        color: $theme-orange1;
                        &.disabled{
                            color: $gray-text
                        }
                    }
                }
                &+.form-row{
                    margin-top: 0.2rem;
                }
            }
            .footer-row{
                display: flex;
                color: #909399;
                padding: 0.1rem 0;
            }
        }
        .button{
            width: 50%;
            margin:0.3rem auto;
        }
        .footer-btn{
            // position: absolute;
            // bottom: 0.5rem;
            // left: 50%;
            // transform: translateX(-50%);
            text-align: center;
            color: $gray-text; 
            &:active{
                color: $normal-text
            }
        }
    }
    
</style>
