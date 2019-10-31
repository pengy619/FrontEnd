<template>
	<div class="view" v-loading="viewLoading">
		<h4>采购单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="8">采购单号：{{procurementData.procurementNo}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{procurementData.flightTypeName}}</el-col>
			<el-col :span="6">航线：{{procurementData.airRoute}}</el-col>
			<el-col :span="6">航空公司：{{procurementData.airlineName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
		<el-col :span="6">开航日期：{{procurementData.startTime.split('T')[0]}}</el-col>
			<el-col :span="6">停航日期：{{procurementData.endTime.split('T')[0]}}</el-col>
			<el-col :span="6">航程类型：{{procurementData.voyageType}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">出发地：{{procurementData.departProvinceName}}</el-col>
			<el-col :span="6">目的地：{{procurementData.arriveProvinceName}}</el-col>
			<el-col :span="6">航程天数：{{procurementData.numberOfDays}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">机型：{{procurementData.planeModelName}}</el-col>
			<el-col :span="6">座位数：{{procurementData.quantity}}</el-col>
			<el-col :span="6">总成本：{{procurementData.totalCost}}</el-col>		
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">供应商：{{procurementData.supplierName}}</el-col>
			<el-col :span="6">采购日期：{{procurementData.procurementDate.split('T')[0]}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">备注：{{procurementData.remark}}</el-col>
		</el-row>
		<div v-if="flightInfoData.airTicketPricingSaless.length > 0" v-loading="tableLoading">
			<h4>航班信息</h4>
			<el-button-group>
				<el-button :type="sellType==0?'primary':''" size="small" @click="sellType=0">去程</el-button>
				<el-button size="small" :type="sellType==1?'primary':''" v-if="procurementData.voyageType == '往返'" @click="sellType=1">回程</el-button>
			</el-button-group>
			<div class="air-info-box">
				<el-alert :title="'① 去程：  '+flightInfoData.departAirport.cityName+'→'+flightInfoData.arriveAirport.cityName" type="success" :closable="false">
				</el-alert>

				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="6">航班号：{{flightInfoData.flightNo}}</el-col>
					<el-col :span="6">起飞机场：{{flightInfoData.departAirport.airportName}}</el-col>
					<el-col :span="6">到达机场：{{flightInfoData.arriveAirport.airportName}}</el-col>
				</el-row>
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="6">起飞时间：{{flightInfoData.departTime}}</el-col>
					<el-col :span="6">抵达时间：{{flightInfoData.arriveTime}}</el-col>
					<el-col :span="6">飞行时长：{{flightInfoData.flightDurationHours}}小时{{flightInfoData.flightDurationMinutes}}分钟</el-col>
				</el-row>
				<h5>定价体系</h5>
				<el-table :data="airTicketPricingSales" border style="width: 100%">
					<el-table-column prop="priceName" label="" width="180">
					</el-table-column>
					<el-table-column prop="adultPrice" label="成人">
					</el-table-column>
					<el-table-column prop="childPrice" label="儿童">
					</el-table-column>
					<el-table-column prop="babyPrice" label="婴儿">
					</el-table-column>
					<el-table-column prop="currencyPrice" label="币种">
					</el-table-column>
				</el-table>
				<h5>航程信息</h5>
				<el-table ref="voyageTable" :data="flightInfoData.airTicketPricingSaless" highlight-current-row style="width: 100%">
					<el-table-column type="index" label="序号" width="50" >
					</el-table-column>
					<el-table-column property="departDate" label="出发日期">
						<template slot-scope="scope">
							{{scope.row.departDate.split('T')[0]}}
						</template>
					</el-table-column>
					<el-table-column label="出发地" >
						<template scope="scope">
							{{flightInfoData.departAirport.cityName}}
						</template>	
					</el-table-column>
					<el-table-column  label="目的地">
						<template scope="scope">
							{{flightInfoData.arriveAirport.cityName}}
						</template>	
					</el-table-column>
					<el-table-column label="起飞时间">
						<template scope="scope">
							{{flightInfoData.departTime}}
						</template>
					</el-table-column>
					<el-table-column label="到达时间">
						<template scope="scope">
							{{flightInfoData.arriveTime}}
						</template>
					</el-table-column>
					<el-table-column property="address" label="舱位">
					</el-table-column>
					<el-table-column property="quantity" label="座位数">
					</el-table-column>
					<el-table-column property="costPrice" label="单座位成本">
					</el-table-column>
					<el-table-column label="成本小计">
						<template scope="scope">
							{{scope.row.costPrice * scope.row.quantity}}
						</template>
					</el-table-column>
				</el-table>
				<h5>政策信息</h5>
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="6">政策名称：{{refundRule.ruleName}}</el-col>
					<el-col :span="8">退票规则：{{enumRefundRule[refundRule.refundRule]}}</el-col>
				</el-row>
				<div v-if="refundRule.refundRule == 1">
					<el-table :data="refundRules" border style="width: 100%">
						<el-table-column prop="refundData" label="退票时间">
						</el-table-column>
						<el-table-column prop="refundWay" label="退票方式">
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>

	 	<h4>操作日志</h4>
		<el-table ref="voyageTable" :data="procurementData.airTicketPOperatingRecorDtos" highlight-current-row style="width: 100%">
				<el-table-column property="pOperationType" label="操作类型">
					<template slot-scope="scope">
						{{operationType[scope.row.pOperationType]}}
					</template>
				</el-table-column>
				<el-table-column property="content" label="操作内容" >
				</el-table-column>
				<el-table-column property="boSysAccountNmae" label="操作人">
				</el-table-column>
				<el-table-column property="creationTime" label="操作时间">
					<template slot-scope="scope">
						{{scope.row.creationTime.split('T')[0]}}
					</template>
				</el-table-column>
		</el-table>

		<div class="footer-control-wrap">
			<el-button size="small" @click="$router.go(-1)">返回</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				procurementData: {},
				airTicketPricingSales:[],
				refundRule:{},
				refundRules:[],
				flightInfoData:[],
				sellType:0,
				operationType: [ '添加', '修改', '删除', '取消', '定价销售', '退切' ],
				currency: [ '人民币', '欧元', '美元' ],
				enumRefundRule: [ '无条件可退', '有条件可退', '不可退' ],
				enumRefundWay: [ '全部', '可退', '不可退', '可退但需额外支付(固定金额)', '可退但需额外支付(固定比例)' ],
				tableLoading:false,
				viewLoading:false
			}
		},
		mounted () {
			this.viewLoading=true;
			this.getAirTicketProcurement();
			this.getAirTicketFlightInfo(this.sellType);
		},
		watch: {
			'sellType':function(){
				this.getAirTicketFlightInfo(this.sellType);
			}
		},
		methods:{
			getAirTicketProcurement() {
				this.tableLoading = true
				this.airHttp.get('/api/Procurement/getairTicketProcurementSingle?airTicketProcurementId='+this.$route.params.id)
					.then((res)=>{
						if(res.data.isSuccess){
							this.procurementData = res.data.objects[0];
						}
						this.tableLoading = false;
					})
			},
			getAirTicketFlightInfo(sellType) {
				this.tableLoading = true
				this.airHttp.get('/api/Procurement/getairTicketFlightInfo?airTicketProcurementId='+this.$route.params.id +'&sellType=' + sellType)
					.then((res)=>{
						if(res.data.isSuccess){
							let object =  res.data.objects[0];
							if(object.airTicketPricingSaless.length>0){
								object.airTicketPricingSaless.forEach((obj)=>{
									if(obj.isPricing){
										this.refundRule = obj.refundRule;
										this.refundRules = [{
											refundData : '航班起飞前'+ obj.refundRule.refundTimeStart + '小时前',
											refundWay: this.enumRefundWay[obj.refundRule.refundWay] + (obj.refundRule.refundWay == 3 || obj.refundRule.refundWay == 4 ? obj.refundRule.limit + (obj.refundRule.refundWay == 3 ? '元' : '%') : '')
										},{
											refundData : '航班起飞后'+ obj.refundRule.refundTimeEnd + '小时',
											refundWay: this.enumRefundWay[obj.refundRule.refundWayTimeEnd] + (obj.refundRule.refundWayTimeEnd == 3 || obj.refundRule.refundWayTimeEnd == 4 ? obj.refundRule.limitTimeEnd + (obj.refundRule.refundWayTimeEnd == 3 ? '元' : '%') : '')
										}];
										this.airTicketPricingSales= [
										{
											priceName:'来价',
											adultPrice: obj.costPrice,
											childPrice: obj.costPrice,
											babyPrice: obj.costPrice,
											currencyPrice: this.currency[0],//来价默认人民币
										},{
											priceName:'媒体外卖价',
											adultPrice: obj.directGuestAdult,
											childPrice: obj.directGuestChild,
											babyPrice: obj.directGuestBaby,
											currencyPrice: this.currency[obj.directGuestCurrency],
										},{
											priceName:'同行价',
											adultPrice: obj.peerPriceAdult,
											childPrice: obj.peerPriceChild,
											babyPrice: obj.peerPriceBaby,
											currencyPrice: this.currency[obj.peerPriceCurrency],
										},{
											priceName:'加盟结算价',
											adultPrice: obj.joinPriceAdult,
											childPrice: obj.joinPriceChild,
											babyPrice: obj.joinPriceBaby,
											currencyPrice: this.currency[obj.joinPriceCurrency],
										},{
											priceName:'直客销售价',
											adultPrice: obj.marketPriceAdult,
											childPrice: obj.marketPriceChild,
											babyPrice: obj.marketPriceBaby,
											currencyPrice: this.currency[obj.marketPriceCurrency],
										},{
											priceName:'内部价',
											adultPrice: obj.internalPriceAdult,
											childPrice: obj.internalPriceChild,
											babyPrice: obj.internalPriceBaby,
											currencyPrice: this.currency[obj.internalPriceCurrency],
										}]
										object.airTicketPricingSaless.splice(object.airTicketPricingSaless.indexOf(obj),1);
										return true;
									}
								})
							}
							this.flightInfoData = object;
							this.tableLoading = false;
							this.viewLoading=false;
						}
					})
			},
		    indexMethod(index){
		    	return index+1
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