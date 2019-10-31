<template>
    <div class="view" v-loading="viewLoading">
        <div class="hotel-box" v-if="hotel">
            <div class="hotel-header">
                <div class="hotel-title">
                    <span class="title-text">{{hotel.hotelName}}</span>
                     <span class="title margin_left_10" v-if="hotel.englishHotelName">{{hotel.englishHotelName}} </span>
                    <el-rate
                    style="display:inline"
                    v-model="hotel.starRated"
                    disabled>
                    </el-rate>
                    <el-button type="primary" size="mini" plain @click="$router.go(-1)">返回列表</el-button>
                </div>
                <div class="hotel-address">
                    地址：{{hotel.address}}
                </div>
            </div>
            <div class="hotel-banner">
                <el-carousel trigger="click" height="260px" :autoplay="false" indicator-position="none">
                    <el-carousel-item v-for="item in hotel.hotelMainPicture" :key="item">
                        <img :src="item" alt="">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="hotel-tab">
                <el-tabs type="">
                    <el-tab-pane label="酒店介绍">
                        <div v-html="hotel.description||'无'">
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="配套设施">
                        <div v-html="hotel.facilities||'无'">
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="交通线路">
                        <div v-html="hotel.location||'无'">
                            
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            viewLoading:false,
            hotel:null,
            hotelProduct:{
                list:[],
                minList:[],
                startDate:'',
                endDate:'',
                showMore:false,
                loading:false,
            }
        };
    },
    mounted() {
        this.getDetail()
        // this.getProductList()
    },
    methods: {
        getDetail(){
            this.viewLoading=true;
            this.groupHttp.get('Hotel/GetHotelDetail',{
                params:{
                    HotelId:this.$route.params.id,
                }
            }).then(res=>{
                if(res.data.isSuccess){
                    this.hotel=res.data.object
                }else{
                    this.$message.error(res.data.message);
                }
                this.viewLoading=false;
            })
        },
        getProductList(){
            this.hotelProduct.loading=true
            this.groupHttp.get('HotelProduct/GetHotelDetailProductList',{
                params:{
                    HotelId:this.$route.params.id,
                    StartDate:this.hotelProduct.startDate,
                    EndDate:this.hotelProduct.endDate,
                }
            }).then(res=>{
                if(res.data.isSuccess){
                    this.hotelProduct.list=res.data.objects
                    this.hotelProduct.minList=this.hotelProduct.list.slice(0,5)
                }else{
                    this.$message.error(res.data.message);
                }
                this.hotelProduct.loading=false
            }).catch(err=>{
                this.hotelProduct.loading=false
            })
        },
        showMoreRoom(){
            if(this.hotelProduct.showMore){
                this.hotelProduct.minList=this.hotelProduct.list.slice(0,5)
            }else{
                this.hotelProduct.minList=this.hotelProduct.list
            }
            this.hotelProduct.showMore=!this.hotelProduct.showMore
        }
    }
};
</script>

<style lang="scss" scoped>
.hotel-box{
    padding-bottom: 20px; 
    .hotel-header{
        padding-bottom: 10px;
        .hotel-title{
            display: flex;
            align-items: center;
            padding: 10px 0;
            .title-text{
                font-size: 18px;
                margin-right: 15px;
            }
        }
    }
    .hotel-banner{
        height: 260px;
        width: 410px;
        img{
            width: 100%;
            height: 260px;
        }
    }
    .hotel-tab{
        margin-top:20px;
    }
    .hotel-footer{
        text-align: center
    }
}
.hotel-main-img{
    height: 260px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #eee;
    img{
        max-width: 100%;
        max-height: 100%

    }
}
</style>
