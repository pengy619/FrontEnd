<template>
	<div class="view" v-loading="tableLoading">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				商品编号：{{this.basicInfo.productNo}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班类型:  {{flightType[this.basicInfo.flightType]}} 
			</el-col>
			<el-col :span="6">航空公司：{{this.basicInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{this.basicInfo.flightNo}} 
			</el-col>
			<!-- <el-col :span="6">出发日期：{{this.basicInfo.departDate.split('T')[0]}}</el-col> -->
			 <el-col :span="6">出发日期：{{this.basicInfo.departDate!=null?this.basicInfo.departDate.split('T')[0]:''}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{this.basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{this.basicInfo.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{this.basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{this.basicInfo.arriveTime}} </el-col>
			<el-col :span="6">飞行时长：{{this.basicInfo.flightDurationHours+'小时'+this.basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{this.basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}}</el-col>
		</el-row>
		<!-- <el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="4">
				上架状态：已上架
			</el-col>
		</el-row> -->
		
		<h4>库存信息</h4>
		<el-table :data="stockData" border style="width: 100%">
			<el-table-column prop="total" label="座位数">
			</el-table-column>
			<el-table-column prop="kongwei" label="控位">
			</el-table-column>
			<el-table-column prop="qiewei" label="切位">
			</el-table-column>
			<el-table-column prop="shouke" label="收客">
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
			<el-table-column prop="price1" label="成人" align="center">
			</el-table-column>
			<el-table-column prop="price2" label="儿童" align="center">
			</el-table-column>
			<el-table-column prop="price3" label="婴儿" align="center">
			</el-table-column>
			<el-table-column prop="currency" label="币种" align="center">
				<template slot-scope="scope">
			        {{CurrencyType[scope.row.currency]}}
			    </template>
			</el-table-column>
		</el-table>
		
		<h4>政策信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">政策名称：{{RefundRuleModel.ruleName||'无'}}</el-col>
			<el-col :span="8">退票规则：{{enumRefundRule[RefundRuleModel.refundRule]||'无'}}</el-col>
		</el-row>
		<el-table :data="ruleData" border style="width: 100%" v-if="this.RefundRuleModel.refundRule==1">
			<el-table-column prop="refundDate" label="退票时间" width="180">
			</el-table-column>
			<el-table-column prop="refundType" label="退票方式" align="center">
			</el-table-column>
		</el-table>
		
		<h4>库存调配记录</h4>
		<el-table :data="logData" border style="width: 100%">
			<el-table-column prop="operatingRecordType" label="操作类型" width="180">
				<template slot-scope="scope">
			        {{oprationType[scope.row.operatingRecordType]}}
			    </template>
			</el-table-column>
			<el-table-column prop="thisTimeNumber" label="调整" align="center">
			</el-table-column>
			<el-table-column prop="operatorName" label="操作人" align="center">
			</el-table-column>
			<el-table-column prop="creationTime" label="操作时间" align="center">
				<template slot-scope="scope">
						{{scope.row.creationTime.split('T')[0]}}
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
				stockData:[{
					total:0,
					kongwei:0,
					qiewei:0,
					shouke:0,
					yuwei:0,
					shuaiwei:0
				}],
				tableData: [{
					priceName: '来价',
					price1: '',
					price2: '',
					price3: '',
					currency: 0
				}, {
					priceName: '媒体外卖价(元)',
					price1: '',
					price2: '',
					price3: '',
					currency: '人民币'
				}, {
					priceName: '同行价(元)',
					price1: '',
					price2: '',
					price3: '',
					currency: '人民币'
				}, {
					priceName: '加盟结算价（元）',
					price1: '',
					price2: '',
					price3: '',
					currency: '人民币'
				}, {
					priceName: '直客销售价（元）',
					price1: '',
					price2: '',
					price3: '',
					currency: '人民币'
				}, {
					priceName: '内部价（元）',
					price1: '',
					price2: '',
					price3: '',
					currency: '人民币'
				}],
				RefundRuleModel:{},
		        ruleData:[{
		        	refundDate:"",
		        	refundType:""
				},
				{
		        	refundDate:"",
		        	refundType:""
				}],
				enumRefundRule: [ '无条件可退', '有条件可退', '不可退' ],
				logData:[],
				flightType:['国内','国外'],
				oprationType:['切位','控位','甩位'],
				CurrencyType:['人民币','美元','港币','欧元'],
				RefundWay:['全部','可退','不可退','可退但需额外支付(固定金额)','可退但需额外支付(固定比例)'],
				tableLoading:false,
			}
		},
		mounted() {
			this.tableLoading=true;
		    this.getBasicInfo();
			this.getPricingSalesInfo()
		},
		methods:{
			//获取采购单信息
				getBasicInfo(){
					this.airHttp.get('/api/Common/GetDetailsTop?pricingSalesId='+this.$route.params.id+'&operatingRecordId=0')
					.then((res)=>{
						var restop=res.data.objects[0];
						restop.departTime=restop.departTime.replace('T',' ').replace('Z','').substring(0,16);
						restop.arriveTime=restop.arriveTime.replace('T',' ').replace('Z','').substring(0,16);
						this.basicInfo=restop;

						this.stockData[0].total=res.data.objects[0].quantity;   				//总座位数
						this.stockData[0].kongwei=res.data.objects[0].reservedQuantity;        //控位数量
						this.stockData[0].qiewei=res.data.objects[0].saleQuantity;   			//切位数量
						this.stockData[0].yuwei=res.data.objects[0].remainingQuantity;   		//余位数量  
						this.stockData[0].shuaiwei=res.data.objects[0].reductionSaleQuantity;	//甩位数量

						//console.log(res.data.objects[0]);
					})
				},
				//获取定价体系
				getPricingSalesInfo(){
					this.airHttp.get('/api/products/GetPricingSalesInfo?PricingSalesId='+this.$route.params.id)
					.then((res)=>{
							this.tableData[0].price1=res.data.objects[0].costPrice;   				
							this.tableData[0].price2=res.data.objects[0].costPrice;        	
							this.tableData[0].price3=res.data.objects[0].costPrice;   			
							this.tableData[0].currency=0;     

							this.tableData[1].price1=res.data.objects[0].directGuestAdult;   				
							this.tableData[1].price2=res.data.objects[0].directGuestChild;        	
							this.tableData[1].price3=res.data.objects[0].directGuestBaby;   			
							this.tableData[1].currency=res.data.objects[0].directGuestCurrency;   

							this.tableData[2].price1=res.data.objects[0].peerPriceAdult;   				
							this.tableData[2].price2=res.data.objects[0].peerPriceChild;        	
							this.tableData[2].price3=res.data.objects[0].peerPriceBaby;   			
							this.tableData[2].currency=res.data.objects[0].peerPriceCurrency;  
							
							this.tableData[3].price1=res.data.objects[0].joinPriceAdult;   				
							this.tableData[3].price2=res.data.objects[0].joinPriceChild;        	
							this.tableData[3].price3=res.data.objects[0].joinPriceBaby;   			
							this.tableData[3].currency=res.data.objects[0].joinPriceCurrency;  
							
							this.tableData[4].price1=res.data.objects[0].marketPriceAdult;   				
							this.tableData[4].price2=res.data.objects[0].marketPriceChild;        	
							this.tableData[4].price3=res.data.objects[0].marketPriceBaby;   			
							this.tableData[4].currency=res.data.objects[0].marketPriceCurrency;  
							
							this.tableData[5].price1=res.data.objects[0].internalPriceAdult;   				
							this.tableData[5].price2=res.data.objects[0].internalPriceChild;        	
							this.tableData[5].price3=res.data.objects[0].internalPriceBaby;   			
							this.tableData[5].currency=res.data.objects[0].internalPriceCurrency;  
							
							this.RefundRuleModel=res.data.objects[0].refundRule;  //退票规则
							if(this.RefundRuleModel!=null)
							{
								if(this.RefundRuleModel.refundRule==1)  //有条件可退
								{
									let refundWayId=res.data.objects[0].refundRule.refundWay;
									let strLimit="";
									if(refundWayId==3)
									{
										strLimit=res.data.objects[0].refundRule.limit+"元";
									}
									if(refundWayId==4)
									{
										strLimit=""+res.data.objects[0].refundRule.limit+"%";
									}
									this.ruleData[0].refundDate="起飞前"+res.data.objects[0].refundRule.refundTimeStart+"小时";
									this.ruleData[0].refundType=this.RefundWay[refundWayId]+"  " +strLimit; 

									let refundWayTimeEndId=res.data.objects[0].refundRule.refundWayTimeEnd;
									let strLimietEnd="";
									if(refundWayTimeEndId==3){
										strLimietEnd=res.data.objects[0].refundRule.limitTimeEnd+"元";
									}
									if(refundWayTimeEndId==4)
									{
										strLimietEnd=+res.data.objects[0].refundRule.limitTimeEnd+"%";
									}
									this.ruleData[1].refundDate="起飞后"+res.data.objects[0].refundRule.refundTimeEnd+"小时";
									this.ruleData[1].refundType=this.RefundWay[refundWayTimeEndId]+"  " +strLimietEnd; 
								}
							}
							else{
								var ruleName="";
								this.RefundRuleModel=ruleName;
							}
							this.logData=res.data.objects[0].airTicketOperatingRecords;  //销售操作记录
							this.tableLoading=false;
												
					})
					.catch((err)=>{
						console.log(err)
					})
				},

				//返回列表
				getReturn(){
					this.$router.push({name:'stock-list'})
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