<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']"  ref="scroll">
            <div class="line-choicedate-wrap">
                <div class="top-box">
                    <van-cell-group class="left-label-group">
                        <van-cell title="出发地">
                            <select class="city-select" v-model="sourceCityId" @change="handleChangeSourceCity">
                                <option :value="item.key" v-for="(item,index) in cityList" :key="index">{{item.name}}</option>
                            </select>
                        </van-cell>
                    </van-cell-group>
                    <div class="month-scroll" ref="wrapper">
                        <div class="content">
                            <span class="tab" v-for="(item,index) in priceMonthList" :key="'m'+index" :class="{'active':index==0}" @click="handleChangeTab($event,index)">
                                {{item.month}}月
                            </span>
                        </div>
                    </div>
                    <price-table ref="priceTable" :price-data="priceData" v-on:table-click="getPriceItem"></price-table>
                </div>
                <van-cell-group class="mar-t">
                    <van-cell >
                        <template slot="title">
                            <span class="van-cell-text">成人 <span class="price">￥{{priceItem.price||0}}</span></span>
                        </template>
                        <van-stepper v-model="priceItem.adultNumber" integer :min="0"  :default-value="0" />
                    </van-cell>
                    <van-cell >
                        <template slot="title">
                            <span class="van-cell-text">老人 <span class="price">￥{{priceItem.oldPrice||0}}</span></span>
                        </template>
                        <van-stepper v-model="priceItem.oldNumber" integer :min="0"  :default-value="0" />
                    </van-cell>
                    <van-cell >
                        <template slot="title">
                            <span class="van-cell-text">儿童 <span class="price">￥{{priceItem.childPrice||0}}</span></span>
                        </template>
                        <van-stepper v-model="priceItem.childNumber" integer :min="0" :default-value="0" />
                    </van-cell>
                </van-cell-group>
                <van-cell-group class="mar-t">
                    <van-cell title="其它"></van-cell>
                    <van-cell v-for="(item,index) in smallItemList" :key="'small'+index">
                        <template slot="title">
                            <span class="van-cell-text">{{item.smallItemsName}} <span class="price">￥{{item.marketPrice||0}}</span></span>
                        </template>
                        <van-stepper v-model="item.smallItemNumber" integer :min="0"  :default-value="0" />
                    </van-cell>
                </van-cell-group>
                <div class="btn-box">
                    <button class="ui-button orange full" @click="handleContinueBooking">继续预定</button>
                </div>
            </div>
        </cube-scroll>
    </div>
</template>

