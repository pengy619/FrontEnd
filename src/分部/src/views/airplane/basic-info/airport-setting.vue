<template>
	<div class="view">
		<div class="button_box">
			<el-button type="primary" size="small" :disabled="addBtn" @click="onOpenAddDiog">添加</el-button>
			<el-button type="danger" size="small" :disabled="deleteBtn" @click="onDelete">删除</el-button>
		</div>

		<el-table :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column label="类型">
				<template slot-scope="scope">
					{{scope.row.enumAirlineType==0?'国内':'国外'}}
				</template>
			</el-table-column>
			<el-table-column label="所在地">
				<template slot-scope="scope">
					{{scope.row.countryName+' / '+scope.row.provinceName+' / '+scope.row.cityName}}
				</template>
			</el-table-column>
			<el-table-column prop="airportCode" label="机场代码">
			</el-table-column>
			<el-table-column prop="airportName" label="机场名称">
			</el-table-column>
			<el-table-column label="操作" width="100px">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1, 10, 20, 50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>

		<!--新增弹框-->
		<el-dialog title="添加机场" :visible.sync="dialogFormVisible" @close="handleAddCloseDialog" width="600px">
			<el-form ref="form" :model="form" :rules="addRules" label-width="80px" size="small" class="full-width" id="addForm">
				<el-form-item label="类型" prop="EnumAirlineType">
					<el-select v-model="form.EnumAirlineType" placeholder="请选择类型" @change="handleChangeAddAirlineType">
						<el-option label="国内" value="Domestic"></el-option>
						<el-option label="国外" value="International"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所在地" prop="CityId">
					<!--<el-cascader :options="addressOptions" @active-item-change="addressItemChange" :props="props"></el-cascader>-->
					<address-select :data-type="form.EnumAirlineType" ref="addressSelect" @result="addAddressResult"></address-select>
				</el-form-item>
				<el-form-item label="机场名称" prop="AirportName">
					<el-input v-model="form.AirportName" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="代码" prop="AirportCode">
					<el-input v-model="form.AirportCode" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onAddCancel">取 消</el-button>
				<el-button type="primary" @click="onAddSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>

		<!--编辑弹框-->
		<el-dialog title="编辑机场" :visible.sync="dialogEditForm" width="600px">
			<el-form ref="form" :model="editForm" :rules="editRules" label-width="80px" size="small" class="full-width" id="editForm">
				<el-form-item label="类型" prop="enumAirlineType">
					<el-select v-model="editForm.enumAirlineType" placeholder="请选择类型" @change="handleChangeEditAirlineType">
						<el-option label="国内" value="Domestic"></el-option>
						<el-option label="国外" value="International"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所在地" prop="cityId">
					<template v-if="!editAdress">
						<span>{{address}}</span>
						<el-button size="mini" @click="editAdress=!editAdress">修改</el-button>
					</template>
					<address-select v-if="editAdress" :data-type="editForm.enumAirlineType" @result="editAddressResult"></address-select>
				</el-form-item>
				<el-form-item label="机场名称" prop="airportName">
					<el-input v-model="editForm.airportName" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="代码" prop="airportCode">
					<el-input v-model="editForm.airportCode" placeholder=""  :maxlength="20"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onEditCancel">取 消</el-button>
				<el-button type="primary" @click="onEditSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import addressSelect from '@/components/address-select/index'
	export default {
		components: {
			addressSelect
		},
		data() {
			let checkAdress = (rule, value, callback) => {
		        if (value === '') {
		          return callback(new Error('请选择地址'));
		        }else{
		        	callback();
		        }
		    };
			return {
				table: {
					currentPage: 1,
					size:10,
					total:0,
				},
				tableData: [],
				dialogFormVisible: false,
				dialogEditForm:false,
				deleteBtn:true,
				addBtn:true,
				defaultForm:{},
				form: {
					EnumAirlineType: 'Domestic',
					AirportName:'',
					AirportCode:'',
					CountryId: '1',
					CountryName: '中国',
					ProvinceId: '',
					ProvinceName: '',
					CityId: '',
					CityName: '',
				},
				editForm:{
					enumAirlineType: 'Domestic',
					airportName:'',
					airportCode:'',
					countryId: '1',
					countryName: '中国',
					provinceId: '',
					provinceName: '',
					cityId: '',
					cityName: '',
				},
				addRules: {
					EnumAirlineType: [{
						required: true,
						message: '请选择类型',
						trigger: 'change'
					}],
					AirportName: [{
						required: true,
						message: '请输入机场名称',
						trigger: 'blur'
					}],
					CityId: [{
						required: true,
						validator:checkAdress,
						trigger: 'blur'
					}],
					AirportCode: [{
						required: true,
						message:'请输入机场代码',
						trigger: 'blur'
					}],
				},
				editRules: {
					enumAirlineType: [{
						required: true,
						message: '请选择类型',
						trigger: 'change'
					}],
					airportName: [{
						required: true,
						message: '请输入机场名称',
						trigger: 'blur'
					}],
					cityId: [{
						required: true,
						validator:checkAdress,
						trigger: 'blur'
					}],
					airportCode: [{
						required: true,
						message:'请输入机场代码',
						trigger: 'blur'
					}],
				},
				submitLoading: false,
				tableLoading: false,
				editAdress:false,
				checkedItems:[],
				address:'',
			}

		},
		methods: {
			//接受地址选择器的结果
			addAddressResult(val) {
				if(this.form.EnumAirlineType == 'Domestic') {
					this.form.ProvinceId = val.first.id
					this.form.ProvinceName = val.first.name
					this.form.CityId = val.second.id
					this.form.CityName = val.second.name
				}else if(this.form.EnumAirlineType == 'International') {
					this.form.CountryId = val.first.id
					this.form.CountryName = val.first.name
					this.form.ProvinceId = val.second.id
					this.form.ProvinceName = val.second.name
					this.form.CityId = val.third.id
					this.form.CityName = val.third.name
				}
			},
			editAddressResult(val) {
				if(this.editForm.enumAirlineType == 'Domestic') {
					this.editForm.provinceId = val.first.id
					this.editForm.provinceName = val.first.name
					this.editForm.cityId = val.second.id
					this.editForm.cityName = val.second.name
				}else if(this.editForm.enumAirlineType == 'International') {
					this.editForm.countryId = val.first.id
					this.editForm.countryName = val.first.name
					this.editForm.provinceId = val.second.id
					this.editForm.provinceName = val.second.name
					this.editForm.cityId = val.third.id
					this.editForm.cityName = val.third.name
				}
			},
			submit(form,type){
				this.$refs['form'].validate((valid) => {
		          if (valid) {
		           this.submitLoading = true
					this.airHttp.post('api/CreateOrEditAirport', form)
					.then((res) => {
						this.submitLoading = false
						if(res.data.isSuccess) {
							if(type=='add'){
								this.$refs.addressSelect.reset()
								this.dialogFormVisible=false;
								this.$message({
									message: '添加机场成功！',
									type: 'success'
								});
								this.form=JSON.parse(JSON.stringify(this.defaultForm));
							}else{
								this.dialogEditForm=false;
								this.$message({
									message: '编辑机场成功！',
									type: 'success'
								});
								this.editAdress=false;
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
				this.submit(this.form,'add')
			},
			onEditSubmit(){
				this.submit(this.editForm,'edit');
			},
			onOpenAddDiog(){

				this.dialogFormVisible = true;
			},
			onAddCancel(){
				this.dialogFormVisible=false;
			},
			handleEdit(row){
				row=JSON.parse(JSON.stringify(row))
				var addressArr=[];
				if(row.enumAirlineType==0){
					row.enumAirlineType='Domestic';
					addressArr.push(row.provinceName,row.cityName)
				}else{
					row.enumAirlineType='International';
					addressArr.push(row.countryName,row.provinceName,row.cityName)
				}
				this.address=addressArr.join(' / ')
				this.editForm=row;
				this.dialogEditForm=true;
				this.editAdress=false;
			},
			onEditCancel(){
				this.dialogEditForm=false;
				this.editAdress=false;
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
				this.$confirm('此操作将删除所选的机场, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var airportIds=[]
					this.checkedItems.forEach(function(item){
						airportIds.push(item.id);
					})
					this.airHttp.post('api/DeleteAirport', {airportIds:JSON.stringify(airportIds)})
					.then((res) => {
						if(res.data.isSuccess) {
							this.getList();
							this.$message({
								message: '删除机场成功！',
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
				this.airHttp.get('api/getairportList?Id=0&PageSize=' + size + '&PageIndex=' + index)
					.then((res) => {
						this.table.total = res.data.total
						this.tableData = res.data.objects
						this.tableLoading = false;
						this.addBtn=false;
					})
			},
			handleChangeAddAirlineType(val){
				if(val=='Domestic'){
					this.form.CountryId=1;
					this.form.CountryName= '中国';
				}else{
					this.form.CountryId='';
					this.form.CountryName= '';
				}
				this.form.ProvinceId= '';
				this.form.ProvinceName= '';
				this.form.CityId= '';
				this.form.CityName= '';
			},
			handleChangeEditAirlineType(val){
				if(val=='Domestic'){
					this.editForm.countryId=1;
					this.editForm.countryName= '中国';
				}else{
					this.editForm.countryId='';
					this.editForm.countryName= '';
				}
				this.editForm.provinceId= '';
				this.editForm.provinceName= '';
				this.editForm.cityId= '';
				this.editForm.cityName= '';
				this.editAdress=true;
			},
			handleAddCloseDialog(){
				this.form=JSON.parse(JSON.stringify(this.defaultForm));
				this.$refs.addressSelect.reset();
			}
		},
		mounted () {
			this.getList();
			this.defaultForm=JSON.parse(JSON.stringify(this.form))
		}
	}
</script>

<style>

</style>
