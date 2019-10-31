<template>
  <div id="box" class="view">
      <h4><span class="vercitals">| </span>结算单位详情</h4>
      <el-form >
          <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="结算单位" size="small" label-width="120px">
                    <span>{{details.name}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="类型" size="small"  label-width="120px">
                    <span>{{details.disTypeName}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
              <el-col :span="7">
                 <el-form-item label="手机号码" size="small" label-width="120px">
                    <span>{{details.mobilePhone}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="主要联系人" size="small" label-width="120px">
                    <span>{{details.contanct}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="固定电话" size="small" label-width="120px">
                    <span>{{details.fixedTelephone}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="邮箱" size="small" style="height:40px"  label-width="120px">
                    <span>{{details.mailbox}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="通讯地址" size="small"  label-width="120px">
                    <span>{{details.provinceName+'省'+details.cityName+'市'+details.districtName+ ' '+details.address}}</span>
                </el-form-item>
             </el-col>
         </el-row>
      </el-form>
      <h4><span class="vercitals">| </span>客户资料</h4>
      <el-table size="small" :data="customerDetails"  ref="orderInformation" border max-height="800" style="width: 100%">
            <el-table-column size="small" prop="name" label="客户名称" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="disTypeName" label="客户类型" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="contract" label="联系人" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="phone" label="手机号码" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="mobile" label="固定电话" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="fax" label="传真" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="email" label="邮箱" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="address" label="通讯地址" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="account" label="登录账号" align="center" show-overflow-tooltip>
            </el-table-column>
     </el-table>
     <h4><span class="vercitals">| </span>银行账号</h4>
      <el-table size="small" :data="bankDetails"  ref="orderInformation" border max-height="800" style="width: 100%">
      <el-table-column size="small" label="编号" width="55" align="center" type="index">
            </el-table-column>
            <el-table-column size="small" prop="name" label="银行名称" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="openBank" label="开户行" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="accountName" label="账户名" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="alias" label="别名" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="cardType" label="卡类" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="accountNo" label="账号" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="currency" label="币种" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="remark" label="备注" align="center" show-overflow-tooltip>
            </el-table-column>
              <!--  <el-table-column size="small" prop="groupLineNo" label="操作" align="center" show-overflow-tooltip>
            </el-table-column>-->
     </el-table>
     <h4><span class="vercitals">| </span>发票信息</h4>
      <el-table size="small" :data="billInfoDetails"  ref="orderInformation" border max-height="800" style="width: 100%">
      <el-table-column size="small" label="序号" width="55" align="center" type="index">
            </el-table-column>
            <el-table-column size="small" prop="companyName" label="单位" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="default" label="默认" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="companyTaxNo" label="公司税号" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="address" label="公司地址" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="bankAccount" label="银行账号" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="openAccount" label="开户银行" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="phone" label="公司电话" align="center" show-overflow-tooltip>
            </el-table-column>
             <!--   <el-table-column size="small" prop="groupLineNo" label="操作" align="center" show-overflow-tooltip>
            </el-table-column> -->
     </el-table>
     <h4><span class="vercitals">| </span>邮寄地址</h4>
      <el-table size="small" :data="postalAddressDetails"  ref="postalAddressDetails" border max-height="800" style="width: 100%">
      <el-table-column size="small" label="序号" width="55" align="center" type="index">
            </el-table-column>
            <el-table-column size="small" prop="consignee" label="收件人" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="default" label="默认" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="address" label="收件地址" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="email" label="邮箱" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="phone" label="收件电话" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="remark" label="备注" align="center" show-overflow-tooltip>
            </el-table-column>
            <!--    <el-table-column size="small" prop="groupLineNo" label="操作" align="center" show-overflow-tooltip>
            </el-table-column> -->
     </el-table>
     <br/>
        <el-row :gutter="20">
        <el-col :span="1" :offset="11">
                <el-button class="mbackbtn" type="info" size="small" @click="back">返回</el-button>
        </el-col>
    </el-row>
                    
  </div>
</template>

<script>
export default {
      data(){
          return{
              dialogVisible:false,
              details:{},
              customerDetails:[{}],
              bankDetails: [{}],
              billInfoDetails: [{}],
              postalAddressDetails: [{}],
          }
      },
      mounted () {
            this.shopHttp.get("SettleClient/DisSettleClientDetails?"+
            "DisSettleClientId="+this.$route.params.id).then(res =>{
            // console.log(res.data.orderInfos)
            this.details = res.data;
            this.customerDetails = res.data.customerDetails;
            this.bankDetails = res.data.bankDetails;
            this.billInfoDetails = res.data.billInfoDetails;
            this.postalAddressDetails = res.data.postalAddressDetails;
        }).catch(e => {
            this.order.loading=false
        })
      },
      methods: {
          back(){
              this.$router.push('/customercenter/jiesuandanwei')
          },
          attachment(){
            this.dialogImageUrl = this.details.attachment;
            this.dialogVisible = true;
          }
      }
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
   
    .mysapn{
        font-weight: bold;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 5px !important;
    }
</style>
