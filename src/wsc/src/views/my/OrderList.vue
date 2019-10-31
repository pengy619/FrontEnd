<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']" @pulling-down="onPullingDown" @pulling-up="onPullingUp"  ref="scroll">
            <div class="order-list-wrap">
                <div class="order-card" v-for="(item,index) in data.list" :key="index" @click="goDetail(item.orderId)">
                    <div class="order-title">{{item.lineName}}</div>
                    <div class="order-info">
                        <div class="info-row">
                            <span>出发日期：{{item.departureDateString}}</span>
                            <template v-if="item.confirmType==1||item.confirmType==4">
                                <span class="status">{{item.payStatusName}}</span>
                            </template>
                            <template v-if="(item.couldPay&&item.confirmType==2)||(item.couldPay&&item.confirmType==3)">
                                <span class="status">{{item.payStatusName}}</span>
                            </template>
                            <template v-if="(!item.couldPay&&item.confirmType==2)||(!item.couldPay&&item.confirmType==3)">
                                <span class="status-tag" v-if="data.payStatus==0">待确认</span>
                                <span class="status-tag" v-else>{{data.payStatusName}}</span>
                            </template>
                        </div>
                        <div class="info-row">
                            <span>出发城市：{{item.sourceCityName}}</span>
                            <span class="price">￥{{item.amount}}</span>
                        </div>
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
    name:'OrderList',
    components:{
        cubeScroll:Scroll,
    },
    data(){
        return {
            data:{
                list:[],
                pageIndex:1,
                loading: false,
                finished: false
            },
            options: {
                pullDownRefresh: {
                    threshold: 90,
                    stop: 40,
                    txt: '刷新成功'
                },
                pullUpLoad: {
                    threshold: 0,
                    txt: {
                        more: '加载更多',
                        noMore: '没有更多了'
                    }
                }
            },
        }
    },
    mounted () {
        event.$emit('header',{
            show:true,
            title:'我的订单',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        this.getList()
    },
    methods: {
        getList(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '正在加载'
            });
            this.data.pageIndex=1
            this.http.get('GroupLineOrderH5/GetH5GroupLineOrderPageList',{
                params:{
                    PageSize:10,
                    PageIndex:this.data.pageIndex
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.data.list=res.data.objects
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
        goDetail(id){
            console.log(id)
            this.$router.push('/My/OrderDetail/'+id)
        },
        onPullingDown(){
            this.data.pageIndex=1
            this.http.get('GroupLineOrderH5/GetH5GroupLineOrderPageList',{
                params:{
                    PageSize:10,
                    PageIndex:this.data.pageIndex
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.data.list=res.data.objects
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                setTimeout(() => {
                    this.$refs.scroll.forceUpdate()
                }, 500);
            })
        },
        onPullingUp(){
            this.http.get('GroupLineOrderH5/GetH5GroupLineOrderPageList',{
                params:{
                    PageSize:10,
                    PageIndex:this.data.pageIndex+1
                }
            }).then(res=>{
                this.data.list.push(...res.data.objects)
                if(res.data.objects.length>0){
                    this.data.pageIndex=res.data.pageIndex
                }
                this.$nextTick(()=>this.$refs.scroll.refresh())
            }).finally(()=>{
                this.$refs.scroll.forceUpdate()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .order-list-wrap{
        .order-card{
            background: #fff;
            padding: 0.15rem;
            .order-title{
                font-size: 0.16rem;
                line-height: 1.3;
                color:$normal-text;
            }
            .order-info{
                margin-top: 0.1rem;
                font-size: 0.14rem;
                .info-row{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: $gray-text;
                    padding: 0.05rem 0;
                    .status{
                        color:$theme-red1;
                    }
                    .price{
                        color:$theme-orange1;
                    }
                }
            }
            &+.order-card{
                margin-top: 0.05rem;
            }
        }
    }
</style>

