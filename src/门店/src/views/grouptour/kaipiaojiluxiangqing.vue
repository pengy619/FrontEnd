<template>
    <div class='view'>
        <div>
            <h4>发票详细</h4>
        </div>
        <div>
            <el-row>
                <el-col :span="8"><span>发票抬头:</span>{{data.invoiceTitle}}</el-col>
                <el-col :span="8"><span>开户行:</span>{{data.openingBank}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><span>地址:</span>{{data.address}}</el-col>
                <el-col :span="8"><span>银行账号:</span>{{data.bankAccount}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><span>发票内容:</span>{{data.invoiceItem}}</el-col>
                <el-col :span="8"><span>发票类型:</span>{{data.invoiceType}}</el-col>
                
            </el-row>
            <el-row>
                <el-col :span="8"><span>开票单位:</span>{{data.invoiceCompany}}</el-col>
                <el-col :span="8"><span>公司税号:</span>{{data.taxNumber}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><span>领取方式:</span>{{data.receiveTypeName}}</el-col>
                <el-col :span="8" v-show='data.receiveTypeName == "邮寄" ? true : false'><span>发票邮寄地址:</span>{{data.toAddress}}</el-col>
            </el-row>
            <el-row>
                <el-col><span>备注:</span>{{data.applyRemark}}</el-col>
            </el-row>
        </div>
        <div>
            <h4>发票对应记录</h4>
        </div>
        <el-row>
            <el-col :span="6"><span>发票金额:</span>{{data.invoiceAmount}}</el-col>
            <el-col :span="6"><span>多开发票金额:</span>{{data.additionalAmount}}</el-col>
            <el-col :span="6"><span>发票税费:</span>{{data.taxAmount}}</el-col>
        </el-row>
        <el-table
              border
              :data="tableData"
              >
                <el-table-column
                    prop="invoiceAmount"
                    label="申请金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="feeNo"
                    label="收款编号"
                    >
                </el-table-column>
                <el-table-column
                    prop="disSettleClientName"
                    label="收款客户"
                    >
                </el-table-column>
                <el-table-column
                    prop="feeDateFormat"
                    label="收款日期"
                    >
                </el-table-column>
                <el-table-column
                    prop="handler"
                    label="收款人"
                    >
                </el-table-column>
        </el-table>
        <el-button type='primary' size='small' @click='goBack'>返回</el-button>
    </div>
</template>
<script>
  
  export default {
    data() {
      return {
          invoiceId:this.$route.query.invoiceId,
          tableData:[{
              
          }],
          data:{
              additionalAmount:'',address:'',applyRemark:'',bankAccount:'',cusFeeId:'',invoiceAmount:'',
              invoiceCompany:'',invoiceId:'',invoiceItem:'',invoiceTitle:'',invoiceType:'',openingBank:'',
              receiveType:'',receiveTypeName:'',taxAmount:'',taxNumber:'',toAddress:''
          }
      }
    },
    computed:{
      
    },
    mounted(){
        this.shopHttp.get('/Invoice/GetInvoiceDetail?InvoiceId='+ this.invoiceId)
            .then( (res) => {
                //console.log(res)
                if (res.data.isSuccess == true) {
                    this.data = res.data.objects[0];
                    this.tableData = res.data.objects;
                } else {
                    this.$message({
                    type: "info",
                    message: "出错了:" + res.data.message
                    });
                }
            }).catch((e) =>{
                console.log(e)
            })
    },
    methods: {
        
      goBack(){
        this.$router.go(-1);
      },
      fixDate(val){
           if(val.feeDate != null && val.feeDate != ''){
                    let datestr = val.feeDate;
                    let datestr_ = datestr.replace("T"," ");
                    if(datestr_.indexOf('.') > 0){
                        let datestr__ = datestr_.substring(0,datestr_.lastIndexOf("."));
                        return datestr__;
                    }else{
                         return datestr_;
                    }
                 }else{
                    return val.feeDate;
                 }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../style/common.scss";
  .view{
      padding:10px 20px;
  }
  h4{
      height: 40px;
      line-height: 40px;
  }
  .el-col{
      margin:10px 15px;
  }
  .el-col span{
      display:inline-block;
      text-align:right;
      width:150px;
      margin-right:20px;
  }
  .el-button{
      margin:20px 0 15px 40%;
  }
</style>
