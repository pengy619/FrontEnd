<template>
	<div class="view">
		<el-form :inline="true" label-width="80px" :model="search" class="demo-form-inline" size="small">
			<el-form-item label="销售状态">
				<el-select v-model="search.saleState" placeholder="请选择">
				    <el-option
				      v-for="item in saleStateList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</el-form-item>
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
			<el-form-item label="航班号">
				<el-input v-model="search.flightNo" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.departPlace" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="目的地">
				<el-input v-model="search.arrivePlace" placeholder="目的地"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
			</el-form-item>
		</el-form>
		
		<el-table :data="table.tableData" style="width: 100%" v-loading="tableLoading" @header-click="handleClickMonth" :header-cell-class-name="headerCellClassName">
			<el-table-column prop='productNo' label="航程类型" min-width="120"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="shelvesStatus" label="航班号" min-width="80">
			</el-table-column>
			<el-table-column prop="airline" label="出发地-目的地" :show-overflow-tooltip="true"  min-width="80">
			</el-table-column>
			<el-table-column  :label="year" id="year" class="year">
				<button>111</button>
				<template v-for="item in dateList">
					<el-table-column  :label="item.month" >
						<el-table-column :label="item.week" >
							<el-table-column prop="flightNo" :label="item.date">
							</el-table-column>
						</el-table-column>
					</el-table-column>
			    </template>
				
				<!-- <el-table-column prop="flightNo" label="2月">
					<el-table-column prop="flightNo" label="六">
						<el-table-column prop="flightNo" label="2">
						</el-table-column>
					</el-table-column>
				</el-table-column>
				<el-table-column prop="flightNo" label="3月">
					<el-table-column prop="flightNo" label="日">
						<el-table-column prop="flightNo" label="3">
						</el-table-column>
					</el-table-column>
				</el-table-column> -->
			</el-table-column>
			
			
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[1,10,20,50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>

		<el-dialog
			title="选择日期"
			:visible.sync="dialogVisible"
			width="200">
			<el-input-number v-model="checkedYear"  :min="0"  placeholder=""></el-input-number>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="onSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				days:30,
				year:new Date().getFullYear()+'',
				month:1,
				checkedYear:new Date().getFullYear(),
				dateList:[{
					month:'',
					week:'周1',
					date:'1'
				}],
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
				},
				search: {
					flightNo: '',
					departPlace: '',
					arrivePlace: '',
					voyageType:'',
					saleState:''
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
				saleStateList:[{
					value:0,
					label:'不限'
				},{
					value:1,
					label:'已上架'
				},{
					value:2,
					label:'未上架'
				}],
				tableLoading: false,
				deleteLoading: false,
				dialogVisible:false,
				multipleSelection: [],
				monthList:{
					'35':1,
					'38':2,
					'41':3,
					'44':4,
					'47':5,
					'50':6,
					'53':7,
					'56':8,
					'59':9,
					'62':10,
					'65':11,
					'68':12
				}
			}
		},
		mounted() {
			this.getList();
			this.getDate();
		},
		methods: {
			getList() {
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('/api/products/list?PageSize=' + size + '&PageIndex=' + index + '&FlightNo=' + this.search.flightNo + '&DepartCityName=' + this.search.departPlace + '&ArriveCityName=' + this.search.arrivePlace + '&voyageType=' + this.search.voyageType + '&saleState=' + this.search.saleState)
					.then((res) => {
						var objects=res.data.objects;
						this.table.total = res.data.total
						this.table.tableData = objects
						this.tableLoading = false
					})
			},
			getDate(){
				let count=1;
				for(let i=0;i<this.days;i++){
					let obj;
					if(i<9||i>20){
						obj={
							month:'',
							week:'周1',
							date:'1',
							isActive:false
						}
					}else{
						obj={
							month:count+'',
							week:'周1',
							date:'1',
							isActive:false
						}
						if(count==this.month){
							obj.isActive=true;
						}
						count++;
					}
					this.dateList.push(obj)
				}
			},
			handleSearch() {
				this.getList()
			},
			handleClickMonth(column, event){
				console.log(column.id)
				var len=column.id.length;
				
				if(column.id=='el-table_1_column_4'){
					this.dialogVisible=true;
					return false;
				}
				if(len==29){
					console.log(column.id.slice(27))
					this.month=this.monthList[column.id.slice(27)]
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
			onSubmit(){
				this.dialogVisible=false;
				this.year=this.checkedYear+'';
				this.enSureDays();
			},
			enSureDays(){
				let m=this.month;
				if(m==2){
					if((this.year % 4 == 0) && (this.year % 100 != 0 || this.year % 400 == 0)){
						this.days=29;
					}else{
						this.days=28;
					}
				}else if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
					this.days=31;
				}else{
					this.days=30;
				}
			},
			headerCellClassName(row, column, rowIndex, columnIndex){
				if(rowIndex ==2||columnIndex==5){
					return 'font-green'
				}
			}
		}
	}
</script>

<style>
	.el-table .el-table__header .font-green{
		color: green;
		background-color: red;
	}
</style>