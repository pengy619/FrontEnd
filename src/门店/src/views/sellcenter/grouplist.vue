<template>
    <div class="view">
          <el-form :inline="true" size="small" label-width="80px">
              <el-form-item label="线路名称">
                  <el-input class="inputs" v-model="lineName" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
          
              <el-form-item size="small" label="出团日期">
                    <el-date-picker
                        v-model="startime"
                        id="startime"
                        type="date"  class="inputs"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始日期">
                        </el-date-picker>-
                        <el-date-picker
                        v-model="endtime"
                        id="endtime"
                        type="date"  class="inputs"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期">
                        </el-date-picker>
              </el-form-item>
              <el-form-item label="供应商">
                <el-input v-model='supplierName' ></el-input>
              </el-form-item>   
              <el-form-item label="线路类型" >
                  <el-select placeholder="请选择" class="inputs" clearable v-model="mlineType">
                      <el-option v-for="item in mlineTypeObj" :key="item.id"  :label="item.paramName" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>
                <el-form-item label="出发地点" >
                  <addressselect class="inputs" placeholder="请选择"  v-model="sourceCityId" @result="addressResult"></addressselect>
              </el-form-item>
              <el-form-item>
                  <el-button type="warning" icon="el-icon-search" @click="searchLineList">搜索</el-button>
                  <el-button  size="small" @click="changeGroupList">切换线路列表</el-button>
              </el-form-item>
              
          </el-form>
          <!-- <el-row :gutter="24" class="margin_bottom">
              <el-col>
                <el-button type="primary" size="small" @click="changeDialog">查看线路订单</el-button>
              </el-col>
          </el-row> -->
           <el-dialog title="线路订单" :visible.sync="dialogTableVisible" append-to-body  width="70%">
                <el-table :data="gridData" style="width:100%" v-loading='dialogloading'>
                    <el-table-column label="序号" type="index" :index="indexs" align="center" width="50"></el-table-column>
                    <el-table-column property="teamStatusDesc" align="center" label="出团状态" show-overflow-tooltip></el-table-column>
                    <el-table-column property="departureDateString" align="center" label="出团日期" show-overflow-tooltip></el-table-column>
                    <el-table-column property="orderNo" align="center" label="订单号" show-overflow-tooltip></el-table-column>
                    
                    <el-table-column property="quantity" align="center" label="人数" show-overflow-tooltip></el-table-column>
                    <el-table-column property="receivableFee" align="center" label="应收款" show-overflow-tooltip></el-table-column>
                     <el-table-column property="receivedFee" align="center" label="已收" show-overflow-tooltip></el-table-column>
                    <el-table-column property="unReceiveFee" align="center" label="未收" show-overflow-tooltip></el-table-column>
                    <el-table-column property="creationTimeString" align="center" label="下单日期" show-overflow-tooltip></el-table-column>
                    <el-table-column property="comment" align="center" label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-row class="mypage" :gutter="20">
                    <el-col :span="7">
                        <el-pagination class="pagination"
                            @size-change="handleDialogSizeChange"
                            @current-change="handleDialogIndexChange"
                            :current-page="dialogpageIndex"
                            :page-sizes="[5,10,20,50]"
                            :page-size="dialogpageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="dialogtotal">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-dialog>
          <el-table ref="multipleTable" v-loading="linelistloading" :data="linelisttabledata" size="small" tooltip-effect="dark"  style="width:100%">
              <el-table-column prop="lineNo" label="序号" size="small" align="center" width="55" fixed show-overflow-tooltip>
                  <template slot-scope="scope">
                       <el-radio v-model="linelisttabledata.lineId" :label="scope.row" @change="getId(scope.row)">&nbsp;</el-radio>
                  </template>
              </el-table-column>
              <el-table-column prop="statusDesc" label="状态" align="center"></el-table-column>
              <el-table-column prop="fullName" label="线路名称"  width="180" size="small"  align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="tripDays" label="天数"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="groupLineTypeName" label="线路类型"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="teamDate" label="出团日期" width="120" align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sourceCityNames" label="出发地"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="targetCityName" label="目的地"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="teamNo" label="团号"  align="center" size="small" width="120"></el-table-column>
              <el-table-column prop="foundNumberCount" label="计划人数"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="soldQuantity" label="已报名"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="reserveQuantity" label="预留位"  align="center" size="small" show-overflow-tooltip></el-table-column>
               <el-table-column prop="stockBalance" label="余位"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="linePrice" label="成人价"  align="center" size="small" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="supplierName" label="供应商"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" fixed="right"  size="small" align="center" width="155">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" @click="ViewProduct(scope.row)">查看</el-button>
                      <el-button type="text" size="small" @click="AddOrder(scope.row)">报名</el-button>
                      <el-button type="text" size="small" @click="AddReverse(scope.row)" :disabled ="!scope.row.showDestine">预留单</el-button>
                      <!-- <el-button type="text" size="small" @click="changeDialog">查看线路订单</el-button> -->
                  </template>
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
    </div>
</template>

