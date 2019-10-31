<template>
  <div class="box">
    <h4>收款信息</h4>
    <el-row :gutter="20">
      <el-col :span="10">
        <span>客户结算单位：</span>
        {{disSettleClientName}}
      </el-col>
      <el-col :span="10">
        <span>收款方式：</span>
        {{feeMethodName}}
      </el-col>
    </el-row>
    <el-row :gutter="20" v-show="feeMethodName =='转账' ? true : false ">
      <el-col :span="10">
        <span>银行名称：</span>
        {{bankName}}
      </el-col>
      <el-col :span="10">
        <span>银行账号：</span>
        {{accountNo}}
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <span>收款金额：</span>
        {{feeAmount}}
      </el-col>
      <el-col :span="10">
        <span>收款人</span>
        {{handler}}
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <span>收款时间</span>
        {{feeDateFormat}}
      </el-col>
      <el-col :span="10">
        <span>币种：</span>
        {{currency}}
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <span>备注：</span>
        {{remark}}
      </el-col>
      <el-col :span="10">
        <span>附件：</span>
        <el-button
          size="small"
          icon="el-icon-picture"
          type="primary"
          @click="checkAttachment"
        >点击查看附件</el-button>
        <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
          <img width="100%" :src="attachment" alt>
        </el-dialog>
      </el-col>
    </el-row>
    <div v-show="kaipiao">
      <h4>发票信息</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>发票抬头：</span>
          {{invoiceObj.invoiceTitle}}
        </el-col>
        <el-col :span="10">
          <span>开户行：</span>
          {{invoiceObj.openingBank}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>地址：</span>
          {{invoiceObj.address}}
        </el-col>
        <el-col :span="10">
          <span>银行账号：</span>
          {{invoiceObj.bankAccount}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>公司税号：</span>
          {{invoiceObj.taxNumber}}
        </el-col>
        <el-col :span="10">
          <span>发票类型：</span>
          {{invoiceObj.invoiceType}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10" style="position:relative;">
          <span style="position:absolute;">发票内容：</span>
          <span
            style="position:absolute;display:inline-block;text-align:left;word-break:break-all;width:300px;left:150px;"
          >{{invoiceObj.invoiceItem}}</span>
        </el-col>
        <el-col :span="10">
          <span>开票单位：</span>
          {{invoiceObj.invoiceCompany}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>领取方式：</span>
          {{invoiceObj.receiveTypeName}}
        </el-col>
        <el-col :span="10" v-show="invoiceObj.receiveTypeName == '邮寄' ? true : false">
          <span>发票邮寄地址：</span>
          {{invoiceObj.toAddress}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>备注：</span>
          {{invoiceObj.applyRemark}}
        </el-col>
      </el-row>
    </div>
    <h4>财务确认信息</h4>
    <el-row :gutter="20" v-show="confirmStatus != 2 ? true : false">
      <el-col :span="10">
        <span>确认状态：</span>
        {{confirmStatusName}}
      </el-col>
    </el-row>
    <el-row :gutter="20" v-show="confirmStatus != 2 ? false : true">
      <el-col :span="10">
        <span>确认人：</span>
        {{confirmUser}}
      </el-col>
      <el-col :span="10">
        <span>确认金额：</span>
        {{confirmAmount}}
      </el-col>
    </el-row>
    <el-row :gutter="20" v-show="confirmStatus != 2 ? false : true">
      <el-col :span="10">
        <span>确认时间：</span>
        {{confirmTimeFormat}}
      </el-col>
      <el-col :span="10">
        <span>收款流水号：</span>
        {{feeSerialNo}}
      </el-col>
    </el-row>
    <h4>订单信息</h4>
    <el-table
      ref="multipleTable"
      :data="demandtabledata"
      border
      max-height="800"
      v-loading="loading2"
      @selection-change="getrowdata"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="customerName"
        size="small"
        label="客户名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="businessTypeName"
        label="业务类型"
        size="small"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orderAmount"
        label="订单金额"
        size="small"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orderDateFormat"
        label="下单时间"
        size="small"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="orderNo" label="订单号" size="small" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="groupLineNo"
        label="团号"
        size="small"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-button
      class="mbackbtn"
      type="info"
      icon="el-icon-arrow-left"
      size="small"
      @click="goBack"
      style="margin:15px 0 50px 45%;"
    >返回</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      cusFeeId: this.$route.query.cusFeeId,
      kaipiao: this.$route.query.kaipiao,
      loading2: false,
      demandtabledata: [
        {
          feeStatusName: 1,
          feeMethod: 2,
          cashway: 3,
          feeDateFormat: 4,
          feeChannelName: 5,
          feeNo: 6,
          saleChannels: "分部"
        }
      ],
      bankName: "",
      accountNo: "",
      attachment: "", //查看附件
      feeStatusName: "", //状态
      disSettleClientName: "", //结算单位
      feeAmount: "", //收款金额
      feeMethodName: "", //收款方式
      feeSerialNo: "", //收款流水号
      currency: "", //币种
      feeDateFormat: "", //收款时间
      feeDate: "",
      handler: "", //收款人
      confirmMethod: "", //确认方式
      remark: "", //备注
      confirmTimeFormat: "", //确认时间
      confirmTime: "",
      confirmAmount: "", //确认金额
      confirmUser: "", //确认人
      debitAmount: "", //确认金额
      confirmStatus: "",
      confirmStatusName: "",
      invoiceObj: {
        invoiceTitle: "", //发票抬头
        address: "", //发票地址
        openingBank: "", //开户行
        bankAccount: "", //银行账号
        invoiceAmount: "", //公司税号
        invoiceType: "", //发票类型
        invoiceItem: "", //发票内容
        invoiceCompany: "", //开票单位
        receiveTypeName: "", //领取方式
        toAddress: "", //发票邮寄地址
        applyRemark: "" //备注
      }
    };
  },
  mounted() {
    this.shopHttp
      .get("/CustomerFee/GetCustomerFeeDetail?Id=" + this.cusFeeId)
      .then(res => {
        //console.log(res);
        if (res.status == 200) {
          this.bankName = res.data.bankName;
          this.accountNo = res.data.accountNo;
          this.attachment = res.data.attachment;
          this.feeStatusName = res.data.feeStatusName;
          this.disSettleClientName = res.data.disSettleClientName;
          this.feeAmount = res.data.feeAmount;
          this.feeMethodName = res.data.feeMethodName;
          this.feeDateFormat = res.data.feeDateFormat;
          this.confirmAmount = res.data.confirmAmount;
          this.feeDate = res.data.feeDate;
          this.handler = res.data.handler;
          this.confirmMethod = res.data.confirmMethod;
          this.remark = res.data.remark;
          this.demandtabledata = res.data.orderInfos;
          this.currency = res.data.currency;
          this.confirmUser = res.data.branchConfirmor;
          this.confirmTimeFormat = res.data.branchConfirmTimeFormat;
          this.confirmTime = res.data.confirmTime;
          this.debitAmount = res.data.debitAmount;
          this.feeSerialNo = res.data.feeNo;
          this.confirmStatus = res.data.status;
          this.confirmStatusName = res.data.statusName;
        } else {
          this.$message({
            type: "info",
            message: "出错了！" + res.data.message
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    if (this.kaipiao) {
      this.shopHttp
        .get("/Invoice/GetInvoiceDetail?CusFeeId=" + this.cusFeeId)
        .then(res => {
          //console.log(res);
          if (res.data.isSuccess == true) {
            this.invoiceObj = res.data.objects[0];
          } else {
            this.$message({
              type: "info",
              message: "出错了！" + res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    //查看附件
    checkAttachment() {
      this.dialogVisible = true;
    },
    getrowdata() {},
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.box {
  background: #fff;
  padding: 10px 15px;
}
h4 {
  height: 40px;
  line-height: 40px;
  color: #409eff;
  border-bottom: 1px solid #409eff;
  font-size: 14px;
}
.el-col {
  margin: 10px 15px;
}
.el-col span {
  display: inline-block;
  text-align: right;
  width: 120px;
  margin-right: 20px;
}
</style>
