<template>
	<div class="" >
		<el-row class="margin_bottom">
			<el-button size="small" type="primary" @click="visible_add=true">添加</el-button>
      		<el-button size="small" :disabled="!canDelete" @click="handleDelete">删除</el-button>
		</el-row>
		<el-table size="small" :data="tableList" v-loading ='tableLoading' @selection-change="handleSelectionChange">
			<el-table-column size="small" type="selection" fixed></el-table-column>
			<el-table-column size="small" align="center" prop="name" label="主题名称" ></el-table-column>
			<el-table-column size="small" align="center"  label="操作" fixed="right" width='180'>
				<template slot-scope="scope">
					<el-button type="text"  size="mini" @click="hadleEdit(scope.row)">编辑</el-button>
					<el-button type="text"  size="mini" @click="handleDelete(scope.row)" >删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
			fixed="right"
			:data = 'pagination'
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="pagination.pageIndex"
			:page-sizes="pagination.sizes"
			:page-size="pagination.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="pagination.total">
			</el-pagination>
		</div>

		<el-dialog title="添加酒店主题" :visible.sync="visible_add" @close="handleCloseAddDialog">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="120px" size="small">
                <el-form-item label="酒店主题名称" prop="Name">
                    <el-input v-model="addForm.Name" class="input_comm" :maxlength="50" auto-complete="off"></el-input>
                </el-form-item> 
            </el-form>
            <div slot="footer">
                <el-button @click="visible_add = false"  size="small">取 消</el-button>
                <el-button type="primary" @click="hadleAddSubmit('addForm')"  size="small">确 定</el-button>
            </div>
        </el-dialog> 

		<el-dialog title="编辑酒店主题" :visible.sync="visible_edit" @close="handleCloseEditDialog">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="120px" size="small">
                <el-form-item label="酒店主题名称" prop="Name">
                    <el-input v-model="editForm.Name" class="input_comm" :maxlength="50" auto-complete="off"></el-input>
                </el-form-item> 
            </el-form>
            <div slot="footer">
                <el-button @click="visible_edit = false"  size="small">取 消</el-button>
                <el-button type="primary" @click="hadleEditSubmit('editForm')"  size="small">确 定</el-button>
            </div>
        </el-dialog> 
	</div>
</template>
<script>
  export default{
    data() {
		return {
			visible_add:false,
			visible_edit:false,
			tableLoading:true,
			tableList:[],
			canDelete:false,
			multipleSelection:[],
			addForm:{
				Name:''
			},
			editForm:{
				Name:'',
				Id:''
			},
			addFormRules:{
				Name: [
					{ required: true, type:'string', trigger: "blur",message:'主题名不能为空' },
					// {max:20,message:'类型名称不能过长'}
				], 
			},
			editFormRules:{
				Name: [
					{ required: true, type:'string', trigger: "blur",message:'主题名不能为空' },
					// {max:20,message:'类型名称不能过长'}
				], 
			},
			//分页
			pagination:{
				sizes:[5,10,20,50],
				pageSize: 10,
				pageIndex: 1,
				total:0
			},
		};
    },
    mounted(){
		this.getInfo();
    },
    methods: {
		getInfo(){
			this.tableLoading = true
			this.groupHttp.post('/HotelParameter/GetHotelThemePageList',{
				PageSize:this.pagination.pageSize,
				PageIndex:this.pagination.pageIndex,
			}).then(res => {
				if (res.data.isSuccess) {
					this.tableList=res.data.objects;
					this.pagination.total=res.data.total;
				} else {
					this.$message.error(res.data.message)
				}
				this.tableLoading = false;
			})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			if(this.multipleSelection.length == 0){
				this.canDelete = false;
			}else{
				this.canDelete = true;
			}
		},
		hadleAddSubmit(formName){
			this.$refs[formName].validate(valid => {
        		if (valid) {
					this.groupHttp.post('/HotelParameter/HotelThemeAddOrEdit',this.addForm)
					.then(res => {
						if (res.data.isSuccess) {
							this.$message({
								message: '添加成功',
								type: 'success'
							})
							this.visible_add=false;
							this.getInfo();
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
		},
		hadleEdit(row){
			this.editForm.Name=row.name;
			this.editForm.Id=row.id;
			this.visible_edit=true;
		},
		hadleEditSubmit(formName){
			this.$refs[formName].validate(valid => {
        		if (valid) {
					this.groupHttp.post('/HotelParameter/HotelThemeAddOrEdit',this.editForm)
					.then(res => {
						if (res.data.isSuccess) {
							this.$message({
								message: '编辑成功',
								type: 'success'
							})
							this.visible_edit=false;
							this.getInfo();
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
		},
		handleDelete(row){
			this.$confirm("确定删除该主题？", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				let itemIds=[];
				if(row.id){
					itemIds.push(row.id)
				}else{
					this.multipleSelection.forEach(item=>{
						itemIds.push(item.id)
					})
				}
				this.groupHttp.post('/HotelParameter/DeleteHotelTheme',{HotelParamId:itemIds})
				.then(res => {
					if (res.data.isSuccess) {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						this.getInfo();
					} else {
						this.$message.error(res.data.message)
					}
				})
			})
		},
		handleCloseAddDialog(){
			this.addForm.Name='';
			this.$refs['addForm'].clearValidate();
		},
		handleCloseEditDialog(){

		},
		//分页
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.pagination.pageIndex = 1;
			this.getInfo();
		},
		handleCurrentChange(val) {
			this.pagination.pageIndex = val;
			this.getInfo();
		},
	}
  }
</script>
