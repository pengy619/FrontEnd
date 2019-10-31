<template>
    <div class="view">
        <el-form size="small" :inline="true"  label-width="100px">
            <el-form-item label="酒店类型">
                <el-select placeholder="请选择" v-model="form.params.HotelsType" clearable>
                    <el-option v-for="item in form.hotelTypeOptions" :label="item.value" :value="item.key" v-bind:key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售状态" >
                <el-select placeholder="请选择" v-model="form.params.Status" clearable>
                    <el-option v-for="item in form.hotelProductStatus" :label="item.value" :value="item.key" v-bind:key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属城市">
                <el-input  v-model="form.params.CityName"></el-input>
            </el-form-item>
            <el-form-item label="酒店名称">
                <el-input  v-model="form.params.HotelName"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input  v-model="form.params.SupplierName"></el-input>
            </el-form-item>
            <el-form-item label="商品编号">
                <el-input  v-model="form.params.ProductNo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click='getList'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
            酒店数 <span class="danger">{{hotelNumber}}</span>，房型数 <span class="danger">{{productNumber}}</span>
        </el-row>
        <el-row v-loading ='form.loading' style="min-height:300px;" >
            <el-row class="no-product" v-if="list.length<=0&&form.loading==false">
                没有酒店商品，去发布吧~
            </el-row>   
            <el-row v-else class="margin_bottom" v-for="(item,index) in list" :key="'m'+index">
                <el-row type="flex">
                    <img :src="item.hotelMainPicture" class="main-img"/>
                    <div class="margin_left right-hotel">
                        <div class="p1">
                            <span class="title" @click="goHotelDetail(item.hotelId)">{{item.hotelName}} </span>
                            <span class="title margin_left_10" v-if="item.englishHotelName">{{item.englishHotelName}} </span>
                            <span class="margin_left_10">
                                <el-rate
                                style="display:inline"
                                v-model="item.starRated"
                                disabled>
                                </el-rate>
                            </span>
                            <span class="margin_left_10" v-bind:class="item.status==3?'ylt-notinfo':'ylt-notinfo1'">{{item.statusStr}}</span>
                        </div>
                        <div class="p2">
                            <i class="icon iconfont icon-dingwei"></i>{{item.address}}
                        </div>
                    </div>
                </el-row>
                <el-row class="margin_top">
                    <el-table :data="item.minProudcts">
                        <el-table-column  prop="productNO" label="商品编号" > </el-table-column>
                        <el-table-column  prop="productName" label="商品名称" > </el-table-column>
                        <el-table-column  prop="roomName" label="房型"> </el-table-column>
                        <el-table-column  prop="supplierName" label="供应商名称" ></el-table-column>
                        <el-table-column  prop="promotionValue" label="推广费" width="80" >
                            <template slot-scope="scope">
                                {{scope.row.promotionValue}}{{scope.row.promotionTypeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="incentiveValue" label="激励" width="80">
                            <template slot-scope="scope">
                                {{scope.row.incentiveValue}}{{scope.row.incentiveTypeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="costPrice" label="同行结算价" >
                            <template slot-scope="scope">
                                ￥{{scope.row.costPrice||0}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="statusStr" label="销售状态" > </el-table-column>
                        <el-table-column  label="操作" fixed="right" width='150'>
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="goHotelRoomDetail(scope.row)" >查看详情</el-button>
                                <el-button type="text" size="mini" @click="openCheckDialog(scope.row,index,scope.$index)" v-if="scope.row.status==1">审核</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div class="text-center view-room margin_top" @click="showMoreRoom(index)"><el-button type="text">{{item.showMore?'收起':'显示全部'}}</el-button></div>
            </el-row>
        </el-row>
        <el-pagination
            class="pagination"
            fixed="right"
            :data = 'pagination'
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>

        <el-dialog title="审核" :visible.sync="check.dialogShow"  width="30%" >
            <el-form  label-width="120px" class="demo-ruleForm" size="small">
				<el-form-item label="审核状态">
					<el-radio-group v-model="check.status">
                        <el-radio :label="true">通过</el-radio>
                        <el-radio :label="false">拒绝</el-radio>
                    </el-radio-group>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="check.dialogShow = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleCheck" :loading="check.btnLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form:{
                    hotelTypeOptions:[],
                    hotelProductStatus:[{key:3,value:'已上架'},{key:4,value:'未上架'},{key:1,value:'待审核'},{key:5,value:'已拒绝'},{key:0,value:'草稿'}],
                    params:{
                        CityName:'',
                        HotelName:'',
                        SupplierName:'',
                        ProductNo:'',
                        HotelsType:'',
                        Status:'',
                        PageSize:10,
                        PageIndex:1,
                    },
                    loading:true
                },
                list:[],
                check:{
                    currentItem:null,
                    status:true,
                    dialogShow:false,
                    btnLoading:false,
                },
                productNumber:0,
                hotelNumber:0,
                //分页
                pagination: {
                    sizes: [5, 10, 20, 50],
                    size: 10,
                    currentPage: 1,
                    total: 0
                }
            }
        },
        mounted(){
            this.getHotelType()
            // this.getHotelProductStatus()
            this.getList()
        },
        methods:{
            getList(){
                this.form.loading=true
                this.groupHttp.get('HotelProduct/GetHotelProductList',{
                    params:this.form.params
                }).then((res)=>{
                    this.form.loading=false
                    this.list=res.data.objects
                    this.pagination.total=res.data.total
                    this.hotelNumber=res.data.hotelNumber
                    this.productNumber=res.data.productNumber

                    this.list.forEach((item,index) => {
                        item.minProudcts=item.proudcts.slice(0,5)
                        item.showMore=false
                    });
                })
            },
            getHotelType(){
                this.groupHttp.get('HotelProduct/GetHotelType')
                .then((res)=>{
                    this.form.hotelTypeOptions=res.data.objects
                })
            },
            getHotelProductStatus(){
                this.groupHttp.get('HotelProduct/GetHotelProductStatus')
                .then((res)=>{
                    this.form.hotelProductStatus=res.data.objects
                })
            },
            sizeChange(size){
                this.form.params.PageSize=size
                this.getList()
            },
            currentPageChange(page){
                this.form.params.PageIndex=page
                this.getList()
            },
            showMoreRoom(index){
                if(this.list[index].showMore){
                    this.list[index].minProudcts=this.list[index].proudcts.slice(0,5)
                }else{
                    this.list[index].minProudcts=this.list[index].proudcts
                }
                this.$set(this.list,index, this.list[index])
                this.list[index].showMore=!this.list[index].showMore
            },
            openCheckDialog(item,i,m){
                this.check.currentItem=item
                this.check.currentItem.i=i
                this.check.currentItem.m=m
                this.check.dialogShow=true

            },
            handleCheck(){
                this.check.btnLoading=true
                this.groupHttp.post('HotelProduct/ApproveHotelProduct',{
                    ProductId:this.check.currentItem.id,
                    Status:this.check.status
                })
                .then((res)=>{
                    this.check.btnLoading=false
                    this.check.dialogShow=false
                    if(res.data.isSuccess){
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error('审核失败，原因：'+res.data.message);
                    }
                    this.list[this.check.currentItem.i].minProudcts[this.check.currentItem.m].statusStr=res.data.statusStr
                    this.list[this.check.currentItem.i].minProudcts[this.check.currentItem.m].status=res.data.status
                    this.$set(this.list,this.check.currentItem.i, this.list[this.check.currentItem.i])
                })
            },
            goHotelDetail(id){
                this.$router.push('/hotel/hotelProductDetail/'+id)
            },
            goHotelRoomDetail(row){
                this.$router.push('/hotel/hotelProductRoomDetail/'+row.id)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .view-room{
        padding: 5px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        cursor: pointer;
    }
    .right-hotel{
        position: relative;
    }
    .hotel-operation{
        position: absolute;
        left: 0;
        bottom: 0;
        white-space: nowrap;
    }
    .main-img{
        width: 205px;
        height: 115px;
    }
    .icon-xing {
        color: #e5e5e5;
    }
    .icon-xing.active {
        color: #f0ae4e;
    }
    .p1 .title{
        font-size: 16px;
        color: #3bb4f2;
        cursor: pointer;
    }
    .p2{
        margin-top: 5px;
        color: #999;
    }
    .p2 .iconfont{
        color: #3bb4f2;
    }
    .ylt-notinfo {
        border-radius: 30px;
        background-color: #e9f8f3;
        color: #40dba1;
        padding: 2px 10px;
    }

    .ylt-notinfo1 {
        border-radius: 30px;
        background-color: #FFFAF4;
        color: #F37B1D;
        padding: 2px 10px;
    }
    .no-product{
        font-size: 18px;
        text-align: center;
        padding:15px;
    }
</style>
