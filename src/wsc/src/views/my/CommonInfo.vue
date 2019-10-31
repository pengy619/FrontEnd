<template>
    <div class="page">
        <div class="common-info-wrap">
            <van-tabs v-model="activeTab" ref="tab" v-if="type=='normal'">
                <van-tab title="常用旅客">
                    <TravellerList :type="type"></TravellerList>
                </van-tab>
                <van-tab title="常用发票">
                    <InvoiceList></InvoiceList>
                </van-tab>
            </van-tabs>
            <div v-if="type=='selectTraveller'">
                <TravellerList :type="type"></TravellerList>
            </div>
            <div v-if="type=='selectInvoice'">
                <InvoiceList :type="type"></InvoiceList>
            </div>
        </div>
    </div>
</template>
<script>
import event from '@/vuex/eventCenter';
import TravellerList from './TravellerList';
import InvoiceList from './InvoiceList';
export default {
    name:'CommonInfo',
    components:{
        TravellerList,
        InvoiceList
    },
    data(){
        return{
            activeTab:0,
            type:'normal',
        }
    },
    watch:{
        activeTab(val){
            if(val==0){
                event.$emit('header',{
                    right:{
                        show:true,
                        icon:'add-o'
                    },
                    onRightBtn:()=>{
                        this.$router.push('/My/AddTraveller')
                    }
                })
            }else if(val==1){
                event.$emit('header',{
                    right:{
                        show:true,
                        icon:'add-o'
                    },
                    onRightBtn:()=>{
                        this.$router.push('/My/AddInvoice')
                    }
                })
            }
            console.log(val)
            localStorage.setItem('CommonInfoTab',val)
        }
    },
    mounted () {
        if(this.$route.query.type){
            this.type=this.$route.query.type
            if(this.$route.query.type=='selectTraveller'){
                event.$emit('header',{
                    show:true,
                    title:'选择联系人',
                    left:{
                        show:true
                    },
                    right:{
                        show:true,
                        icon:'add-o',
                    },
                    onRightBtn:()=>{
                        this.$router.push('/My/AddTraveller')
                    }
                })
            }
            if(this.$route.query.type=='selectInvoice'){
                event.$emit('header',{
                    show:true,
                    title:'选择发票',
                    left:{
                        show:true
                    },
                    right:{
                        show:true,
                        icon:'add-o'
                    },
                    onRightBtn:()=>{
                        this.$router.push('/My/AddInvoice')
                    }
                })
            }
        }else{
            event.$emit('header',{
                show:true,
                title:'常用信息',
                left:{
                    show:true
                },
                right:{
                    show:true,
                    icon:'add-o',
                },
                onRightBtn:()=>{
                    this.$router.push('/My/AddTraveller')
                }
            })
        }
        var tab=localStorage.getItem('CommonInfoTab')
        if(tab){
            console.log(tab)
            this.activeTab=Number(tab)
            localStorage.removeItem('CommonInfoTab')
        }
    }
}
</script>
<style lang="scss" scoped>
    .common-info-wrap{

    }
</style>

