<template>
	<div class="view">
		<div>
			<el-button type="primary" size="small" :disabled="addBtn" @click="onAddRule">添加</el-button>
			<el-button type="danger" size="small" :disabled="deleteBtn" @click="onDelete">删除</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="ruleName" label="政策名称" >
			</el-table-column>
			<el-table-column prop="creationTime" label="创建时间" >
			</el-table-column>
			<el-table-column prop="lastModificationTime" label="更新时间">
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

		<!--添加规则弹框-->
		<el-dialog title="添加退票政策" :visible.sync="dialogAddFormVisible" @close="handleAddCloseDialog" width="700px">
			<el-form ref="form" :model="addForm" :rules="addRules" label-width="80px" size="small" class="full-width" id="addForm">

				<el-form-item label="政策名称" prop="RuleName">
					<el-col :span="16">
					<el-input v-model="addForm.RuleName" placeholder="" maxlength="20"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="退票规则" prop="RefundRule">
					<el-radio-group v-model="addForm.RefundRule" @change="changeAddRefundType" >
						<el-radio label="0">无条件可退</el-radio>
						<el-radio label="1">有条件可退</el-radio>
						<el-radio label="2">不可退</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item style="margin-left:-80px;" v-if="addIsShow.isAddRefund">
					<el-form-item class="rule-box">
						<el-row>
						<el-col :span="10">
							退票时间
						</el-col>
						<el-col :span="14">
							退票方式
						</el-col>
						</el-row>
						<el-row>
						<el-col :span="10">
							航班起飞前
							<el-form-item prop="RefundTimeStart"  class="select-box">
								<el-select v-model="addForm.RefundTimeStart" filterable allow-create @change="handleChangeAddRefundTimeStart">
									<el-option
									v-for="item in addForm.RefundTimeStartItems"
									:key="item.value"
									:label="item.value"
									:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							小时前

						</el-col>
						<el-col :span="14">
							<el-form-item prop="RefundWay" class="refund-way">
								<el-select v-model="addForm.RefundWay" @change="changeAddRefundWay1">
									<el-option
									v-for="item in addForm.RefundWayItems"
									:key="item.value"
									:label="item.label"
									:value="item.value" >
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item class="way-box1" v-if="addIsShow.isAddShow11" prop="Limit" >
								<el-input-number v-model="addForm.Limit" :min="0" :max="999999999" :controls="false" class="smallinput"></el-input-number>
									元
							</el-form-item>
							<el-form-item class="way-box2" v-if="addIsShow.isAddShow12" prop="Limit">
									定价的
								<el-input-number v-model="addForm.Limit" :min="0" :max="100" :controls="false"  class="smallinput"></el-input-number>
									%
							</el-form-item>
						</el-col>
						</el-row>
						<el-row>
						<el-col :span="10">

								航班起飞后
								<el-form-item prop="RefundTimeEnd" class="select-box">
								<el-select v-model="addForm.RefundTimeEnd"  filterable allow-create @change="handleChangeAddRefundTimeEnd">
									<el-option
									v-for="item in addForm.RefundTimeEndItems"
									:key="item.value"
									:label="item.value"
									:value="item.value">
									</el-option>
								</el-select>
								</el-form-item>
									小时

						</el-col>
						<el-col :span="14">
							<el-form-item prop="RefundWayTimeEnd" class="refund-way">
									<el-select v-model="addForm.RefundWayTimeEnd"  @change="changeAddRefundWay2" >
										<el-option
										v-for="item in addForm.RefundWayTimeEndItems"
										:key="item.value"
										:label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item class="way-box1" v-if="addIsShow.isAddShow21" prop="LimitTimeEnd">
									<el-input-number v-model="addForm.LimitTimeEnd" :min="0" :max="999999999" :controls="false"  class="smallinput"></el-input-number>
										元
								</el-form-item>
								<el-form-item class="way-box2" v-if="addIsShow.isAddShow22" prop="LimitTimeEnd">
										定价的
									<el-input-number v-model="addForm.LimitTimeEnd" :min="0" :max="100" :controls="false"  class="smallinput"></el-input-number>
										%
								</el-form-item>

						</el-col>
						</el-row>
					</el-form-item>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddFormVisible = false">取 消</el-button>
				<el-button type="primary"  @click="onAddSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>


		<!--编辑规则弹框-->
		<el-dialog title="编辑退票政策" :visible.sync="dialogEditFormVisible" width="700px">
			<el-form ref="form" :model="editForm" :rules="editRules" label-width="80px" size="small" class="full-width">
				<el-form-item label="政策名称" prop="ruleName">
					<el-col :span="16">
					<el-input v-model="editForm.ruleName" placeholder="" maxlength="20"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="退票规则" prop="refundRule">
					<el-radio-group v-model="editForm.refundRule" @change="changeEditRefundType" >
						<el-radio :label="0">无条件可退</el-radio>
						<el-radio :label="1">有条件可退</el-radio>
						<el-radio :label="2">不可退</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item style="margin-left:-80px;" v-if="editIsShow.isEditRefund" >
					<el-form-item class="rule-box">
						<el-row>
							<el-col :span="10">
								退票时间
							</el-col>
							<el-col :span="14">
								退票方式
							</el-col>
						</el-row>
					<el-row>
					  <el-col :span="10">
							航班起飞前
						<el-form-item prop="refundTimeStart" class="select-box">
							<el-select v-model="editForm.refundTimeStart" filterable allow-create @change="handleChangeEditRefundTimeStart" >
								<el-option
									v-for="item in editForm.refundTimeStartItems"
									:key="item.value"
									:label="item.value"
									:value="item.value">
								</el-option>
								</el-select>
							</el-form-item>
							小时前

					  </el-col>
					  <el-col :span="14">
							<el-form-item prop="refundWay" class="refund-way" >
								<el-select v-model="editForm.refundWay" @change="changeEditRefundWay1">
									<el-option
									v-for="item in editForm.refundWayItems"
									:key="item.value"
									:label="item.label"
									:value="item.value" >
									</el-option>
								</el-select>
							  </el-form-item>
							  <el-form-item class="way-box1" v-if="editIsShow.isEditShow11" prop="limit">
								<el-input-number v-model="editForm.limit" :min="0" :max="999999999" :controls="false"  class="smallinput"></el-input-number>
								       元
							   </el-form-item>
							   <el-form-item class="way-box2" v-if="editIsShow.isEditShow12" prop="limit">
							   		定价的
								<el-input-number v-model="editForm.limit" :min="0" :max="100" :controls="false"  class="smallinput"></el-input-number>
								      %
							   </el-form-item>
					  </el-col>
					</el-row>
					<el-row>
					  <el-col :span="10">
					  		  航班起飞后

							<el-form-item prop="refundTimeEnd" class="select-box">
								<el-select v-model="editForm.refundTimeEnd" filterable allow-create @change="handleChangeEditRefundTimeEnd">
									<el-option
									v-for="item in editForm.refundTimeEndItems"
									:key="item.value"
									:label="item.value"
									:value="item.value">
									</el-option>
								</el-select>
							  </el-form-item>
					        	小时
					  </el-col>
					  <el-col :span="14">
					  	<el-form-item  class="refund-way" prop="refundWayTimeEnd">
					  		<el-select v-model="editForm.refundWayTimeEnd"  @change="changeEditRefundWay2">
							    <el-option
							      v-for="item in editForm.refundWayTimeEndItems"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
							</el-form-item>
							  <el-form-item class="way-box1" v-if="editIsShow.isEditShow21" prop="limitTimeEnd">
								  <el-input-number v-model="editForm.limitTimeEnd" :min="0" :max="999999999" :controls="false"  class="smallinput"></el-input-number>
								       元
							   </el-form-item>
							   <el-form-item class="way-box2" v-if="editIsShow.isEditShow22" prop="limitTimeEnd">
							   		定价的
								  <el-input-number v-model="editForm.limitTimeEnd" :min="0" :max="100" :controls="false"  class="smallinput"></el-input-number>
								      %
							   </el-form-item>
					  </el-col>
					</el-row>
					</el-form-item>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogEditFormVisible = false">取 消</el-button>
				<el-button type="primary"  @click="onEditSubmit" :loading="submitLoading">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
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
				defaultForm:{},
				addForm: {
					RuleName:'',
					RefundRule:'',
					RefundTimeStart:'',
					RefundTimeEnd:'',
					RefundWay:'',
					Limit:'',
					RefundWayTimeEnd:'',
					LimitTimeEnd:'',
					RefundTimeStartItems:[{
						value:1,
					},{
						value:2,
					},{
						value:3,
					}],
					RefundTimeEndItems:[{
						value:1,
					},{
						value:2,
					},{
						value:3,
					}],
					RefundWayItems:[{
						value:1,
						label: '可退'
					},{
						value:2,
						label: '不可退'
					},{
						value:3,
						label: '可退但需额外支付（固定金额）'
					},{
						value:4,
						label: '可退但需额外支付（固定比例）'
					}],
					RefundWayTimeEndItems:[{
						value:1,
						label: '可退'
					},{
						value:2,
						label: '不可退'
					},{
						value:3,
						label: '可退但需额外支付（固定金额）'
					},{
						value:4,
						label: '可退但需额外支付（固定比例）'
					}]
				},
				editForm:{
					ruleName:'',
					refundRule:'',
					refundTimeStart:'',
					refundTimeEnd:'',
					refundWay:'',
					limit:'',
					refundWayTimeEnd:'',
					limitTimeEnd:'',
					refundTimeStartItems:[{
						value:1,
					},{
						value:2,
					},{
						value:3,
					}],
					refundTimeEndItems:[{
						value:1,
					},{
						value:2,
					},{
						value:3,
					}],
					refundWayItems:[{
						value:1,
						label: '可退'
					},{
						value:2,
						label: '不可退'
					},{
						value:3,
						label: '可退但需额外支付（固定金额）'
					},{
						value:4,
						label: '可退但需额外支付（固定比例）'
					}],
					refundWayTimeEndItems:[{
						value:1,
						label: '可退'
					},{
						value:2,
						label: '不可退'
					},{
						value:3,
						label: '可退但需额外支付（固定金额）'
					},{
						value:4,
						label: '可退但需额外支付（固定比例）'
					}]
				},
				addRules: {
					RuleName: [{
						required: true,
						message: '请输入政策名称',
						trigger: 'blur'
					}],
					RefundRule: [{
						required: true,
						message: '请选择退票规则',
						trigger: 'blur'
					}],
					RefundTimeStart: [{
						type:'number',
						required: true,
						message: '请选择起飞前时间',
						trigger: 'change'
					}],
					RefundTimeEnd: [{
						type:'number',
						required: true,
						message: '请选择起飞后时间',
						trigger: 'change'
					}],
					RefundWay: [{
						type:'number',
						required: true,
						message: '请选择起飞前退款方式',
						trigger: 'change'
					}],
					RefundWayTimeEnd: [{
						type:'number',
						required: true,
						message: '请选择起飞后退款方式',
						trigger: 'change'
					}],
					Limit: [{
						type:'number',
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					LimitTimeEnd: [{
						type:'number',
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
				},
				editRules: {
					ruleName: [{
						required: true,
						message: '请输入政策名称',
						trigger: 'blur'
					}],
					refundRule: [{
						type:'number',
						required: true,
						message: '请选择退票规则',
						trigger: 'change'
					}],
					refundTimeStart: [{
						type:'number',
						required: true,
						message: '请选择起飞前时间',
						trigger: 'change'
					}],
					refundTimeEnd: [{
						type:'number',
						required: true,
						message: '请选择起飞后时间',
						trigger: 'change'
					}],
					refundWay: [{
						type:'number',
						required: true,
						message: '请选择起飞前退款方式',
						trigger: 'change'
					}],
					refundWayTimeEnd: [{
						type:'number',
						required: true,
						message: '请选择起飞后退款方式',
						trigger: 'change'
					}],
					limit: [{
						type:'number',
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					limitTimeEnd: [{
						type:'number',
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
				},
				submitLoading: false,
				tableLoading:false,
				checkedItems:[],
				defaultAddIsShow:{},
				defaultEditIsShow:{},
				addIsShow:{
					isAddRefund:false,
					isAddShow11:false,
					isAddShow12:false,
					isAddShow21:false,
					isAddShow22:false,
				},
				editIsShow:{
					isEditRefund:false,
					isEditShow11:false,
					isEditShow12:false,
					isEditShow21:false,
					isEditShow22:false,
				}
			}

		},
		methods: {
			changeAddRefundType(val){
				if(val==0||val==2){
					this.addIsShow.isAddRefund=false;
					this.addForm.RefundTimeStart='';
					this.addForm.RefundTimeEnd='';
					this.addForm.RefundWay='';
					this.addForm.Limit='';
					this.addForm.RefundWayTimeEnd='';
					this.addForm.LimitTimeEnd='';
					this.addIsShow=JSON.parse(JSON.stringify(this.defaultAddIsShow));
				}else{
					this.addIsShow.isAddRefund=true;
				}

			},
			changeAddRefundWay1(val){
				if(val<=2){
					this.addIsShow.isAddShow11=false;
					this.addIsShow.isAddShow12=false;
				}else if(val==3){
					this.addIsShow.isAddShow11=true;
					this.addIsShow.isAddShow12=false;
				}else if(val==4){
					this.addIsShow.isAddShow11=false;
					this.addIsShow.isAddShow12=true;
				}
				this.addForm.Limit='';
			},
			changeAddRefundWay2(val){
				if(val<=2){
					this.addIsShow.isAddShow21=false;
					this.addIsShow.isAddShow22=false;
				}else if(val==3){
					this.addIsShow.isAddShow21=true;
					this.addIsShow.isAddShow22=false;
				}else if(val==4){
					this.addIsShow.isAddShow21=false;
					this.addIsShow.isAddShow22=true;
				}
				this.addForm.LimitTimeEnd='';
			},

			changeEditRefundType(val){
				if(val==0||val==2){
					this.editIsShow.isEditRefund=false;
					this.editForm.refundTimeStart='';
					this.editForm.refundTimeEnd='';
					this.editForm.refundWay='';
					this.editForm.limit='';
					this.editForm.refundWayTimeEnd='';
					this.editForm.limitTimeEnd='';
					this.editIsShow=JSON.parse(JSON.stringify(this.defaultEditIsShow));
				}else{
					this.editIsShow.isEditRefund=true;
				}
			},
			changeEditRefundWay1(val,isFirstTime){
				if(val<=2){
					this.editIsShow.isEditShow11=false;
					this.editIsShow.isEditShow12=false;
				}else if(val==3){
					this.editIsShow.isEditShow11=true;
					this.editIsShow.isEditShow12=false;
				}else if(val==4){
					this.editIsShow.isEditShow11=false;
					this.editIsShow.isEditShow12=true;
				}
				if(!isFirstTime){
					this.editForm.limit='';
				}
			},
			changeEditRefundWay2(val,isFirstTime){
				if(val<=2){
					this.editIsShow.isEditShow21=false;
					this.editIsShow.isEditShow22=false;
				}else if(val==3){
					this.editIsShow.isEditShow21=true;
					this.editIsShow.isEditShow22=false;
				}else if(val==4){
					this.editIsShow.isEditShow21=false;
					this.editIsShow.isEditShow22=true;
				}
				if(!isFirstTime){
					this.editForm.limitTimeEnd='';
				}
			},


			submit(form,type){
				this.$refs['form'].validate((valid) => {
		          if (valid) {
		           this.submitLoading = true
					this.airHttp.post('api/refundrule/CreateOrEditRefundRule', form)
					.then((res) => {
						this.submitLoading = false
						if(res.data.isSuccess) {
							if(type=='add'){
								this.dialogAddFormVisible=false;
								this.$message({
									message: '添加退票规则成功！',
									type: 'success'
								});
								this.addForm=JSON.parse(JSON.stringify(this.defaultForm));
								this.addIsShow=JSON.parse(JSON.stringify(this.defaultAddIsShow));
							}else{
								this.dialogEditFormVisible=false;
								this.$message({
									message: '编辑退票规则成功！',
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
			onAddRule(){
				this.dialogAddFormVisible=true;
			},
			onAddSubmit(){
				this.submit(this.addForm,'add')
			},
			onEditSubmit(){
				this.submit(this.editForm,'edit')
			},
			handleEdit(row){
				for(var i in row) {
					this.editForm[i]=row[i];
				}
				this.changeEditRefundType(row.refundRule);
				this.changeEditRefundWay1(row.refundWay,true);
				this.changeEditRefundWay2(row.refundWayTimeEnd,true);
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
				this.$confirm('此操作将删除所选的退票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var RefundRuleList=[];
					this.checkedItems.forEach(function(item){
						RefundRuleList.push(item.id);
					})
					this.airHttp.post('api/refundrule/DeleteRefundRule',{RefundRuleList:JSON.stringify(RefundRuleList)})
					.then((res) => {
						if(res.data.isSuccess) {
							this.getList()
							this.$message({
								message: '删除退票规则成功！',
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
				this.airHttp.get('api/refundrule/refundruleList?Id=0&PageSize=10&PageIndex=1')
				.then((res)=>{
					var objects=res.data.objects;
						objects.forEach(function(item,index){
							 objects[index].creationTime=objects[index].creationTime?item.creationTime.replace(/T/,' ').split('.')[0]:'';
							 objects[index].lastModificationTime=objects[index].lastModificationTime?item.lastModificationTime.replace(/T/,' ').split('.')[0]:'';
						})
						this.table.total = res.data.total
						this.tableData = objects
						this.tableLoading = false;
						this.addBtn = false
				})
			},
			handleChangeAddRefundTimeStart(val){
				this.addForm.RefundTimeStart=Math.abs(parseInt(val))||0;
			},
			handleChangeAddRefundTimeEnd(val){
				this.addForm.RefundTimeEnd=Math.abs(parseInt(val))||0;
			},
			handleChangeEditRefundTimeStart(val){
				this.editForm.refundTimeStart=Math.abs(parseInt(val))||0;
			},
			handleChangeEditRefundTimeEnd(val){
				this.editForm.refundTimeEnd=Math.abs(parseInt(val))||0;
			},
			handleAddCloseDialog(){
				this.addForm=JSON.parse(JSON.stringify(this.defaultForm));
			}
		},
		mounted () {
			this.defaultForm=JSON.parse(JSON.stringify(this.addForm));
			this.defaultAddIsShow=JSON.parse(JSON.stringify(this.addIsShow));
			this.defaultEditIsShow=JSON.parse(JSON.stringify(this.editIsShow));
			this.getList();
		}
	}
</script>

<style>
	.smallinput{
		width: 70px!important;
	}
	.refund-way{
		display: inline-block;
		width: 240px!important;
	}
	.way-box1,.way-box2{
		display: inline-block;
	}
	.select-box{
		display: inline-block;
		width: 120px!important;
	}
	.el-form-item .el-form-item .el-form-item{
		margin-bottom: 0px;
	}
	.rule-box {
		border:1px solid #e5e5e5;
	}
	.rule-box .el-row:not(:last-child){
		border-bottom:1px solid #e5e5e5;
	}
	.rule-box .el-col{
		padding: 5px 0 18px 5px;
	}
	.rule-box .el-row:first-child .el-col{
		padding-bottom: 0;
	}
	.rule-box .el-col+ .el-col{
		border-left: 1px solid #e5e5e5
	}
</style>
