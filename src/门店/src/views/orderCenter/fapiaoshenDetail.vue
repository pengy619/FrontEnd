<template>
  <div class="box">
        <h4>收款信息</h4>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>客户结算单位：</span>{{m1}}
            </el-col>
            <el-col :span="10">
                <span>收款方式：</span>{{m2}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>银行名称：</span>{{m3}}
            </el-col>
            <el-col :span="10">
                <span>银行账号：</span>{{m4}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>收款金额：</span>{{m5}}
            </el-col>
            <el-col :span="10">
                <span>收款人</span>{{m6}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>收款时间</span>{{m7}}
            </el-col>
            <el-col :span="10">
                <span>币种：</span>{{m8}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>备注：</span>{{m9}}
            </el-col>
            <el-col :span="10">
                <span>附件：</span> <el-button size="small" icon="el-icon-picture" type='primary'>点击查看附件</el-button>
            </el-col>
        </el-row>
        <h4>发票信息</h4>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>发票抬头：</span>{{m10}}
            </el-col>
            <el-col :span="10">
                <span>开户行：</span>{{m11}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>地址：</span>{{m12}}
            </el-col>
            <el-col :span="10">
                <span>银行账号：</span>{{m13}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>公司税号：</span>{{m14}}
            </el-col>
            <el-col :span="10">
                <span>发票类型：</span>{{m15}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>发票内容：</span>{{m16}}
            </el-col>
            <el-col :span="10">
                <span>开票单位：</span>{{m17}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>领取方式：</span>{{m18}}
            </el-col>
            <el-col :span="10">
                <span>发票邮寄地址：</span>{{m19}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>备注：</span>{{m20}}
            </el-col>
        </el-row>
        <h4>财务确认信息</h4>
        <el-row :gutter="20">
                <el-col :span="10">
                    <span>确认人：</span>{{m21}}
                </el-col>
                <el-col :span="10">
                <span>确认金额：</span>{{m22}}
        </el-col>
        </el-row>
         <el-row :gutter="20">
             <el-col :span="10">
                <span>确认时间：</span>{{m23}}
             </el-col>
             <el-col :span="10">
                <span>确认银行/现金：</span>{{m24}}
             </el-col>
         </el-row>
        <h4>订单信息</h4>
        <el-table  ref="multipleTable" :data="demandtabledata" border max-height="800"  v-loading="loading2"
            @selection-change="getrowdata" tooltip-effect="dark" style="width: 100%">
            <!-- <el-table-column label="序号" width="55" align="center" type="index">
            </el-table-column> -->
            <el-table-column prop="feeStatusName" label="客户名称" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeMethod" label="业务类型" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cashway" label="订单金额" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeDateFormat" label="下单时间" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeChannelName" label="订单号" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="feeNo" label="团号" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="saleChannels" label="销售渠道" align="center" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <el-button class="mbackbtn" type="info" icon="el-icon-arrow-left" size="small" @click='goBack' style='margin:15px 0 15px 45%;'>返回</el-button>
  </div>
</template>
<script>
export default {
    data(){
        return {
            demandtabledata:[{feeStatusName:1,feeMethod:2,cashway:3,feeDateFormat:4,feeChannelName:5,feeNo:6,saleChannels:'分部'}],
            m1:'云旅通',m2:'转账',m3:'中国民生银行',m4:'6558**********8899',m5:'5000',
            m6:'张三',m7:'2017-12-2-13:00',m8:'RMB',m9:'重要客户',m10:'65656564',
            m11:'中国民生银行',m12:'湖南省长沙市雨花区树木岭路206号',m13:'65553***********5455',m14:'8998987879878978',m15:'增值',
            m16:'跟团游',m17:'云旅通',m18:'邮寄',m19:'深圳市南山区特发信息港',m20:'重要客户',
            m21:'李四',m22:'5000',m23:'2017-12-23 13:00',m24:'中国民生银行'
        }
    },
    computed:{
        
    },
    mounted(){
        
    },
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped lang="scss">
    @import "../../style/common.scss";
    .box{
        background: #fff;
        padding:10px 15px;
    }
    h4{
        height: 40px;
        line-height: 40px;
        color:#409EFF;
        border-bottom: 1px solid #409EFF;
        font-size: 14px;
    }
    .el-col{
        margin:10px 15px;
    }
    .el-col span{
        display:inline-block;
        text-align:right;
        width:120px;
        margin-right:20px;
    }
</style>
