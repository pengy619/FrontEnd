<template>
  <div class="view">
    <el-form size="small" label-width="100px" :inline="true" :model="list">
      <el-form-item label="状态">
        <el-select v-model="list.status" placeholder="请选择" class="input">
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="list.productName" placeholder class="input"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="list.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="list.type" placeholder="请选择" class="input">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="small"
      algin="center"
      :data="tableData"
      style="width: 100%"
      v-loading="table_loading"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" prop="productTypeName" label="分类"></el-table-column>
      <el-table-column size="small" prop="productName" label="产品名称" width="160"></el-table-column>
      <el-table-column size="small" prop="confirmTypeName" label="确认规则"></el-table-column>
      <el-table-column size="small" prop="unitPrice" label="同行价"></el-table-column>
      <el-table-column size="small" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column size="small" prop="commissionSettingString" label="推广费"></el-table-column>
      <el-table-column size="small" prop="encourageSettingString" label="激励"></el-table-column>
      <el-table-column prop="statusName" label="状态"></el-table-column>
      <el-table-column size="small" label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="auditData(scope.row)"
            v-if="scope.row.canApproval"
          >审核</el-button>
          <el-button
            type="text"
            size="mini"
            @click="openDialog(scope.row)"
            v-if="scope.row.canUpdateAmountRule"
          >维护推广政策</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="推广政策" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
    <el-form :model="form" ref="form">
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item
            label="推广费"
            size="small"
            prop="CommissionSettingValue2"
          >
            <el-radio v-model="CommissionCalculationType" :label="2">
              <el-input
                :disabled="CommissionCalculationType==2?false:true"
                v-model="form.CommissionSettingValue2"
              ></el-input>元/单
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            size="small"
            prop="CommissionSettingValue1"
          >
            <el-radio v-model="CommissionCalculationType" :label="1">
              <el-input-number
                :controls="false"
                :disabled="CommissionCalculationType==1?false:true"
                v-model="form.CommissionSettingValue1"
                :max="100"
                :min="0"
              ></el-input-number>%/单
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item
            label="激励金"
            size="small"
            prop="EncourageSettingValue2"
          >
            <el-radio v-model="EncourageCalculationType" :label="2">
              <el-input
                :disabled="EncourageCalculationType==2?false:true"
                v-model="form.EncourageSettingValue2"
              ></el-input>元/单
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            size="small"
            prop="EncourageSettingValue1"
          >
            <el-radio v-model="EncourageCalculationType" :label="1">
              <el-input-number
                :controls="false"
                :disabled="EncourageCalculationType==1?false:true"
                v-model="form.EncourageSettingValue1"
                :max="100"
                :min="0"
              ></el-input-number>%/单
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
       <el-button @click="closeDialog('form')" size="small">取 消</el-button>
      <el-button type="primary" @click="updateProductPriceRule('form')" size="small">确 定</el-button>
      </el-row>
    </el-form>
    </el-dialog>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      productId:'',
      dialogFormVisible:false,
      CommissionCalculationType: 1,
      EncourageCalculationType: 1,
      form: {
        CommissionSettingValue1: "",
        CommissionSettingValue2: "",
        EncourageSettingValue1: "",
        EncourageSettingValue2: ""
      },
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      table_loading: false,
      statusOptions: [{key:'',name:'全部'}],
      typeOptions: [{id:'',name:'全部'}],
      list: {
        status: "",
        productName: "",
        type: "",
        date: ""
      },
      tableData: []
    };
  },
  mounted() {
    this.getSingleType();
    this.queryData();
    this.getProductStatusType();
  },
  methods: {
    queryData(pageIndex=1) {
      let BeginDate = "",
        EndDate = "";
      if (this.list.date && this.list.date.length > 0) {
        BeginDate = this.list.date[0];
        EndDate = this.list.date[1];
      }
      this.table_loading = true;
      this.groupHttp
        .post("SingleProduct/GetProductList", {
          Status: this.list.status,
          ProductName: this.list.productName,
          DateFrom: BeginDate,
          DateTo: EndDate,
          ProductTypeId: this.list.type,
          PageSize: this.pageSize,
          PageIndex: pageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table_loading = false;
            res.data.objects.forEach(obj => {
              let date1 = new Date(obj.createTime);
              obj.createTime = dateFmt(date1, "yyyy-MM-dd");
            });
            this.tableData = res.data.objects;
            this.total = res.data.total;
          } else {
            this.table_loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //审核
    auditData(row) {
      this.$router.push({
        path: "/singleItem/resourceAudit",
        query: { productId: row.productId }
      });
    },
    closeDialog(form){
      this.$refs[form].resetFields();
      this.dialogFormVisible = false;
    },
    openDialog(row){
      this.dialogFormVisible = true;
      this.productId = row.productId
    },
    updateProductPriceRule(form){
      let commissionSettingValue, encourageSettingValue;
      if (this.CommissionCalculationType == 1) {
        this.form.CommissionSettingValue2 = "";
        commissionSettingValue = this.form.CommissionSettingValue1;
      } else {
        this.form.CommissionSettingValue1 = "";
        commissionSettingValue = this.form.CommissionSettingValue2;
      }
      if (this.EncourageCalculationType == 1) {
        this.form.EncourageSettingValue2 = "";
        encourageSettingValue = this.form.EncourageSettingValue1;
      } else {
        this.form.EncourageSettingValue1 = "";
        encourageSettingValue = this.form.EncourageSettingValue2;
      }
      let reg = /^\d+(?:\.\d{1,2})?$/;
      if(reg.test(commissionSettingValue) && reg.test(encourageSettingValue)){
        this.groupHttp.post('SingleProduct/UpdateProductPriceRule',{
            ProductId: this.productId,
            CommissionCalculationType: this.CommissionCalculationType,
            EncourageCalculationType: this.EncourageCalculationType,
            CommissionSettingValue:commissionSettingValue,
            EncourageSettingValue:encourageSettingValue,
        }).then(res=>{
          if(res.data.isSuccess == true){
            this.$message({
              type:'success',
              message:'价格维护成功'
            })
            this.dialogFormVisible = false;
            this.$refs[form].resetFields();
            this.queryData(this.pageIndex);
          }else{
            this.$message.error(res.data.message)
          }
        }).catch(e=>{
          console.log(e)
        })
      }else {
        this.$message.error("金额必须为正数，且仅保留两位小数");
      }
    },
    //获取产品状态
    getProductStatusType() {
      this.groupHttp.post("SingleProduct/GetProductStatusType").then(res => {
        if (res.data.isSuccess == true) {
          this.statusOptions = this.statusOptions.concat(res.data.keyValueList);
        }
      });
    },
    //获取分类信息
    getSingleType() {
      this.groupHttp.post("SingleProduct/GetAllProductTypeList").then(res => {
        if (res.data.isSuccess == true) {
          this.typeOptions =this.typeOptions.concat(res.data.list); 
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData(this.pageIndex);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData(this.pageIndex);
    }
  }
};
</script>

<style scoped lang="scss">
.el-dialog{
  padding-bottom: 20px;
}
</style>
