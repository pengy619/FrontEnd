<template>
    <div class='view'>
        <el-tabs type="border-card">
            <el-tab-pane label="景点信息">
                <h4>创建景点信息</h4> 
                <div class='audit-div'>
                    <el-row>
                        <el-col>
                            <span class='lspan'>创建人</span><span class='rspan'>{{this.detailData.createUserName}}</span>
                        </el-col>
                        <el-col>
                            <span class='lspan'>创建时间</span><span class='rspan'>{{this.detailData.createTime ? this.detailData.createTime.substring(0,10) : ''}}</span>
                        </el-col>
                        <!-- <el-col class='btn-audit'>
                            <el-button type='primary' size='small' @click='auditVisible = true'>审核</el-button>
                        </el-col> -->
                    </el-row>
                    <el-row>
                        <el-col>
                            <span class='lspan'>审核状态</span><span class='rspan'>{{this.detailData.statusName}}</span>
                        </el-col>
                        <el-col v-if='this.detailData.statusName === "审核拒绝" || this.detailData.statusName === "审核通过"'>
                            <span class='lspan'>审核结果说明</span><span class='rspan'>{{this.detailData.aduitComment}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class='detail-div'>
                    <h4>景点详情</h4> 
                    <el-row><el-col><span class='lspan'>景点名称：</span><span class='rspan'>{{this.detailData.scenicName}}</span>（景点编号：{{this.detailData.scenicNo}}）</el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点简称：</span><span class='rspan'>{{this.detailData.shortName}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点星级：</span><span class='rspan'>{{this.detailData.leveName}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点地址：</span><span class='rspan'>{{this.detailData.fullAddress}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>确认规则：</span><span class='rspan'>{{this.detailData.confirmRuleName}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点联系人：</span><span class='rspan'>{{this.detailData.contact}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点电话：</span><span class='rspan'>{{this.detailData.tel}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点类型：</span><span class='rspan'>{{this.detailData.scenicTypeName}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点经度：</span><span class='rspan'>{{this.detailData.longitude}}</span></el-col></el-row>
                    <el-row><el-col><span class='lspan'>景点纬度：</span><span class='rspan'>{{this.detailData.latitude}}</span></el-col></el-row>
                    <el-row>
                        <el-col class='w-100'>
                            <span class='lspan'>产品图片：</span>                      
                        </el-col>
                        <el-col class='img-col'>
                            <div v-for="(item,index) in this.detailData.pictures" :key="index">
                                    <img class="myimg spanmargin"  :src='item.url'/>
                                <br>
                                <span class='img-span' v-if='item.isMain'>主图</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class='w-100'>
                            <span class='lspan'>景点简介：</span>
                        </el-col>
                        <el-col class='w-800'>
                            <div v-html='this.detailData.intro'></div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class='w-100'>
                            <span class='lspan'>交通指南：</span>
                        </el-col>
                        <el-col class='w-800'>
                            <div v-html='this.detailData.traffic'></div>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="操作日志">
                <el-table size="small" :ref='scenicLogList' border :data="scenicLogList">
                    <el-table-column size="small" prop="operateTypeName" label="操作类型" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column size="small" prop="desc" label="操作内容" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column size="small" prop="operatorName" label="操作人" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column size="small" prop="operateTime" label="操作时间" align="center"  show-overflow-tooltip></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- <el-button @click="this.$router.go(-1)" size='small' class='goBack'>返 回</el-button> -->
        <!-- <el-dialog title="处理审核" :visible.sync="auditVisible" width="600px" >
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
        </el-dialog> -->
    </div>
</template>
<style scoped lang="scss"> 
    .el-row .el-col{
        margin:5px 20px 10px 15px;
    }
    .el-row .el-col span{
        display:inline-block;
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
    .w-100.el-col{
        width:100px;
        display:inline-block;
    }
    .w-800.el-col{
        width:800px;
    }
    .img-col.el-col{
        width:800px;
    }
    .img-col.el-col>div{
        display:inline-block;
    }
    .w-800>div{
        width:80%;
        border:1px solid #999;
        min-height:300px;
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
    .img-span{
        display:block;
        width:100%;
        text-align:center!important;
    }
    .goBack.el-button{
        margin:10px 0 0 322px;
    }
    .lspan{
        width: 100px;
        text-align: right;
    }
    .rspan{
        width: 200px;
        padding-left: 30px;
        text-align: left;
    }
</style>
<script>
    export default{
        data(){
            var checkstatus = (rule, value, callback) => {
                if(!this.auditForm.status){
                    callback(new Error('你还没有做出审核!'))
                }else{
                    callback()
                }
            } 
            return{
                auditVisible: false,
                ticketScenicId: this.$route.query.ticketScenicId,
                detailData: {},
                scenicLogList: [],
                auditForm: {
                    status: '',
                    desc: ''
                },
                auditRule: {
                    status: [
                        {required:true,validator:checkstatus,trigger: "change"}
                    ]
                },
                imgList: [],
                logTable: []
            }
        },
        methods:{
            //提交审核
            handlerAudit () {
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
            },
            //查询景点详情
            queryData (ticketScenicId) {
                this.groupHttp.get("TicketScenic/GetScenicInfo?ticketScenicId=" + ticketScenicId).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.detailData = res.data.dto;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                            });
                        }
                }).catch(e => {
                    console.log(e)
                });
            },
            //查询操作日志
            getScenicLog (ticketScenicId) {
                this.groupHttp.get("TicketScenic/GetScenicLog?ticketScenicId=" + ticketScenicId).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.scenicLogList = res.data.objects;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                            });
                        }
                }).catch(e => {
                    console.log(e)
                });
            }
        },
        mounted(){
            this.queryData(this.ticketScenicId);
            this.getScenicLog(this.ticketScenicId);
        }
    }
</script>