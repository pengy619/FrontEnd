<template>
    <div class="page">
        <div v-if="stage==2" class="success-wrap">
            <van-icon name="clear" class="pay-fail"/>
            <h4 class="pay-fail">支付失败</h4>
            <p>订单号：{{orderInfo.orderNo}}</p>
            <div class="button-wrap">
                <div class="half-button">
                    <button class="ui-button orange" @click="handleGoIndex">返回商城</button>
                    <button class="ui-button white" @click="handleViewOrder">查看订单</button>
                </div>
            </div>
        </div>
        <div v-if="stage==1" class="success-wrap">
            <van-icon name="checked" />
            <h4>支付成功</h4>
            <p>订单号：{{orderInfo.orderNo}}</p>
            <p>您已成功付款<span class="price">￥{{orderInfo.feeAmount}}</span>元</p>
            <div class="button-wrap">
                <div class="half-button">
                    <button class="ui-button orange" @click="handleGoIndex">返回商城</button>
                    <button class="ui-button white" @click="handleViewOrder">查看订单</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import {mapState} from "vuex"
export default {
    name:'PaySuccess',
    data(){
        return {
            stage:1,
            orderInfo:{},
            branchAndShop:null
        }
    },
    mounted () {
        this.getResult();
        event.$emit('header',{
            show:true,
            title:'支付结果',
            left:{
                show:true
            },
            onLeftBtn:()=>{
                this.$router.push('/My/OrderList')
            },
            right:{
                show:false
            },
            border:false
        })

        var orderInfo=localStorage.getItem('orderPayInfo')
        if(orderInfo)orderInfo=JSON.parse(orderInfo)
        this.orderInfo=orderInfo

        this.branchAndShop=JSON.parse(localStorage.getItem('branchAndShop'))
    },
    methods: {
        getResult(){
            this.http.get('H5CustomerFee/PayAwaitH5?orderNO='+this.$route.query.orderNO)
            .then(res=>{
                if(res.data.isSuccess){
                    this.stage=res.data.objects[0].enumPayStatus;
                }
            })
        },
        handleGoIndex(){
            console.log(localStorage.getItem('branchAndShop'))
            this.$router.push({
                name:'GroupLineIndex',
                query:{
                    BranchId:this.branchAndShop.BranchId,
                    CommunityShopId:this.branchAndShop.CommunityShopId
                }
            })
        },
        handleViewOrder(){
            this.$router.push('/My/OrderDetail/'+this.orderInfo.orderId)
        },
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .success-wrap{
        height: 100%;
        background: #fff;
        position: relative;
        @include flex-center;
        flex-direction: column;
        i{
            font-size: 0.8rem;
            color: $theme-green;
            margin-top: -1rem;
            &.pay-fail{
                color: $theme-red1;
            }
        }
        h4{
            margin: .2rem 0;
            color: $theme-green;
            font-size: 0.2rem;
            &.pay-fail{
                color: $theme-red1;
            }
        }
        p{
            margin:.03rem 0;
        }
        .button-wrap{
            padding:0.2rem 0.15rem;
            .half-button{
                display: flex;
                button{
                    flex: 1;
                }
                button+button{
                    margin-left: 0.05rem;
                }
            }
        }
        
    }
    
</style>

