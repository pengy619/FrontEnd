<template>
     <div class="view">
        <el-form  :inline="true" size="small" label-width="100px">
            <el-form-item label="缴款状态" label-width="80px">
                    <el-select size="small" v-model="FeeStatus" class="inputs">
                        <el-option v-for="(item,index) in feecheckstatusObj" :key="index" :value="item.key" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账单编号" label-width="80px">
                    <el-input class="inputs" v-model="PayNo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="缴款人" label-width="80px">
                    <el-input class="inputs" v-model="Payer" size="small"></el-input>
                </el-form-item>
                <el-form-item >
                <el-button type="warning"  icon="el-icon-search" size="small" @click="getSearchFinaceCheck">搜索</el-button>
            </el-form-item> 
        </el-form>
        
        <el-row class="margin_bottom">
            <el-button @click="handleExport"  size="small">导出Excel</el-button>
        </el-row>
        <div>
            <el-table :data="finacechecktabledata"  size="small" v-loading="loading2" tooltip-effect="dark"
                         style="width: 100%">
                <el-table-column fixed="left" prop="payNo" align="center" size="small" label="账单编号"  >
                </el-table-column>
                <el-table-column prop="payDateFormat" align="center" size="small" label="缴款时间" >
                </el-table-column>
                <el-table-column prop="payMethodName" align="center" size="small" label="收款方式"  >
                </el-table-column>
                <el-table-column prop="payAmount" align="center"  size="small" label="缴款金额" >
                </el-table-column>
                <el-table-column prop="payChannel" align="center" size="small" label="缴款渠道">
                </el-table-column>
                <el-table-column prop="payer" align="center" size="small" label="缴款人" >
                </el-table-column>
                <el-table-column prop="remark" align="center" size="small" label="备注" >
                </el-table-column>
                <el-table-column prop="statusName" align="center" size="small" label="状态"  >
                </el-table-column>
                <el-table-column prop="confirmUser" align="center" size="small" label="确认人"  >
                </el-table-column>
                <el-table-column prop="confirmTimeFormat" align="center"  size="small" label="确认时间"  >
                </el-table-column> 
                <el-table-column label="操作" fixed="right" align="center" size="small" width="150">
                    <template slot-scope="scope">
                    <el-button type="text" size="small" @click="isShowcheck(scope.row)"> 账单明细</el-button>
                    <el-button type="text" v-if="scope.row.status ==1" size="small" @click="channelCheck(scope.row)"> 取消缴款</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" v-if="flag" label="状态代码"></el-table-column>
            </el-table>
          </div>
            <el-pagination class="pagination"
                @size-change="tableSizeChange"
                @current-change="tablecurrentchange"
                :current-page="tablepageindex"
                :page-sizes="[5,10,20,50]"
                :page-size="tablepagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabletotal">
            </el-pagination>
           <el-dialog title="账单明细" width="70%" v-loading="loadings" append-to-body :visible.sync="dialogTableVisible">
                <el-table :data="gridData" size="small" tooltip-effect="dark" style="100%">
                    <el-table-column type="index" size="small" label="序号" width="50"></el-table-column>
                    <el-table-column property="disSettleClientName" size="small" label="结算单位" ></el-table-column>
                    <el-table-column property="linkMan" label="联系人" size="small" width="100"></el-table-column>
                    <el-table-column property="feeNo" label="收款编号" size="small" ></el-table-column>
                    <el-table-column property="currency" label="币种" size="small" width="100"></el-table-column>
                    <el-table-column property="feeAmount" :formatter="fixmoney" label="收款金额" size="small" width="100"></el-table-column>
                     <el-table-column property="feeAmount" :formatter="fixmoney" label="财务确认金额" size="small" width="120"></el-table-column>
                    <el-table-column property="invoiceAmount" label="开票金额" size="small" width="100"></el-table-column>
                    <el-table-column property="feeMethodName" label="收款方式" size="small" width="100"></el-table-column>
                    <el-table-column property="feeDateFormat" label="收款时间" size="small" width="100"></el-table-column>
                    <el-table-column property="handler" label="收款人" size="small"></el-table-column>
                    <el-table-column prop="feeType" label="id" size="small" align="center" v-if="flag">
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="PageIndex"
                    :page-sizes="[5,10,20,50]"
                    :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-dialog>
     </div>
</template>

