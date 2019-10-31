<template>
	<div class="view">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				商品编号： {{this.basicInfo.productNo}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">航班类型：{{flightType[this.basicInfo.flightType]}} </el-col>
			<el-col :span="6">
				航空公司：{{this.basicInfo.airlineName}}   
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{this.basicInfo.flightNo}}   
			</el-col>
			<el-col :span="6">出发日期：{{this.basicInfo.departDate.split('T')[0]}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{this.basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{this.basicInfo.arriveProvinceName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{this.basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{this.basicInfo.arriveTime}} </el-col>
				<el-col :span="8">飞行时长：{{this.basicInfo.flightDurationHours+'小时'+this.basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{this.basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{this.basicInfo.arriveAirportName}} </el-col>
		</el-row>

		<h4>库存信息</h4>
		<el-table ref="stockTable" :data="stockTable" highlight-current-row style="width: 100%">
			<el-table-column property="type" label="">
			</el-table-column>
			<el-table-column property="total" label="座位数" align="center">
			</el-table-column>
			<el-table-column property="kongwei" label="控位" align="center">
				<template slot-scope="scope">
					<el-input-number v-model="inputNumber" :min='0' :max="yuwei-scope.row.shuaiwei+scope.row.kongwei"  style="width: 150px;" size="small" v-if="scope.row.type=='调整后'"></el-input-number>
			        <span v-else>{{scope.row.kongwei}}</span>
			    </template>
			</el-table-column>
			<el-table-column property="qiewei" label="切位" align="center">
			</el-table-column>
			<el-table-column property="yuwei" label="余位" align="center">
			</el-table-column>
			<el-table-column property="shuaiwei" label="甩位" align="center">
				
			</el-table-column>
		</el-table>
		
		<el-form ref="form" :model="form" label-width="80px" size="small" style="margin-top: 10px;width: 50%;">
			<el-form-item label="说明">
				<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容">
					</el-input>
			</el-form-item>
			
			<el-form-item>
				<el-button type="primary" :disabled="addBtn" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="getReturn">返回</el-button>
			</el-form-item>
		</el-form>
		
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				basicInfo:{},			
				
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
				form:{
					PricingSalesId:0,
					number:4,
					remark:'ddddd',
					BranchID:1058,
					OperatorName:'ddd'
				},
				yuwei:0,
				submitLoading: false,
				addBtn: false,
				inputNumber:0,
				flightType:['国内','国外']
			}
		},
		watch:{
			'inputNumber':function(val,old){
				let y=this.yuwei
				let s=this.stockTable[1].shuaiwei
				if(val>(y-s+this.stockTable[1].kongwei)){
					val=old
					return false
				}
				this.stockTable[1].yuwei=this.stockTable[1].total - val - this.stockTable[1].qiewei
			}
		},
		mounted() {
			this.getBasicInfo()
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
					this.form.PricingSalesId=res.data.objects[0].pricingSalesId;

					this.stockTable[0].total=res.data.objects[0].quantity;   				//总座位数
					this.stockTable[0].kongwei=res.data.objects[0].reservedQuantity;        //控位数量
					this.stockTable[0].qiewei=res.data.objects[0].saleQuantity;   			//切位数量
					this.stockTable[0].yuwei=res.data.objects[0].remainingQuantity;   		//余位数量
					this.stockTable[0].shuaiwei=res.data.objects[0].reductionSaleQuantity;	//甩位数量

					this.stockTable[1].total=res.data.objects[0].quantity;  
					this.stockTable[1].kongwei=JSON.parse(JSON.stringify(res.data.objects[0].reservedQuantity))
					this.stockTable[1].qiewei=res.data.objects[0].saleQuantity;
					this.stockTable[1].shuaiwei=res.data.objects[0].reductionSaleQuantity;
					this.stockTable[1].yuwei=res.data.objects[0].remainingQuantity; 
					
					this.inputNumber=res.data.objects[0].reservedQuantity;
					this.yuwei=JSON.parse(JSON.stringify(this.stockTable[1].yuwei))
				})
			},
			//保存控位信息
			onSubmit(){
				this.$confirm('此操作将保存调整后的控位信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.submitLoading = true
					if(this.inputNumber<=0)
					{
						this.$message.error('请输入要控位的数量!');
						this.submitLoading = false
						return false;
					}
					this.form.number=this.inputNumber;
					this.airHttp.post('api/products/ReservedSave', this.form)
					.then((res)=>{
							this.submitLoading = false
							if(res.data.isSuccess) {
								this.$message({
									message: res.data.message,
									type: 'success'
								});
								
								setTimeout(()=>{
									this.$router.push({name:'stock-list'})
								},2000)
							}else{
								this.$message({
									message: res.data.message,
									type: 'error'
								});
							}
					})					
				}).catch(() => {
				       this.submitLoading = false 
				});
				
			},

			//取消，返回列表
			getReturn(){
				this.$router.push({name:'stock-list'})
			}
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