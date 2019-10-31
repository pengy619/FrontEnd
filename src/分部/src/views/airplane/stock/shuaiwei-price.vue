<template>
	<div class="view">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="20">
				商品编号： {{this.basicInfo.productNo}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{this.basicInfo.flightType==0?'国内':'国外'}}</el-col>
			<el-col :span="8">航空公司：{{this.basicInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{this.basicInfo.flightNo}}   
			</el-col>
			<el-col :span="6">出发日期：{{basicInfo.departDate?basicInfo.departDate.split('T')[0]:''}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{this.basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="4">目的地：{{this.basicInfo.arriveProvinceName}} </el-col>
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
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}} </el-col>
		</el-row>

		<h4>库存信息</h4>
		<el-table ref="stockTable" :data="stockTable" highlight-current-row style="width: 100%">
			<el-table-column property="typename" label="">
			</el-table-column>
			<el-table-column property="total" label="座位数" align="center">
			</el-table-column>
			<el-table-column property="kongwei" label="控位" align="center">
			</el-table-column>
			<el-table-column property="qiewei" label="切位" align="center">
			</el-table-column>
			<el-table-column property="yuwei" label="余位" align="center">
			</el-table-column>
			<el-table-column property="shuaiwei" label="甩位" align="center">
				<template slot-scope="scope">
					<el-input-number v-model="shuaiwei" :min='0' :max='maxShuaiwei' style="width: 100px;" size="small" v-if="scope.row.typename=='调整后'"></el-input-number>
			        <span v-else>{{scope.row.shuaiwei}}</span>
			    </template>
			</el-table-column>
		</el-table>
		
		<h4>定价甩位体系</h4>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="type" label="" width="180">
			</el-table-column>
			<el-table-column prop="adult" label="成人" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.adult" style="width: 150px;" size="small" v-if="scope.row.type!=='来价（元）'" :min='0' :max='9999999'></el-input-number>
				<span v-else>{{scope.row.adult}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="child" label="儿童" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.child" style="width: 150px;" size="small" v-if="scope.row.type!=='来价（元）'" :min='0' :max='9999999'></el-input-number>
				<span v-else>{{scope.row.child}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="baby" label="婴儿" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.baby" style="width: 150px;" size="small" v-if="scope.row.type!=='来价（元）'" :min='0' :max='9999999'></el-input-number>
				<span v-else>{{scope.row.baby}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="currency" label="币种" align="center">
				<template slot-scope="scope">
				<el-select v-model="scope.row.currency" placeholder="请选择" v-if="scope.row.type!=='来价（元）'">
				    <el-option
				      v-for="item in currency"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <span v-else>{{setToPriceCurrency(scope.row.currency)}}</span>
				</template> 
			</el-table-column>
		</el-table>
		<el-form ref="form" :model="form"  label-width="80px" size="small" style="margin-top: 10px;">
			<el-form-item label="政策信息" prop="RefundRuleId">
				<el-label type="text" >{{ RefundRule }}
					</el-label>
				<el-button type="primary" size="small" @click="dialogTableVisible = true">选择</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :disabled="addBtn" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="onCancel">返回</el-button>
			</el-form-item>
		</el-form>
		
		<el-dialog title="选择退款政策" :visible.sync="dialogTableVisible">
		  <el-table :data="table.tableData" v-loading="refundRulesDataLoading">
		    <el-table-column property="ruleName" label="政策名称"></el-table-column>
		    <el-table-column property="creationTime" label="创建时间" >
				<template slot-scope="scope">
					{{scope.row.creationTime?scope.row.creationTime.replace(/T/,' ').split('.')[0]:''}}
				</template>
			</el-table-column>
		    <el-table-column property="lastModificationTime" label="更新时间" >
				<template slot-scope="scope">
					{{scope.row.lastModificationTime?scope.row.lastModificationTime.replace(/T/,' ').split('.')[0]:''}}
				</template>
			</el-table-column>
		    <el-table-column label="操作" width="100">
		    	<template slot-scope="scope">
		    		<el-button type="text" @click="handleChoose(scope.row)">选择</el-button>
		    	</template>
		    </el-table-column>
		  </el-table>
		  <div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-size="table.size" layout="total, prev, pager, next, jumper" :total="table.total">
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// minShuaiwei:0,
				maxShuaiwei:0,
				RefundRuleId:1,	//退票规则ID
				RefundRule:'',
				basicInfo:{},			
		        stockTable:[{
		        	typename:'当前',
		        	total:0,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        },{
		        	typename:'调整后',
		        	total:0,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
				}],
				form: {
					OperatingRecordId:0,
					PricingSalesId: this.$route.params.id,
					Number: 0,
					BranchID: 1058,
					RefundRuleId: 0,
					JiGoDirectGuestAdult:0,
					JiGoDirectGuestChild:0,
					JiGoDirectGuestBaby:0,
					JiGoDirectGuestCurrency:0,
					JiGoPeerPriceAdult:0,
					JiGoPeerPriceChild:0,
					JiGoPeerPriceBaby:0,
					JiGoPeerPriceCurrency:0,
					JiGoJoinPriceAdult:0,
					JiGoJoinPriceChild:0,
					JiGoJoinPriceBaby:0,
					JiGoJoinPriceCurrency:0,
					JiGoMarketPriceAdult:0,
					JiGoMarketPriceChild:0,
					JiGoMarketPriceBaby:0,
					JiGoMarketPriceCurrency:0,
					JiGoInternalPriceAdult:0,
					JiGoInternalPriceChild:0,
					JiGoInternalPriceBaby:0,
					JiGoInternalPriceCurrency:0,
				},
				shuaiwei:0,
				submitLoading: false,
				refundRulesDataLoading:false,
				addBtn: false,
		         currency:[{
		        	label:'人民币',
		        	value:0
		        },{
		        	label:'美元',
		        	value:1
		        },{
		        	label:'港币',
		        	value:2
		        },{
		        	label:'欧元',
		        	value:3
		        }],
		        dialogTableVisible:false,
		        table: {
					currentPage: 1,
					size: 5,
					total: 0,
					tableData: [],
				},
				tableData:[{
					type:'来价（元）',
					adult:0, 	//来价成人
					child:0, 	//来价儿童
					baby:0,  	//来价婴儿
					currency:'人民币',	//来价币种
		        	
		        },{
		        	type:'媒体外卖价（元）',
		        	adult:0, 	//直客成人
					child:0, 	//直客儿童
					baby:0,  	//直客婴儿
					currency:'人民币',	//直客币种
				},{
		        	type:'同行价（元）',
		        	adult:0,	//同行成人
					child:0,	//同行儿童
					baby:0,		//同行婴儿
					currency:'人民币',	//同行币种
				},{
		        	type:'加盟结算价（元）',
		        	adult:0,	//加盟成人
					child:0,	//加盟儿童
					baby:0,		//加盟婴儿
					currency:'人民币',	//加盟币种
				},{
		        	type:'直客销售价（元）',
		        	adult:0,	//门市成人
					child:0,	//门市儿童
					baby:0,		//门市婴儿
					currency:'人民币',		//门市币种
				},{
		        	type:'内部价（元）',
		        	adult:0,	//内部成人
					child:0,	//内部儿童
					baby:0,		//内部婴儿
					currency:'人民币',		//内部币种
				}],
			}
		},
		mounted() {
			this.getBasicInfo(),
			this.getRuleList(),
			this.getPriceInfo()
		},
		methods:{
			getPriceInfo(){
				this.airHttp.get('api/products/GetPricingSalesInfo?PricingSalesId='+this.$route.params.id)
				.then((res)=>{
					this.tableData[0].adult=res.data.objects[0].costPrice, 			
					this.tableData[0].child=res.data.objects[0].costPrice,  			
					this.tableData[0].baby=res.data.objects[0].costPrice,   			
					this.tableData[0].currency=0, 
					this.tableData[1].adult=res.data.objects[0].directGuestAdult,  	
					this.tableData[1].child=res.data.objects[0].directGuestChild,  	
					this.tableData[1].baby=res.data.objects[0].directGuestBaby, 	
					this.tableData[1].currency=res.data.objects[0].directGuestCurrency, 	
					this.tableData[2].adult=res.data.objects[0].peerPriceAdult,		
					this.tableData[2].child=res.data.objects[0].peerPriceChild,		
					this.tableData[2].baby=res.data.objects[0].peerPriceBaby,		
					this.tableData[2].currency=res.data.objects[0].peerPriceCurrency, 
					this.tableData[3].adult=res.data.objects[0].joinPriceAdult,		
					this.tableData[3].child=res.data.objects[0].joinPriceChild,		
					this.tableData[3].baby=res.data.objects[0].joinPriceBaby,		
					this.tableData[3].currency=res.data.objects[0].joinPriceCurrency, 
					this.tableData[4].adult=res.data.objects[0].marketPriceAdult,		
					this.tableData[4].child=res.data.objects[0].marketPriceChild,		
					this.tableData[4].baby=res.data.objects[0].marketPriceBaby,		
					this.tableData[4].currency=res.data.objects[0].marketPriceCurrency, 
					this.tableData[5].adult=res.data.objects[0].internalPriceAdult,		
					this.tableData[5].child=res.data.objects[0].internalPriceChild,		
					this.tableData[5].baby=res.data.objects[0].internalPriceBaby,		
					this.tableData[5].currency=res.data.objects[0].internalPriceCurrency,
					this.RefundRule=res.data.objects[0].refundRule.ruleName,
					this.RefundRuleId=res.data.objects[0].refundRule.id
				})
			},
			getBasicInfo(){
				this.airHttp.get('/api/Common/GetDetailsTop?pricingSalesId='+this.$route.params.id+'&operatingRecordId=0')
				.then((res)=>{
						var restop=res.data.objects[0];
					this.basicInfo=restop;
					this.form.PricingSalesId=restop.pricingSalesId;
					this.form.OperatingRecordId=restop.operatingRecordId;

					this.stockTable[0].total = restop.quantity; //总座位数
					this.stockTable[0].kongwei = restop.reservedQuantity; //控位数量
					this.stockTable[0].qiewei = restop.saleQuantity; //切位数量
					this.stockTable[0].yuwei = restop.remainingQuantity; //余位数量
					this.stockTable[0].shuaiwei =restop.reductionSaleQuantity; //甩位数量

					this.stockTable[1].total = restop.quantity;
					this.stockTable[1].qiewei = restop.saleQuantity;
					this.stockTable[1].shuaiwei =restop.reductionSaleQuantity;
					this.stockTable[1].kongwei = restop.reservedQuantity; 
					this.stockTable[1].yuwei = restop.remainingQuantity;
					this.shuaiwei= restop.reductionSaleQuantity;
					this.maxShuaiwei=JSON.parse(JSON.stringify(this.stockTable[0].yuwei));
        //   this.minShuaiwei=JSON.parse(JSON.stringify(this.stockTable[0].shuaiwei));
				})
			},
			getRuleList() {
				let size = this.table.size
				let index = this.table.currentPage
				this.refundRulesDataLoading = true
				this.airHttp.get('/api/refundrule/refundruleList?PageSize=' + size + '&PageIndex=' + index )
					.then((res) => {
						var objects=res.data.objects;
							this.table.total = res.data.total
							this.table.tableData = objects
							this.refundRulesDataLoading = false
						})
			},
			handleChoose(row) {
				this.dialogTableVisible=false
				this.RefundRule=row.ruleName
				this.RefundRuleId=row.id
			},
			setToPriceCurrency(val){
				if(val==0){
					val='人民币'
				}else if(val==1){
					val='美元'
				}else if(val==2){
					val='港币'
				}else{
					val='欧元'
				}
				return val;
			},
			onSubmit() {
				this.$confirm("是否确认甩位", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
					this.$refs['form'].validate(valid => {
						if (valid) {
						this.submitLoading = true;
						if (this.shuaiwei <= 0) {
							this.$message.error("请输入正确的甩位数量!");
							this.submitLoading = false;
							return false;
						}
						this.form.Number = this.shuaiwei,	//直接提交调整后的甩位数量
						this.form.RefundRuleId= this.RefundRuleId,
						this.form.JiGoDirectGuestAdult=this.tableData[1].adult,
						this.form.JiGoDirectGuestChild=this.tableData[1].child,
						this.form.JiGoDirectGuestBaby=this.tableData[1].baby,	
						this.form.JiGoDirectGuestCurrency=this.tableData[1].currency,  
						this.form.JiGoPeerPriceAdult=this.tableData[2].adult,		
						this.form.JiGoPeerPriceChild=this.tableData[2].child,	
						this.form.JiGoPeerPriceBaby=this.tableData[2].baby,	
						this.form.JiGoPeerPriceCurrency=this.tableData[2].currency,  
						this.form.JiGoJoinPriceAdult=this.tableData[3].adult,	
						this.form.JiGoJoinPriceChild=this.tableData[3].child,		
						this.form.JiGoJoinPriceBaby=this.tableData[3].baby,		
						this.form.JiGoJoinPriceCurrency=this.tableData[3].currency,  
						this.form.JiGoMarketPriceAdult=this.tableData[4].adult,
						this.form.JiGoMarketPriceChild=this.tableData[4].child,	
						this.form.JiGoMarketPriceBaby=	this.tableData[4].baby,		
						this.form.JiGoMarketPriceCurrency=this.tableData[4].currency,  
						this.form.JiGoInternalPriceAdult=this.tableData[5].adult,	
						this.form.JiGoInternalPriceChild=this.tableData[5].child,	
						this.form.JiGoInternalPriceBaby=this.tableData[5].baby,	
						this.form.JiGoInternalPriceCurrency=this.tableData[5].currency,  
						this.airHttp.post("api/products/ReductionSaleSave", this.form)
							.then(res => {
							this.submitLoading = false;
							if (res.data.isSuccess) {
								this.$message({
								message: "保存甩位信息成功！",
								type: "success"
								});

								setTimeout(() => {
								 this.$router.push({ name: "stock-list" });
								}, 1000);
							}
							});
						} else {
						this.$message.error("请确认输入是否正确");
						}
					});
					})
					.catch(() => {
					this.submitLoading = false;
					});
				},
			onCancel(){
				this.$router.push({name:'stock-list'})
			},
			handleSizeChange(val) {
				this.table.size = val
				this.getRuleList()
			},
			handleCurrentChange(val) {
				this.table.currentPage = val
				this.getRuleList()
			},
		},
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