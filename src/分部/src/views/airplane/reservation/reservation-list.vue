<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small"  label-width="90px">
			<el-form-item label="状态">
				<el-select v-model="search.status" placeholder="请选择">
				    <el-option
				      v-for="item in statusList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="预留单号">
				<el-input v-model="search.reservedOrderNo" placeholder="预留单号"></el-input>
			</el-form-item>
			<el-form-item label="航班号">
				<el-input v-model="search.flightNo" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="预留联系人">
				<el-input v-model="search.contacts" placeholder="预留联系人"></el-input>
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

		<el-row class="button_box">
			<el-button type="primary" size="small" @click="cancelOrder">取消订单</el-button>
		</el-row>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55" fixed>
			</el-table-column>
			<el-table-column label="序号" width="50" type="index" :index="indexMethod">
			</el-table-column>
			<el-table-column label="状态"   :show-overflow-tooltip="true">
				<template slot-scope="scope">
					{{statusList[scope.row.status].label}}
				</template>
			</el-table-column>
			<el-table-column label="预留单号"  prop="reservedOrderNo"  width="160"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地" >
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地" >
			</el-table-column>
			<el-table-column label="出发日期" min-width="100" >
				<template slot-scope="scope">
					{{scope.row.departDate?scope.row.departDate.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="adultQuantity" label="预留数量" >
			</el-table-column>
			<el-table-column prop="contacts" label="预留联系人" :show-overflow-tooltip="true"  min-width="100">
			</el-table-column>
			<el-table-column label="预留时间" min-width="150">
				<template slot-scope="scope">
					{{scope.row.reservedTime?scope.row.reservedTime.replace('T',' ').split('.')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="操作" width="180" fixed="right">
				<template slot-scope="scope">
					<el-button style="margin-bottom:5px;"
			          size="mini"
			          @click="handleTurnOrder(scope.row)" :disabled="scope.row.status>0">转换订单</el-button>
			        <el-button
			          size="mini"
			          @click="goDetail(scope.row)">查看</el-button>
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
					status:'',
					reservedOrderNo: '',
					flightNo: '',
					contacts:'',
					departure: '',
					destination: '',
					departDate:'',
					startDate:'',
					endDate:''
				},
				statusList:[{
					value:0,
					label:'未转换'
				},{
					value:1,
					label:'已转换'
				},{
					value:2,
					label:'已取消'
				}],
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
				this.airHttp.get('api/AirTicketOrder/GetReservedOrderList?Id=0&PageSize=' + size + '&PageIndex=' + index + '&Status=' + this.search.status + '&ReservedOrderNo='+ this.search.reservedOrderNo +'&Contacts=' + this.search.contacts + '&FlightNo=' + this.search.flightNo +'&DepartProvinceName=' + this.search.departure + '&ArriveProvinceName=' + this.search.destination +'&StartDepartDate=' + this.search.startDate +'&EndDepartDate='+this.search.endDate)
					.then((res)=>{
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
		    goDetail(row){
		    	this.$router.push('reservation-detail/'+row.id)
		    },
			cancelOrder(){
				if(this.table.selected.length>1){
					this.$message.error('暂不支持批量预订机票，请单选');
					return false
				}
				// this.$router.push('reservation-air/'+this.table.selected[0].id)
			},
			HandleDepartDateChange(val){
				let s=dateFmt(val[0],'yyyy-MM-dd'),e=dateFmt(val[1],'yyyy-MM-dd');
				this.search.startDate=s;
				this.search.endDate=e;
			},
			handleTurnOrder(row){
				this.airHttp.get('api/AirTicketOrder/VerifyTransition?Id=' + row.id)
					.then((res)=>{
						if(res.data.isSuccess){
							this.$router.push({path:`/airplane/airticket-book/`,query:{id:row.productId,reservedId:row.id}})
						}else{
							this.$message.error(res.data.message+",请刷新页面")
						}
					})
				
			},
			// ||isTimeOut(scope.row.reservedTime)
			// isTimeOut(time){
			// 	let reservedTime=new Date(time).getTime();
			// 	let now=new Date().getTime();
			// 	if(now>=reservedTime){
			// 		return true
			// 	}else{
			// 		return false;
			// 	}
			// }
		}
	}
</script>

<style scoped>

</style>