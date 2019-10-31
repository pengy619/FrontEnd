<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small"  label-width="80px">
			<el-form-item label="状态">
				<el-select v-model="search.status" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in statusList"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value" @change="changeTest(item)">
				    </el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="订单号">
				<el-input v-model="search.orderNo" placeholder="订单号"></el-input>
			</el-form-item>
			<el-form-item label="航班号">
				<el-input v-model="search.flightNo" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="客户名称">
				<el-input v-model="search.customerName" placeholder="客户名称"></el-input>
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

		<el-row style="margin-bottom:10px;">
			<el-button type="primary" size="small" @click="recyclingQiewei" :disabled="table.selected.length==0" >回收切位</el-button>
		</el-row>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55" fixed>
			</el-table-column>
			<el-table-column label="订单号"  prop="orderNo"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="airlineName" label="航空公司"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地" >
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地" >
			</el-table-column>
			<el-table-column prop="departDate" label="出发日期" width="100">
				<template slot-scope="scope">
					{{scope.row.departDate?scope.row.departDate.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="departTime" label="起飞时间" >
			</el-table-column>
			<el-table-column prop="arriveTime" label="到达时间" >
			</el-table-column>
			<el-table-column prop="shippingSpace" label="舱位" >
			</el-table-column>
			<el-table-column prop="cutNumber" label="数量" >
			</el-table-column>
			<el-table-column prop="cutCustomerName" label="客户名称" >
			</el-table-column>
			<el-table-column prop="creationTime" label="创建时间" min-width="150">
				<template slot-scope="scope">
					{{scope.row.creationTime?scope.row.creationTime.replace('T',' ').split('.')[0]:''}}
				</template>
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
					status:'',
					orderNo: '',
					flightNo: '',
					customerName:'',
					departure: '',
					destination: '',
					departDate:'',
					startDate:'',
					endDate:''
				},
				statusList:[{
					value:0,
					label:'待付款'
				},{
					value:1,
					label:'已取消'
				},{
					value:2,
					label:'已付款'
				},{
					value:3,
					label:'待退款'
				},{
					value:4,
					label:'已退款'
				},{
					value:5,
					label:'交易已完成'
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
			changeTest(item){
				console.log()
			},
			getList(){
				let keyword = this.search.keyword
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true
				this.airHttp.get('api/AirTicketOrder/GetSaleOrderList?Id=0&PageSize=' + size + '&PageIndex=' + index + '&AuditStatus=' + this.search.status + '&OrderNo='+ this.search.orderNo + '&FlightNo=' + this.search.flightNo + '&CutCustomerName=' + this.search.customerName +'&DepartProvinceName=' + this.search.departure + '&ArriveProvinceName=' + this.search.destination +'&StartDepartDate=' + this.search.startDate +'&EndDepartDate='+this.search.endDate)
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
		    goDetail(index,row){
				this.$router.push({path:'/airplane/qiewei-order-detail/'+row.id})
		    },
			recyclingQiewei(){
				if(this.table.selected.length>1){
					this.$message.error('暂不支持批量回收切位，请单选');
					return false
				}else{
					this.$router.push('/airplane/qiewei-recovery/'+this.table.selected[0].id)
				}
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