<template>
  <div id="box" class="view" v-loading="viewLoading">
    <h4><span class="verticals">| </span>收款客户</h4>
      <el-row :gutter="24">
          <el-col :span="20">
              <el-form>
                  <el-form-item label="客户结算单位：" size="small" label-width="150px">
                      <span>{{customerFeeInitInfo.customerName}}</span>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
      <h4><span class="verticals">| </span>收款信息</h4>
       <el-row :gutter="24">
            <el-form ref = 'formData' :rules='rules' :model="formData">
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款方式" label-width="120px" prop='FeeMethod'>
                            <el-select size="small" class="inputs" v-model="formData.FeeMethod" >
                                    <el-option
                                        v-for='(item,index) in customerFeeInitInfo.feeMethod'
                                        :value="item.feeMethodId"
                                        :label="item.feeMethodName"
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-if = 'this.formData.FeeMethod == 2 ? true : false'>
                        <el-form-item label="收款银行" size="small" label-width="120px" prop='TransferBank'>
                            <el-input type="text" class="inputs" v-model="formData.TransferBank"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-if = 'this.formData.FeeMethod == 3 ? true : false'>
                        <el-form-item label="收款银行" size="small" label-width="120px" prop='BankAccountId'>
                            <el-select size="small" class="inputs" v-model="formData.BankAccountId" >
                                    <el-option
                                        v-for='(item,index) in BankAccountList'
                                        :value="item.id"
                                        :label="item.bankName"
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="elcol" v-if = 'this.formData.FeeMethod == 2 ? true : false'>
                        <el-form-item label="银行账号" size="small" label-width="120px" prop='TransferAccountNo'>
                            <el-input type="text" class="inputs" v-model="formData.TransferAccountNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款金额" size="small" label-width="120px" prop = 'FeeAmount'>
                            <el-input type="text" class="inputs" v-model="formData.FeeAmount"></el-input>
                            <el-button size="small" type="primary" @click="jisuan()">计算</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="收款人：" size="small" label-width="120px" prop='Handler'>
                            <el-input type="text" class="inputs" v-model="formData.Handler"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="收款时间" size="small" label-width="120px" prop='FeeDate'>
                            <el-date-picker
                                v-model="formData.FeeDate"
                                type="date"
                                placeholder="选择日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="18">
                    <el-col :span="7" class="elcol">
                        <el-form-item label="收款流水号" size="small" label-width="120px" prop='FeeSerialNo'>
                            <el-input class="inputs" v-model="formData.FeeSerialNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"  class="elcol">
                        <el-form-item label="币种" label-width="120px" prop='Currency'>
                            <el-select size="small" class="inputs" v-model="formData.Currency">
                                <el-option
                                    v-for='(item,index) in currencyTypes'
                                    :value="item.currencyName"
                                    :label="item.currencyName"
                                    :key='index'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="附件"  label-width="120px" prop = 'Attachment'>
                     <el-upload
                        class="upload-demo"
                        style='width:200px;'
                        action="/attachment/upload"
                        :http-request="attachmentUpload"
                        :multiple="true"
                        :show-file-list="true"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :file-list="fileData"
                        >
                        <el-button size="small" type="primary" class="margin_bottom">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注" label-width="120px">
                    <el-input type="textarea" style="max-width:500px" v-model="formData.Remark"></el-input>
                </el-form-item>
            </el-form>
      </el-row>
    <h4><span class="verticals">| </span>是否需要发票</h4>
    <el-row :gutter="24">
        <el-col :span="20" :offset="1">
            <el-radio v-model="formData.NeedInvoice" :label="true">是</el-radio>
            <el-radio v-model="formData.NeedInvoice" :label="false" style="margin-left:50px">否</el-radio>
        </el-col>
    </el-row>
    <h4><span class="verticals">| </span>收款订单</h4>
    <el-table size="small"  ref="multipleTable" :data="customerFeeInitInfo.orders" border max-height="800"  tooltip-effect="dark" style="width: 100%">
        <el-table-column size="small" prop="receivableFee" label="应收款" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="receivedFee" label="已收" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="unReceiveFee" label="未收" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="teamNo" label="团号" align="center" show-overflow-tooltip>
        </el-table-column>
            <el-table-column size="small" prop="customerName" label="客户名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="productType" label="业务类型" align="center" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column size="small" prop="orderDateFormat" label="下单日期" align="center" show-overflow-tooltip>
        </el-table-column> -->
    </el-table>
    <el-row :gutter="24" style="margin-top:30px">
        <el-col>
            <el-button size="small" type="primary" @click="payinfoupdatesave()" style='margin-left:40%;'>保 存</el-button>
            <el-button size="small" type="primary" @click="payinfoupdatesave('kaifapiao')" :disabled = '!formData.NeedInvoice' >保存并开发票</el-button>
            <el-button size="small" type="primary" @click="cancel()">取 消</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import {dateFmt} from '@/utils/tools.js'
