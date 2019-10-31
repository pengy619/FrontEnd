<template>
	<div class="view">
		<el-form :inline="true" :model="search" class="demo-form-inline" size="small"  label-width="80px">
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
			<el-form-item label="订单号">
				<el-input v-model="search.orderNo" placeholder="订单号"></el-input>
			</el-form-item>
			<el-form-item label="航班号">
				<el-input v-model="search.flightNo" placeholder="航班号"></el-input>
			</el-form-item>
			<el-form-item label="客户名称">
				<el-input v-model="search.customerName" placeholder="客户名称"></el-input>
			</el-form-item>
			<el-form-item label="联系人">
				<el-input v-model="search.contacts" placeholder="联系人"></el-input>
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
			<el-button type="primary" size="small" >取消订单</el-button>
			<el-button type="primary" size="small" >开发票</el-button>
			<el-button type="primary" size="small" >单笔收款</el-button>
			<el-button type="primary" size="small" >合并收款</el-button>
		</el-row>

		<el-table ref="multipleTable" :data="table.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
			<el-table-column type="selection" width="55" fixed>
			</el-table-column>
			<el-table-column label="序号" width="60" type="index" :index="indexMethod">
			</el-table-column>
			<el-table-column label="状态"   :show-overflow-tooltip="true">
				<template slot-scope="scope">
					{{statusList[scope.row.status].label}}
				</template>
			</el-table-column>
			<el-table-column label="订单号"  prop="orderNo"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="flightNo" label="航班号"  :show-overflow-tooltip="true" >
			</el-table-column>
			<el-table-column prop="departProvinceName" label="出发地" >
			</el-table-column>
			<el-table-column prop="arriveProvinceName" label="目的地" >
			</el-table-column>
			<el-table-column label="出发日期"  min-width="100">
				<template slot-scope="scope">
					{{scope.row.departTime?scope.row.departDate.split('T')[0]:''}}
				</template>
			</el-table-column>
			<el-table-column prop="customerName" label="客户名称" >
			</el-table-column>
			<el-table-column prop="customerContacts" label="联系人" >
			</el-table-column>
			<el-table-column prop="totalCost" label="应收" >
			</el-table-column>
			<el-table-column prop="totalCost" label="已收" >
			</el-table-column>
			<el-table-column prop="totalCost" label="未收" >
			</el-table-column>
			<el-table-column prop="totalCost" label="应付" >
			</el-table-column>
			<el-table-column prop="totalCost" label="已付" >
			</el-table-column>
			<el-table-column prop="totalCost" label="未付" >
			</el-table-column>
			<el-table-column prop="supplierName" label="供应商" >
			</el-table-column>
			<el-table-column prop="distributionChannel" label="销售渠道" min-width="100"  :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column  label="下单日期" min-width="100" >
				<template slot-scope="scope">
			       {{scope.row.orderTime?scope.row.orderTime.split('T')[0]:''}}
			    </template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" :show-overflow-tooltip="true">
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
					contacts:'',
					departure: '',
					destination: '',
					departDate:'',
					startDate:'',
					endDate:''
				},
				statusList:[{
					value:0,
					label:'待支付'
				},{
					value:1,
					label:'已取消'
				},{
					value:2,
					label:'已支付'
				},{
					value:3,
					label:'退款中'
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
			getList(){
				let keyword = this.search.keyword
				let size = this.table.size
				let index = this.table.currentPage
				this.tableLoading = true;
				console.log(this.search.status)
				this.airHttp.get('api/AirTicketOrder/OnLineOrderList?Id=0&PageSize=' + size + '&PageIndex=' + index + '&Status=' + this.search.status + '&OrderNo='+ this.search.orderNo + '&FlightNo=' + this.search.flightNo + '&CustomerName=' + this.search.customerName +'&DepartProvinceName=' + this.search.departure + '&ArriveProvinceName=' + this.search.destination +'&DepartTime=' + this.search.startDate +'&ArriveTime='+this.search.endDate)
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
		    	this.$router.push('online-order-detail/'+row.orderNo)
		    },
			showStatus(val){
				let status = [ '待审核', '未通过', '已审核', '已取消', '已销售' ];
				return status[val];
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