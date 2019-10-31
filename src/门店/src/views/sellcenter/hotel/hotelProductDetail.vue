<template>
    <div class="view">
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
                <el-tabs >
                    <el-tab-pane label="房型价格">
                        <div class="hotel-search">
                            <el-form :inline="true" size="small" label-width="80px">
                                <el-form-item label="入住日期" >
                                    <el-date-picker
                                    v-model="hotelProduct.startDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :picker-options="pickerBeginDateBefore"
                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="离店日期" >
                                    <el-date-picker
                                    v-model="hotelProduct.endDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :picker-options="pickerBeginDateAfter"
                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="warning" size="small" icon="el-icon-search" @click="getProductList">搜索</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="hotel-room">
                            <el-table
                                :data="hotelProduct.minList"
                                style="width: 100%" v-loading="hotelProduct.loading">
                                <el-table-column
                                    prop="productName"
                                    label="商品名称"
                                    >
                                    <template slot-scope="scope">
                                        <div @click="handleGoProductDetail(scope.row.productId)" class="cursor">{{scope.row.productName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="roomName"
                                    label="房型"
                                    >
                                </el-table-column>
                                <el-table-column
                                    label="床型">
                                    <template slot-scope="scope">
                                        <div v-for="(item,index) in scope.row.bedSize" :key="index">{{item}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="breakfastType"
                                    label="早餐">
                                </el-table-column>
                                <el-table-column
                                    prop="paymentTypeStr"
                                    label="预订方式">
                                </el-table-column>
                                <el-table-column
                                    prop="hasNetwork"
                                    label="宽带">
                                    <template slot-scope="scope">
                                        {{scope.row.hasNetwork?'有':'无'}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="canRefund"
                                    label="退订政策">
                                    <template slot-scope="scope">
                                        {{scope.row.canRefund?'可退':'不可退'}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="costPrice"
                                    label="同行结算价">
                                    <template slot-scope="scope">
                                        ￥{{scope.row.costPrice}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="retailSalesPrice"
                                    label="直客销售价">
                                    <template slot-scope="scope">
                                        ￥{{scope.row.retailSalesPrice}}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column
                                    prop="promotionValue"
                                    label="推广费">
                                    <template slot-scope="scope">
                                        {{scope.row.promotionValue}}{{scope.row.promotionTypeStr}}
                                    </template>
                                </el-table-column> -->
                                <el-table-column
                                    prop="incentiveValue"
                                    label="销售激励">
                                    <template slot-scope="scope">
                                        {{scope.row.incentiveValue}}{{scope.row.incentiveTypeStr}}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="warning" v-if="scope.row.realTime">实时预订</el-button>
                                        <div class="half-button" v-else>
                                            <div class="button">预订</div>
                                            <div class="text">30分钟确认</div>
                                        </div>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </div>
                        <div class="hotel-footer">
                            <el-button type="text" @click="showMoreRoom">{{hotelProduct.showMore?'收起':'显示全部'}}</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="酒店介绍">
                        <div v-html="hotel.description">
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="配套设施">
                        <div v-html="hotel.facilities">
                            
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="交通线路">
                        <div v-html="hotel.location">
                            
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import addressselect from "@/components/address-select";
export default {
    data() {
        return {
            hotel:null,
            hotelProduct:{
                list:[],
                minList:[],
                startDate:'',
                endDate:'',
                showMore:false,
                loading:false,
            },
            pickerBeginDateBefore:{
                disabledDate:(time)=> {
                    if(this.hotelProduct.endDate){
                        return time.getTime() > new Date(this.hotelProduct.endDate).getTime();
                    }
                }
            },
            pickerBeginDateAfter:{
                disabledDate:(time)=> {
                    if(this.hotelProduct.startDate){
                        return time.getTime() < new Date(this.hotelProduct.startDate).getTime();
                    }
                }
            }    
        };
    },
    mounted() {
        this.getDetail()
        this.getProductList()
    },
    methods: {
        getDetail(){
            this.shopHttp.get('HotelProduct/GetHotelDetail',{
                params:{
                    HotelId:this.$route.params.id
                }
            })
            .then(res=>{
                this.hotel=res.data.object
            })
        },
        getProductList(){
            this.hotelProduct.loading=true
            this.shopHttp.get('HotelProduct/GetHotelDetailProductList',{
                params:{
                    HotelId:this.$route.params.id,
                    StartDate:this.hotelProduct.startDate,
                    EndDate:this.hotelProduct.endDate,
                }
            }).then(res=>{
                this.hotelProduct.list=res.data.objects
                this.hotelProduct.minList=this.hotelProduct.list.slice(0,5)
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
        },
        handleGoProductDetail(id){
            this.$router.push('/sellcenter/hotelProductRoomDetail/'+id);
        },
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
