<template>
  <div class="view" v-loading="viewLoading">
      <div v-if="detail">
        <div class="title-row">
            <span class="title">{{detail.hotel.hotelName}}</span>
            <span class="title margin_left_10" v-if="detail.hotel.englishHotelName">{{detail.hotel.englishHotelName}} </span>
            <el-rate
            style="display:inline"
            v-model="detail.hotel.starRated"
            disabled>
            </el-rate>
            <span class="address">地址：{{detail.hotel.allAddress}}</span>
        </div>
        <h4><span class="vercitals">| </span>酒店信息</h4>
        <el-form >
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="商品名称" size="small" label-width="100px">
                        <span>{{detail.productName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="销售状态" size="small" label-width="100px">
                        <span>{{detail.statusStr}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="供应商名称" size="small" label-width="100px">
                        <span>{{detail.supplierName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="房间数量" size="small" label-width="100px">
                        <span>{{detail.hotelRoom.number}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="配置" size="small" label-width="100px">
                        <span style="margin-right:10px">{{detail.canRefund?'可退':'不可退'}}</span>
                        <span style="margin-right:10px">{{detail.breakfastType}}</span>
                        <span style="margin-right:10px">{{detail.paymentTypeStr}}</span>
                        <span style="margin-right:10px">{{detail.canExtraBed?'加床'+detail.extraBedPrice:'不可加床'}}</span>
                        <span style="margin-right:10px">{{detail.canExtraBreakfast?'加早'+detail.extraBreakfaskPrice:'不可加早'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="房型名称" size="small" label-width="100px">
                        <span>{{detail.hotelRoom.roomName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="房型信息" size="small" label-width="100px">
                        <span style="margin-right:10px">建筑面积：{{detail.hotelRoom.area}}平米</span>
                        <span style="margin-right:10px">楼层：{{detail.hotelRoom.floor}}层</span>
                        <span style="margin-right:10px">最多可住：{{detail.hotelRoom.livingCount}}人</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="房间设施" size="small" label-width="100px">
                        <span  style="margin-right:10px" v-if="detail.hotelRoom.hasNetwork">有宽带</span>
                        <span  style="margin-right:10px" v-if="detail.hotelRoom.hasWiFi">有WIFI</span>
                        <!-- <span  style="margin-right:10px">{{detail.hotelRoom.hasWindowsStr}}</span> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="detail.productHotelPrices.length>0">
                <el-col :span="20">
                    <el-form-item label="销售策略" size="small" label-width="100px">
                        <el-row style="width:800px;">
                            <price-table ref="priceTable" :price-data="detail.productHotelPrices"></price-table>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
           
        </el-form>
        <h4><span class="vercitals">| </span>预订设置</h4>
        <el-form >
            <!-- <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="资源确认" size="small" label-width="100px">
                        <span>{{detail.confirmResource?'需确认':'无需确认'}}</span>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row :gutter="20" v-if="detail.confirmResource">
                <el-col :span="20">
                    <el-form-item label="联系人" size="small" label-width="100px">
                        <span>{{detail.linkMan}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="detail.confirmResource">
                <el-col :span="20">
                    <el-form-item label="联系方式" size="small" label-width="100px">
                        <span>{{detail.linkMobile}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="退款规则" size="small" label-width="100px">
                        <span v-if="detail.canRefund">入住前{{detail.refundLeadDay}}天可退</span>
                        <span v-else>不可退</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="资源确认" size="small" label-width="100px">
                        <span>{{detail.paymentTypeStr}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="推广费" size="small" label-width="100px">
                        <span>{{detail.promotionValue}}{{detail.promotionTypeStr}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="销售激励" size="small" label-width="100px">
                        <span>{{detail.incentiveValue}}{{detail.incentiveTypeStr}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="早餐配置" size="small" label-width="100px">
                        <span>{{detail.breakfastType}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="是否加床" size="small" label-width="100px">
                        <span v-if="detail.canExtraBed">可加，最多加{{detail.extraBedNumber}}张，每张{{detail.extraBedPrice}}元</span>
                        <span v-else>不可加</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="是否加早" size="small" label-width="100px">
                        <span v-if="detail.canExtraBreakfast">可加，最多加{{detail.extraBreakfaskNumber}}份，每份{{detail.extraBreakfaskPrice}}元</span>
                        <span v-else>不可加</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="补充说明" size="small" label-width="100px">
                        <span>{{detail.additionalRemarks}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
       
        

        <el-row class="margin_top text-center">
            <el-button class="mbackbtn" size="small" @click="$router.go(-1)">返回</el-button>
            <el-button type="warning" v-if="detail.paymentType==0" @click="goBooking(detail.id)">实时预订</el-button>
            <div class="half-button" @click="goBooking(detail.id)" v-if="detail.paymentType==1">
                <div class="button">预订</div>
                <div class="text" v-if="detail.comfirmTime">{{detail.comfirmTime}}分钟确认</div>
            </div>
        </el-row>
        </div>        
    </div>
</template>

<script>
import priceTable from '@/components/priceTable';
export default {
    data() {
        return {
            detail:null,
            viewLoading:true,
        };
    },
    components:{
        priceTable
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getDetail(){
            this.shopHttp.get('HotelProduct/GetHotelProductDetail',{
                params:{
                    ProductId:this.$route.params.id,
                }
            }).then(res=>{
                if(res.data.isSuccess){
                    this.detail=res.data.object
                    if(this.detail.productHotelPrices.length>0){
                        this.$nextTick(() =>{
                            this.$refs.priceTable.updateVal(this.detail.productHotelPrices)
                        })
                    }
                }else{
                    this.$message.error(res.data.message);
                }
                this.viewLoading=false;
                
            })
        },
        goBooking(id){
            this.$router.push('/sellcenter/hotelBooking/'+id);
        }
    }
};
</script>

<style scoped lang="scss">
.mysapn {
  font-weight: bold;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 5px !important;
}
.vercitals {
  font-weight: bold;
  font-size: 20px;
}
.title-row{
    display:flex;
    align-items: center;
    .title{
        font-size: 18px;
        margin-right: 10px;
    }
    .address{
        margin-left: 10px;
    }
}

.half-button{
    display: inline-block;
    width: 98px;
    height: 40px;
    margin-left: 10px;
    border:1px solid #e6a23c;
    color: #e6a23c;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    border-radius: 4px;
    box-sizing: border-box;
    vertical-align: middle;
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
</style>

