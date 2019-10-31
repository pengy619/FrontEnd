<template>
  <div class="view">
    <el-form size="small" :inline="true" :model="form" label-width="100px">
      <el-form-item label="门店名称">
        <el-input v-model="form.DisCompanyName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click='getTableList()'>搜索</el-button>
      </el-form-item>
    </el-form>
      <div style="margin-top: 10px;">
        <el-table v-loading="loading" :data="table" border style="width:100%">
          <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
          <el-table-column align="center" prop="disCompanyName" label="门店名称"></el-table-column>
          <el-table-column align="center" prop="elecContractOnlineQuota" label="合同限额（线上）" >
			  <template slot-scope="scope">
				  {{scope.row.unlimitElecContractOnline?'不限':scope.row.elecContractOnlineQuota}}
			  </template>
		  </el-table-column>
		  <el-table-column align="center" prop="elecContractOfflineQuota" label="合同限额（线下）" >
			  <template slot-scope="scope">
				  {{scope.row.unlimitElecContractOffline?'不限':scope.row.elecContractOfflineQuota}}
			  </template>
		  </el-table-column>
          <el-table-column align="center" prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="Editor(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.pageIndex"
              :page-sizes="[5,10,20,50]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="form.total">
          </el-pagination> 
      </div>
      <el-dialog append-to-body :visible.sync="dialogVisible"  width="460px">
          <el-form size="small" :inline="true" :rules="rules" :model="edit" ref="edit" label-width="140px">
            <el-form-item label="合同限额（线上）" prop="ElecContractOnlineQuota">
              <el-checkbox v-model="edit.UnlimitElecContractOnline" style="margin-right:10px;">不限</el-checkbox>
			  <el-input :disabled="edit.UnlimitElecContractOnline" style="width:170px" type="number" v-model="edit.ElecContractOnlineQuota"></el-input> 份
            </el-form-item>
            <el-form-item label="合同限额（线下）" prop="ElecContractOfflineQuota">
              <el-checkbox v-model="edit.UnlimitElecContractOffline" style="margin-right:10px;">不限</el-checkbox>
			  <el-input :disabled="edit.UnlimitElecContractOffline" style="width:170px" type="number" v-model="edit.ElecContractOfflineQuota"></el-input> 份
            </el-form-item>
            <el-form-item style="text-align:right;width:100%;margin-top:18px">
                <el-button size="small" type="primary" :loading="submitLoading" @click="confirm">确定</el-button>
                <el-button size="small" type="info" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
	let OnlineCheck = (rule, value, callback) => {
        if (!value) {
          return callback()
        }else{
			return callback()
		}
	};
	let OfflineCheck = (rule, value, callback) => {
        if (!value) {
          return callback()
        }else{
			return callback()
		}
    };
    return {
		loading: false,
		dialogVisible: false,
		form: {
			pageSize: 10,
			pageIndex: 1,
			total: 0,
			DisCompanyName: ""
		},
		currentRow: {},
		table: [],
		edit:{
			UnlimitElecContractOnline:false,
			UnlimitElecContractOffline:false,
			ElecContractOnlineQuota:'',
			ElecContractOfflineQuota:'',
		},
		rules:{
			ElecContractOnlineQuota:[{
				validator: OnlineCheck, trigger: 'blur'
			}],
			ElecContractOfflineQuota:[{
				validator: OfflineCheck, trigger: 'blur'
			}],
		},
		submitLoading:false
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList(pageIndex=1) {
      	this.loading = true;
      	this.groupHttp
        .get("Contract/ElecContractQuotaList",{
			params:{
				PageSize:this.form.pageSize,
				PageIndex:pageIndex,
				DisCompanyName:this.form.DisCompanyName
			}
		})
        .then(res => {
          this.table = res.data.objects;
          this.form.total = res.data.total;
          this.loading = false;
        });
    },
    Editor(row) {
		//编辑按钮
		this.dialogVisible = true;
    this.edit.UnlimitElecContractOnline=row.unlimitElecContractOnline;
    this.edit.UnlimitElecContractOffline=row.unlimitElecContractOffline;
    this.edit.ElecContractOnlineQuota=row.elecContractOnlineQuota;
    this.edit.ElecContractOfflineQuota=row.elecContractOfflineQuota;

		this.currentRow= row;
    },
    confirm() {
		  //确认按钮
		this.$refs.edit.validate((valid) => {
			if(valid){
				this.submitLoading=true
				let edit=this.edit
				edit.DisCompanyIds=this.currentRow.disCompanyId
				this.groupHttp
				.post("Contract/UpdateElecContractQuota", edit)
				.then(res => {
					if (res.data.isSuccess == true) {
						this.dialogVisible = false;
						this.getTableList(this.form.pageIndex);
          }
          else {
            this.$message({
              type: "info",
              message: "" + res.data.message
            });
          }
					this.submitLoading=false
				})
				.catch(err=>{
					this.submitLoading=false
				});
			}
		})

    },
    cancel() {
      	this.dialogVisible = false;
    },
    handleSizeChange(val) {
		this.form.pageSize = val;
		this.getTableList();
		// console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
		this.form.pageIndex = val;
		this.getTableList(this.form.pageIndex);
		// console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.el-input {
  width: 200px;
}
.pagination {
  margin: 10px 0;
  text-align: right;
}
</style>

