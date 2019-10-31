<template>
  <div class="view">
    <el-form :inline="true" size="small" label-width="80px">
      <el-form-item label="线路名称">
        <el-input v-model="lineName" clearable placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="线路编号">
        <el-input v-model="lineNum" clearable placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="线路主题">
        <el-select placeholder="请选择" clearable v-model="theme" filterable>
          <el-option
            v-for="item in themeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出团日期">
        <el-date-picker v-model="departureDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="出发地">
        <el-select placeholder="请选择" clearable v-model="startCity" filterable>
          <el-option
            v-for="item in cityList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的地">
        <el-input v-model="endCity"></el-input>
      </el-form-item>
      <el-form-item label="线路类型">
        <el-select placeholder="请选择" clearable v-model="mlineType"  @change="changeLineId">
          <el-option
            v-for="item in mlineTypeObj"
            :key="item.id"
            :label="item.name"
            :value="item.id"
           
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="supplierName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" icon="el-icon-search" @click="getLineList()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="linelistloading"
      :data="linelisttabledata"
      size="small"
      tooltip-effect="dark"
      style="width:100%"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="productNo" label="线路编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="productName"
        label="线路名称"
        width="150"
        size="small"
        align="center"
        show-overflow-tooltip
      >
      <template slot-scope="scope">
        <el-button type="text" @click="ViewProduct(scope.row)">{{scope.row.productName}}</el-button>
      </template>
      </el-table-column>
      <el-table-column   
        prop="dateCh"
        label="团期"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="theme"
        label="线路主题"
        align="center"
        size="small"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="days"
        label="行程总天数"
        align="center"
        width="80"
        size="small"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="startCity"
        label="出发地"
        align="center"
      ></el-table-column>
        <el-table-column
        prop="endCities"
        label="目的地"
        align="center"
      ></el-table-column>
      <el-table-column label="门市价" align="center">
        <template slot-scope="scope">
          ￥{{scope.row.minMarkPrice}}起
        </template>
      </el-table-column>
       <el-table-column prop="minSettlementPrice" label="结算价" align="center" sortable>
        <template slot-scope="scope">
          <span style="color:red">￥{{scope.row.minSettlementPrice}}起</span>
        </template>
      </el-table-column>
       <el-table-column prop="createTime" label="创建日期" align="center" sortable>
      </el-table-column>
      <!-- <el-table-column label="销售激励" align="center" size="small">
        <template slot-scope="scope">
          <span
            v-if="scope.row.encourageType===1"
          >{{scope.row.encourageValue?(scope.row.encourageValue+scope.row.encourageTypeUnit):0}}</span>
          <span
            v-else-if="scope.row.encourageType===2"
          >{{scope.row.encourageValue?(scope.row.encourageValue+scope.row.encourageTypeUnit):0}}</span>
          <div v-else-if="scope.row.encourageType===0">
            <div>成人：{{scope.row.encourageValue?scope.row.encourageValue:0}}</div>
            <div>老人：{{scope.row.encourageElderValue?scope.row.encourageElderValue:0}}</div>
            <div>儿童：{{scope.row.encourageChildValue?scope.row.encourageChildValue:0}}</div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" size="small" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="ViewProduct(scope.row)">线路详情</el-button>
          <el-button type="text" size="small" @click="ViewReservation(scope.row)">立即预订</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="PageIndex"
      :page-sizes="[5,10,20,50]"
      :page-size="PageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import addressselect from "@/components/address-select";
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      sortOrder:'CreateTime',
      asc:false,
      linelistloading: false,
      dialogloading: false,
      departureDate: "",
      startCity:'', //出发地
      theme:'', //线路主题
      lineName: "", //线路名称
      mlineType: "", //枚举线路类型
      lineNum: "", //线路编号
      endCity:"",
      themeList:[],
      cityList:[],
      supplierName: "",
      currentPage4: 1,
      dialogTableVisible: false,
      mlineTypeObj: [{id:'',name:'全部'}],
      gridData: [{}],
      DateDetailId: "",
      dateTeamDate: "",
      lineId: "",
      productID: "",
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
      dialogpageSize: 10,
      dialogpageIndex: 1,
      dialogtotal: 0
    };
  },
  mounted: function() {
    this.getLineType();
    this.getlineTheme()
    this.getLineList();
  },
  methods: {
    handleSortChange(val) {
      if(val.column){
        this.asc = val.order == 'ascending'? true : false;
        this.sortOrder = val.prop == 'createTime' ? 'CreateTime' : 'MinSettlementPrice'
        this.getLineList();
      }
    },
    changeLineId(val){
      this.getlineTheme(val)
    },
    //获取线路主题
    getlineTheme(id=""){
      this.shopHttp.get('ResourcePlatform/LineSearchKey?cateId='+id).then(res=>{
        this.cityList = res.data.startCity;
        this.themeList = res.data.theme
      }).catch(e=>{
        console.log(e)
      })
    },
    getLineList(pageIndex=1) {
      //获取总数据
      var _this = this;
      _this.linelistloading = true;
      _this.linelisttabledata = [];
      // let url = "PageSize=" + this.PageSize + "&PageIndex="+this.PageIndex+"&LineName="+
      // this.lineName+"&EnumGroupLineType="+this.mlineType+"&LineNo="+ this.lineNum+"&SupplierName="+ this.supplierName;
      _this.shopHttp
        .post("ResourcePlatform/LineList", {
          PageSize: this.PageSize,
          PageIndex: pageIndex,
          ProductName: this.lineName,
          ProductNo: this.lineNum,
          Date:this.departureDate,
          Theme:this.theme,
          StartCity:this.startCity,
          SupplierName: this.supplierName,
          CateId:this.mlineType,
          SortFiled:this.sortOrder,
          Asc:this.asc,
          endCity:this.endCity
        })
        .then(function(res) {
            _this.total = res.data.count;
            _this.linelistloading = false;
            if(res.data.list){
              res.data.list.forEach(obj => {
              let date = new Date(obj.createTime);
              obj.createTime = dateFmt(date, "yyyy-MM-dd hh:mm:ss");
              });
               _this.linelisttabledata = res.data.list;
            }
        })
        .catch(function(err) {
          _this.linelistloading = false;
          console.log(err)
        });
    },
    ViewReservation(row) {
      if(row.productSource ==1){
        this.$router.push({
          path: "/sellcenter/reservationLine",
          query: {productId:row.productId,dateOne:row.dateOneCh}
        });
      }else{
        this.$router.push({
        path: "/sellcenter/createLineOrderForUtour",
        query: {productId:row.productId,productNo:row.productNo}
      });
      }
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.getLineList(this.PageIndex);
    },
    handleCurrentChange(val) {
      this.PageIndex = val;
      this.getLineList(this.PageIndex);
    },
    handleDialogSizeChange(val) {
      this.dialogpageSize = val;
      this.dialogpagelist();
    },
    handleDialogIndexChange(val) {
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
    dialogpagelist() {
      if (!this.dialogTableVisible) {
        this.dialogTableVisible = true;
        // this.getShowCheck(row.id);
        this.getProductLineList();
      } else {
        //  this.getShowCheck(row.id);
        this.getProductLineList();
      }
    },
    getProductLineList() {
      var _this = this;
      _this.dialogloading = true;
      _this.shopHttp
        .post("/GroupLine/GetGroupLineOrderListByLineId", {
          LineId: _this.lineId,
          PageSize: _this.dialogpageSize,
          PageIndex: _this.dialogpageIndex
        })
        .then(res => {
          //console.log(res);
          if (res.data.isSuccess) {
            _this.gridData = res.data.objects;
            _this.dialogtotal = res.data.total;
          } else {
            _this.$message("线路订单请求失败");
          }
          _this.dialogloading = false;
        })
        .catch(err => {
          console.log(err);
          _this.dialogloading = false;
          _this.$message("线路订单请求失败");
        });
    },
    addressResult(val) {
      //获取城市ID
      //console.log(val.second.id);
      this.sourceCityId = val.second.id;
    },
    getLineType() {
      //获取线路类型
      var _this = this;
      _this.shopHttp
        .get("ResourcePlatform/LineCateList")
        .then(function(res) {
          _this.mlineTypeObj = _this.mlineTypeObj.concat(res.data.cateList);
        })
        .catch(function(err) {
          console.log(err);
          _this.$message("获取线路类型失败");
        });
    },
    indexs(index) {
      return index * 1 + 1;
    },
    AddOrder(val) {
      this.$router.push({ name: "baoming", query: val });
    },
    AddReverse(row) {
      this.$router.push({
        path: "/grouptour/addReverse",
        name: "addReverse",
        params: {
          DateDetailId: row.dateDetailId,
          lineid: row.lineId,
          DepartureDate: row.dateTeamDate
        }
      });
    },
    ViewProduct(row) {
      //打开订单详情页
      if(row.productSource ==1){
        this.$router.push({
          path: "/sellcenter/externalLineDetail",
          query: { lineId: row.productId}
        });
      }else{
        this.$router.push({
          path: "/sellcenter/lineDetailForUTour",
          query: { lineId: row.productNo,productId:row.productId}
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
