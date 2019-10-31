<template>
    <div class="view">
        <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="订单状态" >
                <el-select placeholder="请选择" v-model="query.EnumOrderStatus" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="预订" value="1"></el-option>
                    <el-option label="退订" value="3"></el-option>
                    <el-option label="已取消" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付状态" >
                <el-select placeholder="请选择" v-model="query.EnumPaymentStatus" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未付款" value="0"></el-option>
                    <el-option label="部分付款" value="1"></el-option>
                    <el-option label="已付款" value="2"></el-option>
                    <el-option label="部分退款" value="3"></el-option>
                    <el-option label="已退款" value="4"></el-option>
                    <el-option label="已完成" value="5"></el-option>
                    <el-option label="已取消" value="6"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="订单时间" >
                <el-radio-group v-model="query.SearchDateType">
                    <el-radio label="1">下单时间</el-radio>
                    <el-radio label="2">入住时间</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" >
                <el-date-picker
                v-model="other.searchDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="订单搜索" >
                <el-radio-group v-model="query.SearchType">
                    <el-radio label="1">订单号</el-radio>
                    <el-radio label="2">产品名称</el-radio>
                    <el-radio label="3">酒店名称</el-radio>
                    <el-radio label="6">入住人和入住人电话</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" >
                <el-input v-model="query.KeyWord"></el-input>
            </el-form-item>
            <el-form-item label="" >
                <el-button type="primary" size="small" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        
        <div class="margin_bottom">
            <el-button @click="handleBills" :disabled="flag" type="primary" size="small" >申请对账</el-button>
            <el-button class="margin_right" @click="exportExcel" :loading="other.exportLoading" type="primary" size="small" icon="el-icon-printer" >订单导出</el-button>
            <span>合计：</span>
            <span>订单数：{{list.total}}，</span>
            <span>订单金额：{{list.orderAmountSum}}，</span>
            <span>已收金额：{{list.orderReceivedSum}}</span>
        </div>
        <el-table
            :data="list.data"
            style="width: 100%" v-loading="list.loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30" fixed></el-table-column>
            <el-table-column prop="enumOrderStatusString" label="订单状态">
            </el-table-column>
            <el-table-column prop="payStatuString" label="支付状态" >
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号"  >
            </el-table-column>
            <el-table-column prop="creationTimeString" label="下单时间"  >
            </el-table-column>
            <el-table-column prop="hotelName" label="酒店名称">
            </el-table-column>
            <el-table-column prop="productName" label="商品名称">
            </el-table-column>
            <el-table-column prop="checkInDateString" label="住宿时间" >
                <template slot-scope="scope">
                    <div>入住：{{scope.row.checkInDateString}}</div>
                    <div>离店：{{scope.row.checkOutDateString}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="roomCount" label="房间数" width="80">
            </el-table-column>
            <el-table-column prop="travelersJson" label="入住人">
                <template slot-scope="scope">
                    {{getTravelers(scope.row.travelersJson)}}
                    <div>{{getTravelersPhone(scope.row.travelersJson)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="订单金额">
                <template slot-scope="scope">
                    ￥{{scope.row.orderAmount}}
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="订单来源">
            </el-table-column>
            <el-table-column label="操作" width="120px" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="goDetail(scope.row.orderId)">查看</el-button>
                    <el-button size="mini" type="text" :disabled="!(scope.row.paymentType==1&&!scope.row.supplierConfirm&&scope.row.payStatus == 0)" @click="handleResourceComfirme(scope.row.orderId)">资源确认</el-button>
                    <el-row style="font-size:12px;">
                        <span v-if="scope.row.showSupplierConfirm&&scope.row.paymentType==1" class="success">供应商已确认</span>
                        <span v-if="scope.row.showBranchConfirm&&scope.row.paymentType==1" class="success" style="margin-left:10px;">分部已确认</span>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
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
            list:{
                loading:false,
                orderAmountSum:'',
                orderReceivedSum:'',
                orderPaidSum:'',
                total:'',
                data:[]
            },
            query:{
                PageSize:10,
                PageIndex:1,
                EnumOrderStatus:'',
                EnumPaymentStatus:'',
                SearchDateType:'1',
                CheckInDate:'',
                CheckOutDate:'',
                SearchType:'1',
                KeyWord:'',
            },
            other:{
                searchDate:[],
                exportLoading:false
            },
            orderIds: [],
            flag: true,
            BillsList: [],
            //分页
            pagination: {
                sizes: [5, 10, 20, 50],
                size: 10,
                currentPage: 1,
                total: 0
            }
        };
    },
    watch:{
        'other.searchDate':function(val){
            if(val){
                this.query.CheckInDate=val[0]
                this.query.CheckOutDate=val[1]
            }else{
                this.query.CheckInDate=''
                this.query.CheckOutDate=''
            }
            
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleSelectionChange(val) {//选中的数据存储
            this.orderIds = [];
            this.BillsList = val;
            this.flag = false;
            if (this.BillsList.length == 0) {
                this.flag = true;
            } else {
                for (let i = 0; i < this.BillsList.length; i++) {
                    this.orderIds.push(this.BillsList[i].orderId)
                        if (!this.BillsList[i].handBill) {
                        this.flag = true;
                        return;
                    }
                }
            }
        },
        handleBills() {
            this.groupHttp.post('/FinApplyBill/CreateSupplierBillHotel', { 'OrderId': this.orderIds })
            .then(res => {
                if (res.data.isSuccess) {
                    this.$message({
                        type: 'success',
                        message: '申请对账成功'
                    });
                    this.getList();
                }else {
                    this.$message({
                        type: 'info',
                        message: res.data.message
                    });
                }
            });
        },
        //资源确认
        handleResourceComfirme(id){
            this.$confirm('是否确认该资源?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.groupHttp.post('/HotelOrder/HotelResourceSupplierConfirm',{
                    OrderId:id
                })
                .then((res)=>{
                    if (res.data.isSuccess) {
                        this.$message({
                            type: 'success',
                            message: '资源确认成功!'
                        });
                        this.getList();
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                
            }).catch(() => {
                    
            });
        },
        getList() {
            //获取酒店订单列表
            this.list.loading=true
            this.groupHttp.get('/HotelOrder/GetHotelOrderPageList',{
                params:this.query
            })
            .then((res)=>{
                this.list.loading=false
                if (res.data.isSuccess) {
                    this.list.orderAmountSum=res.data.orderAmountSum
                    this.list.orderReceivedSum=res.data.orderReceivedSum
                    this.list.orderPaidSum=res.data.orderPaidSum
                    this.list.total=res.data.total
                    this.pagination.total=res.data.total
                    this.list.data=res.data.objects
                } else {
                    this.$message.error(res.data.message);
                }
            })
            .catch((err)=> {

            });
        },
        getTravelers(data){
            if(data){
                data=data.replace(/\'/g,"\"")
                data=JSON.parse(data)
                return data[0].TravelerName
            }else{
                return ""
            }
        },
        getTravelersPhone(data){
            if(data){
                data=data.replace(/\'/g,"\"")
                data=JSON.parse(data)
                return data[0].TravelerPhone
            }else{
                return ""
            }
        },
        sizeChange(size){
            this.query.PageSize=size
            this.getList()
        },
        currentPageChange(page){
            this.query.PageIndex=page
            this.getList()
        },
        exportExcel(){
            this.groupHttp.get('HotelOrder/GetSupplierId')
            .then((res)=>{
                let downLoadUrl=process.env.WEB_API+`/HotelOrder/ExcelHotelOrderPageList?SupplierId=${res.data}&EnumOrderStatus=${this.query.EnumOrderStatus}&EnumPaymentStatus=${this.query.EnumPaymentStatus}&SearchDateType=${this.query.SearchDateType}&CheckInDate=${this.query.CheckInDate}&CheckOutDate=${this.query.CheckOutDate}&SearchType=${this.query.SearchType}&KeyWord=${this.query.KeyWord}&PageSize=${this.query.PageSize}&PageIndex=${this.query.PageIndex}`
                let iframe=document.createElement('iframe')
                iframe.src=downLoadUrl
                iframe.style.display='none'
                document.body.append(iframe)
            })
            .catch((err)=> {

            });
            
        },
        goDetail(id){
            this.$router.push({name:'hotelOrderDetail',query:{orderId:id}});
        },
        
    }
};
</script>

<style lang="scss" scoped>
</style>
