<template>
  <div class="view">
    <h4>订单信息</h4>
    <el-form v-loading="loading" label-width="120px" size="small">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单号">
            <span>{{orderInfo.orderNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间">
            <span>{{orderInfo.creationTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="创建人">
            <span>{{orderInfo.createUserName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单状态">
            <span>{{orderInfo.orderStatusName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>产品信息</h4>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="产品类型">
            <span>{{orderInfo.productTypeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <span>{{orderInfo.productName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称">
            <span>{{orderInfo.supplierName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>客户信息</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="客户名称">
            <span>{{orderInfo.customerName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系人">
            <span>{{orderInfo.linkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系电话">
            <span>{{orderInfo.linkMobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期">
            <span>{{orderInfo.orderDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="合同类型">
            <span>{{orderInfo.categoryName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="合同号">
            <span>{{orderInfo.contractNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>预定信息</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系电话">
            <span>{{orderInfo.firstLinkMan}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="主要联系人">
            <span>{{orderInfo.firstLinkPhone}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>费用信息</h4>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="数量">
            <span>{{orderInfo.quantity}}</span>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="同行价">
            <span>{{orderInfo.unitPrice}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="同行总价">
            <span>{{orderInfo.amount}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="orderInfo.remark">
        <h4>备注</h4>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item>
              <span>{{orderInfo.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h4>审核流程</h4>
      <el-steps :active="3" align-center>
        <el-step :title="orderInfo.shopConfirmedTime+'门店下单'" :description="orderInfo.createUserName"></el-step>
        <el-step :title="orderInfo.branchConfirmedTime+(orderInfo.branchConfirmed?'分部已确认':'分部未确认')" :description="orderInfo.branchConfirmedName"></el-step>
        <el-step :title="orderInfo.supplierConfirmedTime+(orderInfo.supplierConfirmed?'供应商已确认':'供应商未确认')" :description="orderInfo.supplierConfirmedName"></el-step>
      </el-steps>
        <h4>操作日志</h4>
        <el-table :data="orderInfo.orderLogList" size="small" algin="center">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="time" label="操作时间"></el-table-column>
          <el-table-column prop="content" label="日志内容"></el-table-column>
        </el-table>
      <el-form-item style="margin-top:20px;text-align:center">
        <el-button size="small" @click="$router.push({path:'/singleItem/singleOrderList'})">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      loading: false,
      orderInfo: {}
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.loading = true;
      this.groupHttp
        .get(
          `SingleProductOrder/GetSingleProductOrderInfo?Id=${
            this.$route.query.id
          }`
        )
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.orderInfo.creationTime =  dateFmt(
                new Date(res.data.orderInfo.creationTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            res.data.orderInfo.orderDate = dateFmt(
                new Date(res.data.orderInfo.orderDate),
                "yyyy-MM-dd"
              );
              if(res.data.orderInfo.shopConfirmedTime){
                  res.data.orderInfo.shopConfirmedTime =  dateFmt(
                  new Date(res.data.orderInfo.shopConfirmedTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
              }else{
                res.data.orderInfo.shopConfirmedTime =""
              }
            if(res.data.orderInfo.branchConfirmedTime){
                res.data.orderInfo.branchConfirmedTime = dateFmt(
                new Date(res.data.orderInfo.branchConfirmedTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }else{
              res.data.orderInfo.branchConfirmedTime =""
            }
            if(res.data.orderInfo.supplierConfirmedTime){
                res.data.orderInfo.supplierConfirmedTime = dateFmt(
                new Date(res.data.orderInfo.supplierConfirmedTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }else{
              res.data.orderInfo.supplierConfirmedTime =""
            }
             res.data.orderInfo.orderLogList.forEach(item => {
                item.time =  dateFmt(new Date(item.time),"yyyy-MM-dd hh:mm:ss");
             });
            this.orderInfo = res.data.orderInfo;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style>
</style>
