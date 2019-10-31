<template>
  <div class="view" v-loading="!detail" style="min-height:700px">
        <div v-if="detail">
            <h4><span class="vercitals">| </span>酒店信息</h4>
        <h3>{{detail.hotelName}}</h3>
        <p>地址：{{detail.hotelAddress}}</p>
        <h4><span class="vercitals">| </span>订单信息</h4>
        <el-table   :data="tableList" border >
            <el-table-column  prop="costPrice" label="同行结算价" align="center" >
            </el-table-column>
            <el-table-column  prop="retailSalesPrice" label="直客销售价" align="center" >
            </el-table-column>
            <el-table-column  prop="customerPrice" label="媒体外卖价" align="center" >
            </el-table-column>
            <el-table-column  prop="receivableFee" label="应收" align="center"  >
            </el-table-column>
            <el-table-column  prop="receivedFee" label="已收" align="center" >
            </el-table-column>
            <el-table-column  prop="incentiveValue" label="销售激励" align="center" >
            </el-table-column>
            <el-table-column  prop="promotionValue" label="推广费" align="center" >
            </el-table-column>
        </el-table>
        <h4><span class="vercitals">| </span>房型信息</h4>
        <el-form >
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="床型名称" size="small" label-width="100px">
                        {{JSON.parse(detail.roomInfoJson).RoomName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="床型" size="small" label-width="100px">
                        <span style="margin-right:5px" v-for="(item,index) in JSON.parse(detail.roomInfoJson).BedInfo" :key="index">{{item}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="宽带" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.roomInfoJson).HasNetwork}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="楼层" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.roomInfoJson).Floor}}层</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="面积" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.roomInfoJson).Area}}平方米</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h4><span class="vercitals">| </span>预订信息</h4>
        <el-form >
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="入住日期" size="small" label-width="100px">
                        <span>{{detail.checkInDate.split('T')[0]}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="离店日期" size="small" label-width="100px">
                        <span>{{detail.checkOutDate.split('T')[0]}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="房间数" size="small" label-width="100px">
                        <span>{{detail.roomCount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="每间入住" size="small" label-width="100px">
                        <span>{{detail.stayCount}}人</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="早餐" size="small" label-width="100px">
                        <span>{{detail.breakfastType}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="加床" size="small" label-width="100px">
                        <span>{{detail.addBedCount}}张</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="加早" size="small" label-width="100px">
                        <span>{{detail.addbreakfast}}份</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col>
                    <el-form-item label="特殊要求" size="small" label-width="100px">
                        <span>{{detail.remark}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h4><span class="vercitals">| </span>客户信息</h4>
        <el-form >
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="客户名称" size="small" label-width="100px">
                        <span>{{detail.customerName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="联系人" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.customerJson).LinkMan}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="联系电话" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.customerJson).LinkMobile}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="QQ" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.customerJson).LinkQQ}}</span>
                    </el-form-item> 
                </el-col>
                <el-col :span="10">
                    <el-form-item label="Email" size="small" label-width="100px">
                        <span>{{JSON.parse(detail.customerJson).LinkEmail}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h4><span class="vercitals">| </span>入住人信息</h4>
        <el-form>
            <el-row :gutter="20" v-for="(item,index) in JSON.parse(detail.travelersJson)" :key="index">
                <el-col :span="5">
                    <el-form-item :label="'住客姓名'+(index+1)" size="small" label-width="100px">
                        <span>{{item.TravelerName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="联系方式" size="small" label-width="100px">
                        <span>{{item.TravelerPhone}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="margin_top text-center">
            <el-button class="mbackbtn" size="small" @click="back">返回</el-button>
        </el-row>        
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            detail:null,
            tableList:[]
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getDetail(){
            this.groupHttp.post('HotelOrder/GetHotelOrderDetailInfoByOrderId',{
                OrderId:this.$route.query.orderId
            })
            .then(res=>{
                if(res.data.isSuccess){
                    this.detail=res.data.object;
                    let tableList={
                        customerPrice:this.detail.customerPrice,
                        costPrice:this.detail.costPrice,
                        retailSalesPrice:this.detail.retailSalesPrice,
                        incentiveValue:this.detail.incentiveValue,
                        receivableFee:this.detail.receivableFee,
                        receivedFee:this.detail.receivedFee,
                        promotionValue:this.detail.promotionValue,
                    };
                    this.tableList.push(tableList)
                }else{
                    this.$message.error(res.data.message)
                }
            })
            .catch(err=>{

            })
        },
        back() {
            this.$router.go(-1);
        },
    }
};
</script>

<style scoped lang="scss">
</style>

