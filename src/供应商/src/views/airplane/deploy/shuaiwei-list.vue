<template>
	<div>
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading">
			<el-table-column prop="productNo" label="商品编号">
			</el-table-column>
			<el-table-column prop="airlineName" label="航空公司" :show-overflow-tooltip="true" width="120px">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号">
			</el-table-column>
			<el-table-column prop="departDate" label="出发日期" width="100px">
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
			<el-table-column prop="remainingQuantity" label="当前甩位库存" width="120px">
			</el-table-column>
			<el-table-column prop="creationTime" label="创建时间" width="140px">
			</el-table-column>
			<el-table-column  label="操作" width="160px" fixed="right">
				<template slot-scope="scope">
					<el-button size="mini" @click="goDetail(scope.row)">查看</el-button>
					<el-button size="mini" @click="handleRecovery(scope.row)">回收</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1,10,20,50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>

		<!--回收弹框-->
		<el-dialog title="添加机型" :visible.sync="dialogRecoveryVisible" width="600px">
			<h4>航班信息</h4>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">
					商品编号：{{obj.ProductNo}}
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					航班类型：{{obj.ProductNo}}
				</el-col>
				<el-col :span="12">航空公司：{{obj.AirlineName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					航班号：{{obj.FlightNo}}
				</el-col>
				<el-col :span="12">出发日期：{{obj.DepartDate}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					出发地：{{obj.DepartProvinceName}}
				</el-col>
				<el-col :span="12">目的地：{{obj.ArriveProvinceName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					起飞时间：{{obj.DepartTime}}
				</el-col>
				<el-col :span="12">到达时间：{{obj.ArriveTime}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">飞行时长：{{(obj.FlightDurationHours||0)+"小时"+(obj.FlightDurationMinutes||0)+"分钟"}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="12">
					起飞机场：{{obj.DepartAirporName}}
				</el-col>
				<el-col :span="12">到达机场：{{obj.ArriveAirportName}}</el-col>
			</el-row>
			<h4>库存信息</h4>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="full-width"  size="small">
				<el-form-item label="甩位数量" >
					<div>10</div>
				</el-form-item>
				<el-form-item label="回收数量" prop="PlaneSeat">
					<el-input-number v-model="form.PlaneSeat" :min="0" :max="99999" :controls="false" placeholder=""></el-input-number>
				</el-form-item>
				<el-form-item label="说明" >
					<el-input type="textarea" v-model="form.Explain" placeholder=""></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" >
				<el-button @click="onCancel" >取 消</el-button>
				<el-button type="primary" @click="onSubmit" :loading="submitLoading" >确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
//caijiongrui
	export default{
		data() {
			let checkNumber=(rule,value,callback)=>{
				if(!value){
					return callback(new Error('请输入回收数量'))
				}else if(isNaN(Number(value))){
					return callback(new Error('回收数量必须填写数字'))
				}else if(Number(value)<0){
					return callback(new Error('回收数量必须大于0'))
				}else if(value.toString().indexOf('.')>-1){
					return callback(new Error('回收数量必须为整数'));
				}else{
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
					PlaneSeat: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}],
				},
				obj:{},
				dialogRecoveryVisible:false,
				form:{
					PlaneSeat:null,
					Explain:'',
				}
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('api/AirTicketOperatingRecord/getairTicketOperatingRecordList?OperatingRecordType=2&Id=0&PageSize=' + size + '&PageIndex=' + index)
				.then((res)=>{
					if(res.data.isSuccess){
						var objects=res.data.objects;
						objects.forEach(function(item,index){
							objects[index].departDate=item.departDate.split(/T/)[0];
							var arr=item.creationTime.split(/T/);
							var arr1=arr[1].split(/:/);
							objects[index].creationTime=arr[0]+" "+arr1[0]+':'+arr1[1];
						})
						this.table.total = res.data.total
						this.table.tableData = objects
						this.tableLoading = false
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
				this.obj=row;
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