<template>
  <div id="box" class="view">
    <h4><span class="verticals">| </span>收款客户</h4>
      <el-row :gutter="24">
          <el-col :span="5">
              <el-form>
                  <el-form-item label="客户：" size="small" label-width="120px">
                      <span>{{customerFeeInitInfo.disSettleClientName}}</span>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
      <h4><span class="verticals">| </span>客户信息</h4>
       <el-row :gutter="24">
          <el-col :span="20">
            <el-form>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款方式" label-width="120px">
                            <el-select size="small" class="inputs" v-model="feeMethod" >
                                    <el-option 
                                        v-for='(item,index) in PayMethod' 
                                        :value="item.key" 
                                        :label="item.value" 
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-show = 'this.feeMethod == 2 ? true : false'>
                        <el-form-item label="收款银行" size="small" label-width="120px">
                            <el-input type="text" class="inputs" v-model="TransferBank"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-show = 'this.feeMethod == 3 ? true : false'>
                        <el-form-item label="收款银行" size="small" label-width="120px">
                            <el-select size="small" class="inputs" v-model="BankAccountId" >
                                    <el-option 
                                        v-for='(item,index) in BankAccountList' 
                                        :value="item.id" 
                                        :label="item.bankName" 
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-show = 'this.feeMethod == 2 ? true : false'>
                        <el-form-item label="银行账号" size="small" label-width="120px">
                            <el-input type="text" class="inputs" v-model="TransferAccountNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款金额" size="small" label-width="120px">
                            <el-input type="text" class="inputs" v-model="feeAmount" @blur = 'jisuan'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="收款人：" size="small" label-width="120px">
                            <el-input type="text" class="inputs" v-model="handler"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="收款时间" size="small" label-width="120px">
                            <el-date-picker
                                v-model="feeDate"
                                type="date"
                                placeholder="选择日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款流水号" size="small" label-width="120px">
                            <el-input class="inputs" v-model="feeSerialNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="币种" label-width="120px">
                            <el-select size="small" class="inputs" v-model="currency">
                                <el-option 
                                    v-for='(item,index) in currencyTypes' 
                                    :value="item.currencyCode" 
                                    :label="item.currencyName" 
                                    :key='index'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="附件"  label-width="120px">
                    <!-- <el-button type="primary" icon="el-icon-upload" size="small" v-model="attachment">点击上传附件</el-button> -->
                    <el-upload
                        class="upload-demo"
                        action="/attachment/upload"
                        :http-request="attachmentUpload"
                        :multiple="true"
                        :show-file-list="false"
                        :file-list="fileData"
                        >
                        <el-button size="small" type="primary" class="margin_bottom">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label=""  label-width="120px">
                            <template slot-scope="scope">
                                <span v-for = '(file,index) in fileData' :key='index' style='margin-right:15px;'>{{file.AttrachmentName}}</span>
                            </template>
                </el-form-item>
                <el-form-item label="备注" label-width="120px">
                    <el-input type="textarea" style="max-width:500px" v-model="remark"></el-input>
                </el-form-item>
            </el-form>
          </el-col>
      </el-row>
    <h4><span class="verticals">| </span>收款订单</h4>
    <el-table size="small"  ref="multipleTable" :data="customerFeeInitInfo.orderInfos" border max-height="800"  tooltip-effect="dark" style="width: 100%">
        <el-table-column size="small" prop="receivableFee" label="应收款" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="receivedFee" label="已收" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="unReceivedFee" label="未收" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="groupLineNo" label="团号" align="center" show-overflow-tooltip>
        </el-table-column>
            <el-table-column size="small" prop="customerName" label="客户名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="businessTypeName" label="项目" align="center" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column size="small" prop="orderDateFormat" label="下单日期" align="center" show-overflow-tooltip>
        </el-table-column> -->
    </el-table>
    <el-row :gutter="24" style="margin-top:70px">
        <el-col :span="2" :offset="8">
            <el-button size="small" type="primary" @click="payinfoupdatesave()">保存</el-button>
        </el-col>
        <el-col :span="3">
            <el-button size="small" type="primary" @click="payinfoupdatesave('kaifapiao')" >保存并开发票</el-button>
        </el-col>
        <el-col :span="3">
            <el-button size="small" type="primary" @click="cancel()">取消</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import {dateFmt} from '@/utils/tools.js'
