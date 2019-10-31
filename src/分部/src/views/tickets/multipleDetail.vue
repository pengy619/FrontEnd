<template>
    <div class='view'>
        <el-tabs type="border-card">
            <el-tab-pane label="门票基本信息">
                <h4>门票创建信息</h4> 
                <div class='audit-div'>
                    <el-row>
                        <el-col>
                            <span>创建人</span>
                        </el-col>
                        <el-col>
                            <span>创建时间</span>
                        </el-col>
                        <el-col class='btn-audit'>
                            <el-button type='primary' size='small' @click='auditVisible = true'>审核</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <span>审核状态</span>
                        </el-col>
                        <el-col v-if='this.detailData.statusName === "审核拒绝" || this.detailData.statusName === "审核通过"'>
                            <span>审核结果说明</span>
                        </el-col>
                    </el-row>
                </div>
                <div class='detail-div'>
                    <el-row>
                        <el-col class='w-100'>
                            <span>关联产品：</span>
                        </el-col>
                        <el-col class='table-col'>
                            <el-table size="small" :ref='productionTable' border :data="productionTable">
                                <el-table-column size="small" prop="name" label="价格类型" align="center"  show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column size="small" label="价格" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        包含 {{scope.row.num}} 件
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row><el-col><span>产品名称：</span></el-col></el-row>
                    <el-row><el-col><span>产品简称：</span></el-col></el-row>
                    <el-row><el-col><span>内部编码：</span></el-col></el-row>
                    <el-row><el-col><span>供应商：</span></el-col></el-row>
                    <el-row><el-col><span>票种：</span></el-col></el-row>
                    <el-row><el-col><span>产品所在地：</span></el-col></el-row>
                    <el-row><el-col><span>对应景点：</span></el-col></el-row>
                    <el-row><el-col><span>适用人群：</span></el-col></el-row>
                    <el-row><el-col><span>营业时间说明：</span></el-col></el-row>
                    <el-row><el-col><span>产品包含人数：</span></el-col></el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="销售设置">
                <el-row><el-col><span>销售范围：</span></el-col></el-row>
                <el-row><el-col><span>支付方式：</span></el-col></el-row>
                <el-row><el-col><span>产品总数量：</span></el-col></el-row>
                <el-row><el-col><span>每单最多可购买：</span></el-col></el-row>
                <el-row><el-col><span>手机号限制：</span>天内购买 张</el-col></el-row>
                <el-row><el-col><span>身份证限制：</span>天内购买 张</el-col></el-row>
                <el-row><el-col><span>购买年龄限制：</span>岁到 岁</el-col></el-row>
                <el-row><el-col><span>团队门票设置：</span></el-col></el-row>
            </el-tab-pane>
            <el-tab-pane label="预订环节设置">
                <el-row><el-col><span>预订时间限制：</span>在提前天数当日要求在 之前预订</el-col></el-row>
                <el-row><el-col><span>生效时间限制：</span>必须在购票后 分钟后才能入园</el-col></el-row>
                <el-row><el-col><span>订单确认方式：</span></el-col></el-row>
                <el-row><el-col><span>订单取消设置：</span> 分钟后不支持自动取消</el-col></el-row>
                <el-row><el-col><span>有效期限制：</span></el-col></el-row>
                <el-row><el-col><span>客人资料要求：</span></el-col></el-row>
                <el-row><el-col><span>客人必填信息：</span></el-col></el-row>
                <el-row><el-col><span>预订成功短信：</span></el-col></el-row>
            </el-tab-pane>
            <el-tab-pane label="验证环节设置">
                <el-row><el-col><span>游客入园设置：</span></el-col></el-row>
                <el-row><el-col><span>入园地址：</span></el-col></el-row>
                <el-row><el-col><span>取票地址：</span></el-col></el-row>
                <el-row><el-col><span>订单取消设置：</span></el-col></el-row>
                <el-row><el-col><span>订单自动完成：</span></el-col></el-row>
                <el-row><el-col><span>应到未处理：</span></el-col></el-row>
            </el-tab-pane>
            <el-tab-pane label="退款设置">
                <el-row><el-col><span>退款设置：</span></el-col></el-row>
                <el-row><el-col><span>退款说明：</span></el-col></el-row>
            </el-tab-pane>
            <el-tab-pane label="详细资料" class='w-130px'>
                <el-row>
                    <el-col class='w-100'>
                        <span>使用说明：</span>
                    </el-col>
                    <el-col class='w-800'>
                        <div></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class='w-100'>
                        <span>费用说明：</span>
                    </el-col>
                    <el-col class='w-800'>
                        <div></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class='w-100'>
                        <span>详细描述：</span>
                    </el-col>
                    <el-col class='w-800'>
                        <div></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class='w-100'>
                        <span>产品图片：</span>                      
                    </el-col>
                    <el-col class='w-800'>
                        <img class="myimg spanmargin" v-for="(item,index) in imgList" :key="index" :src='item'/>
                    </el-col>
                </el-row>
                <el-row><el-col><span>同业分销补充说明：</span></el-col></el-row>
                <el-row><el-col><span>内部参考资料：</span></el-col></el-row>
            </el-tab-pane>
            <el-tab-pane label="库存价格设置">
                <el-row>
                    <el-col class='w-120'>
                        <span>批量设置库存价格</span>
                    </el-col>
                    <el-col class='w-800'>
                        <div class='border-none'>
                            <template>
                                <div v-for='(item,index) in priceList' :key='index' class='border-div'>
                                    <h4>{{item.title}}</h4>
                                    <el-row>
                                        <el-col class='p-l-30'>
                                            每日可售 张，需提前 天预订
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col>
                                            <span>销售日期：</span>      按日期销售      
                                        </el-col>
                                        <el-col> 
                                            <div class='m-l-100'></div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col class='w-100'>
                                            <span>定价：</span>                      
                                        </el-col>
                                        <el-col class='w-420'> 
                                                <el-table size="small" :ref='"priceTable"+index' border :data="priceTable">
                                                    <el-table-column size="small" prop="priceType" label="价格类型" align="center"  show-overflow-tooltip>
                                                    </el-table-column>
                                                    <el-table-column size="small" prop="unReceivedFee" label="价格" align="center" show-overflow-tooltip>
                                                    </el-table-column>
                                                    <el-table-column size="small" prop="receivedFee" label="币种" align="center" show-overflow-tooltip>
                                                    </el-table-column>
                                                </el-table>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>                
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="处理审核" :visible.sync="auditVisible" width="600px" >
            <el-form :model="auditForm" :rules="auditRule" ref="auditForm" style='margin-top:-20px;' label-width='90px'>
                <el-form-item label='审核结果' prop='status'>
                    <el-radio-group v-model="auditForm.status">
                        <el-radio label="审核通过"></el-radio>
                        <el-radio label="审核拒绝"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label='说明'>
                    <el-input type="textarea" :rows="4" v-model="auditForm.desc" style='width:400px'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small' @click='handlerAudit'>确 定</el-button>
            </div>
            </el-dialog>
    </div>
