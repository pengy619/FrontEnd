<template>
	<div class="view" v-loading="tableLoading">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="8">
				商品编号：{{obj.productNo}}
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{obj.flightType}}</el-col>
			<el-col :span="6">航空公司：{{obj.airlineName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{obj.flightNo}}
			</el-col>
			<el-col :span="6">出发日期：{{obj.departDate}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{obj.departProvinceName}}
			</el-col>
			<el-col :span="6">目的地：{{obj.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{obj.departTime}}
			</el-col>
			<el-col :span="6">到达时间：{{obj.arriveTime}}</el-col>
			<el-col :span="8">飞行时长：{{obj.flightDurationHours+"小时"+obj.flightDurationMinutes+"分钟"}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{obj.departAirporName}}
			</el-col>
			<el-col :span="6">到达机场：{{obj.arriveAirportName}}</el-col>
		</el-row>
		
		<h4>库存信息</h4>
		<el-table :data="stockTable" border style="width: 100%">
			<el-table-column prop="type" label="">
			</el-table-column>
			<el-table-column prop="total" label="座位数">
			</el-table-column>
			<el-table-column prop="kongwei" label="控位">
			</el-table-column>
			<el-table-column prop="qiewei" label="切位">
			</el-table-column>
			<el-table-column prop="yuwei" label="余位">
			</el-table-column>
			<el-table-column prop="shuaiwei" label="甩位">
			</el-table-column>
		</el-table>
		
		<h4>定价体系</h4>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="priceName" label="" width="180">
			</el-table-column>
			<el-table-column prop="adultPrice" label="成人" align="center">
			</el-table-column>
			<el-table-column prop="childPrice" label="儿童" align="center">
			</el-table-column>
			<el-table-column prop="babyPrice" label="婴儿" align="center">
			</el-table-column>
			<el-table-column prop="currency" label="币种" align="center">
			</el-table-column>
		</el-table>
		
		<h4>政策信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">政策名称：{{obj2.refundRule.ruleName||'无'}}</el-col>
			<el-col :span="8">退票规则：{{enumRefundRule[obj2.refundRule.refundRule]||'无'}}</el-col>
		</el-row>
		<el-table :data="ruleData" border style="width: 100%" v-if="obj2.refundRule.refundRule==1">
			<el-table-column prop="refundTime" label="退票时间">
			</el-table-column>
			<el-table-column prop="refundWay" label="退票方式">
			</el-table-column>
		</el-table>
		
		<div class="footer-control-wrap">
			<el-button size="small" @click="handleCancel">返回</el-button>
		</div>
	</div>
</template>

<script>
	//caijiongrui
	export default {
		data() {
			return {
				obj:{},
				obj2:{
					refundRule:{
						ruleName:'',
						refundTimeStart:'',
						ways:'',
						refundTimeEnd:'',
						endWays:''
					},
				},
				stockTable:[{
		        	type:'当前',
		        	total:0,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        	// currency:'1'
		        },{
		        	type:'调整后',
		        	total:0,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        	// currency:'1'
				}],
				tableData: [],
				ruleData:[{
					refundTime:'',
		        	refundWay:'',
				},{
					refundTime:'',
		        	refundWay:'',
				}],
				enumRefundRule: [ '无条件可退', '有条件可退', '不可退' ],
				tableLoading:false,
			}
		},
		mounted(){
			this.getInfo()
		},
		methods:{
			getInfo(){
				this.tableLoading=true;
				//+this.$route.params.pricingSalesId
				this.airHttp.get('api/Common/GetDetailsTop?operatingRecordId='+this.$route.query.id+'&pricingSalesId='+this.$route.query.pricingSalesId)
				.then((res)=>{
					this.tableLoading=false;

					var objects=res.data.objects[0];
					objects.departDate=objects.departDate.split(/T/)[0];
					objects.flightType=objects.flightType==0?'国内':'国外';
					this.obj=objects;

					this.stockTable[0].total=res.data.objects[0].quantity;   				//总座位数
					this.stockTable[0].kongwei=res.data.objects[0].reservedQuantity;        //控位数量
					this.stockTable[0].qiewei=res.data.objects[0].saleQuantity;   			//切位数量
					this.stockTable[0].yuwei=res.data.objects[0].remainingQuantity;   		//余位数量
					this.stockTable[0].shuaiwei=res.data.objects[0].reductionSaleQuantity;	//甩位数量

					this.stockTable[1].total=res.data.objects[0].quantity;  
					this.stockTable[1].qiewei=res.data.objects[0].saleQuantity;
					this.stockTable[1].kongwei=res.data.objects[0].reservedQuantity;      
					this.stockTable[1].shuaiwei=res.data.objects[0].reductionSaleQuantity;
					this.stockTable[1].yuwei=res.data.objects[0].remainingQuantity; 
				})
				//+this.$route.params.id  +this.$route.query.id
				this.airHttp.get('api/AirTicketOperatingRecord/GetAirTicketJilt?operatingRecordId='+this.$route.query.id)
				.then((res)=>{
					var objects=res.data.objects[0];
					if(objects.refundRule&&objects.refundRule.refundRule==1){
						if(objects.refundRule.refundWay==0){
							objects.refundRule['ways']='全部';
						}else if(objects.refundRule.refundWay==1){
							objects.refundRule['ways']='可退';
						}else if(objects.refundRule.refundWay==2){
							objects.refundRule['ways']='不可退';
						}else if(objects.refundRule.refundWay==3){
							objects.refundRule['ways']='可退但需额外支付'+objects.refundRule.limit+'元';
						}else if(objects.refundRule.refundWay==4){
							objects.refundRule['ways']='可退但需额外支付定价的'+objects.refundRule.limit+'%';
						}

						if(objects.refundRule.refundWayTimeEnd==0){
							objects.refundRule['endWays']='全部';
						}else if(objects.refundRule.refundWayTimeEnd==1){
							objects.refundRule['endWays']='可退';
						}else if(objects.refundRule.refundWayTimeEnd==2){
							objects.refundRule['endWays']='不可退';
						}else if(objects.refundRule.refundWayTimeEnd==3){
							objects.refundRule['endWays']='可退但需额外支付'+objects.refundRule.Limit+'元';
						}else if(objects.refundRule.refundWayTimeEnd==4){
							objects.refundRule['endWays']='可退但需额外支付定价的'+objects.refundRule.Limit+'%';
						}
						this.ruleData[0].refundTime='航班起飞前'+objects.refundRule.refundTimeStart+'小时前';
						this.ruleData[0].refundWay=objects.refundRule.ways;
						this.ruleData[1].refundTime='航班起飞后'+objects.refundRule.refundTimeEnd+'小时';
						this.ruleData[1].refundWay=objects.refundRule.endWays;
					}
					
					var objlaijia={
						priceName:'来价',
						adultPrice:objects.costPrice,
						childPrice:objects.costPrice,
						babyPrice:objects.costPrice,
						currency:0,
					}
					var objzhike={
						priceName:'媒体外卖价',
						adultPrice:objects.jiGoDirectGuestAdult,
						childPrice:objects.jiGoDirectGuestChild,
						babyPrice:objects.jiGoDirectGuestBaby,
						currency:objects.jiGoDirectGuestCurrency,
					}
					var objtonghang={
						priceName:'同行价',
						adultPrice:objects.jiGoPeerPriceAdult,
						childPrice:objects.jiGoPeerPriceChild,
						babyPrice:objects.jiGoPeerPriceBaby,
						currency:objects.jiGoPeerPriceCurrency,
					}
					var objjiameng={
						priceName:'加盟结算价',
						adultPrice:objects.jiGoJoinPriceAdult,
						childPrice:objects.jiGoJoinPriceChild,
						babyPrice:objects.jiGoJoinPriceBaby,
						currency:objects.jiGoJoinPriceCurrency,
					}
					var objmenshi={
						priceName:'直客销售价',
						adultPrice:objects.jiGoMarketPriceAdult,
						childPrice:objects.jiGoMarketPriceChild,
						babyPrice:objects.jiGoMarketPriceBaby,
						currency:objects.jiGoMarketPriceCurrency,
					}
					var objneibu={
						priceName:'内部价',
						adultPrice:objects.jiGoInternalPriceAdult,
						childPrice:objects.jiGoInternalPriceChild,
						babyPrice:objects.jiGoInternalPriceBaby,
						currency:objects.jiGoInternalPriceCurrency,
					}
					var newArr=[];
					newArr.push(objlaijia)
					newArr.push(objzhike)
					newArr.push(objtonghang)
					newArr.push(objjiameng)
					newArr.push(objmenshi)
					newArr.push(objneibu)
					newArr.forEach((item,index) => {
						if(item.currency==0){
							newArr[index].currency='人民币'
						}else if(item.currency==1){
							newArr[index].currency='美元'
						}else if(item.currency==2){
							newArr[index].currency='港币'
						}else{
							newArr[index].currency='欧元'
						}
						
					});
					this.tableData=newArr;
					this.obj2=objects;
				})
				
			},
			handleCancel(){
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