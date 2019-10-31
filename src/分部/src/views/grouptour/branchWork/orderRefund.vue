<template>
  <div class="view" id="box">
      <h4><span class="verticals">| </span>退款客户</h4>
      <el-row :gutter="24">
          <el-col :span="5">
              <el-form>
                  <el-form-item label="客户结算单位" size="small" label-width="120px">
                      <span>{{customerFeeInitInfo.disSettleClientName}}</span>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
      <h4><span class="verticals">| </span>退款信息</h4>
       <el-row :gutter="24">
            <el-form ref = 'formData' :rules='rules' :model="formData">
                <el-form-item label="退款方式" label-width="120px" prop='feeMethod'>
                    <el-select size="small" class="inputs" v-model="formData.feeMethod">
                        <el-option 
                            v-for='(item,index) in PayMethod' 
                            :value="item.key" 
                            :label="item.value" 
                            :key='index'>
                        </el-option>
                    </el-select>
                </el-form-item>
                        <el-form-item label="退款金额" size="small" label-width="120px" prop='refundAmount'>
                            <el-input type="text" class="inputs" v-model="formData.refundAmount"></el-input>
                            <el-button size="small" type="primary" @click="jisuan()">计算</el-button>
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
                        <el-form-item label="退款人" size="small" label-width="120px" prop='handler'>
                            <el-input type="text" class="inputs" v-model="formData.handler"></el-input>
                        </el-form-item>
                        <el-form-item label="退款时间" size="small" label-width="120px" prop='feeDate'>
                            <el-date-picker
                                v-model="formData.feeDate"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
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
                <el-form-item label="备注" label-width="120px" prop='remark'>
                    <el-input type="textarea" style="max-width:500px" v-model="formData.remark"></el-input>
                </el-form-item>
            </el-form>
      </el-row>
    <h4><span class="verticals">| </span>退款订单</h4>
    <el-table size="small" ref="multipleTable" border :data="customerFeeInitInfo.orderInfos" max-height="800" tooltip-effect="dark" style="width: 100%">
        <el-table-column size="small" prop="receivableFee" label="应退" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="unReceivedFee" label="已退" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="receivedFee" label="未退" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="groupLineNo" label="团号" align="center" show-overflow-tooltip>
        </el-table-column>
            <el-table-column size="small" prop="customerName" label="客户名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column size="small" prop="businessTypeName" label="项目" align="center" show-overflow-tooltip>
        </el-table-column>
    </el-table>
    <el-row :gutter="24" style="margin-top:30px;padding-left:40%;">
            <el-button size="small" type="primary" @click = 'confirmRefund'>确认退款</el-button>
            <el-button size="small" type="primary" @click = 'cancle'>取 消</el-button>
    </el-row>
  </div>
</template>

