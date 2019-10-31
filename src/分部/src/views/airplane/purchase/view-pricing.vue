<template>
	<div class="view" v-loading="viewLoading">
		<el-table :data="airTicketPricingSales" border style="width: 100%">
			<el-table-column prop="priceName" label="舱位类型">
			</el-table-column>
			<el-table-column prop="adultPrice" label="座位数">
			</el-table-column>
		</el-table>
		
		<h4>定价体系</h4>
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
		<h4>政策信息</h4>
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
			

	 	<h4>航程信息</h4>
		<el-table ref="voyageTable" :data="procurementData.airTicketPOperatingRecorDtos" max-height="290" highlight-current-row style="width: 100%">
			<el-table-column type="index" label="序号" width="50" >
			</el-table-column>
			<el-table-column property="address" label="出发日期">
			</el-table-column>
			<el-table-column property="address" label="出发地">
			</el-table-column>
			<el-table-column property="address" label="目的地">
			</el-table-column>
			<el-table-column property="address" label="起飞时间">
			</el-table-column>
			<el-table-column property="address" label="到达时间">
			</el-table-column>
			<el-table-column property="address" label="舱位">
			</el-table-column>
			<el-table-column property="address" label="座位数">
			</el-table-column>
			<el-table-column property="address" label="单座位成本">
			</el-table-column>
			<el-table-column property="address" label="成本小计">
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
			// this.viewLoading=true;
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