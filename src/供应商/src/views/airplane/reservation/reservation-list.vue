<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small">
			<el-form-item label="航空公司">
				<el-input v-model="search.company" placeholder="航空公司"></el-input>
			</el-form-item>
			<el-form-item label="航班号">
				<el-input v-model="search.route" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.departure" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="目的地">
				<el-input v-model="search.destination" placeholder="目的地"></el-input>
			</el-form-item>
			<el-form-item label="出发日期">
				<el-date-picker
					v-model="search.departDate"
					type="daterange"
					range-separator="至">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getList">查询</el-button>
			</el-form-item>
		</el-form>

		<div>
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="reservationAir">预订机票</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="reservationDan">预留单</el-button>
		</div>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column label="商品编号" width="80" type="index" :index="indexMethod">
			</el-table-column>
			<el-table-column prop="auditStatus" label="状态">
				<template slot-scope="scope">
					{{showStatus(scope.row.auditStatus)}}
				</template>
			</el-table-column>
			<el-table-column prop="procurementNo" label="采购单号" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="airline.name" label="航空公司">
			</el-table-column>
			<el-table-column prop="airRoute" label="航班号" >
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地" >
			</el-table-column>
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地" >
			</el-table-column>
			<el-table-column prop="departDate" label="出发日期" >
				<template slot-scope="scope">
					{{scope.row.departDate.split('T')[0]}}
				</template>
			</el-table-column>
			<el-table-column prop="startTime" label="起飞时间" >
			</el-table-column>
			<el-table-column prop="endTime" label="起飞时间" >
			</el-table-column>
			<el-table-column prop="quantity" label="计划" >
			</el-table-column>
			<el-table-column prop="totalCost" label="已售" >
			</el-table-column>
			<el-table-column prop="totalCost" label="预留" >
			</el-table-column>
			<el-table-column prop="totalCost" label="剩余" >
			</el-table-column>
			<el-table-column prop="totalCost" label="成人价" >
			</el-table-column>
			<el-table-column prop="totalCost" label="供应商" >
			</el-table-column>
			<el-table-column label="操作" >
				<template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="goDetail(scope.$index, scope.row)">查看</el-button>
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
					destination: '',
					departDate:'',
				},
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
					selected:[]
				},
				tableLoading:false,
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
			reservationAir(){
				this.$router.push('reservation-air/1')
			}
		}
	}
</script>

<style scoped>

</style>