export default {
    data(){
        var checkAttachment = (rule, value, callback) => {
            if(this.fileData.length == 0 ){
                callback(new Error('你还没有上传过附件'))
            }else{
                callback()
            }
        }
        var checkFeeMethod = (rule, value, callback) => {
            if(this.formData.FeeMethod == '' ){
                callback(new Error('你还没有选择收款方式'))
            }else{
                callback()
            }
        }
        var checkFeeDate = (rule, value, callback) => {
            if(!this.formData.FeeDate){
                callback(new Error('你还没有选择收款时间'))
            }else{
                callback()
            }
        }
        var checkTransferBank = (rule, value, callback) => {
            if(this.formData.TransferBank == '' &&  this.formData.FeeMethod == 2){
                callback(new Error('你还没有输入银行'))
            }else{
                callback()
            }
        }
        var checkTransferAccountNo = (rule, value, callback) => {
            if(this.formData.TransferAccountNo == '' &&  this.formData.FeeMethod == 2){
                callback(new Error('你还没有输入银行账号'))
            }else{
                callback()
            }
        }
        var checkBankAccountId = (rule, value, callback) => {
            if(this.formData.BankAccountId == '' &&  this.formData.FeeMethod == 3){
                callback(new Error('你还没有选择收款时间'))
            }else{
                callback()
            }
        }
        var checkFeeAmount = (rule, value, callback) => {
            if(value != 0 && !value){
                callback(new Error('你还没有输入收款金额'))
            }else if(!/^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(value)){
                callback(new Error('收款金额只能是正数'))
            }else{
                callback()
            }
        }
        return{//this.$route.query
            viewLoading:true,
            orderIds:this.$route.query.orderIds,
            //文件上传
            fileData:[],
            data:[],
            ids:[],
            rules:{
                FeeMethod:[
                    { required: true, validator: checkFeeMethod, trigger: "change" }
                ],
                FeeAmount:[
                    { required: true, validator: checkFeeAmount, trigger: "blur" }
                ],
                Handler:[
                    { required: true, message: '你还没有添加收款人', trigger: "blur" }
                ],
                FeeDate:[
                    { required: true,validator: checkFeeDate, trigger: "change" }
                ],
                FeeSerialNo:[
                    { required: true, message: '你还没有添加流水号', trigger: "blur" }
                ],
                Attachment:[
                    { required: true, validator: checkAttachment}
                ],
                Currency:[
                    { required: true, message: '你还没有选择币种', trigger: "change" }
                ],
                TransferBank:[
                    { required: true, validator: checkTransferBank, trigger: "blur" }
                ],
                TransferAccountNo:[
                    { required: true, validator: checkTransferAccountNo, trigger: "blur" }
                ],
                BankAccountId:[
                    { required: true, validator: checkBankAccountId, trigger: "blur" }
                ]
            },
            customerFeeInitInfo:{ },
            formData:{
                DisSettleClientId:'',
                DisSettleClientName:'',
                FeeMethod:'',
                TransferBank:'',
                BankAccountId:'',
                TransferAccountNo:'',
                FeeSerialNo:'',
                FeeAmount:'',
                FeeDate:'',
                Remark:'',
                Handler:'',
                Currency:'人民币',
                Attachment:'',
                BankAccountId:'',//银行ID
                TransferBank:'',//银行名称
                TransferAccountNo:'',//银行账号
                NeedInvoice:true,
            },
            BankAccountList:[],//银行列表
            currencyTypes:[],//币种列表
            feeDetails:[]
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
                        name: res.data.FileName,
                        url: res.data.Url,
                    })
                    this.$refs.formData.validateField('Attachment');//去验证文件上传
                    this.$message({
                        message: "上传成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.data.Message);
                }
            });
        },
        //图片过多
        handleExceed(files, fileList) {
            this.$message.warning(`您只能上传一个附件`);
        },
        //删除确认
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        //删除操作
        handleRemove(file, fileList) {
            this.fileData = fileList;
        },
        jisuan(){
            let amount = Number(this.formData.FeeAmount);
            if(amount >= 0){
                this.feeDetails = [];
                for(var i = 0;i<this.data.length-1;i++) {
                    let obj = {};
                    amount =  amount + this.data[i].receivedFee - this.data[i].receivableFee;
                    obj.settlementId  = this.customerFeeInitInfo.orders[i].id;
                    if( amount > 0){
                        obj.amount = this.data[i].receivableFee - this.data[i].receivedFee;
                        this.customerFeeInitInfo.orders[i].receivedFee = this.data[i].receivableFee;
                        this.customerFeeInitInfo.orders[i].unReceiveFee = 0;
                    }else{
                        obj.amount = this.data[i].receivableFee - this.data[i].receivedFee + amount;
                        this.customerFeeInitInfo.orders[i].receivedFee = this.data[i].receivableFee + amount;
                        this.customerFeeInitInfo.orders[i].unReceiveFee = 0 - amount;
                        amount = 0;
                    }
                    this.feeDetails.push(obj);
                }
                let obj = {};
                this.customerFeeInitInfo.orders[i].receivedFee = this.data[i].receivedFee + amount;
                this.customerFeeInitInfo.orders[i].unReceiveFee = this.data[i].unReceiveFee - amount;
                obj.settlementId = this.customerFeeInitInfo.orders[i].id;
                obj.amount = amount;
                this.feeDetails.push(obj);
            }
        },
        //创建客户收款单
        payinfoupdatesave(text){
            this.jisuan();
            this.formData.Attachment = '';
            this.fileData.forEach((file) => {
                this.formData.Attachment += file.url + '|';
            });
            this.formData.Attachment = this.formData.Attachment.substring(0,this.formData.Attachment.length-1);
            this.$refs.formData.validate( (valid) => {
                if(valid){
                    let date = new Date(this.formData.FeeDate);
                    this.formData.FeeDate = dateFmt(date,'yyyy-MM-dd');
                    if(this.formData.FeeMethod == 2 ){
                        this.formData.BankAccountId =''
                    }else if(this.formData.FeeMethod == 3 ){
                        this.formData.TransferBank = '';
                        this.formData.TransferAccountNo = '';
                    }else{
                        this.formData.BankAccountId ='';
                        this.formData.TransferBank = '';
                        this.formData.TransferAccountNo = '';
                    }
                    this.shopHttp
                        .post("GroupLineOffline/CreateOfflineOrderFee", {
                            OrderIds: this.orderIds,
                            OfflineOrderFinCustomerFeeInfo:this.formData
                        })
                        .then(res => {
                            if (res.data.isSuccess == true) {
                                this.$message({
                                    type:'success',
                                    message:'付款成功'
                                })
                                setTimeout(() => {
                                    if(text){
                                        this.$router.push({path:'/grouptour/kaifapiao',query:{cusFeeId:res.data.objects[0]}})
                                    }else{
                                        this.$router.push({path:'/orderCenter/offlineOrderList'})
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
                        }
                    })
        },
        //取消
      cancel(){
          this.$router.push('/orderCenter/offlineOrderList')
      }
    },
    mounted(){
        var date = new Date();
        this.formData.FeeDate = dateFmt(date,'yyyy-MM-dd');
        //收付款初始化
        this.shopHttp
                .get("GroupLineOffline/GetGroupLineOfflineOrderReceiveFeeInfo?OrderIds="+ this.orderIds)
                .then(res => {
                    if (res.status == 200) {
                        this.customerFeeInitInfo = res.data;
                        this.formData.DisSettleClientId=res.data.customerId;
                        this.formData.DisSettleClientName=res.data.customerName;
                        var feeAmount = 0;
                        res.data.orders.forEach((info) => {
                            let obj = {};
                            obj.receivableFee = info.receivableFee;
                            obj.receivedFee = info.receivedFee;
                            obj.unReceiveFee = info.unReceiveFee;
                            feeAmount += info.unReceiveFee;
                            this.data.push(obj);
                        });
                        this.formData.FeeAmount = feeAmount;
                        this.viewLoading=false;
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
        this.shopHttp
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
