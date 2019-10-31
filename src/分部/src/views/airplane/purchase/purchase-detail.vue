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
		<el-col :span="6">开航日期：{{procurementData.startTime?procurementData.startTime.split('T')[0]:''}}</el-col>
			<el-col :span="6">停航日期：{{procurementData.endTime?procurementData.endTime.split('T')[0]:''}}</el-col>
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
			<el-col :span="6">采购日期：{{procurementData.procurementDate?procurementData.procurementDate.split('T')[0]:''}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="20">航班飞行总次数：{{procurementData.amount||160}}次 x 利用率：{{procurementData.amount||80}}% = 保底飞行次数：{{procurementData.amount||128}} 次</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="20">备注：{{procurementData.remark}}</el-col>
		</el-row>

		<h4>航班信息</h4>
		<el-table :data="spaceInfo" border style="width: 100%" :span-method="arraySpanMethod">
			<el-table-column prop="type" label="舱位类型">
			</el-table-column>
			<el-table-column label="座位数" prop="seatCount" >
			</el-table-column>
			<el-table-column label="定价信息">
				<template slot-scope="scope">
					<span v-if="!scope.row.isLastOne" @click="handleViewPricing(scope.row)" class="link-address">查看定价</span>
				</template>
			</el-table-column>
		</el-table>
		
		<h4>航班信息</h4>
		<el-table ref="voyageTable" :data="flightInfoData.airTicketPricingSaless" highlight-current-row style="width: 100%">
			<el-table-column type="index" label="序号" width="50" >
			</el-table-column>
			<el-table-column property="address" label="航空公司">
			</el-table-column>
			<el-table-column property="address" label="航班号">
			</el-table-column>
			<el-table-column property="address" label="出发地">
			</el-table-column>
			<el-table-column property="address" label="目的地">
			</el-table-column>
			<el-table-column property="address" label="出发日期">
			</el-table-column>
			<el-table-column property="address" label="舱位">
			</el-table-column>
			<el-table-column property="address" label="起飞时间">
			</el-table-column>
			<el-table-column property="address" label="到达时间">
			</el-table-column>
			<el-table-column property="address" label="飞行时长">
			</el-table-column>
			<el-table-column property="address" label="起飞机场">
			</el-table-column>
			<el-table-column property="address" label="到达机场">
			</el-table-column>
		</el-table>

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
					{{scope.row.creationTime?scope.row.creationTime.split('T')[0]:''}}
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
				viewLoading:false,
				spaceInfo:[{
					type:'价格',
					seatCount:2,
				},{
					type:'数量',
					seatCount:3,
				}],
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
							let newObj1={
								type:'座位数合计',
								seatCount:5,
								isLastOne:true,
							}
							this.spaceInfo.push(newObj1);
						}
					})
			},
		    indexMethod(index){
		    	return index+1
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
				console.log(row )
				if (rowIndex === 2) {
					if (columnIndex === 1) {
						return [1, 2];
					} 
				}
			},
			handleViewPricing(row){
				this.$router.push({path:'/airplane/view-pricing'})
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