<script>
import {dateFmt} from '@/utils/tools'
import event from '@/vuex/eventCenter'
import {Style, Scroll,} from 'cube-ui'
import BScroll from 'better-scroll'
import priceTable from '@/components/priceTable';
export default {
    name:'GroupLineChoiceDate',
    components:{
        cubeScroll:Scroll,
        priceTable
    },
    data() {
        return {
            cityList:[],
            sourceCityId:'',
            startDate:dateFmt(new Date(),'yyyy-MM-dd'),//this.$route.query.StartDate
            priceData:{},
            options: {
                
            },
            params:{
    			BranchId:this.$route.query.BranchId,
                EnumGroupLineType:this.$route.query.EnumGroupLineType,
                LineId:this.$route.query.LineId,
                CommunityShopId:this.$route.query.CommunityShopId
            },
            priceMonthList:[],
            smallItemList:[],
            priceItem:{},
            currentMonth:new Date().getMonth()+1,
        }

    },
    mounted(){
        this.$toast.loading({duration:0,mask:true})
        this.getSourceCity();
        this.getSmallItems();
        event.$emit('header',{
            show:true,
            left:{
                show:true,
            },
            title:'选择日期与人数',
            right:{
                show:false,
            },
        })
        let month;
        for(let i=0;i<12;i++){
            month=this.currentMonth+i;
            if(month>12){
                month=Math.abs(12-month)
            }
            this.priceMonthList.push({
                month:month,
                price:66
            })
        }
        this.$nextTick(() => {
            //$refs绑定元素
            if(!this.scroll){
                this.scroll = new BScroll(this.$refs.wrapper, {
                //开启点击事件 默认为false
                scrollX:true,
                click:true
            })
            // console.log(this.scroll)
            }else if(!this.$refs.wrapper){
                return
            }
            else{
                this.scroll.refresh()
            }
        })

        this.removeCache()
    },
    methods: {
        getPriceItem(data){
            this.priceItem=data;
            this.startDate=data.teamDate;
        },
        handleChangeSourceCity(val){
            this.getPrice();
            this.priceItem={};
        },
        handleChangeTab(e,index){
            
            document.querySelectorAll('.tab').forEach(item=>{
                item.className='tab'
            })
            e.target.className='tab active'
            let newDate=new Date();
            this.startDate=dateFmt(new Date(newDate.getFullYear(),this.currentMonth+index-1,1),'yyyy-MM-dd')
            this.getPrice()
        },
        getSourceCity(){
            // this.$toast.loading({duration:0,mask:true})
            this.http.get("/GroupLine/GetGroupLineSourceCitySelect?LineId="+this.$route.query.LineId)
            .then(res=>{
                if(res.data.isSuccess){
                    if(res.data.objects.length==0){
                        this.$toast.clear()
                    }
                    this.cityList=res.data.objects;
                    this.sourceCityId=this.cityList[0].key;
                    this.getPrice();
                    
                }else{
                    console.log('error:'+res.data.message)
                }
            })
            .catch(err=>{
                
            })
        },
        getSmallItems(key){
            this.http.get("/GroupLine/GetGroupLineSmallItemH5",{
                params:{
                    LineId:this.$route.query.LineId
                }
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.smallItemList=res.data.objects;
                }else{
                    this.$toast(res.data.message);
                }
            })
            .catch(err=>{

            })
        },
        getPrice(){
            this.http.get("/GroupLine/GetGroupLineProductPriceH5",{
                params:{
                    LineId:this.$route.query.LineId,
                    CommunityShopId:this.$route.query.CommunityShopId,
                    SourceCityId:this.sourceCityId,
                    StartDate:this.startDate,
                }
            })
            .then(res=>{
                 if(res.data.isSuccess){
                    let obj={
                        date:this.startDate,
                        priceList:res.data.objects
                    }
                    this.priceData=obj
                }else{
                    this.$toast(res.data.message);
                }
                this.$toast.clear()
            })
            .catch(err=>{

            })
            
        },
        handleContinueBooking(){
            if(this.priceItem.adultNumber===0||this.priceItem.oldNumber===0||this.priceItem.childNumber===0){
                this.$toast('请最少选择一位旅客')
                return false
            }
            let obj={
                LineId:this.params.LineId,
                BranchId:this.params.BranchId,
                CommunityShopId:this.params.CommunityShopId,
                StartDate:this.startDate,
                SourceCityId:this.sourceCityId,
                SourceCityName:'',
                Number:this.priceItem.adultNumber,
                OldNumber:this.priceItem.oldNumber,
                ChildNumber:this.priceItem.childNumber,
                Price:this.priceItem.price,
                OldPrice:this.priceItem.oldPrice,
                ChildPrice:this.priceItem.childPrice,
                TeamDate:this.priceItem.teamDate,
                PriceSum:'',
                SmallItemOrderList:[],
            }
            let adultCountPrice=this.priceItem.adultNumber*this.priceItem.price||0,
                oldCountPrice=this.priceItem.oldNumber*this.priceItem.oldPrice||0,
                childCountPrice=this.priceItem.childNumber*this.priceItem.childPrice||0,
                otherPrice=0;
            this.cityList.forEach(item=>{
                if(item.key==this.sourceCityId){
                    obj.SourceCityName=item.name;
                }
            })

            this.smallItemList.forEach(item=>{
                if(item.smallItemNumber>0){
                    let obj1={
                        SmallItemPriceId:item.smallItemId,
                        SmallItemsName:item.smallItemsName,
                        SmallitemAmount:item.marketPrice,
                        Quantity:item.smallItemNumber,
                        CostAmount:''
                    }
                    obj.SmallItemOrderList.push(obj1);
                    otherPrice+=item.marketPrice*item.smallItemNumber;
                }
            })
            obj.PriceSum=adultCountPrice+oldCountPrice+childCountPrice+otherPrice;
            if(obj.PriceSum>0){
                localStorage.setItem('orderData',JSON.stringify(obj))
                this.$router.push({
                    name:'OrderInfo',
                    query:{
                        LineId:this.params.LineId,
                        BranchId:this.params.BranchId,
                        EnumGroupLineType:this.curentIndex,
                        CommunityShopId:this.params.CommunityShopId,
                    }
                })
            }else{
                this.$toast('请选择日期和人数');
            }
            
        },
        
        onPullingDown(){
            this.search.pageIndex=1;
            this.getData(this.curentIndex)
            this.$refs.scroll.forceUpdate()
        },
        removeCache(){
            localStorage.removeItem('orderData')
            localStorage.removeItem('selectTraveller')
            localStorage.removeItem('info')
            localStorage.removeItem('guestList')
        }
    }
}
</script>

<style scoped lang=scss>
@import "../../style/theme.scss";
    .line-choicedate-wrap{
        .city-select{
            width: 100%;
            border: 0;
            outline: 0 none;
            background-color: #fff;
        }
        .tab-p{
            line-height: .22rem;
        }
        .btn-box{
            padding: .1rem .15rem;
            margin-top: .08rem;
        }
        .month-scroll{
            .content{
                height: 0.43rem;
                line-height: 0.43rem;
                width: 8.16rem;
                .tab{
                    padding: 0.1rem 0.2rem;
                }
                .tab.active{
                    border-bottom:1px solid $theme-orange1
                }
            }
        }   
    }
    
</style>
