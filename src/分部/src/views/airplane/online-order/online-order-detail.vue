<template>
	<div class="view" v-loading="viewLoading">
		<h4>订单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				订单号：{{orderInfo.orderNo}} 
			</el-col>
			<el-col :span="6">
				创建时间:  {{orderInfo.orderTime?orderInfo.orderTime.replace(/T/,' ').split('.')[0]:''}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">创建人：{{orderInfo.createdBy}} </el-col>
		</el-row>

		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="20">航空公司：{{orderInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{orderInfo.flightNo}} 
			</el-col>
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
		
		<h4>客户信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				客户名称： {{orderInfo.customerName}} 
			</el-col>
			<el-col :span="6">销售渠道：{{orderInfo.distributionChannel}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				联系人：{{orderInfo.customerContacts}} 
			</el-col>
			 <el-col :span="6">联系电话：{{orderInfo.customerContactsPhone}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				QQ：{{orderInfo.customerContactsQQ}} 
			</el-col>
			<el-col :span="6">Email：{{orderInfo.customerContactsEmail}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				合同号：{{orderInfo.customerContractNumber}} 
			</el-col>
			<el-col :span="6">订单日期：{{orderInfo.orderTime?orderInfo.orderTime.split('T')[0]:''}} </el-col>
		</el-row>

		<h4>预订信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				主要联系人：{{orderInfo.keyContacts}} <span v-if="orderInfo.sexType!==null&&orderInfo.sexType!==undefined">({{orderInfo.sexType==0?'先生':'女士'}})</span>
			</el-col>
			<el-col :span="6">主要联系人电话：{{orderInfo.keyContactsPhone}}</el-col>
			<el-col :span="6" v-if="orderInfo.isAddTourist">已添加为常用旅客</el-col>
		</el-row>
		<el-table :data="priceTable" border style="width: 100%" :span-method="arraySpanMethod">
			<el-table-column prop="type" label="">
			</el-table-column>
			<el-table-column label="成人" >
				<template slot-scope="scope">
					<span  v-if="scope.row.num<=2">{{scope.row.adult}}</span>
					<span  v-else>{{scope.row.total}}</span>
				</template>
			</el-table-column>
			<el-table-column label="儿童">
				<template slot-scope="scope">
					<span v-if="scope.row.num<=2">{{scope.row.child}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="baby" label="婴儿">
				<template slot-scope="scope">
					<span v-if="scope.row.num<=2">{{scope.row.baby}}</span>
				</template>
			</el-table-column>
		</el-table>
		
		<h4>附加费</h4>
		<el-table :data="orderInfo.surcharges" border max-height="300">
			<el-table-column label="费用名" prop="name">
			</el-table-column>
			<el-table-column label="价格" prop="price">
			</el-table-column>
			<el-table-column label="数量"  prop="quantity">
			</el-table-column>
			<el-table-column label="说明" prop="remark">
			</el-table-column>
		</el-table>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				附加费合计：{{orderInfo.surcharge}} 
			</el-col>
			<el-col :span="6">优惠：{{orderInfo.discounts}}</el-col>
			<el-col :span="6" >总价：{{orderInfo.orderAmount}}</el-col>
		</el-row>
		
		<h4>旅客信息</h4>
		<el-table :data="orderInfo.passengers" border style="width: 100%" max-height="300">
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column label="旅客类型" align="center">
				<template slot-scope="scope">
					<span>{{PassengerTypeList[scope.row.passengerType]}}</span>
				</template>
			</el-table-column>
			<el-table-column  label="性别" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.sexType!==null&&scope.row.sexType!==undefined">{{scope.row.sexType==0?'男':'女'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="证件类型" align="center">
				<template slot-scope="scope">
					<span>{{IDTypeList[scope.row.idType]}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="idNumber" label="证件号码" align="center" width="180">
			</el-table-column>
			<el-table-column label="出生日期" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.birthDate?scope.row.birthDate.split('T')[0]:''}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="phone" label="手机号码" align="center">
			</el-table-column>
			<el-table-column prop="ticketNumber" label="机票号" align="center">
			</el-table-column>
		</el-table>
		
		<h4>备注</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="24">
				{{orderInfo.remark||'暂无备注'}}
			</el-col>
		</el-row>
		
		<h4 v-if="orderInfo.reservedOrderNo">预留单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row" v-if="orderInfo.reservedOrderNo">
			<el-col :span="24">
				预留单号：<span @click="goDanDtail" class="link-address">{{orderInfo.reservedOrderNo}}</span>
			</el-col>
		</el-row>

		<h4>操作日志</h4>
		<el-table ref="voyageTable" :data="orderInfo.orderLogs" highlight-current-row style="width: 100%"  max-height="300">
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
				orderInfo:{},
				passagerTable:[],
				priceTable:[{
					num:1,
					type:'价格',
					adult:null,
					child:null,
					baby:null
				},{
					num:2,
					type:'数量',
					adult:null,
					child:null,
					baby:null
				},{
					num:3,
					type:'金额小计',
					total:null,
				}],
				operationType: [ '添加', '修改', '取消', '定价销售' ],
				viewLoading:false,
				PassengerTypeList:['成人','儿童','婴儿'],
				IDTypeList:['身份证','护照','驾驶证'],
			}
		},
		mounted() {
		    this.getBasicInfo();
		},
		methods:{
			//获取信息
			getBasicInfo(){
				this.viewLoading=true;
				this.airHttp.get(`api/AirTicketOrder/GetTicketOrderInfo?OrderNo=${this.$route.params.id}`)
				.then((res)=>{
						this.viewLoading=false
						let objects=res.data.objects[0];
						this.priceTable[0].adult=objects.adultPrice;
						this.priceTable[0].child=objects.childPrice;
						this.priceTable[0].baby=objects.babyPrice;
						this.priceTable[1].adult=objects.adultQuantity;
						this.priceTable[1].child=objects.childQuantity;
						this.priceTable[1].baby=objects.babyQuantity;
						this.priceTable[2].total=objects.amount;
						this.orderInfo=objects;
				})
				.catch((err)=>{
					console.log(err)
				})
			},

			//返回列表
			getReturn(){
				this.$router.go(-1)
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 2) {
					if (columnIndex === 1) {
						return [1, 3];
					} 
				}
			
			},
			goDanDtail(){
				this.$router.push({path:`/airplane/reservation-detail/${this.orderInfo.id}`})
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