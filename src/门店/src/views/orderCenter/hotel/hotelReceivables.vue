<template>
  <div class="view" v-loading="viewLoading">
    <h4><span class="verticals">| </span>收款客户</h4>
      <el-row :gutter="24">
          <el-col :span="10">
              <el-form>
                  <el-form-item label="客户：" size="small" label-width="120px">
                      <span>{{customerFeeInitInfo.disSettleClientName}}</span>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
      <h4><span class="verticals">| </span>收款信息</h4>
            <el-form ref = 'formData' :rules='rules' :model="formData">
                        <el-form-item label="收款方式" label-width="120px" prop='feeMethod'>
                            <el-select size="small" class="inputs" v-model="formData.feeMethod" >
                                    <el-option 
                                        v-for='(item,index) in PayMethod' 
                                        :value="item.key" 
                                        :label="item.value" 
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收款银行" size="small" label-width="120px" prop='TransferBank' v-show = 'this.formData.feeMethod == 2 ? true : false'> 
                            <el-input type="text" class="inputs" v-model="formData.TransferBank"></el-input>
                        </el-form-item>
                        <el-form-item label="收款银行" size="small" label-width="120px" prop='BankAccountId' v-show = 'this.formData.feeMethod == 3 ? true : false'>
                            <el-select size="small" class="inputs" v-model="formData.BankAccountId" >
                                    <el-option 
                                        v-for='(item,index) in BankAccountList' 
                                        :value="item.id" 
                                        :label="item.bankName" 
                                        :key='index'>
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="银行账号" size="small" label-width="120px" prop='TransferAccountNo' v-show = 'this.formData.feeMethod == 2 ? true : false'>
                            <el-input type="text" class="inputs" v-model="formData.TransferAccountNo"></el-input>
                        </el-form-item>
                        <el-form-item label="收款金额" size="small" label-width="120px" prop = 'feeAmount'>
                            <el-input type="text" class="inputs" v-model="formData.feeAmount"></el-input>
                            <el-button size="small" type="primary" @click="jisuan()">计算</el-button>
                        </el-form-item>
                        <el-form-item label="收款人：" size="small" label-width="120px" prop='handler'>
                            <el-input type="text" class="inputs" v-model="formData.handler"></el-input>
                        </el-form-item>
                        <el-form-item label="收款时间" size="small" label-width="120px" prop='feeDate'>
                            <el-date-picker
                                v-model="formData.feeDate"
                                type="date"
                                placeholder="选择日期">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="收款流水号" size="small" label-width="120px" prop='feeSerialNo'>
                            <el-input class="inputs" v-model="formData.feeSerialNo"></el-input>
                        </el-form-item>
                        <el-form-item label="币种" label-width="120px" prop='currency'>
                            <el-select size="small" class="inputs" v-model="formData.currency">
                                <el-option 
                                    v-for='(item,index) in currencyTypes' 
                                    :value="item.currencyName" 
                                    :label="item.currencyName" 
                                    :key='index'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                <el-form-item label="附件"  label-width="120px" prop = 'attachment'>
                    <el-upload
                        style='width:200px;'
                        class="upload-demo"
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
                    <el-input type="textarea" style="max-width:500px" v-model="formData.remark"></el-input>
                </el-form-item>
            </el-form>
    <h4><span class="verticals">| </span>是否需要发票</h4>
    <el-row :gutter="24">
        <el-col :span="20" :offset="1">
            <el-radio v-model="needInvoice" label="1">是</el-radio>
            <el-radio v-model="needInvoice" label="0" style="margin-left:50px">否</el-radio>
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
            <el-table-column size="small" prop="customerName" label="客户名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="businessTypeName" label="项目" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  v-if="isActivePayValidTime" label="剩余付款时间">
          <template slot-scope="scope"><span class="danger" v-if="scope.row.isActivePayValidTime">{{scope.row.showTime}}</span><span class="out-window">{{scope.row.businessType+1}}</span></template>
        </el-table-column>
    </el-table>
    
    <el-row class="danger text-center margin_top" v-show="(!canSubmit)&&(!timeOutCanPay)">{{timeoutTips}}</el-row>
    <el-row :gutter="24" class=" text-center margin_top" >
        <el-button size="small" type="primary" :loading="btnLoading" @click="payinfoupdatesave()" :disabled="(!canSubmit)&&(!timeOutCanPay)" >保 存</el-button>
        <el-button size="small" type="primary" :loading="btnLoading" @click="payinfoupdatesave('kaifapiao')" :disabled = 'needInvoice != 1||(!canSubmit)&&(!timeOutCanPay)' >保存并开发票</el-button>
        <el-button size="small" type="primary" @click="cancel()">取 消</el-button>
        
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
            if(this.formData.feeMethod == '' ){
                callback(new Error('你还没有选择收款方式'))
            }else{
                callback()
            }
        } 
        var checkFeeDate = (rule, value, callback) => {
            if(!this.formData.feeDate){
                callback(new Error('你还没有选择收款时间'))
            }else{
                callback()
            }
        } 
        var checkTransferBank = (rule, value, callback) => {
            if(this.formData.TransferBank == '' &&  this.formData.feeMethod == 2){
                callback(new Error('你还没有输入银行'))
            }else{
                callback()
            }
        } 
        var checkTransferAccountNo = (rule, value, callback) => {
            if(this.formData.TransferAccountNo == '' &&  this.formData.feeMethod == 2){
                callback(new Error('你还没有输入银行账号'))
            }else{
                callback()
            }
        } 
        var checkBankAccountId = (rule, value, callback) => {
            if(this.formData.BankAccountId == '' &&  this.formData.feeMethod == 3){
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
        return{
            timeOutCanPay:true,
            viewLoading:true,
            settlementIds:this.$route.query.settlementIds,
            disSettleClientId:this.$route.query.disSettleClientId,
            //文件上传
            fileData:[],
            data:[],
            ids:[],
            btnLoading:false,
            isActivePayValidTime:false,
            timeoutTips:'',
            canSubmit:true,
            rules:{
                feeMethod:[
                    { required: true, validator: checkFeeMethod, trigger: "change" }
                ],
                feeAmount:[
                    { required: true, validator: checkFeeAmount, trigger: "blur" }
                ],
                handler:[
                    { required: true, message: '你还没有添加收款人', trigger: "blur" }
                ],
                feeDate:[
                    { required: true,validator: checkFeeDate, trigger: "change" }
                ],
                feeSerialNo:[
                    { required: true, message: '你还没有添加流水号', trigger: "blur" }
                ],
                attachment:[
                    { required: true, validator: checkAttachment}
                ],
                currency:[
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
                        channelName: '',
                    }
                ]
            },
            formData:{
                feeMethod:'',
                TransferBank:'',
                BankAccountId:'',
                TransferAccountNo:'',
                feeSerialNo:'',
                feeAmount:'',
                feeDate:'',
                remark:'',
                handler:'',
                currency:'人民币',
                attachment:'',
                BankAccountId:'',//银行ID 
                TransferBank:'',//银行名称
                TransferAccountNo:'',//银行账号
            },
            BankAccountList:[],//银行列表
            
            currencyTypes:[],//币种列表
            
            PayMethod:[],//收款方式
            needInvoice:'1',
            feeDetails:[
                            // {
                            //     settlementId:'',//结算编号
                            //     amount:''
                            // }
                        ]
        }
    },
    methods:{
        //计时器
        timer(duration,creationTime,index){
         	let beginTime=new Date(creationTime).getTime(),
            endTime=beginTime+duration*60*1000,
            betweenTime=0,
            nowTime=0,
            _this=this,
            time1=1000,
            day=0,
            hour=0,
            minute=0,
            second=0;
            
            setInterval(()=>{
                nowTime=new Date().getTime();
                betweenTime=(endTime-nowTime)/1000;
                if(endTime>nowTime){
                    day=Math.floor(betweenTime/60/60/24);
                    hour=Math.floor(betweenTime/60/60%24);
                    minute=Math.floor(betweenTime/60%60);
                    second=Math.floor(betweenTime%60);
                    _this.customerFeeInitInfo.orderInfos[index].businessType=duration++
                    _this.customerFeeInitInfo.orderInfos[index].showTime=`${day}天${hour}小时${minute}分钟${second}秒`;
                    betweenTime--;
                }else{
                    time1=10000000000;
                    _this.canSubmit=false;
                    _this.timeoutTips='部分订单收款时间超时，请重新选择订单收款！'
                }
            },time1)
          
        },
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
                    this.$refs.formData.validateField('attachment');//去验证文件上传
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
            var amount = Number(this.formData.feeAmount);
            if(amount >= 0){
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
            this.jisuan();
            this.formData.attachment = '';
            this.fileData.forEach((file) => {
                this.formData.attachment += file.url + '|';
            });
            this.formData.attachment = this.formData.attachment.substring(0,this.formData.attachment.length-1);
            this.$refs.formData.validate( (valid) => {
                if(valid){
                    let date = new Date(this.formData.feeDate);
                    this.formData.feeDate = dateFmt(date,'yyyy-MM-dd');
                    if(this.formData.feeMethod == 2 ){
                        this.formData.BankAccountId =''
                    }else if(this.formData.feeMethod == 3 ){
                        this.formData.TransferBank = '';
                        this.formData.TransferAccountNo = '';
                    }else{
                        this.formData.BankAccountId ='';
                        this.formData.TransferBank = '';
                        this.formData.TransferAccountNo = '';
                    }
                    this.btnLoading=true;
                    this.shopHttp
                        .post("CustomerFee/CustomerReceiveFee", {
                            feeDetails:this.feeDetails,
                            object:{
                                disSettleClientId:this.disSettleClientId,//结算单编号
                                feeSerialNo:this.formData.feeSerialNo,//收款流水号
                                feeMethod:this.formData.feeMethod,//收款方式
                                feeAmount:this.formData.feeAmount,//收款金额
                                handler:this.formData.handler,//收款人
                                feeDate:this.formData.feeDate,//收款时间
                                attachment:this.formData.attachment,//附件 路径
                                remark:this.formData.remark,
                                needInvoice:this.needInvoice == 1 ? true : false,
                                Currency:this.formData.currency,
                                BankAccountId:this.formData.BankAccountId,
                                TransferBank:this.formData.TransferBank,
                                TransferAccountNo:this.formData.TransferAccountNo
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
                                        this.$router.push({path:'/grouptour/kaifapiao',query:{cusFeeId:res.data.objects[0]}})
                                    }else{
                                        this.$router.push({path:'/orderCenter/hotelOrderList'})
                                    }
                                },500)
                                
                            }else{
                                this.$message({
                                        type: "info",
                                        message: res.data.message
                                    });
                                }
                            
                                this.btnLoading=false;
                            })
                            .catch(e => {
                                console.log(e);
                            });
                        }
                    })
        },
        //取消
        cancel(){
            this.$router.push('/orderCenter/hotelOrderList')
        }
    },
    mounted(){
        var date = new Date();
        this.formData.feeDate = dateFmt(date,'yyyy-MM-dd');
        //收付款初始化
        this.shopHttp
                .post("CustomerFee/GetCustomerFeeInitInfo", {
                    DisSettleClientId: this.$route.query.disSettleClientId,
                    SettlementIds:this.$route.query.settlementIds
                })
                .then(res => {
                    // if (res.data.isSuccess) {
                        this.viewLoading=false;
                        this.customerFeeInitInfo = res.data;
                        var feeAmount = 0;
                        res.data.orderInfos.forEach((info,index) => {
                            if(info.isActivePayValidTime){
                                this.isActivePayValidTime=true;
                                this.timer(info.payValidTime,info.orderDate,index)
                                if(info.payStatus!=1){
                                    this.timeOutCanPay=false;
                                }
                            }
                            let obj = {};
                            obj.receivableFee = info.receivableFee;
                            obj.receivedFee = info.receivedFee;
                            obj.unReceivedFee = info.unReceivedFee;
                            feeAmount += info.unReceivedFee;
                            this.data.push(obj);
                        });
                        this.formData.feeAmount = feeAmount;
                        this.payStatus=res.data.payStatus
                    // } else {
                    //     this.$message({
                    //             type: "info",
                    //             message: "出错了!" + res.data.message
                    //         });
                    //     }
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
         //结算方式下拉列表 
        this.shopHttp
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
    .inputs{
        width: 200px;
    }
</style>
