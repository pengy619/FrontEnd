<template>
	<div>
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading">
			<el-table-column prop="productNo" label="商品编号"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="airlineName" label="航空公司" min-width="120px" :show-overflow-tooltip="true">
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
			<el-table-column prop="operatorName" label="客户名称">
			</el-table-column>
			<el-table-column  label="创建时间" min-width="150px">
				<template slot-scope="scope">
					{{scope.row.creationTime?scope.row.creationTime.replace(/T/,' ').split('.')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column  label="操作" width="100px"  fixed="right">
				<template slot-scope="scope">
					<el-button size="mini" @click="goDetail(scope.row)">查看</el-button>
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
	export default{
		data() {
			return {
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
				},
				tableLoading:false,
				
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
				this.airHttp.get('api/AirTicketOperatingRecord/getairTicketOperatingRecordList?OperatingRecordType=0&Id=0&PageSize=' + size + '&PageIndex=' + index)
				.then((res)=>{
					if(res.data.isSuccess){
						var objects=res.data.objects;
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
				// this.$router.push({path:'/airplane/qiewei-detail/',query:{id:row.id,pricingSalesId:row.pricingSalesId}})
			}
		}
	}
</script>

<style>
</style>