<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']"  ref="scroll" class="blue-scroll">
            <div class="order-detail-wrap">
                <div class="section-header">
                    <div class="header-card">
                        <div class="title-row">
                            <span class="text-title">{{data.lineName}}</span>
                            <template v-if="data.confirmType==1||data.confirmType==4">
                                <span class="status-tag">{{data.payStatusName}}</span>
                            </template>
                            <template v-if="(data.couldPay&&data.confirmType==2)||(data.couldPay&&data.confirmType==3)">
                                <span class="status-tag">{{data.payStatusName}}</span>
                            </template>
                            <template v-if="(!data.couldPay&&data.confirmType==2)||(!data.couldPay&&data.confirmType==3)">
                                <span class="status-tag" v-if="data.payStatus==0">待确认</span>
                                <span class="status-tag" v-else>{{data.payStatusName}}</span>
                            </template>
                            <!-- <span class="status-tag" v-if="data.confirmType==1||data.confirmType==4">{{data.payStatusName}}</span>
                            <span class="status-tag" v-if="(data.payStatus==0&&!data.couldPay&&data.confirmType==2)||(data.payStatus==0&&!data.couldPay&&data.confirmType==3)">待确认</span> -->
                        </div>
                        <div class="title-info van-hairline--bottom">
                            <span class="price">{{data.lineTypeName}}</span> {{data.orderNo}}
                        </div>
                        <div class="info-row">
                            <div class="row">
                               <span>出发日期：{{data.teamDate}}</span>
                               <span>返程日期：{{data.returnDate}}</span>
                            </div>
                            <div class="row">
                                <span>出发城市：{{data.sourceCityName}}</span>
                                <span>目的城市：{{data.targetCityName}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-card">
                    <div class="label-title">
                        合同签署人
                    </div>
                    <template v-for="item in data.signerList">
                        <div class="label-row" >
                            <span>联系人：{{item.signerName}}</span>
                        </div>
                        <div class="label-row">
                            <span>手机号：{{item.mobilePhone}}</span>
                        </div>
                        <div class="label-row">
                            <span>证件号码：{{item.idCardNO}}</span>
                        </div>
                    </template>
                </div>
                <div class="panel-card">
                    <div class="label-title">
                        旅客信息
                    </div>
                    <div class="label-row" v-for="(item,index) in data.guestList" :key="index">
                        <span>{{item.guestName}}：{{item.idCardNO}}</span>
                    </div>
                </div>
                <div class="panel-card">
                    <div class="label-row">
                        <span>退款规则：{{data.refundDay==-1?'不可退':'出团前'+data.refundDay+'天可退'}}</span>
                    </div>
                    <div class="label-row">
                        <span>预订规则：{{data.destineDay==-1?'不可退':'出团前'+data.destineDay+'天可预订'}}</span>
                    </div>
                </div>
                <div class="panel-card">
                    <div class="label-row between">
                        <span>团费</span><span class="center">X{{data.positionCount}}</span><span class="price right">￥{{data.positionPrice}}</span>
                    </div>
                    <div class="label-row between">
                        <span>其它费用</span><span class="center">X{{data.smallCount}}</span><span class="price right">￥{{data.smallItemPrice?data.smallItemPrice:0}}</span>
                    </div>
                    <div class="label-row between">
                        <span>订单总额</span> <span class="price right">￥{{data.amount}}</span>
                    </div>
                </div>
                <div class="button-wrap">
                    <div class="half-button">
                        <button class="ui-button white" v-if="data.payStatus==2&&data.isCouldRefund&&1==2" @click="Refund">申请退款</button>
                        <template v-if="data.confirmType==2||data.confirmType==3">
                            <button class="ui-button orange" v-if="data.couldPay&&data.payStatus===0" @click="$router.push('/GroupLine/Payment?orderId='+$route.params.id)">继续支付</button>
                        </template>
                        <template v-if="data.confirmType==1||data.confirmType==4">
                            <button class="ui-button orange" v-if="data.payStatus===0" @click="$router.push('/GroupLine/Payment?orderId='+$route.params.id)">继续支付</button>
                        </template>
                        <button class="ui-button orange" v-if="data.isApplyInvoice!==1&&data.payStatus==2" @click="$router.push('/My/CommonInfo?type=selectInvoice')">申请发票</button>
                    </div>
                    <div style="margin-top:0.1rem">
                        <button class="ui-button theme-white full" v-if="data.payStatus==0" @click="cancel">取消订单</button>
                    </div>
                </div>
            </div>
        </cube-scroll>
    </div>
</template>
<script>
import {mapState} from "vuex"
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui'
export default {
    name:'OrderDetail',
    components:{
        cubeScroll:Scroll,
    },
    data(){
        return {
            data:{},
            options: {
            },
        }
    },
    computed:{
        ...mapState({
            selectInvoice:state=>state.selectInvoice
        })
    },
    mounted () {
        event.$emit('header',{
            show:true,
            title:'订单详情',
            left:{
                show:true
            },
            right:{
                show:false
            },
            border:false
        })
        this.getDetail()
    },
    methods: {
        getDetail(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '正在加载'
            });
            this.http.get('GroupLineOrderH5/GetH5GroupLineOrderDetail?orderId='+this.$route.params.id)
            .then(res=>{
                if(res.data.isSuccess){
                    this.data=res.data.objectDto
                    if(this.selectInvoice){
                        this.$dialog.confirm({
                            title: '提示',
                            message: '确认申请开票？'
                        }).then(() => {
                            this.applyInvoice()
                            this.$store.commit('setSelectInvoice',null)
                        }).catch(() => {
                            this.$store.commit('setSelectInvoice',null)
                        });
                        
                    }
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
            })
        },
        cancel(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '正在取消订单'
            });
            this.http.post('GroupLineOrderH5/CancelGroupLineOrderH5',{
                OrderId:this.$route.params.id
            })
            .then(res=>{
                if(res.data.isSuccess){
                    setTimeout(() => {
                        this.$toast.success('取消成功');
                    }, 200);
                    setTimeout(() => {
                        this.getDetail()
                    }, 2000);
                    
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
            })
        },
        applyInvoice(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '申请开票中'
            });
            this.http.post('Invoice/ApplyInvoice',{
                orderId:this.$route.params.id,
                commonInvoiceId:this.selectInvoice.id
            })
            .then(res=>{
                if(res.data.isSuccess){
                    setTimeout(() => {
                        this.$toast.success('开票成功');
                    }, 200);
                    setTimeout(() => {
                        this.getDetail()
                    }, 2000);
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
            })
        },
        Refund(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '申请退款中'
            });
            this.http.post('H5CustomerFee/CustomerRefundFee',{
                OrderId:this.$route.params.id
            })
            .then(res=>{
                if(res.data.isSuccess){
                    setTimeout(() => {
                        this.$toast.success('申请退款成功');
                    }, 200);
                    setTimeout(() => {
                        this.getDetail()
                    }, 2000);
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
            })
        }
    },
    beforeDestroy(){
        this.$store.commit('setSelectInvoice',null)
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .order-detail-wrap{
        .section-header{
            padding: 0.15rem;
            background: linear-gradient(to right, $theme-blue1 , $theme-blue2);
            .header-card{
                padding: 0.15rem;
                background: #fff;
                border-radius: 4px;
                .title-row{
                    display: flex;
                    .text-title{
                        flex: 1;
                        font-size: 0.14rem;
                    }
                    .status-tag{
                        margin-left: 0.15rem;
                        background: #fff3e5;
                        color: $theme-orange1;
                        border-radius: 0.1rem;
                        height: 0.2rem;
                        line-height: 0.2rem;
                        padding: 0 0.1rem;
                        font-size:0.14rem;
                        flex-shrink:0
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
        .panel-card{
            background: #fff;
            padding: 0.15rem;
            margin-top: 0.05rem;
            .label-title{
                margin-bottom: 0.1rem;
            }
            .label-row{
                display: flex;
                &+.label-row{
                    margin-top:0.1rem;
                }
                &.between{
                    justify-content: space-between;
                    span{
                        flex: 1;
                        &.center{
                            text-align: center
                        }
                        &.right{
                            text-align: right
                        }
                    }
                }
            }
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