</template>
<style scoped lang="scss"> 
    .el-row .el-col{
        margin:5px 20px 10px 15px;
    }
    .el-row .el-col span{
        display:inline-block;
        text-align:right;
        margin-right:10px;
        width:100px;
    }
    .audit-div .el-col{
        width:350px;
    }
    .audit-div .el-col.btn-audit{
        width:70px;
    }
    .audit-div .el-col.btn-audit .el-button{
        width:60px;
        margin-left:-50px;
    }
    .w-130px .el-row .el-col span{
        width:130px;
    }
    .w-100.el-col{
        width:100px;
        display:inline-block;
    }
    .w-800.el-col{
        width:800px;
    }
    .w-800>div{
        width:80%;
        border:1px solid #999;
        min-height:300px;
    }
    .table-col{
        width:600px;
        padding-left:20px;
    }
    .m-l-100{
        margin-left:110px;
        width:500px;
        min-height:50px;
        border:1px dashed #999;
    }
    .border-none{
        border:none!important;
    }
    .border-div{
        border:1px solid #999;
        margin:5px 0;
    }
    h4{
        color:#333;
        border-bottom:1px solid #ccc;
        margin:15px;
    }
    .el-row .el-col.w-120{
        width:120px;
    }
    .el-row .el-col.w-120>span{
        width:120px;
    }
    .el-col.w-420{
        width:450px;
        margin:none;
        display:inline-block;
    }
    .el-col.w-420>.el-table{
        margin:0 0 0 -25px!important;
        width:450px;
    }
    .p-l-30.el-col{
        padding-left:30px;
    }
</style>
<script>
    export default{
        data(){
            var checkstatus = (rule, value, callback) => {
                if(!this.auditForm.status){
                    callback(new Error('你还没有做出审核'))
                }else{
                    callback()
                }
            } 
            return{
                auditVisible:false,
                auditForm:{
                    status:'',
                    desc:''
                },
                auditRule:{
                    status:[
                        {required:true,validator:checkstatus,trigger: "change"}
                    ]
                },
                productionTable:[{name:'珠海长隆海洋王国两日游成人门票',num:2},{name:'夜宿鲸鲨馆海景区域夜宿1晚',num:2}],
                imgList:[{},{},{}],
                priceList:[{title:'价格规则1'},{title:'价格规则2'}],
                priceTable:[{priceType:'来价'},{priceType:'媒体外卖价'},{priceType:'同行价'},{priceType:'加盟结算价'},{priceType:'直客销售价'},{priceType:'内部价'},{priceType:'团体价'},{priceType:'窗口价'}]
            }
        },
        methods:{
            //提交审核
            handlerAudit(){
                this.$refs.auditForm.validate( (valid) => {
                    if(valid){
                        this.$message({
                            type:'success',
                            message:'验证成功!'
                        })
                    }else{
                        this.$message.error('出错了!')
                    }
                })
            }
            
        },
        mounted(){
        }
    }
</script>