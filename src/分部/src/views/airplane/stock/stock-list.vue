<template>
	<div class="view">
		<el-form :inline="true" label-width="80px" :model="search" class="demo-form-inline" size="small">
			<el-form-item label="航程类型">
				<el-select v-model="search.voyageType" placeholder="请选择">
				    <el-option
				      v-for="item in voyageTypeList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="航空公司">
				<el-input v-model="search.airline" placeholder="航空公司"></el-input>
			</el-form-item>
			<!-- <el-form-item label="航线">
				<el-input v-model="search.airroute" placeholder="航线"></el-input>
			</el-form-item> -->
			<el-form-item label="航班号">
				<el-input v-model="search.flightnon" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.departcityname" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="目的地">
				<el-input v-model="search.arrivecityname" placeholder="目的地"></el-input>
			</el-form-item>
			<el-form-item label="商品编号">
				<el-input v-model="search.productno" placeholder="商品编号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
			</el-form-item>
		</el-form>

		<div class="button_box">
			<el-button type="primary" size="small" :disabled="allBtn" @click="handleShuaiwei">甩位</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handleKongwei">控位</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handleQiewei">切位</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handleTuiQie">退切</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handlePutOn">上架</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handlePullOff">下架</el-button>
			<el-button type="danger" size="small" :disabled="allBtn" @click="handleDelete" icon="el-icon-delete">删除</el-button>
		</div>
		
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="40" fixed>
			</el-table-column>
			<el-table-column prop='productNo' label="商品编号" min-width="120"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="shelvesStatus" label="销售状态" min-width="80">
			</el-table-column>
			<el-table-column prop="airline" label="航空公司" :show-overflow-tooltip="true"  min-width="80">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="出发日期" width="100">
				<template slot-scope="scope">
					{{scope.row.departDate?scope.row.departDate.split('T')[0]:''}}
			    </template>
			</el-table-column>
			<el-table-column prop="departCity" label="出发地">
			</el-table-column>
			<el-table-column prop="arriveCity" label="目的地">
			</el-table-column>
			<el-table-column prop="departTime" label="起飞时间">
			</el-table-column>
			<el-table-column prop="arriveTime" label="到达时间">
			</el-table-column>
			<el-table-column prop="quantity" label="座位数">
			</el-table-column>
			<el-table-column prop="reservedQuantity" label="控位">
			</el-table-column>
			<el-table-column prop="saleQuantity" label="切位">
			</el-table-column>
			<el-table-column prop="recivedQuantity" label="收客">
			</el-table-column>
			<el-table-column prop="remainingQuantity" label="余位">
			</el-table-column>
			<el-table-column prop="" label="正价票">
			</el-table-column>
			<el-table-column prop="reductionSaleQuantity" label="甩位票">
			</el-table-column>
			<el-table-column prop="peerPriceAdult" label="成人价">
			</el-table-column>
			<el-table-column label="操作" width="180"  fixed="right">
				<template slot-scope="scope">
			       <el-button size="mini" @click="goDetail(scope.row)">查看</el-button>
				   <el-button size="mini" type="warning" @click="goEdit(scope.row)" icon="el-icon-edit">修改</el-button>
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
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
				},
				search: {
					airline: '',
					airroute: '',
					flightnon: '',
					departcityname: '',
					arrivecityname: '',
					productno: '',
					voyageType:''
				},
				voyageTypeList:[{
					value:0,
					label:'不限'
				},{
					value:1,
					label:'往返'
				},{
					value:2,
					label:'单程'
				}],
				tableLoading: false,
				allBtn: true,
				deleteLoading: false,
				multipleSelection: [],
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				let airline = this.search.airline
				let airroute = this.search.airroute
				let flightnon = this.search.flightnon
				let departcityname = this.search.departcityname
				let arrivecityname = this.search.arrivecityname
				let productno = this.search.productno
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('/api/products/list?PageSize=' + size + '&PageIndex=' + index + '&Airline=' + airline + '&AirRoute=' + airroute + '&FlightNo=' + flightnon + '&DepartCityName=' + departcityname + '&ArriveCityName=' + arrivecityname + '&ProductNo=' + productno)
					.then((res) => {
						var objects=res.data.objects;
						this.table.total = res.data.total
						this.table.tableData = objects
						this.tableLoading = false
					})
			},
			handleSearch() {
				this.getList()
			},
			handlePutOn() {
				this.$confirm('确认上架所选商品？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let putonGroup = []
					this.multipleSelection.forEach((item) => {
						putonGroup.push(item.id)
					})
					this.deleteLoading = true
					this.airHttp.post('api/products/status', {AirTicketPricingSalesID:JSON.stringify(putonGroup),ShelvesStatus:0})
						.then((res) => {
							this.deleteLoading = false
							if(res.data.isSuccess) {
								this.$message({
									message: '上架成功！',
									type: 'success'
								});
								this.getList()
							}
						})
				}).catch(() => {

				});

			},
			handlePullOff() {
				this.$confirm('确认下架所选商品？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let pulloffGroup = []
					this.multipleSelection.forEach((item) => {
						pulloffGroup.push(item.id)
					})
					this.deleteLoading = true
					this.airHttp.post('api/products/status', {AirTicketPricingSalesID:JSON.stringify(pulloffGroup),ShelvesStatus:1})
						.then((res) => {
							this.deleteLoading = false
							if(res.data.isSuccess) {
								this.$message({
									message: '下架成功！',
									type: 'success'
								});
								this.getList()
							}
						})
				}).catch(() => {

				});

			},
			handleDelete() {
				this.$confirm('此操作将删除所选的商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let deleteGroup = []
					this.multipleSelection.forEach((item) => {
						deleteGroup.push(item.id)
					})
					this.deleteLoading = true
					this.airHttp.post('api/products/delete', {IdList:JSON.stringify(deleteGroup)})
						.then((res) => {
							this.deleteLoading = false
							if(res.data.isSuccess) {
								this.$message({
									message: '删除商品成功！',
									type: 'success'
								});
								this.getList()
							}
						})
				}).catch(() => {

				});

			},
			handleShuaiwei() {
				if(this.multipleSelection.length>1){
					this.$message.error('暂不支持批量甩位');
					return false
				}else{
					this.$router.push({path:'/airplane/shuaiwei-price/'+this.multipleSelection[0].id})
				}
			},
			handleKongwei() {
				if(this.multipleSelection.length>1){
					this.$message.error('暂不支持批量控位');
					return false
				}else{
					this.$router.push({path:'/airplane/stock-kongwei/'+this.multipleSelection[0].id})
				}
			},
			handleTuiQie(){
				if(this.multipleSelection.length>1){
					this.$message.error('暂不支持批量定价，请单选');
					return false
				}else{
					this.$router.push({path:`/airplane/stock-tuiqie/${this.multipleSelection[0].id}`})
				}
			},
			handleQiewei() {
				if(this.multipleSelection.length>1){
					this.$message.error('暂不支持批量切位');
					return false
				}else{
					this.$router.push({path:'/airplane/stock-qiewei/'+this.multipleSelection[0].id})
				}
			},
			goDetail(row) {
				this.$router.push({path:'/airplane/air-detail/'+row.id})
			},
			goEdit(row) {
				this.$router.push({path:'/airplane/modify-price/'+row.id})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				if(this.multipleSelection.length > 0) {
					this.allBtn = false
				} else {
					this.allBtn = true
				}
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

<style scoped>

</style>