<template>
	<div class="view">
		<el-header class="margin_bottom">
			<el-steps :active="1" align-center>
				<el-step title="选择酒店" description=""></el-step>
				<el-step title="选择房型" description=""></el-step>
				<el-step title="产品设置" description=""></el-step>
				<el-step title="价格设置" description=""></el-step>
			</el-steps>
		</el-header>
		<el-form size="small" :inline="true" :model="infoForm"  label-width="100px">
            <el-form-item label="所属城市">
                <el-input v-model="infoForm.CityName" ></el-input>
            </el-form-item>
            <el-form-item label="酒店名称">
                <el-input v-model="infoForm.HotelName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click='queryData'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
            <el-button size="small" type="primary"  @click="handleAddHotel(0)" >添加国内酒店</el-button>
            <el-button size="small" type="primary"  @click="handleAddHotel(1)" >添加港澳台酒店</el-button>
            <el-button size="small" type="primary"  @click="handleAddHotel(2)" >添加国外酒店</el-button>
        </el-row>
		<el-table :data="tableList" v-loading="tableLoading">
			<el-table-column  prop="hotelName" label="酒店名称" > </el-table-column>
			<el-table-column  prop="address" label="地址" > </el-table-column>
			<el-table-column  prop="hotelsTypeStr" label="类型" > </el-table-column>
			<el-table-column  prop="starRatedStr" label="星级"></el-table-column>
			<el-table-column  prop="dateStr" label="修改时间"></el-table-column>
			<el-table-column  prop="statusStr" label="状态"></el-table-column>
			<el-table-column  label="操作" fixed="right" width='100'>
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="handleChooseHotel(scope.row)" v-if="scope.row.canChoose">选择</el-button>
					<el-button type="text" size="mini" @click="handleEditHotel(scope.row)" v-if="scope.row.canEdit">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
            class="pagination"
            fixed="right"
            :data = 'pagination'
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
	</div>
</template>
<style lang="scss" scoped>
</style>
<script>
	export default{
		data() {
			return {
				tableLoading:false,
				btnLoading:false,
				tableList:[],
				infoForm: {
					CityName:'',
					HotelName:'',
					PageSize:10,
					PageIndex:1
				},
				//分页
				pagination: {
					sizes: [5, 10, 20, 50],
					size: 10,
					currentPage: 1,
					total: 0
				}
			};
		},
		mounted(){
			this.queryData();
		},
		methods: {
			//新增酒店
			handleAddHotel(type){
				this.$router.push({name:'basicInfo',query:{hotelsType:type}})
			},
			//选择酒店
			handleChooseHotel(row){
				this.$router.push({name:'chooseRoomType',query:{hotelId:row.id}})
			},
			//编辑酒店
			handleEditHotel(row){
				this.$router.push({name:'editHotel',query:{hotelId:row.id}})
			},
			//查询数据
			queryData(){
				this.tableLoading=true;
				this.groupHttp.get("/HotelProduct/GetChooseHotelList",{params:this.infoForm})
				.then(res => {
					if (res.data.isSuccess == true) {
						this.tableList = res.data.objects;
						this.pagination.total=res.data.total;
					} else {
						this.$message.error(res.data.message);
					}
					this.tableLoading=false;
				});
			},
			//分页
			sizeChange(val) {
				this.pagination.size = val;
				this.pagination.currentPage = 1;
				this.infoForm.PageSize = val;
				this.infoForm.PageIndex = 1;
				this.queryData();
			},
			currentPageChange(val) {
				this.pagination.currentPage = val;
				this.infoForm.PageIndex = val;
				this.queryData();
			}
		}
	}
</script>
