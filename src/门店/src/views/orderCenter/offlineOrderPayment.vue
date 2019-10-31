<template>
  <div class="view" id="box" v-loading="viewLoading">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      class="demo-form-inline"
      label-width="80px"
    >
      <h4>
        <span class="vercitals">|</span>支付信息
      </h4>
      <el-row>
        <el-form-item label="支付方式" prop="PayType">
          <el-radio-group v-model="form.PayType" @change="handleChangePayType">
            <el-radio :label="8">余额</el-radio>
            <!-- <el-radio :label="9" :disabled="isAssetsEnough">信用额度</el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="支付金额" prop="PayAmount">
          <el-input-number
            :disabled="PayAmountDisabled"
            placeholder="请输入支付金额"
            :min="0"
            :max="maxMoney"
            :controls="false"
            class="input"
            v-model="form.PayAmount"
          ></el-input-number>
          <el-button type="primary" @click="compute">计算</el-button>
          <span
            v-if="PayAmountDisabled"
            style="vertical-align: -webkit-baseline-middle;color:#999"
          >提示：部分收款无法输入金额</span>
        </el-form-item>
      </el-row>

      <h4>
        <span class="vercitals">|</span>是否需要发票
      </h4>
      <el-row>
        <el-form-item label prop="IsNeedTheInvoice">
          <el-radio-group v-model="form.IsNeedTheInvoice">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <h4>
        <span class="vercitals">|</span>支付订单
      </h4>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="margin_bottom"
        max-height="300px"
      >
        <el-table-column prop="receivableFee" :label="companyType==2?'应付款':'应收款'" width></el-table-column>
        <el-table-column prop="receivedFee" :label="companyType==2?'已付':'已收'" width></el-table-column>
        <el-table-column prop="unReceiveFee" :label="companyType==2?'未付':'未收'"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="teamNo" label="团号"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column label="业务类型">
          <template slot-scope="scope">{{'跟团游'}}</template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-form-item label="支付密码" prop="PayPassword">
          <el-input
            type="password"
            placeholder="请输入支付密码"
            v-model="form.PayPassword"
            class="input"
            :disabled="!isSetPayPassword"
          ></el-input>
          <el-button type="primary" @click="handleSetPayPassword" v-if="!isSetPayPassword">设置支付密码</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button size="small" type="primary" @click="handlePay('')" :loading="false">支付</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handlePay('kaifapiao')"
            :loading="false"
            :disabled="!form.IsNeedTheInvoice"
          >支付并开发票</el-button>
          <el-button size="small" type="info" @click="back">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>


