<template>
    <cube-scroll :style="{height:options.height+'px'}" :options="options" @pulling-up="onPullingUp" :scroll-events="['scroll']"  ref="scroll">
        <div class="traveller-list-wrap">
            <van-cell-swipe class="swipe-cell" :right-width="65" :left-width="0" :on-close="onClose" v-for="item in data.list" :key="item.id">
                <div class="traveller-card" :class="{'select':item.select}" @click="select(item.id)">
                    <div class="card-main">
                        <div class="traveller-title">{{item.chineseName}}<span v-if="item.englishName">（{{item.englishName}}）</span><i class="iconfont" :class="{'icon-nan':item.sex==1,'icon-nv':item.sex==2}"></i> 
                            <van-tag plain :type="item.enumPassengersType|getPassengersColor">{{item.enumPassengersType|getPassengersType}}</van-tag>
                        </div>
                        <div class="traveller-row"><i class="iconfont icon-shouji"></i>{{item.phone}}</div>
                        <div class="traveller-row"><i class="iconfont icon-zhengjian"></i>{{item.documentsID}}</div>
                    </div>
                    <div class="card-right" v-if="type=='normal'">
                        <van-icon name="edit" @click="edit(item.id)"/>
                    </div>
                </div>
                <span slot="right" class="swipe-cell-right denger" @click="deleteItem(item.id)">删除</span>
            </van-cell-swipe>
            <div class="no-data" v-if="data.list.length==0">
                还没有任何联系人,请添加
            </div>
            <!-- <div class="button-wrap">
                <button class="ui-button orange full" @click="$router.push('/My/AddTraveller')">新增旅客</button>
            </div> -->
        </div>
    </cube-scroll>
</template>
<script>
import {mapState} from "vuex"
import event from '@/vuex/eventCenter';
import {Style, Scroll,} from 'cube-ui'
export default {
    name:'TravellerList',
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
            deleteId:null
        }
    },
    mounted () {
        console.log(this.$route)
        //计算滚动区域高度
        var tabH=this.type=='normal'?document.querySelector('.van-tabs__wrap').offsetHeight:0
        this.options.height=document.body.offsetHeight-document.querySelector('#header').offsetHeight-tabH
        this.getList()
    },
    filters: {  
        getPassengersType(value) {
            var type=['成人','老人','儿童']  
            return type[value-1]
        },
        getPassengersColor(value){
            var type=['primary','success','danger']  
            return type[value]
        }  
    },  
    methods: {
        getList(){
            this.$toast.loading({
                mask: true,
                message: '加载中...'
            });
            this.http.post('H5Account/Passengers',{
                PageSize:10,
                PageIndex:this.data.pageIndex
            }).then(res=>{
                this.data.list=res.data.objects
                this.$nextTick(()=>this.$refs.scroll.refresh())
            }).finally(()=>{
                this.$toast.clear()
            })
        },
        edit(id){
            var item=this.data.list.find(e=>{
                return e.id==id
            })
            localStorage.setItem('editTraveller',JSON.stringify(item))
            this.$router.push('/My/AddTraveller?id='+id)
        },
        deleteItem(id){
            this.deleteId=id
        },
        onClose(clickPosition, instance) {
            switch (clickPosition) {
                case 'left':
                case 'cell':
                    instance.close();
                    break;
                case 'right':
                    this.$dialog.confirm({
                        message: '确定删除吗？'
                    }).then(() => {
                        this.$toast.loading({
                            mask: true,
                            message: '正在删除'
                        });
                        this.http.post('H5Account/DeletePassengers',{PassengersId:this.deleteId})
                        .then(res=>{
                            if(res.data.isSuccess){
                                this.$toast.success('删除成功');
                                setTimeout(() => {
                                    this.getList()
                                }, 2000);
                            }else{
                                this.$toast.success(res.data.message||'未知错误');
                            }
                        })
                        .finally(()=>{

                        })
                    }).catch(() => {
                        instance.close();
                    });
                    break;
                case 'outside':
                    
                    break;
            }
        },
        select(id){
            if(this.type=='normal')return false
            var item=this.data.list.find(e=>{
                return e.id==id
            })
            this.data.list.forEach((e,i)=>{
                e.select=false
                if(e.id==id){
                    e.select=true
                    this.$set(this.data.list,i,e)
                }
            })
            var data={
                mark:this.$route.query.mark,
                data:item
            }
            
            localStorage.setItem('selectTraveller',JSON.stringify(data))
            setTimeout(() => {
                this.$router.go(-1)
            }, 200);
        },
        onPullingUp(){
            this.http.post('H5Account/Passengers',{
                PageSize:10,
                PageIndex:this.data.pageIndex+1
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
    .traveller-list-wrap{
        .traveller-card{
            background: #fff;
            padding: 0.15rem;
            display: flex;
            .card-main{
                flex: 1;
                line-height: 1.5;
                .traveller-title{
                    .icon-nan{
                        font-size: 0.2rem;
                        color: #0091ff;
                        vertical-align: middle;
                    }
                    .icon-nv{
                        font-size: 0.2rem;
                        color: #ff4d94;
                        vertical-align: middle;
                    }
                }
                .traveller-row{
                    .icon-shouji{
                        color: #8dbdf2;
                        margin-right: 0.05rem;
                    }
                    .icon-zhengjian{
                        color: #F5DEB3;
                        margin-right: 0.05rem;
                    }
                }
            }
            .card-right{
                color: $gray-text;
                @include flex-center;
                font-size: 0.2rem;
                i:active{
                    color: $normal-text
                }
            }
            &+.traveller-card{
            }
            &.select{
                border: 1px solid $theme-orange1
            }
        }
        .button-wrap{
            margin: 0.3rem 0.2rem;
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
    }
    .no-data{
        color: #999;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-50%);
    }
</style>

