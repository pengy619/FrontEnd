<template>
    <div class="view">
        <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="酒店类型" >
                <el-select placeholder="请选择" v-model="query.HotelsType">
                    <el-option label="全部" value=" "></el-option>
                    <el-option v-for="item in hotelType" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="酒店名称">
                <el-input style="width:200px" v-model="query.HotelName" clearable placeholder="按酒店名称搜索"></el-input>
            </el-form-item>
            <el-form-item label="所属城市" >
                <el-input style="width:200px" v-model="query.CityName" clearable placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="入住日期" v-model="query.StartDate">
                <el-date-picker
                v-model="query.StartDate"
                value-format="yyyy-MM-dd"
                type="date"
                :picker-options="pickerBeginDateBefore" id="s"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="离店日期" v-model="query.EndDate">
                <el-date-picker
                v-model="query.EndDate"
                value-format="yyyy-MM-dd"
                type="date"
                :picker-options="pickerBeginDateAfter" id="e"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="晚数" >
                <el-select placeholder="请选择" v-model="query.Night" clearable>
                    <el-option v-for="item in 9" :label="item" :value="item" :key="item"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="间数" >
                <el-select placeholder="请选择" v-model="query.RoomNumber" clearable>
                    <el-option v-for="item in 9" :label="item" :value="item" :key="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  >
                <el-button type="primary" size="small" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        
        <div class="hotel-list-box" v-loading="loading" style="min-height:300px;">
            <div class="no-data-tip" v-if="hotelList.length==0&&!loading">暂无数据</div>
            <div class="hotel-card" v-for="(hotel,index) in hotelList" :key="hotel.hotelId" >
                <div class="hotel-header">
                  <div class="hotel-title">
                    <span class="title-text">{{hotel.hotelName}}</span>
                    <span class="title margin_left_10" v-if="hotel.englishHotelName">{{hotel.englishHotelName}} </span>
                    <el-rate style="display:inline"
                             v-model="hotel.starRated"
                             disabled>
                    </el-rate>
                    <el-button type="primary" size="mini" plain @click="goDetail(hotel.hotelId)">查看酒店详情</el-button>
                  </div>
                    <div class="hotel-address">
                        地址：{{hotel.address}}
                    </div>
                </div>
                <div class="hotel-room">
                    <el-table
                        :data="hotel.minProudcts"
                        style="width: 100%">
                        <el-table-column
                            prop="productName"
                            label="商品名称"
                            >
                            <template slot-scope="scope">
                                <div @click="handleGoProductDetail(scope.row.id)" class="cursor">{{scope.row.productName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="roomName"
                            label="房型"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="bedSize"
                            label="床型">
                            <template slot-scope="scope">
                                <div v-for="(item,index) in scope.row.bedSize" :key="index">{{item}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="stockBalance"
                            label="库存" wdith="80">
                        </el-table-column>
                        <el-table-column
                            prop="breakfastType"
                            label="早餐">
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
                            label="同行结算价/间" wdith="100">
                            <template slot-scope="scope">
                                ￥{{scope.row.costPrice}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="retailSalesPrice"
                            label="直客销售价/间" wdith="100">
                            <template slot-scope="scope">
                                ￥{{scope.row.retailSalesPrice}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="customerPrice"
                            label="媒体价/间" wdith="100">
                            <template slot-scope="scope">
                                ￥{{scope.row.customerPrice}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="incentiveValue"
                            label="销售激励" wdith="100">
                            <template slot-scope="scope">
                                {{scope.row.incentiveValue}}{{scope.row.incentiveTypeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="warning" v-if="scope.row.paymentType==0" @click="goBooking(scope.row.id)">实时预订</el-button>
                                <div class="half-button" @click="goBooking(scope.row.id)" v-if="scope.row.paymentType==1">
                                    <div class="button">预订</div>
                                    <div class="text" v-if="scope.row.comfirmTime">{{scope.row.comfirmTime}}分钟确认</div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="hotel-footer">
                    <el-button type="text" @click="showMoreRoom(index)">{{hotel.showMore?'收起':'显示全部'}}</el-button>
                </div>
            </div>
        </div>

        <el-pagination class="pagination"
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading:false,
            hotelList:[],
            hotelType:[],
            query:{
                HotelsType:'',
                Status:'',
                CityName:'',
                HotelName:'',
                StartDate:'',
                EndDate:'',
                Night:'',
                RoomNumber:'',
                PageSize:10,
                PageIndex:1
            },
            //分页
            pagination: {
                sizes: [5, 10, 20, 50],
                size: 10,
                currentPage: 1,
                total: 0
            },
            pickerBeginDateBefore:{
                disabledDate:(time)=> {
                    if(this.query.EndDate){
                        return time.getTime() > new Date(this.query.EndDate).getTime();
                    }
                }
            },
            pickerBeginDateAfter:{
                disabledDate:(time)=> {
                    if(this.query.StartDate){
                        return time.getTime() < new Date(this.query.StartDate).getTime();
                    }
                }
            }
        };
    },
    mounted() {
        this.getList()
        this.getHotelType()
    },
    methods: {
        getList() {
            this.loading=true
            this.shopHttp.get('HotelProduct/GetHotelProductList',{
                params:this.query
            }).then(res=>{
                this.hotelList=res.data.objects
                this.pagination.total=res.data.total

                this.hotelList.forEach((item,index) => {
                    item.minProudcts=item.proudcts.slice(0,3)
                    item.showMore=false
                });
                this.loading=false
            }).catch(err=>{
                this.loading=false
            })
        },
        sizeChange(size){
            this.query.PageSize=size
            this.getList()
        },
        currentPageChange(page){
            this.query.PageIndex=page
            this.getList()
        },
        getHotelType(){
            this.shopHttp.get('HotelProduct/GetHotelType')
            .then(res=>{
                this.hotelType=res.data.objects
                
            })
        },
        showMoreRoom(index){
            if(this.hotelList[index].showMore){
                this.hotelList[index].minProudcts=this.hotelList[index].proudcts.slice(0,3)
            }else{
                this.hotelList[index].minProudcts=this.hotelList[index].proudcts
            }
            this.$set(this.hotelList,index, this.hotelList[index])
            this.hotelList[index].showMore=!this.hotelList[index].showMore
        },
        goDetail(id){
            this.$router.push('/sellcenter/hotelProductDetail/'+id);
        },
        handleGoProductDetail(id){
            this.$router.push('/sellcenter/hotelProductRoomDetail/'+id);
        },
        goBooking(id){
            this.$router.push('/sellcenter/hotelBooking/'+id);
        }
    }
};
</script>

<style lang="scss" scoped>
.hotel-card{
    border-top: 1px solid #eee;
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
    .half-button{
        width: 98px;
        height: 40px;
        border:1px solid #e6a23c;
        color: #e6a23c;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
        border-radius: 4px;
        box-sizing: border-box;
        .button{
            background: #e6a23c;
            color: #fff;
            height: 20px;
        }
        .text{
            color: #e6a23c;
            font-size:12px;
            height: 20px;
        }
        &:hover{
            border-color: #ebb563;
            .button{
                background: #ebb563;
            }
            .text{
                color:#ebb563;
            }
        }
    }
    .hotel-footer{
        text-align: center
    }
}
.no-data-tip{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #E4E7ED;
    font-size: 24px;
    min-height: 300px;
}
</style>
