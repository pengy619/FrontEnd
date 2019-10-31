<template>
  <div class="view">
        <el-row>
			<el-col class="text1">线路名称:</el-col>
			<el-col :span="10"><el-input style='width:200px' v-model='lineName' size='small'></el-input></el-col>
            <el-col class="text1">线路类型:</el-col>
			<el-col :span="8">
                <el-select v-model="enumGroupLineType" placeholder="请选择" size='small'>
                    <el-option
                        v-for="item in routeTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
	    </el-row>
        <el-row>
			<el-col class="text1">出团日期:</el-col>
			<el-col :span="10">
                <el-date-picker
                    :editable = 'false'
                    :picker-options='pickerOptions'
                    size='small'
                    v-model="dates"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="el-icon-search" @click="queryData(pagination.size,1)" size='small'>查 找</el-button>
            </el-col>
	    </el-row>
        <div>
            <el-table
                v-loading = 'loading'
                highlight-current-row
                border
                fixed
                :data="productList"
                style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="70"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="teamNo"
                        label="团号"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="statusDesc"
                        label="状态"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="fullName"
                        label="线路名称"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="tripDays"
                        label="天数"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="groupLineTypeName"
                        label="线路类型"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="teamDate"
                        label="出团日期"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sourceCityNames"
                        label="出发地"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="foundNumberCount"
                        label="计划人数"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="soldQuantity"
                        label="已报名"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="reserveQuantity"
                        label="预留位"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="stockBalance"
                        label="余位"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="supplierName"
                        label="供应商"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="180"
                        fixed="right"
                        >
                            <template slot-scope="scope">
                              <el-button type="primary" @click="routeSkip(scope.$index, scope.row)" size="small">报 名</el-button>
                              <el-button type="primary" @click="toAddReverse(scope.$index, scope.row)" size="small">预留单</el-button>
                            </template>
                    </el-table-column>
            </el-table>
                <div class="pagination" >
                    <el-pagination
                        :data = 'pagination'
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="pagination.sizes"
                        :page-size="pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
  </div>
</template>
<style scoped lang="scss">
    @import "../../../style/common.scss";
    .el-row {
        margin: 10px 0 15px 20px;
    }
    .text1 {
        font-size: 14px;
        line-height: 32px;
        width: 100px;
    }
</style>
<script>
    import {dateFmt} from '@/utils/tools.js'
    export default {
        data() {
            return {
                pickerOptions:{
                    disabledDate:(date) => {
                        return  date.getTime() <= Date.now();
                    }
                },
                loading : false,
                routeTypeOptions: [
                    {
                    value: "不限",
                    label: "不限"
                    }
                ],
                productList: [

                ],
                lineName:'',
                teamNo:'',
                enumGroupLineType:'',
                orderStatus:'',
                dates:'',
                currentRow:'',
                pagination: {
                    sizes: [5, 10, 20,50],
                    size: 10,
                    currentPage: 1,
                    total: 0
                }
            };
        },
        methods:{
            queryData(pageSize,pageIndex){
                this.loading = true;
                this.groupHttp.post("GroupLine/GetGroupLineProductStockList", {
                    status:this.orderStatus,
                    enumGroupLineType:this.enumGroupLineType,
                    teamNo:this.teamNo,
                    lineName:this.lineName,
                    beginDate:this.dates[0],
                    endDate:this.dates[1],
                    pageSize: pageSize || 10,
                    pageIndex: pageIndex || 1
                }).then(res => {
                    if (res.data.isSuccess == true) {
                        res.data.objects.forEach((obj) => {
                            let date1 = new Date(obj.dateTeamDate);
                            let date2 = new Date(obj.teamDate);
                            obj.dateTeamDate = dateFmt(date1,'yyyy-MM-dd');
                            obj.teamDate =  dateFmt(date2,'yyyy-MM-dd');
                        })
                        this.productList = res.data.objects;
                        this.pagination.currentPage = pageIndex || 1;
                        this.pagination.total = res.data.total;
                        this.loading = false;
                    } else {
                        this.$message({
                            type: "info",
                            message: "操作失败: " + res.data.message
                        });
                    }
                }).catch(e => {
                console.log(e);
                });
            },
            //分页
            handleSizeChange(val) {
                this.pagination.size = val;
                this.queryData(this.pagination.size,1)
            },
            handleCurrentChange(val) {
                this.pagination.currentPage = val;
                this.queryData(this.pagination.size,this.pagination.currentPage)
            },
            convertOrder(){
                console.log();
            },
            cancelOrder(){
                console.log(ow);
            },
            deleteOrder(){
                console.log();
            },
            routeSkip(index,data){
                this.$router.push({name:'placeOrder',query:data})
            },
            toAddReverse(index,data){
                this.$router.push({name:'addReverse',params:{message:data}})
            },
        },
        mounted() {
            this.groupHttp.post("GroupLine/GetGroupLineParamList", {
                paramType: 4
                }).then(res => {
                    if(res.data.isSuccess == true){
                        res.data.objects.forEach(val =>{
                            var obj = {};
                            obj.label = val.paramName;
                            obj.value = val.id;
                            this.routeTypeOptions.push(obj);
                        })
                    }else {
                        this.$message({
                            type: "info",
                            message: "加载失败: " + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e);
                })
            this.queryData()
        }
    };
</script>
