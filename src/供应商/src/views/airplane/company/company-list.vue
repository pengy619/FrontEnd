<template>
	<div class="view">
		<el-form :inline="true" :model="search" size="small" class="demo-form-inline">
			<el-form-item label="航空公司名称">
				<el-input v-model="search.keyword" placeholder=""></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
			</el-form-item>
		</el-form>

		<div>
			<el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
			<el-button type="danger" size="small" :disabled="deleteBtn" @click="handleDelete" icon="el-icon-delete">删除</el-button>
		</div>

		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="name" label="航空公司" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="logo" label="标志">
				<template slot-scope="scope">
					<img :src="scope.row.logo" style="width: 100%;" />
				</template>
			</el-table-column>
			<el-table-column prop="airlineType" label="类型">
				<template slot-scope="scope">
					{{scope.row.airlineType==0?'国内':'国外'}}
				</template>
			</el-table-column>
			<el-table-column prop="code" label="三字码">
			</el-table-column>
			<el-table-column prop="iataCode" label="二字码">
			</el-table-column>
			<el-table-column prop="contacts" label="联系人">
			</el-table-column>
			<el-table-column prop="mobile" label="手机">
			</el-table-column>
			<el-table-column label="操作" width="100px">
				<template slot-scope="scope">
					<el-button size="mini" @click="goEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
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
					keyword: ''
				},
				tableLoading: false,
				deleteBtn: true,
				deleteLoading: false,
				multipleSelection: [],
			}

		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				let keyword = this.search.keyword
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('/api/airline/list?PageSize=' + size + '&PageIndex=' + index + '&Name=' + keyword)
					.then((res) => {
						this.table.total = res.data.total
						this.table.tableData = res.data.objects
						this.tableLoading = false
					})
			},
			handleSearch() {
				this.getList()
			},
			handleAdd() {
				this.$router.push('company-add')
			},
			handleDelete() {
				this.$confirm('此操作将删除所选的航空公司, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let deleteGroup = []
					this.multipleSelection.forEach((item) => {
						deleteGroup.push(item.id)
					})
					this.deleteLoading = true
					console.log(JSON.stringify(deleteGroup))
					this.airHttp.post('api/airline/delete', {IdList:JSON.stringify(deleteGroup)})
						.then((res) => {
							this.deleteLoading = false
							if(res.data.isSuccess) {
								this.$message({
									message: '删除航空公司成功！',
									type: 'success'
								});
								this.getList()
							}
						})
				}).catch(() => {

				});

			},
			goEdit(row) {
				this.$router.push({path:'/airplane/company-edit/'+row.id})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				if(this.multipleSelection.length > 0) {
					this.deleteBtn = false
				} else {
					this.deleteBtn = true
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

<style>

</style>
