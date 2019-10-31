<template>
    <div class="page">
        <van-tabs @click="handleChangeTab">
            <van-tab v-for="(item,index) in lineTypeList" :title="item.paramName" :key="index"></van-tab>
        </van-tabs>
        <van-cell-group class="left-label-group">
            <van-field v-model="search.city" label="目的地"  placeholder="请输入目的地"  @change="handleSearch"/>
            <van-field v-model="search.goDate" type="date" label="出发日期"    @change="handleSearch"/>
        </van-cell-group>
        <cube-scroll :options="options" :scroll-events="['scroll']" @pulling-down="onPullingDown" @pulling-up="onPullingUp" :style="{height:scrollHeight}"  ref="scroll">
            <div class="product-card">
                <div class="product-item" v-for="(item,index) in data.list" :key="index">
                    <div class="product-img" @click="handleGoDetail(item.id)">
                        <img :src="item.imgUrl"/>
                    </div>
                    <div class="product-content">
                        <div class="product-title"  @click="handleGoDetail(item.id)">
                            {{item.lineName}}
                        </div>
                        <div class="product-footer">
                            <div>
                                <span class="price">
                                    <span class="font-size-12">￥</span><span>{{item.price}}</span>
                                </span>
                                <span class="font-size-12 font-grey">起</span>
                                <del class="font-size-12 font-grey" style="margin-left:.1rem;">￥{{item.customerPrice}}</del>
                            </div>
                            <van-button type="warning" size="small" @click="handleBooking(item.id)">预定</van-button>
                        </div>
                    </div>
                </div>
            </div>
        </cube-scroll>
        <div class="kefu" @click="actionShow=true">
            <i class="iconfont icon-kefu"></i>
        </div>
        <van-actionsheet v-model="actionShow" :actions="actions" cancel-text="取消"/>
    </div>
</template>