export default {
    data(){
        return{//this.$route.query
            settlementIds:this.$route.query.settlementIds,
            disSettleClientId:this.$route.query.disSettleClientId,
            fileData:[],
            data:[],
            ids:[],
            customerFeeInitInfo:{
                disSettleClientId: 0,
                disSettleClientName: "",
                orderInfos: [
                    {
                        customerName: '',
                        businessType: 1,
                        businessTypeName: "",
                        orderAmount: 1,
                        orderDate: "",
                        orderDateFormat: "",
                        orderNo: '',
                        groupLineNo: "",
                        channelName: ''
                    }
                ]
            },
            BankAccountList:[],//银行列表
            BankAccountId:'',//银行ID 
            TransferBank:'',//银行名称
            TransferAccountNo:'',//银行账号
            currencyTypes:[],//币种列表
            currency:'CNY',
            PayMethod:[],//收款方式
            feeMethod:'',
            needInvoice:'true',
            feeSerialNo:'',
            feeAmount:'',
            feeDate:'',
            handler:'',
            attachment:'ssss',
            remark:'',
            feeDetails:[
                            // {
                            //     settlementId:'',//结算编号
                            //     amount:''
                            // }
                        ]
        }
    },
    methods:{
        //文件上传
        attachmentUpload(val) {
            var f = new FormData();
            f.append("FileData", val.file);
            f.append("Category", "AirTicket");
            f.append("thumbnail", true);
            f.append("Folder", "Airline");
            this.fileUpload.post(val.action, f).then(res => {
                if (res.data.Status == true) {
                    this.fileData.push({
                        AttrachmentName: res.data.FileName,
                        AttrachmentUrl: res.data.Url,
                    })
                    this.$message({
                        message: "上传成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.data.Message);
                }
            });
        },
        jisuan(){
            var amount = Number(this.feeAmount);
            if(amount > 0){
                this.feeDetails = [];
                for(var i = 0;i<this.data.length-1;i++) {
                    let obj = {};
                    amount =  amount + this.data[i].receivedFee - this.data[i].receivableFee;
                    obj.settlementId  = this.customerFeeInitInfo.orderInfos[i].id;
                    if( amount > 0){
                        obj.amount = this.data[i].receivableFee - this.data[i].receivedFee;
                        this.customerFeeInitInfo.orderInfos[i].receivedFee = this.data[i].receivableFee;
                        this.customerFeeInitInfo.orderInfos[i].unReceivedFee = 0;
                    }else{
                        obj.amount = this.data[i].receivableFee - this.data[i].receivedFee + amount;
                        this.customerFeeInitInfo.orderInfos[i].receivedFee = this.data[i].receivableFee + amount;
                        this.customerFeeInitInfo.orderInfos[i].unReceivedFee = 0 - amount;
                        amount = 0;
                    }
                    this.feeDetails.push(obj);
                } 
                let obj = {}; 
                this.customerFeeInitInfo.orderInfos[i].receivedFee = this.data[i].receivedFee + amount;
                this.customerFeeInitInfo.orderInfos[i].unReceivedFee = this.data[i].unReceivedFee - amount;
                obj.settlementId = this.customerFeeInitInfo.orderInfos[i].id;
                obj.amount = amount;
                this.feeDetails.push(obj);
            }
        },
        //创建客户收款单
        payinfoupdatesave(text){
            let date = new Date(this.feeDate);
            this.feeDate = dateFmt(date,'yyyy-MM-dd');
            if(this.feeMethod == 2 ){
                this.BankAccountId =''
            }else if(this.feeMethod == 3 ){
                this.TransferBank = '';
                this.TransferAccountNo = '';
            }else{
                this.BankAccountId ='';
                this.TransferBank = '';
                this.TransferAccountNo = '';
            }
            this.groupHttp
                .post("CustomerFee/CustomerReceiveFee", {
                    feeDetails:this.feeDetails,
                    object:{
                        disSettleClientId:this.disSettleClientId,//结算单编号
                        feeSerialNo:this.feeSerialNo,//收款流水号
                        feeMethod:this.feeMethod,//收款方式
                        feeAmount:this.feeAmount,//收款金额
                        handler:this.handler,//收款人
                        feeDate:this.feeDate,//收款时间
                        needInvoice:true,
                        attachment:this.attachment,//附件 路径
                        remark:this.remark,
                        Currency:this.currency,
                        BankAccountId:this.BankAccountId,
                        TransferBank:this.TransferBank,
                        TransferAccountNo:this.TransferAccountNo
                    }
                })
                .then(res => {
                    if (res.data.isSuccess == true) {
                        this.$message({
                            type:'success',
                            message:'付款成功'
                        })
                        setTimeout(() => {
                            if(text){
                                this.$router.push({path:'/grouptour/kaifapiao'})
                            }else{
                                this.$router.push({path:'/grouptour/orderList'})
                            }
                        },500)
                        
                    } else {
                        this.$message({
                                type: "info",
                                message: "出错了!" 
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
        },
        //取消
        cancel(){
            this.$router.push('/orderCenter/order')
        }
    },
    mounted(){
        var date = new Date();
        this.feeDate = dateFmt(date,'yyyy-MM-dd');
        //收付款初始化
        this.groupHttp
                .post("CustomerFee/GetCustomerFeeInitInfo", {
                    DisSettleClientId: this.disSettleClientId,
                    SettlementIds:this.settlementIds
                })
                .then(res => {
                    if (res.status == 200) {
                        this.customerFeeInitInfo = res.data;
                        res.data.orderInfos.forEach((info) => {
                            let obj = {};
                            obj.receivableFee = info.receivableFee;
                            obj.receivedFee = info.receivedFee;
                            obj.unReceivedFee = info.unReceivedFee;
                            this.data.push(obj);
                        });
                    } else {
                        this.$message({
                                type: "info",
                                message: "出错了!" + res.data.message
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
        //币种下拉列表 
        this.groupHttp
                .get("Finance/GetCurrency", {})
                .then(res => {
                    if (res.data.isSuccess == true) {
                        this.currencyTypes = res.data.objects;
                    } else {
                        this.$message({
                                type: "info",
                                message: "出错了!" + res.data.message
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
         //结算方式下拉列表 
        this.groupHttp
                .get("Finance/GetPayMethod", {})
                .then(res => {
                    if (res.data.isSuccess == true) {
                        this.PayMethod = res.data.objects;
                    } else {
                        this.$message({
                                type: "info",
                                message: "出错了!" + res.data.message
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
    }
    
}
</script>

<style lang="scss" scoped>
   #box{
      background: white;
      padding: 20px;
    }
    .mysapn{
        font-weight: bold;
    }
    .verticals{
        font-weight: bold;
        font-size: 20px;
    }
    .inputs{
        width: 200px;
    }
    .elcol{
        width: 400px;
    }
</style>
