<template>
	<div class="view">
		<el-table ref="multipleTable" :data="tableData3" v-loading="loading" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column label="日期" width="120">
				<template slot-scope="scope">{{ scope.row.date }}</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="address" label="地址" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<div style="margin-top: 20px">
			<el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
			<el-button @click="toggleSelection()">取消选择</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData3: [],
				multipleSelection: [],
				loading:true
			}
		},
		mounted(){
			this.groupHttp.post('/GroupLine/GetGroupLineParamList',{branchid:1})
			.then((res)=>{
				console.log(res.data)
//				this.tableData3=res.data
				this.loading=false
			})
			.catch((err)=>{

			})
		},
		methods: {
			toggleSelection(rows) {
				if(rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				console.log(val)
			}
		}
	}
</script>

<style>

</style>