<script>
import {dateFmt} from '@/utils/tools'
import event from '@/vuex/eventCenter'
import {Style, Scroll,} from 'cube-ui'
export default {
    name:'GroupLineIndex',
    components:{
        cubeScroll:Scroll,
    },
    data() {
        return {
            data:{
                list:[],
                loading: false,
                finished: false,
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
            curentIndex:0,
            search:{
                city:'',
                goDate: '',
                pageIndex: 1,
                pageSize: 10,
                total:0,
            },
            params:{
    			BranchId:this.$route.query.BranchId,//4090
                CommunityShopId:this.$route.query.CommunityShopId,//25
            },
            lineTypeList:[{paramName:'全部',id:''}],
            scrollHeight:'',
            actionShow:false,
            actions:[]
        }

    },
    mounted(){
        var branchAndShop={
            BranchId:this.$route.query.BranchId,
            CommunityShopId:this.$route.query.CommunityShopId
        }
        localStorage.setItem('branchAndShop',JSON.stringify(branchAndShop))
        this.getGroupType();
        event.$emit('header',{
            show:true,
            left:{
                show:false,
            },
            title:'跟团游',
            right:{
                show:true,
                icon:'contact'
            },
            onRightBtn:()=>{
                if(localStorage.getItem('token')){
                    this.$router.push({name:'MyHome'})
                }else{
                    this.$router.push({
                        name:'Login',
                        query:{
                            BranchId:this.params.BranchId,
                            CommunityShopId:this.params.CommunityShopId,
                        }
                    })
                }
            }

        })
        this.scrollHeight='calc(100% - '+this.$refs.scroll.$el.offsetTop+'px - .46rem)';
        this.getKefu()
    },
    methods: {
        handleSearch(){
            this.search.pageIndex=1;
            this.getData(this.curentIndex)
        },
        handleGoDetail(id){
            this.$router.push({
                name:'GroupLineDetail',
                query:{
                    LineId:id,
                    BranchId:this.params.BranchId,
                    EnumGroupLineType:this.curentIndex,
                    TargetCityName:this.search.city,
                    CommunityShopId:this.params.CommunityShopId,
                    StartDate:this.goDate
                }
            })
        },
        handleBooking(id){
            if(localStorage.getItem('token')){
                this.$router.push({
                    name:'GroupLineChoiceDate',
                    query:{
                        LineId:id,
                        BranchId:this.params.BranchId,
                        EnumGroupLineType:this.curentIndex,
                        StartDate:this.goDate,
                        CommunityShopId:this.params.CommunityShopId,
                    }
                })
            }else{
                this.$router.push({
                    name:'Login',
                    query:{
                        BranchId:this.params.BranchId,
                        CommunityShopId:this.params.CommunityShopId,
                    }
                })
            }
        },
        getGroupType(){
            this.$toast.loading({duration:0,mask:true})
            this.http.get("/GroupLine/GetGroupLineParamListH5",{
                params:{
                    BranchId:this.params.BranchId,
                    CommunityShopId:this.params.CommunityShopId
                }
            })
            .then(res=>{
                this.lineTypeList.push(...res.data);
                this.getData(0)
            })
            .catch(err=>{
                
            })
        },
        getData(key){
            this.http.get("/GroupLine/GetGroupLineListH5",{
                params:{
                    CommunityShopId:this.params.CommunityShopId,
                    BranchId:this.params.BranchId,
                    EnumGroupLineType:this.lineTypeList[key].id,
                    TargetCityName:this.search.city,
                    GoDate:this.search.goDate,
                    PageSize:this.search.pageSize,
                    PageIndex:this.search.pageIndex,
                }
            })
            .then(res=>{
                 if(res.data.isSuccess){
                    if(this.search.pageIndex==1){
                        this.data.list=res.data.objects;
                        this.search.total=res.data.total;
                    }else{
                        this.data.list.push(...res.data.objects);
                    }
                    if(this.data.list.length>=this.search.total){
                        this.data.finished=true;
                    }else{
                        this.data.finished=false;
                    }
                    this.data.loading = false;
                    this.search.pageIndex++;
                }else{
                    this.$toast(res.data.message);
                }
                this.$refs.scroll.forceUpdate()
                this.$nextTick(()=>this.$refs.scroll.refresh())
                this.$toast.clear()
            })
            .catch(err=>{

            })
        },
        //切换Tab
        handleChangeTab(index){
            this.search.pageIndex=1;
            this.curentIndex=index;
            this.$toast.loading({duration:0,mask:true})
            this.getData(index)
        },
        onPullingDown(){
            this.search.pageIndex=1;
            this.getData(this.curentIndex)
            this.$refs.scroll.forceUpdate()
        },
        onPullingUp(){
            this.getData(this.curentIndex)
        },
        getKefu(){
            this.http.get('Distributor/GetCommunityShopH5?CommunityShopId='+this.$route.query.CommunityShopId)
            .then(res=>{
                if(res.data.isSuccess){
                    res.data.objects[0].communityShopSalesConsultants.forEach(item=>{
                        var action={
                            name:item.name+" - "+item.mobilePhone,
                            mobilePhone:item.mobilePhone,
                            callback:this.callPhone
                        }
                        this.actions.push(action)
                    })
                }
            })
        },
        callPhone(item){
            window.location.href="tel:"+item.mobilePhone
        }
    }
}
</script>

<style scoped lang=scss>
    .product-card{
        background-color: #fff;
        .product-item{
            height: 1rem;
            padding: .1rem;
            overflow: hidden;
            box-sizing: border-box;
            .product-img{
                width: 1.2rem;
                height: .8rem;
                overflow: hidden;
                float: left;
                img{
                    width: 100%;
                    min-height: .8rem;
                }
            }
            .product-content{
                position: relative;
                height: 100%;
                margin-left: 1.3rem;
                .product-title{
                    max-height: .4rem;
                    line-height: .2rem;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .product-footer{
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    display: -webkit-flex;
                    display: flex;
                    align-items: center;
                    justify-content: space-between
                }
            }
        }
        
    }
    .left-label-group{
        margin-bottom: .08rem;
    }
    .kefu{
        background: #f80;
        border-radius: 50%;
        position: fixed;
        z-index: 506;
        text-align: center;
        color: #fff;
        bottom: .2rem;
        right: .05rem;
        line-height: 0.5rem;
        width: 0.5rem;
        height: 0.5rem;
        border: .03rem solid #FFF;
        box-shadow: 1px 2px 5px #ccc;
        i{
            font-size: .25rem;
        }
    }
</style>
