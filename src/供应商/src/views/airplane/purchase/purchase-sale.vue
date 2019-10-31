<template>
	<div class="view">
		<h4>采购单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				采购单号：{{info.procurementNo}}
			</el-col>
			
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{info.flightType==0?'国内':'国外'}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航线：{{info.airRoute}}</el-col>
			<el-col :span="6">
				航空公司：{{info.airline.name}}
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">开航日期：{{info.startTime.split('T')[0]}}</el-col>
			<el-col :span="6">停航日期：{{info.endTime.split('T')[0]}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航程类型：{{info.voyageType==0?'单程':'往返'}}
			</el-col>
			<el-col :span="6">出发地：{{info.departProvinceName}}</el-col>
			<el-col :span="6">目的地：{{info.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航程天数：{{info.numberOfDays}}
			</el-col>
			<el-col :span="6">机型：{{info.airTicketPlaneModel.planeModelName}}</el-col>
			<el-col :span="6">座位数：{{info.quantity}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				总成本：{{info.totalCost}} 元
			</el-col>
			<el-col :span="6">供应商：{{info.supplierName}}</el-col>
			<el-col :span="6">采购日期：{{info.procurementDate.split('T')[0]}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="24">
				备注：{{info.remark}} 
			</el-col>
		</el-row>

		<h4>定价体系</h4>
		<el-alert :title="'① 去程：  '+info.departProvinceName+'→'+info.arriveProvinceName" type="success" :closable="false" style="margin-bottom: 20px;">
			
		</el-alert>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="priceName" label="" width="180">
			</el-table-column>
			<el-table-column prop="price1" label="成人" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price1" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price1}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price2" label="儿童" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price2" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price2}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price3" label="婴儿" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price3" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price3}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="currency" label="币种" align="center">
				<template slot-scope="scope">
				<el-select v-model="scope.row.currency" placeholder="请选择" v-if="scope.row.priceName!=='来价'">
				    <el-option
				      v-for="item in currency"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <span v-else>人民币</span>
				</template> 
			</el-table-column>
		</el-table>
		<el-form ref="form" :model="form" label-width="80px" size="small" style="margin-top: 10px;">
			<el-form-item label="政策信息">
				<span>{{goRule.ruleName?goRule.ruleName:'请选择'}}</span>
				<el-button type="primary" size="small" @click="openRulesDialog(0)">选择</el-button>
			</el-form-item>
		</el-form>


		<el-alert v-if="info.voyageType==1" :title="'② 返程：  '+info.arriveProvinceName+'→'+info.departProvinceName" type="success" :closable="false" style="margin: 20px 0">
			</el-alert>
		<el-table v-if="info.voyageType==1" :data="tableData2" border style="width: 100%">
			<el-table-column prop="priceName" label="" width="180">
			</el-table-column>
			<el-table-column prop="price1" label="成人" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price1" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price1}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price2" label="儿童" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price2" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price2}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price3" label="婴儿" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price3" :min="0" :max="99999999" style="width: 150px;" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price3}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="currency" label="币种" align="center">
				<template slot-scope="scope">
				<el-select v-model="scope.row.currency" placeholder="请选择" v-if="scope.row.priceName!=='来价'">
				    <el-option
				      v-for="item in currency"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <span v-else>人民币</span>
				</template> 
			</el-table-column>
		</el-table>
		
		<el-form ref="form" :model="form" label-width="80px" size="small" style="margin-top: 10px;">
			<el-form-item label="政策信息" v-if="info.voyageType==1">
				<span>{{backRule.ruleName?backRule.ruleName:'请选择'}}</span>
				<el-button type="primary" size="small" @click="openRulesDialog(1)">选择</el-button>
			</el-form-item>
			<el-form-item label="上架状态">
				<el-radio-group v-model="saleStatus">
				    <el-radio :label="0">上架</el-radio>
				    <el-radio :label="1">下架</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="$router.go(-1)">返回</el-button>
			</el-form-item>
		</el-form>
		
		<el-dialog title="选择退款政策" :visible.sync="dialogTableVisible">
		  <el-table :data="refundRulesData.data" v-loading="refundRulesData.loading">
		    <el-table-column property="ruleName" :show-overflow-tooltip="true" label="政策名称"></el-table-column>
		    <el-table-column label="创建时间" width="200">
				<template slot-scope="scope">
					{{scope.row.creationTime.replace('T',' ').split('.')[0]}}
				</template>
			</el-table-column>
		    <el-table-column label="更新时间" width="200">
				<template scope="scope">
					{{scope.row.lastModificationTime.replace('T',' ').split('.')[0]}}
				</template>
			</el-table-column>
		    <el-table-column label="操作" width="100">
		    	<template slot-scope="scope">
		    		<el-button type="text" @click="selectRule(scope.row)">选择</el-button>
		    	</template>
		    </el-table-column>
		  </el-table>
		  <div class="pagination">
			<el-pagination @current-change="ruleCurrentChange" :current-page="refundRulesData.index"  :page-size="refundRulesData.size" layout="total, prev, pager, next, jumper" :total="refundRulesData.total">
			</el-pagination>
		</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				info:{},
				tableData: [{
					priceName: '来价',
					price1: 200,
					price2: 200,
					price3: 200,
					currency:0
				}, {
					priceName: '媒体外卖价(元)',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '同行价(元)',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '加盟结算价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '直客销售价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '内部价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}],
				tableData2: [{
					priceName: '来价',
					price1: 300,
					price2: 300,
					price3: 300,
					currency:0
				}, {
					priceName: '媒体外卖价(元)',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '同行价(元)',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '加盟结算价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '直客销售价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}, {
					priceName: '内部价（元）',
					price1: null,
					price2: null,
					price3: null,
					currency:0
				}],
				form:{
					BranchID:1058,
					PricingSalesList:[
						{
							"DirectGuestAdult":null,
							"DirectGuestChild":null,
							"DirectGuestBaby":null,
							"DirectGuestCurrency":0,
							"PeerPriceAdult":null,
							"PeerPriceChild":null,
							"PeerPriceBaby":null,
							"PeerPriceCurrency":0,
							"JoinPriceAdult":null,
							"JoinPriceChild":null,
							"JoinPriceBaby":null,
							"JoinPriceCurrency":0,
							"MarketPriceAdult":null,
							"MarketPriceChild":null,
							"MarketPriceBaby":null,
							"MarketPriceCurrency":0,
							"InternalPriceAdult":null,
							"InternalPriceChild":null,
							"InternalPriceBaby":null,
							"InternalPriceCurrency":0,
							"ShelvesStatus":0,
							"SellType":0,
							"FlightInfoId":6,
							"RefundRuleId":0,
							ProcurementId:this.$route.params.id
						},
					]

				},
		        currency:[{
		        	label:'人民币',
		        	value:0
		        },{
		        	label:'欧元',
		        	value:1
		        },{
		        	label:'美元',
		        	value:2
		        }],
		        dialogTableVisible:false,
		        refundRulesData:{
					size:5,
					index:1,
					total:0,
					loading:false,
					data:[]
				},
				saleStatus:0,
				currentRules:0,
				goRule:{},
				backRule:{},
				submitLoading:false
			}
		},
		mounted(){
			this.getInfo()
			
		},
		methods: {
			getInfo(){
				this.airHttp.get(`/api/products/GetProcurementInfo?Id=${this.$route.params.id}`)
				.then((res)=>{
					
					this.info=res.data.objects[0]
					if(this.info.voyageType==1){
						this.form.PricingSalesList.push({
							"DirectGuestAdult":null,
							"DirectGuestChild":null,
							"DirectGuestBaby":null,
							"DirectGuestCurrency":0,
							"PeerPriceAdult":null,
							"PeerPriceChild":null,
							"PeerPriceBaby":null,
							"PeerPriceCurrency":0,
							"JoinPriceAdult":null,
							"JoinPriceChild":null,
							"JoinPriceBaby":null,
							"JoinPriceCurrency":0,
							"MarketPriceAdult":null,
							"MarketPriceChild":null,
							"MarketPriceBaby":null,
							"MarketPriceCurrency":0,
							"InternalPriceAdult":null,
							"InternalPriceChild":null,
							"InternalPriceBaby":null,
							"InternalPriceCurrency":0,
							"ShelvesStatus":0,
							"SellType":1,
							"FlightInfoId":6,
							"RefundRuleId":0,
							ProcurementId:this.$route.params.id
						})

					}

					//计算来价
					let departDateLength=0
					this.info.airTicketFlightInfos.forEach((item)=>{
						departDateLength+=item.departDate.split(',').length
					})
					let laijia=parseInt(this.info.totalCost)/parseInt(departDateLength)/parseInt(this.info.quantity)
					laijia=laijia.toFixed(2)
					this.tableData[0].price1=laijia
					this.tableData[0].price2=laijia
					this.tableData[0].price3=laijia
					if(this.info.voyageType==1){
						this.tableData2[0].price1=laijia
						this.tableData2[0].price2=laijia
						this.tableData2[0].price3=laijia
					}
				})
			},
			openRulesDialog(type){
				this.dialogTableVisible=true
				this.currentRules=type
				this.getRules()
			},
			getRules(){
				this.refundRulesData.loading=true
				this.airHttp.get(`/api/refundrule/refundruleList?Id=0&PageSize=${this.refundRulesData.size}&PageIndex=${this.refundRulesData.index}`)
				.then((res)=>{
					this.refundRulesData.loading=false
					this.refundRulesData.total=res.data.total
					this.refundRulesData.data=res.data.objects
					console.log(res.data.objects)
				})
			},
			ruleCurrentChange(val){
				this.refundRulesData.index=val
				this.getRules()
			},
			selectRule(row){
				this.form.PricingSalesList[this.currentRules].RefundRuleId=row.id
				if(this.currentRules==0){
					this.goRule=row
				}else if(this.currentRules==1){
					this.backRule=row
				}
				this.dialogTableVisible=false
			},
			onSubmit(){
				if(!this.goRule.ruleName){
					this.$message.error('请给去程选择一个退款政策');
					return false
				}
				if(this.info.voyageType==1&&!this.backRule.ruleName){
					this.$message.error('请给返程选择一个退款政策');
					return false
				}
				let hasNull=false
				this.tableData.forEach((item)=>{
					if(item.price1===0||item.price2===0||item.price3===0){
						hasNull=true
					}
				})
				if(this.info.voyageType==1){
					this.tableData2.forEach((item)=>{
						if(item.price1===0||item.price2===0||item.price3===0){
							hasNull=true
						}
					})
				}

				let tip='确认提交本次操作？'
				if(hasNull){
					tip='价格中包含0元项,确认提交本次操作？'
				}
				this.$confirm(tip, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.createFormData()
					this.submitLoading=true
					this.form.PricingSalesList=JSON.stringify(this.form.PricingSalesList)
					this.airHttp.post('/api/products/SavePricingSalesInfo',this.form)
					.then((res)=>{
						this.$message({
							message: '提交成功！',
							type: 'success'
						});
						setTimeout(()=> {
							this.submitLoading=false
							this.$router.push({name:'stock-list'})
						}, 2000);
					})
				})
				// if(hasNull){
				// 	this.$message.error('请填写完所有的价格才能提交');
				// 	return false
				// }
				console.log(this.form)
			},
			createFormData(){
				this.tableData.forEach((item,index)=>{
					if(index==1){
						this.form.PricingSalesList[0].DirectGuestAdult=item.price1
						this.form.PricingSalesList[0].DirectGuestChild=item.price2
						this.form.PricingSalesList[0].DirectGuestBaby=item.price3
						this.form.PricingSalesList[0].DirectGuestCurrency=item.currency
					}
					if(index==2){
						this.form.PricingSalesList[0].PeerPriceAdult=item.price1
						this.form.PricingSalesList[0].PeerPriceChild=item.price2
						this.form.PricingSalesList[0].PeerPriceBaby=item.price3
						this.form.PricingSalesList[0].PeerPriceCurrency=item.currency
					}
					if(index==3){
						this.form.PricingSalesList[0].JoinPriceAdult=item.price1
						this.form.PricingSalesList[0].JoinPriceChild=item.price2
						this.form.PricingSalesList[0].JoinPriceBaby=item.price3
						this.form.PricingSalesList[0].JoinPriceCurrency=item.currency
					}
					if(index==4){
						this.form.PricingSalesList[0].MarketPriceAdult=item.price1
						this.form.PricingSalesList[0].MarketPriceChild=item.price2
						this.form.PricingSalesList[0].MarketPriceBaby=item.price3
						this.form.PricingSalesList[0].MarketPriceCurrency=item.currency
					}
					if(index==5){
						this.form.PricingSalesList[0].InternalPriceAdult=item.price1
						this.form.PricingSalesList[0].InternalPriceChild=item.price2
						this.form.PricingSalesList[0].InternalPriceBaby=item.price3
						this.form.PricingSalesList[0].InternalPriceCurrency=item.currency
					}
				})
				this.form.PricingSalesList[0].ShelvesStatus=this.saleStatus
				
				if(this.info.voyageType==1){
					this.tableData2.forEach((item,index)=>{
						if(index==1){
							this.form.PricingSalesList[1].DirectGuestAdult=item.price1
							this.form.PricingSalesList[1].DirectGuestChild=item.price2
							this.form.PricingSalesList[1].DirectGuestBaby=item.price3
							this.form.PricingSalesList[1].DirectGuestCurrency=item.currency
						}
						if(index==2){
							this.form.PricingSalesList[1].PeerPriceAdult=item.price1
							this.form.PricingSalesList[1].PeerPriceChild=item.price2
							this.form.PricingSalesList[1].PeerPriceBaby=item.price3
							this.form.PricingSalesList[1].PeerPriceCurrency=item.currency
						}
						if(index==3){
							this.form.PricingSalesList[1].JoinPriceAdult=item.price1
							this.form.PricingSalesList[1].JoinPriceChild=item.price2
							this.form.PricingSalesList[1].JoinPriceBaby=item.price3
							this.form.PricingSalesList[1].JoinPriceCurrency=item.currency
						}
						if(index==4){
							this.form.PricingSalesList[1].MarketPriceAdult=item.price1
							this.form.PricingSalesList[1].MarketPriceChild=item.price2
							this.form.PricingSalesList[1].MarketPriceBaby=item.price3
							this.form.PricingSalesList[1].MarketPriceCurrency=item.currency
						}
						if(index==5){
							this.form.PricingSalesList[1].InternalPriceAdult=item.price1
							this.form.PricingSalesList[1].InternalPriceChild=item.price2
							this.form.PricingSalesList[1].InternalPriceBaby=item.price3
							this.form.PricingSalesList[1].InternalPriceCurrency=item.currency
						}
					})
					this.form.PricingSalesList[1].ShelvesStatus=this.saleStatus
				}
				
				

				this.info.airTicketFlightInfos.forEach((item)=>{
					if(item.sellType==0){
						this.form.PricingSalesList[0].FlightInfoId=item.id	
					}
					if(item.sellType==1&&this.info.voyageType==1){
						this.form.PricingSalesList[1].FlightInfoId=item.id
					}
				})
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