<script>
export default {
     data(){
        return{
            flag:false,
            loading2:false,
            dialogTableVisible:false,
            loadings:false,
            currentPage4:1,
            feecheckstatusObj:[],
            FeeStatus:"",//缴款状态
            PayNo:'',//账单编号
            Payer:'',//缴款人
            finacechecktabledata: [{
                payNo: '',//账单编号
                payDateFormat: '',//缴款时间
                payMethodName: '',//收款方式
                payAmount:'',//缴款金额
                payChannel:'',//缴款渠道
                payer:'',//缴款人
                remark:'',//备注
                statusName:'',//确认状态
                confirmUser:'',//确认人
                confirmTimeFormat:''//确认时间
            }],
            starttime:'',
            PageSize:10,//这里的分页属性给dialog用
            PageIndex:1,
            total:0,
            gridData:[{}],
            //这下面的分页属性给外层用
            tablepagesize:10,
            tablepageindex:1,
            tabletotal:0,  
        }
    },
    methods:{
        //导出
        handleExport(){
            let WEB_API=process.env.WEB_API;
            let url=WEB_API+"/StorePay/GetFinStoreToExcel?PageSize="+this.tablepagesize+"&PageIndex="+this.tablepageindex+"&FeeStatus="+this.FeeStatus+"&PayNo="+this.PayNo+"&Payer="+this.Payer;
            // +"&DisCompanyInfoId="
            window.location.href=url;
        //    this.shopHttp.get("/Finance/GetShopId").then(function(res){
        //         console.log(url+res.data)
        //         window.location.href=url+res.data;
        //     })
        },
        getFinacecheck(url){
            var _this = this;
            //console.log(this.starttime);
            _this.loading2 = true;
            _this.shopHttp.get("/StorePay/GetFinStorePayPageList?"+url).then(function(res){
                //console.log(res);
                if(res.data.isSuccess){
                    _this.finacechecktabledata = res.data.objects;
                    _this.tabletotal = res.data.total;
                }else{
                _this.$message("请求已缴款列表失败");
                }
                    _this.loading2 = false;
            }).catch(function(err){
                console.log(err);
                _this.loading2 = false;
                _this.$message("请求已缴款列表失败");
            });
        },
        getSearchFinaceCheck(){
            let url = "PageSize="+this.tablepagesize+"&PageIndex="+this.tablepageindex+"&FeeStatus="+this.FeeStatus+"&PayNo="+this.PayNo+"&Payer="+this.Payer;
            this.getFinacecheck(url);
        },
        getFinaceStatus(){
            var _this = this;
            _this.shopHttp.get("/StorePay/GetEnumFeeStatus").then(res=>{
            // console.log(res);
                if(res.data.isSuccess){
                    for(var i=0;i<res.data.objects.length;i++){
                    console.log(res.data.objects[i]);
                    if(res.data.objects[i].key != 0 && res.data.objects[i].key != 4){
                            _this.feecheckstatusObj.push(res.data.objects[i]);
                    }
                    }
                //_this.feecheckstatusObj = res.data.objects;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        isShowcheck(row){//账单明细
            console.log(row.id);
            if(!this.dialogTableVisible){
                this.dialogTableVisible = true;
                this.getShowCheck(row.id);
            }else{
                this.getShowCheck(row.id);
            }
            
        },
        getShowCheck(id){
            var _this = this;
            _this.loadings = true;
            _this.shopHttp.get("/StorePay/GetFinCustomerFeePageList?"+"PageSize="+this.PageSize+"&PageIndex="+this.PageIndex+"&StorePayId="+id).then(res=>{
                // console.log(res);
                if(res.data.isSuccess){
                    _this.total = res.data.total;
                    _this.gridData = res.data.objects;
                }
                _this.loadings = false;
            }).catch(err=>{
                console.log(err);
                _this.loadings = false;
            });
        },
        channelCheck(row){
            // console.log(row);
            var _this = this;
            _this.shopHttp.post("/StorePay/CancelStorePay",{Id:row.id}).then(res=>{
                // console.log(res);
                if(res.data.isSuccess){
                    _this.$message("操作成功");
                    this.getSearchFinaceCheck();
                }else{
                    _this.$message("操作失败，服务器返回错误");
                }
            }).catch(err=>{
                console.log(err);
                _this.$message("操作失败，服务器返回错误");
            })
        },
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.PageSize = val;
        this.isShowcheck();
        },
        handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.PageIndex = val;
        this.isShowcheck();
        },
        tableSizeChange(val){
        this.tablepagesize = val;
        this.getSearchFinaceCheck();
        },
        tablecurrentchange(val){
            this.tablepageindex = val;
            this.getSearchFinaceCheck();
        },
        // indexMethod(index) {
        //     return index * 1;
        // },
        fixmoney(val){
            if(val.feeType === 2){
                return "-"+val.feeAmount;
            }else{
                return val.feeAmount;
            }
            },
    },
    mounted:function(){
        this.getSearchFinaceCheck();
        this.getFinaceStatus();
    }
}
</script>

<style leng='scss' scoped>
</style>
