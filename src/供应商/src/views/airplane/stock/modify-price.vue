<template>
	<div class="view" v-loading="tableLoading">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="8">
				商品编号：{{this.basicInfo.productNo}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班类型：{{flightType[this.basicInfo.flightType]}} 
			</el-col>
			<el-col :span="6">航空公司：{{this.basicInfo.airlineName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{this.basicInfo.flightNo}}
			</el-col>
			<el-col :span="6">出发日期：{{this.basicInfo.departDate}}</el-col>
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
			<el-col :span="6">到达时间：{{this.basicInfo.arriveTime}}</el-col>
			<el-col :span="8">飞行时长：{{this.basicInfo.flightDurationHours+"小时"+this.basicInfo.flightDurationMinutes+"分钟"}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{this.basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}}</el-col>
		</el-row>

		<h4>定价体系</h4>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="priceName" label="" width="180">
			</el-table-column>
			<el-table-column prop="price1" label="成人" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price1" style="width: 150px;" :min="0" :max="99999999" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price1}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price2" label="儿童" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price2" style="width: 150px;" :min="0" :max="99999999" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
				<span v-else>{{scope.row.price2}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price3" label="婴儿" align="center">
				<template slot-scope="scope">
				<el-input-number v-model="scope.row.price3" style="width: 150px;" :min="0" :max="99999999" size="small" v-if="scope.row.priceName!=='来价'"></el-input-number>
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
				  <span v-else>{{setToPriceCurrency(scope.row.currency)}}</span>
				</template> 
			</el-table-column>
		</el-table>
		
		<el-form ref="form" :model="form" label-width="80px" size="small" style="margin-top: 10px;">
			<el-form-item label="政策信息">
				<span>{{form.RuleName}}</span>
				<el-button type="primary" size="small" @click="handleChoicingRule">选择</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">保存</el-button>
				<el-button @click="onCancel">返回</el-button>
			</el-form-item>
		</el-form>
		
		<el-dialog title="选择退款政策" :visible.sync="dialogTableVisible">
		  <el-table :data="refundRulesData" v-loading="refundRulesDataLoading">
		    <el-table-column property="ruleName" label="政策名称"></el-table-column>
		    <el-table-column property="creationTime" label="创建时间" ></el-table-column>
		    <el-table-column property="lastModificationTime" label="更新时间" ></el-table-column>
		    <el-table-column label="操作" width="100">
		    	<template slot-scope="scope">
		    		<el-button type="text" @click="handleChoicedRule(scope.row)">选择</el-button>
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
				basicInfo:{},
				form:{
					Id:'',
					PricingSalesId:'',
					ProcurementId:'',//采购单ID
					FlightInfoId:'',//航班Id
					RuleName:'',
					RefundRuleId:'',
					BranchID:'',
					DepartDate:''
				},
				table:{
					currentPage: 1,
					size: 5,
					total: 0,
				},
				
				tableData: [{
					priceName: '来价',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}, {
					priceName: '媒体外卖价(元)',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}, {
					priceName: '同行价(元)',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}, {
					priceName: '加盟结算价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}, {
					priceName: '直客销售价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}, {
					priceName: '内部价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: 0
				}],
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
		        refundRulesData:[],
				saleStatus:true,
				flightType:['国内','国外'],
				submitLoading: false,
				tableLoading:false,
				refundRulesDataLoading:false
			}
		},
		mounted(){
			this.tableLoading=true;
			this.getBasicInfo()
			this.getPricingSalesInfo()
		},
		methods:{
			//获取采购单信息
			getBasicInfo(){
				this.airHttp.get('/api/Common/GetDetailsTop?operatingRecordId=0&pricingSalesId='+this.$route.params.id)
				.then((res)=>{
					if(res.data.objects.length>0){
						var objects=res.data.objects[0];
						objects.departDate=objects.departDate.split(/T/)[0];
						objects.departTime=objects.departTime.replace(/T/,' ').split('.')[0];
						objects.arriveTime=objects.arriveTime.replace(/T/,' ').split('.')[0];
						this.basicInfo=objects;
					}
				})
			},


			//获取定价体系
			getPricingSalesInfo(){
				this.airHttp.get('/api/products/GetPricingSalesInfo?pricingSalesId='+this.$route.params.id)
				.then((res)=>{
					if(res.data.isSuccess&&res.data.objects.length>0){
						var objects=res.data.objects[0];
						if(objects.refundRule != null){
                             this.form.RuleName=objects.refundRule.ruleName;
						}else{
							this.form.RuleName = null;
						}
						this.form.RefundRuleId=objects.refundRuleId;
						this.form.Id=objects.id;
						this.form.PricingSalesId=objects.pricingSalesId;
						this.form.ProcurementId=objects.procurementId;
						this.form.FlightInfoId=objects.flightInfoId;
						this.form.DepartDate=objects.departDate;

						this.tableData[0].price1=objects.costPrice, 			
						this.tableData[0].price2=objects.costPrice,  			
						this.tableData[0].price3=objects.costPrice,   			
						this.tableData[0].currency=0, 

						this.tableData[1].price1=objects.directGuestAdult;   				
						this.tableData[1].price2=objects.directGuestChild;        	
						this.tableData[1].price3=objects.directGuestBaby;   			
						this.tableData[1].currency=objects.directGuestCurrency;   

						this.tableData[2].price1=objects.peerPriceAdult;   				
						this.tableData[2].price2=objects.peerPriceChild;        	
						this.tableData[2].price3=objects.peerPriceBaby;   			
						this.tableData[2].currency=objects.peerPriceCurrency;  
						
						this.tableData[3].price1=objects.joinPriceAdult;   				
						this.tableData[3].price2=objects.joinPriceChild;        	
						this.tableData[3].price3=objects.joinPriceBaby;   			
						this.tableData[3].currency=objects.joinPriceCurrency;  
						
						this.tableData[4].price1=objects.marketPriceAdult;   				
						this.tableData[4].price2=objects.marketPriceChild;        	
						this.tableData[4].price3=objects.marketPriceBaby;   			
						this.tableData[4].currency=objects.marketPriceCurrency;  
						
						this.tableData[5].price1=objects.internalPriceAdult;   				
						this.tableData[5].price2=objects.internalPriceChild;        	
						this.tableData[5].price3=objects.internalPriceBaby;   			
						this.tableData[5].currency=objects.internalPriceCurrency;  

						this.refundRulesData=objects.RefundRule;  //定价规则
						this.tableLoading=false;
					}						
				})
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
			onSubmit(){
				this.$confirm('此操作将修改定价信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					
					var form={
						Id:this.form.Id,
						BranchID:1058,
						DepartDate:this.form.DepartDate,
						RefundRuleId:this.form.RefundRuleId,
						PricingSalesId:this.form.PricingSalesId,
						ProcurementId:this.form.ProcurementId,//采购单ID
						FlightInfoId:this.form.FlightInfoId,//航班Id
						DirectGuestAdult:this.tableData[1].price1,
						DirectGuestChild:this.tableData[1].price2,
						DirectGuestBaby:this.tableData[1].price3,
						DirectGuestCurrency:this.tableData[1].currency,
						PeerPriceAdult:this.tableData[2].price1,
						PeerPriceChild:this.tableData[2].price2,
						PeerPriceBaby:this.tableData[2].price3,
						PeerPriceCurrency:this.tableData[2].currency,
						JoinPriceAdult:this.tableData[3].price1,
						JoinPriceChild:this.tableData[3].price2,
						JoinPriceBaby:this.tableData[3].price3,
						JoinPriceCurrency:this.tableData[3].currency,
						MarketPriceAdult:this.tableData[4].price1,
						MarketPriceChild:this.tableData[4].price2,
						MarketPriceBaby:this.tableData[4].price3,
						MarketPriceCurrency:this.tableData[4].currency,
						InternalPriceAdult:this.tableData[5].price1,
						InternalPriceChild:this.tableData[5].price2,
						InternalPriceBaby:this.tableData[5].price3,
						InternalPriceCurrency:this.tableData[5].currency,
					}
					this.submitLoading = true
					if(this.kongwei<=0)
					{
						this.$message.error('请输入要控位的数量!');
						this.submitLoading = false
						return false;
					}
					this.airHttp.post('api/products/EditPricingSalesInfo', form)
					.then((res)=>{
						this.submitLoading = false
						if(res.data.isSuccess) {
							this.$message({
								message: "修改机票价格成功！",
								type: "success"
							});

							setTimeout(() => {
							this.$router.push({ name: "stock-list" });
							}, 2000);
						}
					})					
				}).catch(() => {
					this.submitLoading = false 
				});
				
			},
			onCancel(){
				this.$router.go(-1)
			},
			getList() {
				let size = this.table.size
				let index = this.table.currentPage
				this.refundRulesDataLoading = true
				this.airHttp.get('api/refundrule/refundruleList?PageSize=' + size + '&PageIndex=' + index)
				.then((res)=>{
					this.submitLoading = false
					if(res.data.isSuccess) {
						var objects=res.data.objects;
						objects.forEach(function(item,index){
							objects[index].creationTime=item.creationTime.replace(/T/,' ').split('.')[0];
							objects[index].lastModificationTime=item.lastModificationTime.replace(/T/,' ').split('.')[0];
						})
						this.table.total = res.data.total;
						this.refundRulesData=objects;
						this.refundRulesDataLoading = false;
					}
				})	
			},
			handleChoicingRule(){
				this.getList() 
				this.dialogTableVisible = true;	
			},
			handleChoicedRule(row){
				this.form.RuleName=row.ruleName;
				this.dialogTableVisible = false;	
				this.form.RefundRuleId=row.id;
			},
			handleSizeChange(val) {
				this.table.size = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.table.currentPage = val
				this.getList()
			},
		}
	}
</script>

<style>
	.info-row {
		margin: 10px 0;
	}
	.air-info-box {
		border: 1px solid #ddd;
		margin: 10px 0;
		padding: 10px;
	}
</style>