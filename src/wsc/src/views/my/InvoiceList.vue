<template>
    <cube-scroll :style="{height:options.height+'px'}" @pulling-up="onPullingUp" :options="options" :scroll-events="['scroll']"  ref="scroll">
        <div class="invoice-list-wrap">
            <van-cell-group>
                <van-cell-swipe class="swipe-cell" :right-width="65" :left-width="0" v-for="item in data.list" :key="item.id">
                    <van-cell :class="{active:item.selected}" @click="select(item)" :title="item.invoiceTitle" value="" :label="item.invoiceTypeName">
                        <van-icon @click.stop="$router.push('/My/AddInvoice?edit='+item.id)" slot="right-icon" name="edit" class="van-cell__right-icon" />
                    </van-cell>
                    <span slot="right" class="swipe-cell-right denger" @click.stop="deleteItem(item.id)">删除</span>
                </van-cell-swipe>
            </van-cell-group>
            <div class="no-data" v-if="data.list.length==0">
                还没有任何发票,请添加
            </div>
            <!-- <div class="button-wrap">
                <button class="ui-button orange full" @click="$router.push('/My/AddInvoice')">新增发票</button>
            </div> -->
        </div>
    </cube-scroll>
</template>
<script>
import {mapState} from "vuex"
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui'
export default {
    name:'InvoiceList',
    components:{
        cubeScroll:Scroll,
    },
    props:{
        type:{
            type:String,
            default:'normal'
        }
    },
    data(){
        return {
            data:{
                list:[],
                pageIndex:1,
                pageSize:10,
                loading: false,
                finished: false
            },
            options: {
                height:'',
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
        //计算滚动区域高度
        var tabH=this.type=='normal'?document.querySelector('.van-tabs__wrap').offsetHeight:0
        this.options.height=document.body.offsetHeight-document.querySelector('#header').offsetHeight-tabH
        this.getList()
    },
    methods: {
        getList(){
            this.$toast.loading({
                duration:0,
                mask: true,
                message: '正在加载'
            });
            this.http.get('Invoice/GetCommonInvoiceList',{
                params:{
                    pageIndex:this.data.pageIndex,
                    pageSize:this.data.pageSize
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.data.list=[]
                    res.data.objects.forEach(item=>{
                        item.selected=false
                        this.data.list.push(item)
                    })
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
        onPullingUp(){
            this.http.get('Invoice/GetCommonInvoiceList',{
                params:{
                    PageSize:10,
                    PageIndex:this.data.pageIndex+1
                }
            }).then(res=>{
                res.data.objects.forEach(item=>{
                    item.selected=false
                    this.data.list.push(item)
                })
                if(res.data.objects.length>0){
                    this.data.pageIndex=res.data.pageIndex
                }
                this.$nextTick(()=>this.$refs.scroll.refresh())
            }).finally(()=>{
                this.$refs.scroll.forceUpdate()
            })
        },
        select(item){
            if(this.type!=='selectInvoice')return false
            this.data.list.forEach(item=>{
                item.selected=false
            })
            item.selected=true
            this.$store.commit('setSelectInvoice',item)
            this.$router.go(-1)
        }

    }
}
</script>
<style lang="scss" scoped>
@import "../../style/theme.scss";
    .invoice-list-wrap{
        .invoice-card{
            background: #fff;
            padding: 0.15rem;
            display: flex;
            
            &+.invoice-card{
                margin-top: 0.05rem;
            }
        }
        .button-wrap{
            margin: 0.3rem 0.2rem;
        }
        .van-cell__right-icon{
            font-size: 0.16rem
        }
    }
    .swipe-cell-right{
            @include flex-center;
            width: 65px;
            height: 100%;
            &.denger{
                background: #f44;
                color: #fff;
            }
        }
        .swipe-cell+.swipe-cell{
            margin-top: 0.05rem;
        }
        .active{
            border: 1px solid #f44
        }
    .no-data{
        color: #999;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-50%);
    }
</style>

