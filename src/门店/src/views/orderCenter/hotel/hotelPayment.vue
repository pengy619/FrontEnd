<template>
  <div class="view" id="box" v-loading="viewLoading">
    <el-form ref="form" :model="form" :rules="rules" size="small" class="demo-form-inline" label-width="80px">
      <h4><span class="vercitals">| </span>支付信息</h4>
      <el-row>
        <el-form-item label="支付方式" prop="PayType">
          <el-radio-group v-model="form.PayType">
            <el-radio :label="8">余额</el-radio>
            <el-radio :label="9" :disabled="isAssetsEnough">信用额度</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="支付金额" prop="PayAmount">
          <el-input-number placeholder="请输入支付金额" :min="0" :max="maxMoney" :controls="false" class="input" v-model="form.PayAmount"></el-input-number>
          <el-button type="primary" @click="compute">计算</el-button>
        </el-form-item>
      </el-row>

      <h4><span class="vercitals">| </span>是否需要发票</h4>
      <el-row>
        <el-form-item label="" prop="IsNeedTheInvoice">
          <el-radio-group v-model="form.IsNeedTheInvoice">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <h4><span class="vercitals">| </span>支付订单</h4>
      <el-table :data="tableData" border style="width: 100%" class="margin_bottom" max-height="300px">
        <el-table-column prop="receivableFee" label="应收款" width="">  </el-table-column>
        <el-table-column prop="receivedFee" label="已收" width="">   </el-table-column>
        <el-table-column prop="unReceiveFee" label="未收">    </el-table-column>
        <el-table-column prop="orderNo" label="订单号">    </el-table-column>
        <el-table-column prop="customerName" label="客户名称">    </el-table-column>
        <el-table-column label="业务类型">
          <template slot-scope="scope">
            {{'酒店'}}
            <span class="out-window">{{scope.row.withdrawAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isActivePayValidTime" label="剩余付款时间">
          <template slot-scope="scope">
            <span class="danger" v-if="scope.row.isActivePayValidTime">{{scope.row.showTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-form-item label="支付密码" prop="PayPassword">
          <el-input type="password" placeholder="请输入支付密码" v-model="form.PayPassword" class="input" :disabled="!isSetPayPassword"></el-input>
          <el-button type="primary" @click="handleSetPayPassword" v-if="!isSetPayPassword">设置支付密码</el-button>
        </el-form-item>
      </el-row>

      <el-row class="danger text-center" v-show="(!canSubmit)&&(!timeOutCanPay)">{{timeoutTips}}</el-row>
      <el-row class="text-center margin_top">
        <el-button size="small" type="primary" @click="handlePay('')" :loading="btnLoading" :disabled="(!canSubmit)&&(!timeOutCanPay)">支付</el-button>
        <el-button size="small" type="primary" @click="handlePay('kaifapiao')" :loading="btnLoading" :disabled="!form.IsNeedTheInvoice||(!canSubmit)&&(!timeOutCanPay)">支付并开发票</el-button>
        <el-button size="small" type="info" @click="cancel">取消</el-button>
      </el-row>

    </el-form>
  </div>
</template>


<script>
  export default {
    data() {
      let checkPayAmount = (rule, value, callback) => {
        if (value) {
          this.form.PayAmount = Number(this.form.PayAmount.toFixed(2))
          callback();
        } else {
          callback()
        }
      }
      return {
        timeOutCanPay:true,
        form: {
          DisCompanyInfoId: '',
          Handler: '',
          OrderIds: this.$route.query.orderIds,
          PayType: 8,
          PayAmount: 0,
          IsNeedTheInvoice: false,
          PayPassword: '',
          CusSettleClientId: ''
		},
		btnLoading:false,
        isActivePayValidTime: false,
        timeoutTips: '0天0小时0分钟0秒',
        canSubmit: true,
        companyType: localStorage.getItem('companyType'),
        isAssetsEnough: true,
        isSetPayPassword: true,
        maxMoney: 99999999,
        tableData: [],
        tableData2: [],
        assets: 0,
        creditAmount: 0,
        viewLoading: true,
        rules: {
          PayType: [{
            required: true,
            message: "请选择支付方式",
            trigger: "change"
          }],
          PayAmount: [{
            type: 'number',
            required: true,
            validator: checkPayAmount,
            trigger: "blur"
          }],
          IsNeedTheInvoice: [{
            required: true,
            message: "请选择发票",
            trigger: "change"
          }],
          PayPassword: [{
            required: true,
            message: "请输入支付密码",
            trigger: "blur"
          }],
        },
      }
    },
    mounted() {
      this.getUserBalanceInfo();
      this.getOrderPayList();
      this.getIsSetPayPassword();
    },
    methods: {
      //计时器
      timer(duration, creationTime, index) {
        let beginTime = new Date(creationTime).getTime(),
          endTime = beginTime + duration * 60 * 1000,
          betweenTime = 0,
          nowTime = 0,
          _this = this,
          time1 = 1000,
          day = 0,
          hour = 0,
          minute = 0,
          second = 0;

        setInterval(() => {
          nowTime = new Date().getTime();
          betweenTime = (endTime - nowTime) / 1000;
          if (endTime > nowTime) {
            day = Math.floor(betweenTime / 60 / 60 / 24);
            hour = Math.floor(betweenTime / 60 / 60 % 24);
            minute = Math.floor(betweenTime / 60 % 60);
            second = Math.floor(betweenTime % 60);
            _this.tableData[index].withdrawAmount = duration++
            _this.tableData[index].showTime = `${day}天${hour}小时${minute}分钟${second}秒`;
            betweenTime--;
          } else {
            time1 = 10000000000;
            _this.canSubmit = false;
            _this.tableData[index].withdrawAmount = duration++
            _this.tableData[index].showTime = `0天0小时0分钟0秒`;
            _this.timeoutTips = '部分订单支付时间超时，请重新选择订单支付！'
          }
        }, time1)

	  },
	  //获取支付信息
      getOrderPayList() {
        this.shopHttp.post('HotelOrder/GetPayHotelOrderList', { OrderIds: this.form.OrderIds })
          .then(res => {
				if(res.data.isSuccess){
					this.tableData = res.data.objects;
					if (this.tableData.length > 0) {
						this.tableData.forEach((item, index) => {
							if (item.isActivePayValidTime) {
                                this.isActivePayValidTime = true;
                                this.timer(item.payValidTime, item.creationTime, index)
                                if(item.payStatus!=1){
                                    this.timeOutCanPay=false;
                                }
							}
						})
					}
					this.form.CusSettleClientId = res.data.objects[0].cusSettleClientId;
					this.tableData2 = JSON.parse(JSON.stringify(res.data.objects));
					this.judgeAmount();
					this.isAssetsEnough = this.assets >= this.form.PayAmount ? true : false;
				}else{
					this.$message.error(res.data.message)
				}
				this.viewLoading = false;
          })
      },
      //获取账户余额
      getUserBalanceInfo() {
        this.shopHttp.get("Property/GetProperty")
          .then(res => {
            if (res.data.isSuccess) {
              this.assets = (res.data.objects[0].assets - res.data.objects[0].freezeAssets) || 0;
              this.creditAmount = res.data.objects[0].creditAmount || 0;
            }
          })
      },
      //是否有支付密码
      getIsSetPayPassword() {
        this.shopHttp.get("Finance/GetIsSetPayPassword")
          .then(res => {
            if (res.data.isSuccess) {
              this.isSetPayPassword = res.data.objects[0];
            }
          })
      },
      handleSetPayPassword() {
        this.$router.push('/paymanage/payPassword');
      },
      judgeAmount() {
        let money = 0, amount = 0;
        this.tableData.forEach(item => {
          money += item.unReceiveFee;
        })
        this.form.PayAmount = money;
        this.maxMoney = money;
      },
      compute() {
        var amount = Number(this.form.PayAmount);
        if (this.assets + this.creditAmount < amount) {
          this.$message.info({
            type: 'info',
            message: '用户余额与信用值不足，操作失败！'
          })
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
              this.tableData[i].receivedFee = Number((this.tableData2[i].receivableFee + amount).toFixed(2));
              this.tableData[i].unReceiveFee = -Number(amount.toFixed(2));
              return;
            }
          }
        }
      },
      postPayInfo(text) {
		  this.btnLoading=true;
        this.shopHttp
          .post("CustomerFee/PayHotelOrder", this.form)
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: 'success',
                message: '付款成功'
              })
              if (text) {
                this.$router.push({ path: '/grouptour/kaifapiao', query: { cusFeeId: res.data.objects[0] } })
              } else {
                this.$router.push('/orderCenter/hotelOrderList')
              }

            } else {
              this.$message({
                type: "info",
                message: res.data.message
              });
			}
			
				
		  	this.btnLoading=false;
          })
      },
      //支付
      handlePay(text) {
        this.compute();
        this.$refs['form'].validate(valid => {

          if (valid) {
            this.shopHttp.post("CustomerFee/CheckPriceChange", { OrderIds: this.form.OrderIds })//先检查是否有改价
              .then(res => {
                if (res.data.isSuccess) {
                  this.$confirm('订单有改价变动在审核中，您确定以现订单金额进行付款吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.postPayInfo(text);
                  })
                }
                else {
                  this.postPayInfo(text);
                }
              })
          }
        })
      },
      //取消
	cancel(){
		this.$router.push('/orderCenter/hotelOrderList')
	}
    }
  }
</script>
<style scoped lang='scss'>

  .input {
    width: 200px;
  }
</style>