<script>
import {dateFmt} from '@/utils/tools.js';
export default {
    data(){
        var checkAttachment = (rule, value, callback) => {
            if(this.fileData.length == 0 ){
                console.log(this.fileData)
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
        var checkrefundAmount = (rule, value, callback) => {
            if(value != 0 && !value){
                callback(new Error('你还没有输入收款金额'))
            }else if(!/^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(value)){
                callback(new Error('收款金额只能是正数'))
            }else{
                callback()
            }
        } 
        return{
            arr:[],
            fileData:[],
            settlementIds:this.$route.params.settlementIds,
            cusSettleClientId:this.$route.params.disSettleClientId,
            customerFeeInitInfo:{
                disSettleClientId: 0,
                disSettleClientName: "",
                orderInfos: [
                    {}
                ]
            },
            data:[],
            currencyTypes:[],//币种列表
            PayMethod:[],//退款方式
            formData:{
                remark:'',
                feeMethod:'',
                feeAmount:'',
                feeDate:'',
                handler:'',
                currency:'人民币',
                refundAmount:''
            },
            rules:{
                feeMethod:[
                    { required: true, validator: checkFeeMethod, trigger: "change" }
                ],
                refundAmount:[
                    { required: true, validator: checkrefundAmount, trigger: "blur" }
                ],
                handler:[
                    { required: true, message: '你还没有添加退款人', trigger: "blur" }
                ],
                feeDate:[
                    { required: true,validator: checkFeeDate, trigger: "change" }
                ],
                attachment:[
                    { required: true, validator: checkAttachment}
                ],
                remark:[
                    { required: true, message: '你还没有添加备注', trigger: "blur" }
                ],
                currency:[
                    { required: true, message: '你还没有选择币种', trigger: "change" }
                ],
            },
            attachment:'',
            
            feeDetails:[
                            // {
                            //     settlementId:'',//结算编号
                            //     amount:''
                            // }
            ]
        }
    },
    methods:{
        payinfoupdatesave(){
            this.$router.push({path:'/financenter/demandetail'});
        },
        //文件上传
        attachmentUpload(val) {
            var f = new FormData();
            f.append("FileData", val.file);
            f.append("Category", "AirTicket");
            f.append("thumbnail", true);
            f.append("Folder", "Airline");
            this.fileUpload.post(val.action, f).then(res => {
                console.log(res);
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
            var amount = Number(this.formData.refundAmount);
            if(amount >= 0){
                this.feeDetails = [];
                for(var i = 0;i<this.data.length-1;i++) {
                    let obj = {};
                    amount =  amount + this.data[i].unReceivedFee - this.data[i].receivableFee;
                    obj.settlementId  = this.customerFeeInitInfo.orderInfos[i].id;
                    if( amount > 0){
                        obj.amount = this.data[i].receivableFee - this.data[i].unReceivedFee;
                        this.customerFeeInitInfo.orderInfos[i].unReceivedFee= this.data[i].receivableFee;
                        this.customerFeeInitInfo.orderInfos[i].receivedFee= 0;
                    }else{
                        obj.amount = this.data[i].receivableFee - this.data[i].unReceivedFee + amount;
                        this.customerFeeInitInfo.orderInfos[i].receivedFee= this.data[i].unReceivedFee - amount;
                        this.customerFeeInitInfo.orderInfos[i].unReceivedFee= this.customerFeeInitInfo.orderInfos[i].receivableFee + amount;
                        amount = 0;
                    }
                    this.feeDetails.push(obj);
                } 
                let obj = {}; 
                this.customerFeeInitInfo.orderInfos[i].receivedFee = this.data[i].receivedFee - amount;
                this.customerFeeInitInfo.orderInfos[i].unReceivedFee = this.data[i].unReceivedFee + amount;
                obj.settlementId = this.customerFeeInitInfo.orderInfos[i].id;
                obj.amount = amount;
                this.feeDetails.push(obj);
            }
        },
        //确认退款
        confirmRefund(){
            this.formData.attachment = '';
            this.fileData.forEach((file) => {
                this.formData.attachment += file.url + '|';
            });
            this.formData.attachment = this.formData.attachment.substring(0,this.formData.attachment.length-1);
            this.jisuan();
            this.$refs.formData.validate( (valid) => {
                if(valid){
                    this.groupHttp
                        .post("CustomerFee/CustomerRefundFee", {
                            feeDetails:this.feeDetails,
                            object:{
                                disSettleClientId:this.cusSettleClientId,//结算单编号
                                feeMethod:this.formData.feeMethod,//退款款方式
                                feeAmount:this.formData.refundAmount,//退款金额
                                handler:this.formData.handler,//退款人
                                feeDate:this.formData.feeDate,//退款时间
                                attachment:this.formData.attachment,//附件 路径
                                remark:this.formData.remark,
                                Currency:this.formData.currency
                            }
                        })
                        .then(res => {
                            console.log(res);
                            if (res.data.isSuccess == true) {
                                this.$message({
                                    type:'success',
                                    message:'退款成功'
                                })
                                setTimeout(() => {
                                    this.$router.push({path:'/grouptour/orderList'})
                                },500)
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
            });
            
        },
        //取消
        cancle(){
            this.$router.push({path:'/grouptour/orderList'})
        }
    },
    mounted(){
        this.formData.feeDate = dateFmt(new Date(),'yyyy-MM-dd');
        //收付款初始化
        this.groupHttp
            .post("CustomerFee/GetCustomerFeeInitInfo", {
                DisSettleClientId: this.cusSettleClientId,
                SettlementIds:this.settlementIds
            }).then(res => {
                if (res.status == 200) {
                    this.customerFeeInitInfo = res.data;
                    let refundAmount = 0;
                    res.data.orderInfos.forEach((info) => {
                        let obj = {};
                        obj.receivableFee = info.receivableFee;
                        obj.receivedFee = info.receivedFee;
                        obj.unReceivedFee = info.unReceivedFee;
                        this.data.push(obj);
                        refundAmount += info.receivedFee;
                    });
                    this.formData.refundAmount = refundAmount;
                }else{
                    this.$message({
                        type: "info",
                        message: "出错了!" + res.data.message
                    });
                }
            }).catch(e => {
                console.log(e);
        });
        //币种下拉列表 
        this.groupHttp
                .get("Finance/GetCurrency", {})
                .then(res => {
                    console.log(res);
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
                    console.log(res);
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
   @import "../../../style/common.scss";
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