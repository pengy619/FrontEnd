<template>
	<div class="view" v-loading="tableLoading">

		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">订单编号：{{basicInfo.orderNo}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">商品编号：{{basicInfo.productNo}} </el-col>
			<el-col :span="6">航空公司：{{basicInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{basicInfo.flightNo}} 
			</el-col>
			<!-- <el-col :span="6">出发日期：{{this.basicInfo.departDate.split('T')[0]}}</el-col> -->
			<el-col :span="6">出发日期：{{basicInfo.departDate?basicInfo.departDate.split('T')[0]:''}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{basicInfo.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{basicInfo.arriveTime}} </el-col>
			<el-col :span="6">飞行时长：{{basicInfo.flightDurationHours+'小时'+basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{basicInfo.arriveAirportName}}</el-col>
		</el-row>
		
		<h4>分配账户</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				客户名称： {{basicInfo.cutCustomerName}} 
			</el-col>
			<el-col :span="6">切位数量：{{basicInfo.cutNumber}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				切位单价：{{basicInfo.originalPrice}} 
			</el-col>
			 <el-col :span="6">切位总价：{{basicInfo.cutNumber*basicInfo.originalPrice}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				切位时间：{{basicInfo.cutDateTime?basicInfo.cutDateTime.split('T')[0]:''}} 
			</el-col>
			 <el-col :span="6">切位联系人：{{basicInfo.cutTangentContact}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				联系方式：{{basicInfo.cutContactInformation}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			 <el-col :span="24">说明：{{basicInfo.remark}}</el-col>
		</el-row>

		<h4>操作日志</h4>
		<el-table ref="voyageTable" :data="basicInfo.saleOrderLogs" highlight-current-row style="width: 100%">
			<el-table-column label="操作类型">
				<template slot-scope="scope">
					{{operationType[scope.row.orderLogType]}}
				</template>
			</el-table-column>
			<el-table-column property="content" label="操作内容" >
			</el-table-column>
			<el-table-column property="boSysAccountNmae" label="操作人">
			</el-table-column>
			<el-table-column property="creationTime" label="操作时间">
				<template slot-scope="scope">
					{{scope.row.creationTime?scope.row.creationTime.split('T')[0]:''}}
				</template>
			</el-table-column>
		</el-table>

		<div class="footer-control-wrap">
			<el-button size="small" @click="getReturn">返回</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				basicInfo:{},
				tableLoading:false,
				operationType:["添加","修改","取消","回收切位"]
			}
		},
		mounted() {
		    this.getBasicInfo();
		},
		methods:{
			//获取采购单信息
				getBasicInfo(){
					this.tableLoading=true;
					this.airHttp.get('api/AirTicketOrder/GetTicketSaleOrderInfo?SaleOrderId='+this.$route.params.id)
					.then((res)=>{
						this.tableLoading=false;
						var restop=res.data.objects[0];
						this.basicInfo=restop;
					})
				},
				//返回列表
				getReturn(){
					this.$router.go(-1)
				}
			}
		}
</script>


<style scoped>
	.info-row {
		margin: 10px 0;
	}
	
	.air-info-box {
		border: 1px solid #ddd;
		margin: 10px 0;
		padding: 10px;
	}
</style>