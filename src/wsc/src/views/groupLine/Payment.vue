<template>
    <div class="page">
        <div class="payment-wrap">
            <div class="section-header">
                <div class="header-card">
                    <div class="title-row">
                        <span class="text-title">{{orderInfo.lineName||'asdasf阿大富豪'}}</span>
                    </div>
                    <div class="info-row">
                        <div class="row">
                            <span>应付总额 <span class="price font-size-18">￥{{orderInfo.feeAmount}}</span></span>
                        </div>
                    </div>
                </div>
            </div>
            <van-cell-group>
                <van-cell title="微信支付" >
                    <van-icon slot="icon" name="wechat" class="left-icon" />
                    <span slot="right-icon" class="van-cell__right-icon" >
                        <van-radio-group v-model="checked">
                            <van-radio :name="1" ></van-radio> 
                        </van-radio-group>
                    </span>
                </van-cell>
            </van-cell-group>
            <div class="button-wrap">
                <button class="ui-button orange full" @click="handleSubmitPay" :loading="btnLoading" >确定支付</button>
            </div>
            <div id="paymentHtml">

            </div>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
export default {
    name:'Payment',
    data(){
        return {
            orderInfo:{},
            checked:1,
            btnLoading:false,
            pamentHtml:'',
        }
    },
    mounted () {
        event.$emit('header',{
            show:true,
            title:'支付订单',
            left:{
                show:true
            },
            right:{
                show:false
            },
            border:false
        })
        
        this.getOrderInfo();
    },
    methods: {
        getOrderInfo(){
            this.http.get("/H5CustomerFee/GetPayOrderH5?OrderId="+this.$route.query.orderId)
            .then(res=>{
                if(res.data.isSuccess){
                    this.orderInfo=res.data.objects[0];
                    localStorage.setItem('orderPayInfo',JSON.stringify(this.orderInfo))
                }else{
                    this.$toast(res.data.message);
                }
            })
            .catch(err=>{

            })
        },
        handleSubmitPay(){
            if(this.btnLoading)return false
            this.btnLoading=true;
            this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '正在提交'
            });
            let returnPageUrl=location.host+'/#/GroupLine/PayResult?orderNo='+this.orderInfo.orderNo;
            this.http.get(window.location.origin+"/Order/ProcessPayment?OrderNO="+this.orderInfo.orderNo)
            .then(res=>{
                document.querySelector("#paymentHtml").innerHTML=res.data.Data                
                var jsPayPostUrl=document.getElementById('jsPayPostUrl').innerText.trim()
                var nativePayPostUrl=document.getElementById('nativePayPostUrl').innerText.trim()
                if (this.checkBrowser().versions.mobile) {
                    
                    var ua = navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            document.querySelector("#paymentHtml form").setAttribute("action", jsPayPostUrl);
                        } else {
                            document.querySelector("#paymentHtml form").setAttribute("action", nativePayPostUrl);
                        }
                } else {
                    
                    document.querySelector("#paymentHtml form").setAttribute("action", nativePayPostUrl);
                }


                document.querySelector("#paymentHtml form").submit();
                this.btnLoading=false;
                //this.$toast.clear()
            })
            .catch(err=>{
                this.btnLoading=false;
                //this.$toast.clear()
            })
            
        },
        checkBrowser(){
            return{
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1,
                        presto: u.indexOf('Presto') > -1,
                        webKit: u.indexOf('AppleWebKit') > -1,
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                        iPhone: u.indexOf('iPhone') > -1,
                        iPad: u.indexOf('iPad') > -1,
                        webApp: u.indexOf('Safari') == -1
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .payment-wrap{
        .section-header{
            padding: 0.15rem;
            background: linear-gradient(to right, $theme-blue1 , $theme-blue2);
            .header-card{
                padding: 0.15rem;
                background: #fff;
                border-radius: 4px;
                .title-row{
                    display: flex;
                    padding-bottom: .1rem;
                    border-bottom:1px solid #f7f7f7;
                    .text-title{
                        flex: 1;
                        font-size: 0.14rem;
                    }
                }
                .title-info{
                    margin: 0 -0.15rem;
                    font-size: 0.14rem;
                    color: $gray-text;
                    padding: 0.1rem 0.15rem;
                }
                .info-row{
                    color: $normal-text;
                    font-size: 0.14rem;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        margin-top: 0.1rem;
                    }
                }
            }
        }
        .left-icon{
            color: $theme-green;
            font-size: .2rem;
            line-height: normal;
            margin-right: .05rem;
        }
        .button-wrap{
            position: fixed;
            width: calc(100% - .4rem);
            left: 0;
            bottom: 0;
            margin: 0.3rem 0.2rem;
        }
    }
    #paymentHtml{
        position: fixed;
        left: 100%;
    }
    
</style>

