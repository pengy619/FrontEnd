<template>
	<div>
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading">
			<el-table-column prop="productNo" label="商品编号">
			</el-table-column>
			<el-table-column prop="airlineName" label="航空公司" width="120px">
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
			<el-table-column prop="remainingQuantity" label="当前控位库存" width="120px">
			</el-table-column>
			<el-table-column prop="creationTime" label="创建时间" width="140px">
			</el-table-column>
			<el-table-column  label="操作" width="100px">
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
				this.airHttp.get('api/AirTicketOperatingRecord/getairTicketOperatingRecordList?OperatingRecordType=1&Id=0&PageSize=' + size + '&PageIndex=' + index)
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
				// this.$router.push({path:'/airplane/kongwei-detail/',query:{id:row.id,pricingSalesId:row.pricingSalesId}})
			}
		}
	}
</script>

<style>
</style>