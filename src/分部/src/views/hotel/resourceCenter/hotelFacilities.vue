<template>
	<div class="" >
		<el-row class="margin_bottom">
			<el-button size="small" type="primary" @click="visible_add=true">添加</el-button>
      		<el-button size="small" :disabled="!canDelete" @click="handleDelete">删除</el-button>
		</el-row>
		<el-table size="small" :data="tableList" v-loading ='tableLoading' @selection-change="handleSelectionChange">
			<el-table-column size="small" type="selection" fixed></el-table-column>
			<el-table-column size="small" align="center" prop="name" label="酒店设施名称" ></el-table-column>
			<el-table-column size="small" align="center" label="图标" >
				<template slot-scope="scope">
					<img :src="scope.row.imageIcon" v-if="scope.row.imageIcon" style="width:75px;height:75px;" />
				</template>
			</el-table-column>
			<el-table-column size="small" align="center"  label="操作" fixed="right" width='180'>
				<template slot-scope="scope">
					<el-button type="text"  size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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

		<el-dialog title="添加酒店设施" :visible.sync="visible_add" @close="handleCloseAddDialog">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="120px" size="small">
                <el-form-item label="酒店设施名称" prop="Name">
                    <el-input v-model="addForm.Name" class="input_comm" :maxlength="50" auto-complete="off"></el-input>
                </el-form-item> 
				<el-form-item label="设施图标">
					<el-upload class="avatar-uploader" :http-request="addUpload" accept="image/*" action="http://120.76.20.11:8004/image/upload" :show-file-list="false" :before-upload="beforeLogoUpload">
						<img v-if="addForm.ImageIcon" :src="addForm.ImageIcon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="visible_add = false"  size="small">取 消</el-button>
                <el-button type="primary" @click="handleAddSubmit('addForm')"  size="small">确 定</el-button>
            </div>
        </el-dialog> 

		<el-dialog title="编辑酒店设施" :visible.sync="visible_edit" @close="handleCloseEditDialog">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="120px" size="small">
                <el-form-item label="酒店设施名称" prop="Name">
                    <el-input v-model="editForm.Name" class="input_comm" :maxlength="50" auto-complete="off"></el-input>
                </el-form-item> 
				<el-form-item label="设施图标">
					<el-upload class="avatar-uploader" :http-request="editUpload" accept="image/*" action="http://120.76.20.11:8004/image/upload" :show-file-list="false" :before-upload="beforeLogoUpload">
						<img v-if="editForm.ImageIcon" :src="editForm.ImageIcon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="visible_edit = false"  size="small">取 消</el-button>
                <el-button type="primary" @click="handleEditSubmit('editForm')"  size="small">确 定</el-button>
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
				Name:'',
				ImageIcon:''
			},
			editForm:{
				Name:'',
				ImageIcon:'',
				Id:''
			},
			addFormRules:{
				Name: [
					{ required: true, type:'string', trigger: "blur",message:'设施名不能为空' },
				], 
			},
			editFormRules:{
				Name: [
					{ required: true, type:'string', trigger: "blur",message:'设施名不能为空' },
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
			this.groupHttp.post('/HotelParameter/GetHotelFacilityPageList',{
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
		handleAddSubmit(formName){
			this.$refs[formName].validate(valid => {
        		if (valid) {
					this.groupHttp.post('/HotelParameter/HotelFacilityAddOrEdit',this.addForm)
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
		handleEdit(row){
			this.editForm.Name=row.name;
			this.editForm.Id=row.id;
			this.editForm.ImageIcon=row.imageIcon;
			this.visible_edit=true;
		},
		handleEditSubmit(formName){
			this.$refs[formName].validate(valid => {
        		if (valid) {
					this.groupHttp.post('/HotelParameter/HotelFacilityAddOrEdit',this.editForm)
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
			this.$confirm("确定删除该设施？", {
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
				this.groupHttp.post('/HotelParameter/DeleteHotelFacility',{HotelParamId:itemIds})
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
			this.addForm.ImageIcon=''
			this.$refs['addForm'].clearValidate();
		},
		handleCloseEditDialog(){

		},
		
		addUpload(val){
			var f=new FormData()
			f.append('FileData',val.file)
			f.append('Category','AirTicket')
			f.append('thumbnail',true)
			f.append('Folder','Airline')
			this.fileUpload.post(val.action,f)
			.then((res)=>{
				this.addForm.ImageIcon=res.data.url
			})
		},
		editUpload(val){
			var f=new FormData()
			f.append('FileData',val.file)
			f.append('Category','AirTicket')
			f.append('thumbnail',true)
			f.append('Folder','Airline')
			this.fileUpload.post(val.action,f)
			.then((res)=>{
				this.editForm.ImageIcon=res.data.url
			})
		},
		beforeLogoUpload(file) {
			const isImg = file.type.indexOf('image')>-1;
			const isLt2M = file.size / 1024 / 1024 < 2;

			if(!isImg) {
				this.$message.error('只能上传图片!');
			}
			if(!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
			}
			return isImg && isLt2M;
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
<style lang="scss" scoped>

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		border: 1px dashed #d9d9d9;
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>