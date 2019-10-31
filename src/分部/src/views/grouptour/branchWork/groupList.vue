<template>
  <div class="view">
     <el-form :inline="true" size="small" label-width="100px">
        <el-form-item label="线路名称">
          <el-input v-model='lineName' size='small'></el-input>
        </el-form-item>
        <el-form-item label="线路类型">
          <el-select v-model="enumGroupLineType" placeholder="请选择" size='small'>
            <el-option
              v-for="item in routeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
     <el-form-item label="出发地点">
        <addressselect clearable placeholder="请选择"  v-model="SourceCityID" @result="addressResult1" ></addressselect>
      </el-form-item>
       <el-form-item label="到达地点">
      
        <addressselect clearable placeholder="请选择"  v-model="TargetCityId" @result="addressResult2" ></addressselect>
     </el-form-item>
     <el-form-item label="供应商">
        <el-input v-model='supplierName' ></el-input>
      </el-form-item> 
     <el-form-item label="出团日期">
        <el-date-picker
          :editable='false'
          v-model="dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
     </el-form-item>
     <el-form-item label="">
        <el-button type="primary" icon="el-icon-search" @click="searchData" size='small'>查 找
        </el-button>
        <el-button  size="small" @click="changeGroupList">切换线路列表</el-button>
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
        <el-table-column
          prop="teamNo"
          label="团号"
          align="center"
          min-width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="statusDesc"
          label="状态"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="线路名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="tripDays"
          label="天数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="groupLineTypeName"
          label="线路类型"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="teamDate"
          label="出团日期"
          align="center"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="sourceCityNames"
          label="出发地"
          align="center"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="targetCityName"
          label="目的地"
          align="center"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="foundNumberCount"
          label="计划人数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="soldQuantity"
          label="已报名"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="reserveQuantity"
          label="预留位"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="stockBalance"
          label="余位"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="supplierName"
          label="供应商"
          align="center"
          min-width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="180"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeMessage(scope.$index, scope.row)">查 看</el-button>
            <el-button type="text" @click="routeSkip(scope.$index, scope.row)" size="small" >报 名</el-button>
            <el-button type="text" @click="toAddReverse(scope.$index, scope.row)" size="small" :disabled ="!scope.row.showDestine">预留单</el-button>
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
        lineName: this.$route.query.lineName||'',
        teamNo: "",
        supplierName:'',
        lineId:this.$route.query.lineId||'',
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
      searchData(){
        this.lineId='';
        this.queryData();
      },
      queryData(pageSize, pageIndex) {
        this.loading = true;
        let BeginDate = '', EndDate = '';
        if (this.dates && this.dates.length > 0) {
          BeginDate = dateFmt(new Date(this.dates[0]), 'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.dates[1]), 'yyyy-MM-dd');
        }
        this.groupHttp
          .post("GroupLine/GetGroupLineProductStockList", {
            status: this.orderStatus,
            enumGroupLineType: this.enumGroupLineType,
            teamNo: this.teamNo,
            lineName: this.lineName,
            supplierName: this.supplierName,
            TeamDateFrom: BeginDate,
            TeamDateEndForm: EndDate,
            TargetCityId:this.TargetCityId,
            SourceCityID:this.SourceCityID,
            pageSize: pageSize || 10,
            pageIndex: pageIndex || 1,
            lineId:this.lineId
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              res.data.objects.forEach((obj) => {
                let date1 = new Date(obj.dateTeamDate);
                let date2 = new Date(obj.teamDate);
                obj.dateTeamDate = dateFmt(date1, 'yyyy-MM-dd');
                obj.teamDate = dateFmt(date2, 'yyyy-MM-dd');
              })
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
      //切换线路列表
      changeGroupList(){
        this.$router.push({name:'productList'});
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
      }
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
