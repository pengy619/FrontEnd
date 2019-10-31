<template>
	<div>
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading">
			<el-table-column prop="productNo" label="商品编号"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="airlineName" label="航空公司" :show-overflow-tooltip="true" min-width="120px">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="出发日期" min-width="100px">
				<template slot-scope="scope">
					{{scope.row.departDate?scope.row.departDate.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地">
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地">
			</el-table-column>
			<el-table-column prop="departTime" label="起飞时间">
			</el-table-column>
			<el-table-column prop="arriveTime" label="到达时间">
			</el-table-column>
			<el-table-column prop="shippingSpace" label="舱位">
			</el-table-column>
			<el-table-column  label="数量">
				<template slot-scope="scope">
					{{(scope.row.adjustTheType==0?"+":"-")+scope.row.thisTimeNumber}}
				</template>
			</el-table-column>
			<el-table-column prop="remainingQuantity" label="当前甩位库存" min-width="120">
			</el-table-column>
			<el-table-column  label="创建时间" min-width="150">
				<template slot-scope="scope">
					{{scope.row.creationTime?scope.row.creationTime.replace(/T/,' ').split('.')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column  label="操作" width="160px" fixed="right">
				<template slot-scope="scope">
					<el-button size="mini" @click="goDetail(scope.row)">查看</el-button>
					<el-button size="mini" :disabled="scope.row.remainingQuantity<=0" @click="handleRecovery(scope.row)">回收</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1,10,20,50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>

		<!--回收弹框-->

		<el-dialog title="回收甩位" :visible.sync="dialogRecoveryVisible" width="600px" v-loading="dialogLoading"  @close="handleCloseDialog">
			<h4>航班信息</h4>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">
					商品编号：{{obj.productNo}}
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					航班类型：{{obj.flightType==0?'国内':'国外'}}
				</el-col>
				<el-col :span="12">航空公司：{{obj.airlineName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					航班号：{{obj.flightNo}}
				</el-col>
				<el-col :span="12">出发日期：{{obj.departDate?obj.departDate.split('T')[0]:''}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					出发地：{{obj.departProvinceName}}
				</el-col>
				<el-col :span="12">目的地：{{obj.arriveProvinceName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					起飞时间：{{obj.departTime}}
				</el-col>
				<el-col :span="12">到达时间：{{obj.arriveTime}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">飞行时长：{{(obj.flightDurationHours||0)+"小时"+(obj.flightDurationMinutes||0)+"分钟"}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					起飞机场：{{obj.departAirporName}}
				</el-col>
				<el-col :span="12">到达机场：{{obj.arriveAirportName}}</el-col>
			</el-row>
			<h4>库存信息</h4>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="full-width"  size="small">
				<el-form-item label="甩位数量" >
					<div>{{obj.reductionSaleQuantity}}</div>
				</el-form-item>
				<el-form-item label="回收数量" prop="Number">
					<el-input-number v-model="form.Number" :min="0" :max="99999" :controls="false" placeholder=""></el-input-number>
				</el-form-item>
				<el-form-item label="说明">
					<el-input type="textarea" v-model="form.Remark" placeholder=""></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" >
					<el-button @click="dialogRecoveryVisible=false;" >取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="submitLoading" >确 定</el-button>
				</div>
		</el-dialog>
	</div>
</template>

<script>
//caijiongrui
	export default{
		data() {
			let checkNumber = (rule, value, callback) => {
				let num=this.obj.reductionSaleQuantity;
				if (!value) {
					return callback(new Error('请填写座位数'));
				}else if(isNaN(Number(value))){
					return callback(new Error('座位数必须填写数字'));
				}else if(Number(value)<=0){
					return callback(new Error('座位数必须大于0'));
				}else if(value.toString().indexOf('.')>-1){
					return callback(new Error('回收数量必须为整数'));
				}else if(value>num){
					return callback(new Error(`回收数量必须需小于等于${num}`));
				}
				else{
					callback();
				}
			};
			return {
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
				},
				tableLoading:false,
				rules: {
					Number: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}],
				},
				obj:{},
				dialogRecoveryVisible:false,
				form:{
					PricingSalesId:null,
					OperatingId:null,
					Number:null,
					Remark:'',
				},
				defaultForm:{},
				dialogLoading:false,
				submitLoading:false,
			}
		},
		mounted(){
			this.defaultForm=JSON.parse(JSON.stringify(this.form));
			this.getList();
		},
		methods:{
			getList(){
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('api/AirTicketOperatingRecord/getairTicketOperatingRecordList?OperatingRecordType=2&Id=0&PageSize=' + size + '&PageIndex=' + index)
				.then((res)=>{
					if(res.data.isSuccess){
						this.tableLoading = false
						var objects=res.data.objects;
						this.table.total = res.data.total
						this.table.tableData = objects
					}
				})
			},
			handleSizeChange(val) {
				this.table.size = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.table.currentPage = val
				this.getList()
			},
			goDetail(row){
				this.$router.push({path:'/airplane/shuaiwei-detail/',query:{id:row.id,pricingSalesId:row.pricingSalesId}})
			},
			handleRecovery(row){
				this.dialogRecoveryVisible=true;
				this.dialogLoading=true;
				this.airHttp.get('api/Common/GetDetailsTop?operatingRecordId='+row.id+'&pricingSalesId='+row.pricingSalesId)
				.then((res)=>{
					if(res.data.isSuccess){
						this.dialogLoading=false;
						var objects=res.data.objects[0];
						this.obj=objects;
						this.form.PricingSalesId=row.pricingSalesId;
						this.form.OperatingId=row.id;
					}
				}).catch((err)=>{
					this.dialogLoading=false;
				})
			},
			onSubmit(){
				if(this.obj.reductionSaleQuantity<=0){
					return callback(new Error(`回收数量小于或等于0，不可回收`));
					return false;
				}
				this.submitLoading=true
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.submitLoading=true
						this.airHttp.post('api/AirTicketOperatingRecord/JiltRecycling',this.form)
						.then((res)=>{
							if(res.data.isSuccess){
								this.submitLoading=false;
								this.$message({
									message: '回收成功！',
									type: 'success'
								});
								this.form=JSON.parse(JSON.stringify(this.defaultForm));
								this.dialogRecoveryVisible=false;
								this.getList();
							}else{
								this.submitLoading=false;
							}
						}).catch((err)=>{
							this.submitLoading=false;
						})
					}
				})
				
			},
			handleCloseDialog(){
				this.form=JSON.parse(JSON.stringify(this.defaultForm));
				this.$refs['form'].resetFields();
			}
		}
	}
</script>

<style>
.el-form-item{
	margin-bottom:6px;
}
.el-dialog__body{
	padding-top:0;
}
</style>