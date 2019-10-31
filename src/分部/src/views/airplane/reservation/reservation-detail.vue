<template>
	<div class="view" v-loading="tableLoading">
		<h4>订单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				预留单号：{{orderInfo.reservedOrderNo}} 
			</el-col>
			<el-col :span="6">
				创建时间:  {{orderInfo.creationTime?orderInfo.creationTime.replace(/T/,' ').split('.')[0]:''}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">创建人：{{orderInfo.createdBy}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				订单号：<span @click="goDanDtail" class="link-address">{{orderInfo.orderNo}} </span>
			</el-col>
			<el-col :span="6">
				转换时间:  {{orderInfo.orderTime?orderInfo.orderTime.replace(/T/,' ').split('.')[0]:''}} 
			</el-col>
		</el-row>

		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航空公司：{{orderInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{orderInfo.flightNo}} 
			</el-col>
			<!-- <el-col :span="6">出发日期：{{this.orderInfo.departDate.split('T')[0]}}</el-col> -->
			<el-col :span="6">出发日期：{{orderInfo.departDate?orderInfo.departDate.split('T')[0]:''}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{orderInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{orderInfo.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{orderInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{orderInfo.arriveTime}} </el-col>
			<el-col :span="6">飞行时长：{{orderInfo.flightDurationHours+'小时'+orderInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{orderInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{orderInfo.arriveAirportName}}</el-col>
		</el-row>
		
		<h4>预留信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				预留数量： {{orderInfo.adultQuantity}} 
			</el-col>
			<el-col :span="6">预留账号：{{orderInfo.reservedAccount}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				预留时间：{{orderInfo.reservedTime?orderInfo.reservedTime.replace(/T/,' ').split('T')[0]:''}} 
			</el-col>
			 <el-col :span="6">预留联系人：{{orderInfo.contacts}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				联系电话：{{orderInfo.contactsPhone}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="24">
				预留说明：{{orderInfo.remark}} 
			</el-col>
		</el-row>

		<div class="footer-control-wrap">
			<el-button size="small" @click="getReturn">返回</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo:{},
				tableLoading:false,
			}
		},
		created(){
		},
		mounted() {
		    this.getInfo();
		},
		methods:{
			//获取采购单信息
				getInfo(){
					this.tableLoading=true;
					this.airHttp.get(`/api/AirTicketOrder/GetDetails?id=${this.$route.params.id}`)
					.then((res)=>{
						var objects=res.data.objects[0];
						this.orderInfo=objects;
						this.tableLoading=false;
					})
				},
				//返回列表
				getReturn(){
					this.$router.go(-1)
				},
				goDanDtail(){
					//点击订单编号跳转到订单详情
					this.$router.push({path:`/airplane/online-order-detail/${this.orderInfo.orderNo}`})
				},
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