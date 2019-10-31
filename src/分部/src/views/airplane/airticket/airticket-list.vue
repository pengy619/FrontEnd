
<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small">
			<el-form-item label="航空公司">
				<el-input v-model="search.company" placeholder="航空公司"></el-input>
			</el-form-item>
			<el-form-item label="航班号">
				<el-input v-model="search.flightNo" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.departure" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="目的地">
				<el-input v-model="search.destination" placeholder="目的地"></el-input>
			</el-form-item>
			<el-form-item label="出发日期">
				<el-date-picker
					v-model="search.departDate"
					type="daterange"
					range-separator="至" @change="HandleDepartDateChange">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getList">查询</el-button>
			</el-form-item>
		</el-form>

		<el-row  class="button_box">
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="reservationAir">预订机票</el-button>
			<el-button type="primary" size="small" :disabled="table.selected.length==0" @click="reservationDan">预留单</el-button>
		</el-row>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55" fixed>
			</el-table-column>
			<el-table-column label="商品编号" width="80" prop="productNo"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="shelvesStatus" label="状态">
			</el-table-column>
			<el-table-column prop="airline" label="航空公司" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="departCity" label="出发地" >
			</el-table-column>
			<el-table-column prop="arriveCity" label="目的地" >
			</el-table-column>
			<el-table-column label="出发日期" min-width="100" >
				<template slot-scope="scope">
					{{scope.row.departDate?scope.row.departDate.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="departTime" label="起飞时间" >
			</el-table-column>
			<el-table-column prop="arriveTime" label="到达时间" >
			</el-table-column>
			<el-table-column prop="planQuantity" label="计划" >
			</el-table-column>
			<el-table-column prop="haveSaleQuantity" label="已售" >
			</el-table-column>
			<el-table-column prop="haveReservedQuantity" label="预留" >
			</el-table-column>
			<el-table-column prop="residualQuantity" label="剩余" >
			</el-table-column>
			<el-table-column prop="peerPriceAdult" label="成人价" >
			</el-table-column>
			<el-table-column prop="supplierName" label="供应商" >
			</el-table-column>
			<el-table-column label="操作" fixed="right">
				<template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="goDetail(scope.$index, scope.row)">查看</el-button>
			    </template>
			</el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[5,10,20,50,100]" :page-size="table.size" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {dateFmt}　from　'@/utils/tools'
	export default {
		data() {
			return {
				search: {
					company: '',
					flightNo: '',
					departure: '',
					destination: '',
					departDate:'',
					startDate:'',
					endDate:''
				},
				table: {
					currentPage: 1,
					size: 10,
					total: 0,
					tableData: [],
					selected:[]
				},
				tableLoading:false,
				procurementIds:[],
			}
		},
		mounted () {
			this.getList()
		},
		methods: {
			getList(){
				let keyword = this.search.keyword
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('api/airticket/list?Id=0&PageSize=' + size + '&PageIndex=' + index + '&Airline=' + this.search.company + '&FlightNo=' + this.search.flightNo +'&DepartCityName=' + this.search.departure + '&ArriveCityName=' + this.search.destination +'&StartDate=' + this.search.startDate +'&EndDate='+this.search.endDate)
					.then((res)=>{
						// console.log(res.data)
						this.table.total = res.data.total
						this.table.tableData = res.data.objects
						this.tableLoading = false
					})
			},
			handleSelectionChange(val) {
				this.table.selected = val;
			},
			handleSizeChange(val) {	
				this.table.size = val;			
				this.getList();
		      },
		    handleCurrentChange(val) {
				this.table.currentPage = val;
				this.getList();
		    },
		    indexMethod(index){
		    	return index+1
		    },
		    goDetail(index,row){
		    	// this.$router.push('purchase-detail/'+row.id)
		    },
			showStatus(val){
				let status = [ '待审核', '未通过', '已审核', '已取消', '已销售' ];
				return status[val];
			},
			reservationAir(){
				if(this.table.selected.length>1){
					this.$message.error('暂不支持批量预订机票，请单选');
					return false
				}
				this.$router.push({path:`/airplane/airticket-book/`,query:{id:this.table.selected[0].id,reservedId:null}})
			},
			reservationDan(){
				if(this.table.selected.length>1){
					this.$message.error('暂不支持批量预留单，请单选');
					return false
				}
				this.$router.push('reservation/'+this.table.selected[0].id)
			},
			HandleDepartDateChange(val){
				let s=dateFmt(val[0],'yyyy-MM-dd'),e=dateFmt(val[1],'yyyy-MM-dd');
				this.search.startDate=s;
				this.search.endDate=e;
			}
		}
	}
</script>

<style scoped>

</style>