<script>
import addressselect from "@/components/address-select";
export default {
  data() {
    return {
      linelistloading: false,
      dialogloading:false,
      startime: "", //开始时间
      endtime: "", //结束时间
      lineName: this.$route.query.lineName||'', //线路名称
      mlineType: "", //枚举线路类型
      sourceCityId: "", //出发地
      supplierName:'',
      currentPage4: 1,
      dialogTableVisible: false,
      mlineTypeObj: [{}],
      gridData: [{}],
      DateDetailId: "",
      dateTeamDate: "",
      lineId: "",
      queryLineId: this.$route.query.lineId||'',
      productID:'',
      linelisttabledata: [
        {
          lineId: 1,
          statusDesc: "", //状态
          fullName: "", //线路名称
          tripDays: "", //天数
          groupLineTypeName: "", //线路类型
          teamDate: "", //出团日期
          sourceCityNames: "长沙", //出发地
          teamNo: "", //团号
          foundNumberCount: "", //计划人数
          soldQuantity: "", //已报名
          reserveQuantity: "", //预留位
          stockBalance: "", //余位
          //linePrice:"",//成人价
          supplierName: "" //供应商
        }
      ],
      PageSize: 10,
      PageIndex: 1,
      total: 0,
      dialogpageSize:10,
      dialogpageIndex:1,
      dialogtotal:0
    };
  },
  components: {
    addressselect
  },
  mounted: function() {
    this.getLineList();
    this.getLineType();
  },
  methods: {
    getLineList() {
      //获取总数据
      var _this = this;
      // let url = "PageSize=" + this.PageSize + "&PageIndex="+this.PageIndex+"&LineName="+ this.lineName+"&TeamDateFrom="+(this.startime||'')+"&TeamDateEndForm="+(this.endtime||'')+"&EnumGroupLineType="+this.mlineType+"&SourceCityID="+ this.sourceCityId+"&LineId="+ this.queryLineId;
      _this.linelistloading = true;
      _this.linelisttabledata = [{}];
      _this.shopHttp.post("/GroupLine/GetGroupLineProductStockList",{
            enumGroupLineType: this.mlineType,
            teamNo: this.teamNo,
            lineName: this.lineName,
            TeamDateFrom: this.startime||'',
            TeamDateEndForm: this.endtime||'',
            SourceCityID:this.sourceCityId,
            SupplierName:this.supplierName,
            PageSize: this.PageSize,
            PageIndex: this.PageIndex,
            lineId:this.queryLineId
      }).then(function(res) {
          //console.log(res);
          if (res.data.isSuccess) {
            _this.PageSize = res.data.pageSize;
            _this.PageIndex = res.data.pageIndex;
            _this.total = res.data.total;
            _this.linelistloading = false;
            _this.linelisttabledata = res.data.objects;
          } else {
            _this.linelistloading = false;
             _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
          }
        })
        .catch(function(err) {
          _this.linelistloading = false;
           _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
        });
    },
    searchLineList() {
      //搜索
      this.queryLineId='';
      this.getLineList();
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.PageSize = val;
      this.pageIndex = 1;
      this.searchLineList();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.PageIndex = val;
      this.searchLineList();
    },
    handleDialogSizeChange(val){
       this.dialogpageSize = val;
       this.dialogpageIndex = 1;
       this.dialogpagelist();
    },
    handleDialogIndexChange(val){
        this.dialogpageIndex = val;
        this.dialogpagelist();
    },
    getId(val) {
      //单选按钮  获取数据
      this.DateDetailId = val.dateDetailId;
      
      this.lineId = val.lineId;
      this.dateTeamDate = val.dateTeamDate;
      this.productID = val.productID;
    },
    changeDialog() {
      if(this.DateDetailId === ''){
            this.$message("请选择一条旅游路线");
        }else{
              if(this.lineId != null && this.lineId != "" && this.dateTeamDate != null && this.dateTeamDate != ''){
                 this.dialogpagelist();
              }else{
                  this.$message("请选择一条正确的旅游路线");
              }
        }
    },
    dialogpagelist(){
      if(!this.dialogTableVisible){
        this.dialogTableVisible = true;
        // this.getShowCheck(row.id);
        this.getProductLineList();
      }else{
        //  this.getShowCheck(row.id);
          this.getProductLineList();
      }
    },
    getProductLineList(){
        var _this = this;
        _this.dialogloading = true;
        _this.shopHttp.post('/GroupLine/GetProductIDGroupLineOrderList',{LineId:_this.lineId,DepartureDate:_this.dateTeamDate,PageSize:_this.dialogpageSize,PageIndex:_this.dialogpageIndex}).then(res=>{
            //console.log(res);
            if(res.data.isSuccess){
              _this.gridData = res.data.objects;
              _this.dialogtotal = res.data.total;
            }else{
              _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
            }
            _this.dialogloading = false;
        }).catch(err=>{
            console.log(err);
            _this.dialogloading = false;
             _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
        });
    },
    //切换线路列表
    changeGroupList(){
       this.$router.push({path:'/sellcenter/linelist'});
    },
    addressResult(val){//获取城市ID
       //console.log(val.second.id);
       this.sourceCityId = val.second.id;
    },
    getLineType() {
      //获取线路类型
      var _this = this;
      _this.shopHttp
        .post("/GroupLine/GetGroupLineParamList", {
          paramType: 4,
          PageSize: 100,
          PageIndex: 1
        })
        .then(function(res) {
          if (res.data.isSuccess) {
            _this.mlineTypeObj = res.data.objects;
          } else {
             _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
          }
        })
        .catch(function(err) {
           _this.$message({
                type:'error',
                message: "出错了！" + res.data.message
              });
        });
    },
    indexs(index){
      return index * 1 +1;
    },
    AddOrder(val) {
      this.$router.push({name:'baoming',query:val});
    },
    AddReverse(row){
        this.$router.push({path:'/grouptour/addReverse',name:'addReverse',params:{DateDetailId:row.dateDetailId,lineid:row.lineId,DepartureDate:row.dateTeamDate}});
    },
    ViewProduct(row) {
      //打开订单详情页
      this.$router.push({
        path: "/sellcenter/linedetails",
        //query: { lineId: row.lineId,teamNo:row.teamNo}
        query: row
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