<script>
export default {
  data() {
    let checkPayAmount = (rule, value, callback) => {
      if (value) {
        this.form.PayAmount = Number(this.form.PayAmount.toFixed(2));
        callback();
      } else {
        callback();
      }
    };
    return {
      isPartialPayment: false,
      isActive: false, //是否启用支付最小金额
      minDepositAmount: 0, //最小金额
      form: {
        DisCompanyInfoId: "",
        Handler: "",
        OrderIds: this.$route.query.orderIds,
        PayType: 8,
        PayAmount: 0,
        IsNeedTheInvoice: false,
        CustomerId: "",
        PayPassword: ""
      },
      isAssetsEnough: true,
      isSetPayPassword: true,
      maxMoney: 99999999,
      tableData: [],
      tableData2: [],
      assets: 0,
      companyType: null,
      creditAmount: 0,
      viewLoading: true,
      rules: {
        PayType: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change"
          }
        ],
        PayAmount: [
          {
            type: "number",
            required: true,
            validator: checkPayAmount,
            trigger: "blur"
          }
        ],
        IsNeedTheInvoice: [
          {
            required: true,
            message: "请选择发票",
            trigger: "change"
          }
        ],
        PayPassword: [
          {
            required: true,
            message: "请输入支付密码",
            trigger: "blur"
          }
        ]
      },
      PayAmountDisabled: false
    };
  },
  mounted() {
    this.getUserBalanceInfo();
    this.getOrderPayList();
    this.getIsSetPayPassword();
    this.getMinDepositAmount();
  },
  methods: {
    //获取最小支付金额
    getMinDepositAmount() {
      this.shopHttp
        .get("SystemSetting/GetMinDepositAmount")
        .then(res => {
          this.isActive = res.data.isActive;
          this.minDepositAmount = res.data.value;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getOrderPayList() {
      this.shopHttp
        .get(
          "GroupLineOffline/GetPayGroupLineOfflineOrderLists?orderIds=" +
            this.form.OrderIds
        )
        .then(res => {
          this.tableData = res.data.orders;
          this.form.CustomerId = res.data.orders[0].customerId;
          this.tableData2 = JSON.parse(JSON.stringify(res.data.orders));
          this.judgeAmount();
          this.viewLoading = false;
          this.isAssetsEnough =
            this.assets >= this.form.PayAmount ? true : false;
        });
    },
    //获取账户余额
    getUserBalanceInfo() {
      this.shopHttp.get("Property/GetProperty").then(res => {
        if (res.data.isSuccess) {
          this.assets =
            res.data.objects[0].assets - res.data.objects[0].freezeAssets || 0;
          this.companyType = res.data.objects[0].companyType;
          this.creditAmount = res.data.objects[0].creditAmount || 0;
        }
      });
    },
    //是否有支付密码
    getIsSetPayPassword() {
      this.shopHttp.get("Finance/GetIsSetPayPassword").then(res => {
        if (res.data.isSuccess) {
          this.isSetPayPassword = res.data.objects[0];
        }
      });
    },
    handleSetPayPassword() {
      this.$router.push("/paymanage/payPassword");
    },
    handleChangePayType() {
      this.judgeAmount();
    },
    judgeAmount() {
      let money = 0,
        amount = 0;
      this.tableData.forEach(item => {
        money += item.unReceiveFee;
        if (item.receivedFee !== 0) {
          this.PayAmountDisabled = true;
        }
      });
      this.form.PayAmount = money;
      this.maxMoney = money;
      // if(this.form.PayType==8){
      //   amount=this.assets;
      // }else{
      //   amount=this.creditAmount;
      // }
      // if(money<=amount){
      //   this.form.PayAmount=money;
      //   this.maxMoney=money;
      // }else{
      //   this.form.PayAmount=amount;
      //   this.maxMoney=amount;
      // }
    },
    compute() {
      this.tableData = JSON.parse(JSON.stringify(this.tableData2));
      var amount = Number(this.form.PayAmount);
      if (this.assets + this.creditAmount < amount) {
        this.$message.info({
          type: "info",
          message: "用户余额与信用值不足，操作失败！"
        });
        return;
      }
      if (amount >= 0) {
        for (var i = 0; i < this.tableData.length; i++) {
          amount = amount - Number(this.tableData2[i].unReceiveFee);
          if (amount >= 0) {
            this.tableData[i].receivedFee = this.tableData2[i].receivableFee;
            this.tableData[i].unReceiveFee = 0;
            if (amount == 0) {
              return;
            }
          } else {
            this.isPartialPayment = true;
            this.tableData[i].receivedFee = Number((this.tableData2[i].receivableFee + amount).toFixed(2));
            this.tableData[i].unReceiveFee = -Number(amount.toFixed(2));
            return;
          }
        }
      }
    },
    //支付
    handlePay(text) {
      this.compute();
      if (this.form.PayAmount <= 0) {
            this.$message.error("支付金额不能小于等于0");
            return false;
          }
      if (this.isPartialPayment) {
        if (this.isActive) {
          if (this.form.PayAmount < this.minDepositAmount) {
            this.$message.error("当前支付金额不能小于" + this.minDepositAmount);
            return false;
          }
        }
      }
      this.$refs["form"].validate(valid => {
          if (valid) {
            this.shopHttp
              .post("GroupLineOffline/PayGroupLineOfflineOrder", this.form)
              .then(res => {
                if (res.data.isSuccess == true) {
                  this.$message({
                    type: "success",
                    message: "付款成功"
                  });
                  if (text) {
                    this.$router.push({
                      path: "/grouptour/kaifapiao",
                      query: { cusFeeId: res.data.objects[0] }
                    });
                  } else {
                    this.$router.push("/orderCenter/offlineOrderList");
                  }
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.message
                  });
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        });
    },
    back() {
      this.$router.push("/orderCenter/offlineOrderList");
    }
  }
};
</script>
<style scoped lang='scss'>
.input {
  width: 200px;
}
</style>
