<template>
    <div class='view'>
        <el-form :inline="true" label-width="80px" :model="search" class="demo-form-inline" size="small">
			<el-form-item label="线路名称">
				<el-input v-model="search.linename" placeholder="线路名称"></el-input>
			</el-form-item>
			<el-form-item label="出发地">
				<el-input v-model="search.lineaddress" placeholder="出发地"></el-input>
			</el-form-item>
			<el-form-item label="线路类型">
				<el-input v-model="search.linetype" placeholder="线路类型"></el-input>
			</el-form-item>
            <el-form-item label="销售状态">
				<el-input v-model="search.marketstatus" placeholder="销售状态"></el-input>
			</el-form-item>
			<el-form-item label="出团日期">
                <el-date-picker
                    v-model="search.grouptime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
			</el-form-item>
			<el-form-item label="团号">
				<el-input v-model="search.groupNO" placeholder="团号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
			</el-form-item>
		</el-form>

        <div>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handleAmend">批量修改</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handlePutOn">上架</el-button>
			<el-button type="primary" size="small" :disabled="allBtn" @click="handlePullOff">下架</el-button>
			<el-button type="danger" size="small" :disabled="allBtn" @click="handleDelete" icon="el-icon-delete">删除</el-button>
		</div>

        <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="线路名称"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="团号"
            width="120">
            </el-table-column>
            <el-table-column
            prop="address"
            label="天数"
            >
            </el-table-column>
            <el-table-column
            prop="address"
            label="线路类型"
            >
            </el-table-column>
            <el-table-column
            prop="address"
            label="出团日期"
            >
            </el-table-column>
             <el-table-column
            prop="address"
            label="线路类型"
            >
            </el-table-column>
            <el-table-column
            prop="address"
            label="出发地"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
            </el-pagination>
        </div>
        <!-- 模态框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="priceForm">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <template slot-scope="scope">
                    <el-input-number v-model="scope.row.price3" style="width: 150px;" :min="0" :max="99999999" size="small"></el-input-number>
				    </template>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <template slot-scope="scope">
                   <el-input-number v-model="scope.row.price3" style="width: 150px;" :min="0" :max="99999999" size="small"></el-input-number>
				    </template>
                </el-form-item>
            </el-form>
            <el-table :data="gridData">
                <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="姓名" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      allBtn: true,
      multipleSelection:[],
      currentPage:1,
      dialogFormVisible:false,
      search: {
        linename: "",
        lineaddress: "",
        linetype: "",
        marketstatus: "",
        grouptime: "",
        groupNO: ""
      },
      tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
    };
  },
  methods: {
    handleSearch(){},
    handleAmend(){
        this.dialogFormVisible = true;
    },
    handlePutOn(){
        this.$confirm('确认上架所选商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handlePullOff(){
        this.$confirm('确认下架所选商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleDelete(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleSelectionChange(val) {
				this.multipleSelection = val;
				if(this.multipleSelection.length > 0) {
					this.allBtn = false
				} else {
					this.allBtn = true
				}
            },
            //编辑
       handleClick(data){

       }
  }
};
</script>

<style>

</style>
