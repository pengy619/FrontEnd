<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small"  label-width="80px">
			<el-form-item label="航空公司">
				<el-input v-model="search.company" placeholder="航空公司"></el-input>
			</el-form-item>
			<el-form-item label="航线">
				<el-input v-model="search.route" placeholder="航线"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.departure" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="目的地">
				<el-input v-model="search.destination" placeholder="目的地"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getList">查询</el-button>
			</el-form-item>
		</el-form>

		<div class="button_box">
			<el-button type="primary" size="small" @click="$router.push({name:'purchase-add'})">新增机票采购单</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0">申请预付款</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="PricingSale">定价销售</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="Cancel()" :loading="cancelLoading">取消</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0">打印</el-button>
		</div>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55" fixed>
			</el-table-column>
			<el-table-column label="序号" min-width="50" type="index" :index="indexMethod">
			</el-table-column>
			<el-table-column prop="auditStatus" label="状态">
				<template slot-scope="scope">
					{{showStatus(scope.row.auditStatus)}}
				</template>
			</el-table-column>
			<el-table-column prop="procurementNo" label="采购单号" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="airline.name" label="航空公司" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="airRoute" label="航线"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地" >
			</el-table-column>
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地" >
			</el-table-column>
			<el-table-column label="开航日期" min-width="100">
				<template slot-scope="scope">
					{{scope.row.startTime?scope.row.startTime.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column label="停航日期" min-width="100" >
				<template slot-scope="scope">
					{{scope.row.endTime?scope.row.endTime.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="quantity" label="座位数" >
			</el-table-column>
			<el-table-column prop="totalCost" label="总成本" >
			</el-table-column>
			<el-table-column label="操作" fixed="right">
				<template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="goDetail(scope.$index, scope.row)">详情</el-button>
			    </template>
			</el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1,10,20,50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				search: {
					company: '',
					route: '',
					departure: '',
					destination: ''
				},
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
					selected:[]
				},
				tableLoading:false,
				cancelLoading:false,
				procurementIds:[],
			}
		},
		mounted () {
			this.getList()
		},
		methods: {
			getList(){
				let keyword = this.search.keyword
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('/api/Procurement/GetProcurementList?Id=0&PageSize=' + size + '&PageIndex=' + index + '&AirlineName=' + this.search.company + '&AirRoute=' + this.search.route +'&DepartProvinceName=' + this.search.departure + '&ArriveProvinceName=' + this.search.destination)
					.then((res)=>{
						this.table.total = res.data.total
						this.table.tableData = res.data.objects
						this.tableLoading = false
					})
			},
			handleSelectionChange(val) {
				this.table.selected = val;
			},
			handleSizeChange(val) {	
				this.table.size = val;			
				this.getList();
		      },
		    handleCurrentChange(val) {
				this.table.currentPage = val;
				this.getList();
		    },
		    indexMethod(index){
		    	return index+1
		    },
		    goDetail(index,row){
		    	this.$router.push('purchase-detail/'+row.id)
		    },
			showStatus(val){
				let status = [ '待审核', '未通过', '已审核', '已取消', '已销售' ];
				return status[val];
			},
			PricingSale(){
				if(this.table.selected.length>1){
					this.$message.error('暂不支持批量定价，请单选');
					return false
				}else if(this.table.selected.length==1){
					this.airHttp.get('/api/Procurement/VerifyIsPricing?procurementId='+ this.table.selected[0].id)
						.then((res)=>{
							if(res.data.isSuccess){
								this.$router.push({path:`/airplane/purchase-sale/${this.table.selected[0].id}`})
							}
							else{
								this.$message.error(res.data.message);
								return false;
							}
						})
				}
				
			},
			Cancel(){
				this.procurementIds = [];
				if(this.table.selected.length > 0){
				this.$confirm('确定要取消选中的机票采购单吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
					.then(() => {
						this.cancelLoading = true;
						this.table.selected.forEach((obj) => {
							this.procurementIds.push(obj.id);
						});
						this.airHttp.post('/api/Procurement/CancelProcurement', { ProcurementIds : this.procurementIds })
						.then((res)=>{
							this.cancelLoading = false;
							
							this.$alert(res.data.message, '提示', { confirmButtonText: '确定',callback:action => {
								this.getList()
							}})
						})
					});
				}
				else{
					this.$message.error('请选择要取消的机票采购单');
				}
			}
		}
	}
</script>

<style scoped>

</style>