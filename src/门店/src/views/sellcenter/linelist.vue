<template>
    <div class="view">
          <el-form :inline="true" size="small" label-width="80px">
              <el-form-item label="线路名称" >
                  <el-input  v-model="lineName" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="线路编号" >
                  <el-input  v-model="lineNum" clearable placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="线路类型" >
                  <el-select placeholder="请选择"  clearable v-model="mlineType">
                      <el-option v-for="item in mlineTypeObj" :key="item.id"  :label="item.paramName" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>
              <br>
              <el-form-item label="供应商">
                <el-input v-model='supplierName' ></el-input>
              </el-form-item>   
              <el-form-item>
                  <el-button type="warning" icon="el-icon-search" @click="getLineList()">搜索</el-button>
                  <el-button  size="small" @click="changeGroupList">切换团期列表</el-button>
              </el-form-item>
          </el-form>
          <el-row :gutter="24" class="margin_bottom">
              <el-col>
                <!-- <el-button type="primary" size="small" @click="AddOrder">报名</el-button>
                <el-button type="primary" size="small" @click="AddReverse">预留单</el-button> -->
                <el-button type="primary" size="small" @click="changeDialog">查看线路订单</el-button>
              </el-col>
          </el-row>
      
            <!-- <div  class="btnmargintop" style="margin-bottom:10px">
              <el-button type="primary" size="small" @click="AddOrder">报名</el-button>
              <el-button type="primary" size="small" @click="AddReverse">预留单</el-button>
              <el-button type="primary" size="small" @click="changeDialog">查看线路订单</el-button>
            </div> -->
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
              <el-table-column prop="lineCode" label="线路编号" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="supplierName" label="供应商" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fullName" label="线路名称"  width="180" size="small"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button type="text" @click="ViewProduct(scope.row)">{{scope.row.fullName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="groupLineTypeName" label="线路类型"  align="center" size="small" ></el-table-column>
              <el-table-column prop="enumGroupLineModeDesc" label="组团方式" width="120" align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="tripDays" label="行程总天数"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sourceCityNames" label="出发地"  align="center" size="small" show-overflow-tooltip></el-table-column>
              <el-table-column prop="targetCityName" label="目的地"  align="center" size="small" width="120"></el-table-column>
              <el-table-column  label="销售激励"  align="center" size="small">
                  <template slot-scope="scope">
                      <span v-if="scope.row.encourageType===1">{{scope.row.encourageValue?(scope.row.encourageValue+scope.row.encourageTypeUnit):0}}</span>
                      <span v-else-if="scope.row.encourageType===2">{{scope.row.encourageValue?(scope.row.encourageValue+scope.row.encourageTypeUnit):0}}</span>
                      <div v-else-if="scope.row.encourageType===0">
                        <div>成人：{{scope.row.encourageValue?scope.row.encourageValue:0}}</div>
                        <div>老人：{{scope.row.encourageElderValue?scope.row.encourageElderValue:0}}</div>
                        <div>儿童：{{scope.row.encourageChildValue?scope.row.encourageChildValue:0}}</div>
                      </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right"  size="small" align="center" width="155">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" @click="ViewProduct(scope.row)">线路详情</el-button>
                      <el-button type="text" size="small" @click="changeGroupList(scope.row)">团期计划</el-button>
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
      lineName: "", //线路名称
      mlineType: "", //枚举线路类型
      lineNum: "", //线路编号
      supplierName:'',
      currentPage4: 1,
      dialogTableVisible: false,
      mlineTypeObj: [{}],
      gridData: [{}],
      DateDetailId: "",
      dateTeamDate: "",
      lineId: "",
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
    this.getLineType();
    this.getLineList();
  },
  methods: {
    getLineList(pageIndex=1) {
      //获取总数据
      var _this = this;
      _this.linelistloading = true;
      _this.linelisttabledata = [{}];
      // let url = "PageSize=" + this.PageSize + "&PageIndex="+this.PageIndex+"&LineName="+ 
      // this.lineName+"&EnumGroupLineType="+this.mlineType+"&LineNo="+ this.lineNum+"&SupplierName="+ this.supplierName;
      _this.shopHttp.post("/GroupLine/GetGroupLineList" ,{
        PageSize:this.PageSize,
        PageIndex:pageIndex,
        EnumGroupLineType:this.mlineType,
        LineNo:this.lineNum,
        SupplierName:this.supplierName,
        LineName:this.lineName
      }).then(function(res) {
          if (res.data.isSuccess) {
            _this.total = res.data.total;
            _this.linelistloading = false;
            _this.linelisttabledata = res.data.objects;
          } else {
            _this.linelistloading = false;
            _this.$message("线路列表请求失败");
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.linelistloading = false;
          _this.$message("线路列表请求失败");
        });
    },
    changeGroupList(row){
       this.$router.push({path:'/sellcenter/grouplist',query:{lineId:row.lineId,lineName:row.fullName}});
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.getLineList(this.PageIndex);
    },
    handleCurrentChange(val) {
      this.PageIndex = val;
      this.getLineList(this.PageIndex);
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
        _this.shopHttp.post('/GroupLine/GetGroupLineOrderListByLineId',{LineId:_this.lineId,PageSize:_this.dialogpageSize,PageIndex:_this.dialogpageIndex}).then(res=>{
            //console.log(res);
            if(res.data.isSuccess){
              _this.gridData = res.data.objects;
              _this.dialogtotal = res.data.total;
            }else{
              _this.$message("线路订单请求失败");
            }
            _this.dialogloading = false;
        }).catch(err=>{
            console.log(err);
            _this.dialogloading = false;
            _this.$message("线路订单请求失败");
        });
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
            _this.$message("获取线路类型失败");
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$message("获取线路类型失败");
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
