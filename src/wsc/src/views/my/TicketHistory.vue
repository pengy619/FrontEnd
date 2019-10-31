<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']" @pulling-down="onPullingDown" @pulling-up="onPullingUp"  ref="scroll">
            <van-panel v-for="item in data.list" :key="item.invoiceId" :title="item.orderNo?item.orderNo:' '" :status="item.statusName" class="ticket-list">
                <div class="ticket-card">
                    <div class="info-row">
                        {{item.productName}}
                    </div>
                    <div class="info-row">
                        <span>{{item.invoiceType}}</span>
                        <span>￥{{item.invoiceAmount}}</span>
                    </div>
                    <div class="info-row">
                        <span>{{item.invoiceTitle}}</span>
                        <span>{{item.applyDateFormat}}</span>
                    </div>
                </div>
                <div slot="footer" v-if="item.status==1" class="card-footer">
                    <button class="ui-button white small" @click="changeStatus(item.invoiceId,7)">取消</button>
                </div>
                <div slot="footer" v-if="item.status==6||item.status==7" class="card-footer">
                    <button class="ui-button orange small" @click="changeStatus(item.invoiceId,1)">申请发票</button>
                </div>
            </van-panel>
        </cube-scroll>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui'
export default {
    name:"TicketHistory",
    components:{
        cubeScroll:Scroll,
    },
    data(){
        return{
            data:{
                list:[],
                pageIndex:1,
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
            title:'开票记录',
            left:{
                show:true
            },
            right:{
                show:false
            }
        })
        this.getList(true)
    },
    methods:{
        getList(loading){
            if(loading){
                this.$toast.loading({
                    duration:0,
                    mask: true,
                    message: '正在加载'
                });
            }
            this.data.pageIndex=1
            this.http.get('Invoice/GetInvoiceApplyRecord',{
                params:{
                    PageIndex:this.data.pageIndex,
                    PageSize:10,
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
                setTimeout(() => {
                    this.$nextTick(()=>this.$refs.scroll.refresh())
                    this.$refs.scroll.forceUpdate()
                }, 500);
            })
            
        },
        onPullingDown(){
            this.getList()
        },
        onPullingUp(){
            this.http.get('Invoice/GetInvoiceApplyRecord',{
                params:{
                    PageIndex:this.data.pageIndex+1,
                    PageSize:10,
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    
                    this.data.list.push(...res.data.objects)
                    if(res.data.objects.length>0){
                        this.data.pageIndex=res.data.pageIndex
                    }
                }else{
                    setTimeout(() => {
                        this.$toast.fail(res.data.message||'未知错误');
                    }, 200);
                }
            })
            .finally(()=>{
                this.$toast.clear()
                setTimeout(() => {
                    this.$nextTick(()=>this.$refs.scroll.refresh())
                    this.$refs.scroll.forceUpdate()
                }, 500);
            })
        },
        changeStatus(id,status){
            var text1,text2;
            if(status==7){
                text1='确认取消开票？'
                text2='取消成功'
            }
            if(status==1){
                text1='确认申请开票？'
                text2='申请成功'
            }
            this.$dialog.confirm({
                title: '提示',
                message: text1
            }).then(() => {
                this.http.post('Invoice/UpdateInvoiceStatus',{
                    CommonInvoiceId:id,
                    InvoiceStatus:status
                })
                .then(res=>{
                    if(res.data.isSuccess){
                        setTimeout(() => {
                            this.$toast.success(text2);
                        }, 200);
                        setTimeout(() => {
                            this.getList()
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
            }).catch(() => {
                
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .ticket-card{
        padding: 0.1rem 0.15rem;
        .info-row{
            display: flex;
            justify-content: space-between;
            line-height: 1.5
        }
    }
    .card-footer{
        text-align: right;
    }
    .ticket-list+.ticket-list{
        margin-top: 0.05rem
    }
</style>
