<template>
	<div class="view">
		<div class="button_box">
			<el-button type="primary" size="small" :disabled="addBtn" @click="dialogAddFormVisible = true">添加</el-button>
			<el-button type="danger" size="small"  :disabled="deleteBtn" @click="onDelete">删除</el-button>
		</div>

		<el-table :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="spanceName" label="舱位名称">
			</el-table-column>
			<el-table-column prop="spanceCode" label="舱位代码">
			</el-table-column>
			<el-table-column label="操作" width="100px">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1, 10, 20, 50 ,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>

		<!--添加舱位弹框-->
		<el-dialog title="添加舱位" :visible.sync="dialogAddFormVisible" @close="handleAddCloseDialog" width="600px">
			<el-form ref="form" :model="addForm" :rules="addRules" label-width="80px" size="small" class="full-width">
				<el-form-item label="舱位名称" prop="SpanceName" >
					<el-input v-model="addForm.SpanceName" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="舱位代码" prop="SpanceCode">
					<el-input class="left-input" v-model="addForm.SpanceCode"   :maxlength="20" placeholder="" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onAddCancel">取 消</el-button>
				<el-button type="primary" @click="onAddSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>

		<!--编辑舱位弹框-->
		<el-dialog title="编辑舱位" :visible.sync="dialogEditFormVisible" width="600px">
			<el-form ref="form" :model="editForm" :rules="editRules" label-width="80px" size="small" class="full-width">
				<el-form-item label="舱位名称" prop="spanceName" >
					<el-input v-model="editForm.spanceName" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="舱位代码" prop="spanceCode">
					<el-input class="left-input" v-model="editForm.spanceCode"   :maxlength="20" placeholder="" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onEditCancel">取 消</el-button>
				<el-button type="primary"  @click="onEditSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			// let checkQuantity = (rule, value, callback) => {
			// 	if(Number(value)<=0){
			// 		return callback(new Error('座位数必须大于0'));
			// 	}else if(value.toString().indexOf('.')>-1){
			// 		return callback(new Error('座位数必须为整数'));
			// 	}else{
			// 		callback();
			// 	}
			// };
			return {
				table: {
					currentPage: 1,
					size:10,
					total:0,
				},
				tableData: [],
				dialogAddFormVisible: false,
				dialogEditFormVisible:false,
				deleteBtn:true,
				addBtn:true,
				defaultForm:{
					SpanceName:'',
					SpanceCode:'',
				},
				addForm: {
					SpanceName:'',
					SpanceCode:'',
				},
				editForm:{},
				addRules: {
					SpanceName: [{
						required: true,
						message: '请输入舱位名称',
						trigger: 'blur'
					}],
					// ,{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					SpanceCode: [{
						required: true,
						message: '请输入舱位代码',
						trigger: 'blur'
					}],
				},
				editRules: {
					spanceName: [{
						required: true,
						message: '请输入舱位名称',
						trigger: 'blur'
					}],
					spanceCode: [{
						required: true,
						message: '请输入舱位代码',
						trigger: 'blur'
					}],
				},
				submitLoading: false,
				tableLoading: false,
				checkedItems:[]
			}

		},
		methods: {
			submit(form,type){
				this.$refs['form'].validate((valid) => {
		          if (valid) {
		           this.submitLoading = true
					this.airHttp.post('api/ShoppingSpace/CreateOrEditSpace', form)
					.then((res) => {
						this.submitLoading = false
						if(res.data.isSuccess) {
							if(type=='add'){
								this.dialogAddFormVisible=false;
								this.$message({
									message: '添加舱位成功！',
									type: 'success'
								});
								this.addForm=JSON.parse(JSON.stringify(this.defaultForm));
							}else{
								this.dialogEditFormVisible=false;
								this.$message({
									message: '编辑舱位成功！',
									type: 'success'
								});
							}
							this.getList();
						}
					}).catch((err)=>{
						this.submitLoading = false	
					})
		          } else {
		            return false;
		          }
		        });
			},
			onAddSubmit(){
				this.submit(this.addForm,'add')
			},
			onEditSubmit(){
				this.submit(this.editForm,'edit')
			},
			onAddCancel(){
				this.dialogAddFormVisible=false;
			},
			handleEdit(row){
				if(row.enumAirlineType==0){
					row.enumAirlineType='Domestic';
				}else{
					row.enumAirlineType='International';
				}
				
				this.editForm= JSON.parse(JSON.stringify(row));
				this.dialogEditFormVisible=true;
			},
			onEditCancel(){
				this.dialogEditFormVisible=false;
			},
			handleSelectionChange(val){
				this.checkedItems=val;
				if(this.checkedItems.length > 0) {
					this.deleteBtn = false
				} else {
					this.deleteBtn = true
				}
			},
			onDelete(){
				this.$confirm('此操作将删除所选的舱位, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var SpaceIds=[]
					this.checkedItems.forEach(function(item){
						SpaceIds.push(item.id);
					})
					this.airHttp.post('api/ShoppingSpace/DeleteSpace', {SpaceIds:SpaceIds})
					.then((res) => {
						if(res.data.isSuccess) {
							this.getList()
							this.$message({
								message: '删除舱位成功！',
								type: 'success'
							});
						}
					})
				}).catch(() => {

				});
			},
			handleSizeChange(val) {
				this.table.size = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.table.currentPage = val
				this.getList()
			},
			getList() {
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('api/ShoppingSpace/GetSpaceList?Id=0&PageSize=' + size + '&PageIndex=' + index)
					.then((res) => {
						this.table.total = res.data.total
						this.tableData = res.data.objects
						this.tableLoading = false;
						this.addBtn=false;
					})
			},
			handleAddCloseDialog(){
				this.addForm=JSON.parse(JSON.stringify(this.defaultForm));
			}
		},
		mounted () {
			this.getList()
		}
	}
</script>

<style>

</style>