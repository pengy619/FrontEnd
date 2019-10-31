<template>
  <div class="view">
     <el-form :inline="true" size="small" label-width="100px">
        <el-form-item label="线路名称">
          <el-input v-model='lineName'></el-input>
        </el-form-item>
        <el-form-item label="线路类型">
          <el-select v-model="enumGroupLineType" placeholder="请选择">
            <el-option
              v-for="item in routeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
     <el-form-item label="线路编号">
        <el-input v-model='lineNo' ></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model='supplierName' ></el-input>
      </el-form-item> 
    
     <el-form-item label="">
        <el-button type="primary" icon="el-icon-search" @click="queryData(pagination.size,1)" size='small'>查 找
        </el-button>
        <el-button  size="small" @click="changeGroupList">切换团期列表</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        v-loading='loading'
        highlight-current-row
        border
        fixed
        :data="productList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
        >
        </el-table-column>
         <el-table-column prop="lineCode" label="线路编号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称"  size="small"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fullName" label="线路名称"  width="180" size="small"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="groupLineTypeName" label="线路类型"  align="center" size="small" ></el-table-column>
        <el-table-column prop="enumGroupLineModeDesc" label="组团方式" width="120" align="center" size="small" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tripDays" label="行程总天数"  align="center" size="small" ></el-table-column>
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
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeMessage(scope.$index, scope.row)">线路详情</el-button>
            <el-button type="text" @click="changeGroupList(scope.row)" size="small" >团期计划</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div class="pagination">
          <el-pagination
            :data='pagination'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  
</style>
<script>
  import {dateFmt} from '@/utils/tools.js';
  import addressselect from "@/components/address-select";
  export default {
    components: {
      addressselect
    },
    data() {
      return {
        loading: false,
        routeTypeOptions: [
          {
            value: "",
            label: "不限"
          }
        ],
        productList: [],
        lineName: "",
        teamNo: "",
        lineNo:'',
        supplierName:'',
        enumGroupLineType: "",
        SourceCityID:'',
        TargetCityId:'',
        orderStatus: "",
        dates: "",
        currentRow: "",
        pagination: {
          sizes: [5, 10, 20, 50],
          size: 10,
          currentPage: 1,
          total: 0
        }
      };
    },
    methods: {
      queryData(pageSize, pageIndex) {
        this.loading = true;
        let BeginDate = '', EndDate = '';
        if (this.dates && this.dates.length > 0) {
          BeginDate = dateFmt(new Date(this.dates[0]), 'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.dates[1]), 'yyyy-MM-dd');
        }
        // ?PageSize=" + (pageSize || 10) + "&PageIndex="+(pageIndex || 1)+"&LineName="+ this.lineName+"
        // &EnumGroupLineType="+this.enumGroupLineType+"&LineNo="+ this.lineNo+"&SupplierName="+ this.supplierName
        this.groupHttp
          .post("GroupLine/GetGroupLineList",{
              PageSize:pageSize || 10,
              PageIndex:pageIndex || 1,
              LineName:this.lineName,
              EnumGroupLineType:this.enumGroupLineType,
              LineNo:this.lineNo,
              SupplierName:this.supplierName,
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.productList = res.data.objects;
              this.pagination.currentPage = pageIndex || 1;
              this.pagination.total = res.data.total;
              this.loading = false;
            } else {
              this.$message({
                type: "info",
                message: "出错了！" + res.data.message
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      //查看详情
      routeMessage(index, data){
        this.$router.push({path: '/grouptour/linedetails', query: {lineId: data.lineId,teamNo:data.teamNo}})
      },
      //分页
      handleSizeChange(val) {
        this.pagination.size = val;
        this.queryData(this.pagination.size, 1);
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      routeSkip(index, data) {
        this.$router.push({name: "placeOrder", query: data});
      },
      toAddReverse(index, data) {
        this.$router.push({name: "addReverse", params: {message: data}});
      },
      addressResult1(val){
       this.SourceCityID = val.second.id
      },
      addressResult2(val){
        this.TargetCityId = val.second.id
      },
      changeGroupList(row){
        this.$router.push({name:'groupList',query:{lineId:row.lineId,lineName:row.fullName}});
      },
    },
    mounted() {
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 4
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(val => {
              var obj = {};
              obj.label = val.paramName;
              obj.value = val.id;
              this.routeTypeOptions.push(obj);
            });
          } else {
            this.$message({
              type: "info",
              message: "加载失败: " + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      this.queryData();
    }
  };
</script>
