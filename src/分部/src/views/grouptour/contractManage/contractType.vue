<template>
  <div class='view'>
    <el-row>
      <el-col>
        <el-button size="small" type="primary" icon="el-icon-plus" @click='addTypeVisible = true'>添 加</el-button>
        <!-- <el-button size="small" type="primary" icon="el-icon-delete" @click='deleteType' :disabled='disDelete'>删 除
        </el-button> -->
      </el-col>
    </el-row>
    <el-table size="small" ref="multipleTable" :data="typeList" max-height="800" tooltip-effect="dark"
              style="width: 100%" @selection-change="selectionChange">
      <el-table-column size="small" type="selection" fixed label="序号" align="center"></el-table-column>
      <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="contractPrefix" label="电子合同前缀" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="attachmentCount" label="附件数" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column size="small" align="center" label="操作" fixed="right" width='150'>
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click='handleEdit(scope.row)'>编辑</el-button>
          <el-button type="text" size="mini" @click='downloadFile(scope.row)'>下载附件</el-button>
          <!-- <el-button type="text" size="mini" >编 辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
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
    <el-dialog title="添加合同类型" :visible.sync="addTypeVisible" width="30%" center>
      <el-form :model="addTypeForm" :rules="addTypeRule" ref="addTypeForm" label-width='100px'>
        <el-form-item label='合同类型' prop='type'>
          <el-input v-model="addTypeForm.type" size='small'></el-input>
        </el-form-item>
        <el-form-item label='电子合同前缀' >
          <el-input v-model="addTypeForm.contractPrefix" size='small'></el-input>
        </el-form-item>
        <el-form-item label="附件" prop='attachment'>
          <el-upload
            style='width:200px;'
            class="upload-demo"
            action="/attachment/upload"
            :http-request="attachmentUpload"
            :multiple="true"
            :show-file-list="true"
            :limit="5"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileData"
          >
            <el-button size="small" type="primary" class="margin_bottom">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTypeVisible = false" size='small'>取 消</el-button>
        <el-button type="primary" size='small' @click='addType'>确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="编辑合同类型" :visible.sync="editTypeVisible" width="30%" center @close="handleCloseEdit">
      <el-form :model="addTypeForm" :rules="addTypeRule" ref="addTypeForm" label-width='100px'>
        <el-form-item label='合同类型' prop='type'>
          <el-input v-model="addTypeForm.type" size='small' :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label='电子合同前缀' >
          <el-input v-model="addTypeForm.contractPrefix" size='small'></el-input>
        </el-form-item>
        <el-form-item label="附件" prop='attachment'>
          <el-upload
            style='width:200px;'
            class="upload-demo"
            action="/attachment/upload"
            :http-request="attachmentUpload"
            :multiple="true"
            :show-file-list="true"
            :limit="5"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileData"
          >
            <el-button size="small" type="primary" class="margin_bottom">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTypeVisible = false" size='small'>取 消</el-button>
        <el-button type="primary" size='small' @click='handleUpdateContractType'>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="下载附件" :visible.sync="downloadVisible" width="410px">
      <span>旅游合同</span>
      <el-table size="small" ref="downloadTable" :data="downloadTable" tooltip-effect="dark" style="width: 100%"
                >
        <!--@selection-change="handleSelectionChange"<el-table-column size="small" type="selection" fixed label="序号" align="center"></el-table-column>-->
        <el-table-column size="small" prop="attachmentName" label="附件" align="center" show-overflow-tooltip width="260px">
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="small" type="text"
            ><a :href='scope.row.attachmentUrl' download>下载</a></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-button type="primary" size='small' style='margin:10px 0 0 45%;' @click="downloadFiles">下 载</el-button>-->
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .el-row .el-col {
    width: 300px;
    margin: 15px 10px 10px 0px;
  }

  .el-row .el-col .el-button {
    margin-left: 20px;
  }
  .cell .el-button a{
    color:#409EFF;
  }
</style>
<script>
  export default{
    data(){
      var checktype = (rule, value, callback) => {
        if (!value) {
          callback(new Error('合同类型不能为空'));
        } else if (!(/^[^ ]+$/.test(value))) {
          callback(new Error('合同类型不能含有空格'))
        } else {
          callback()
        }
      };
      var checkattachment = (rule, value, callback) => {
        if (this.fileData.length == 0) {
          callback(new Error('您还没有上传附件'));
        } else {
          callback()
        }
      };
      return {
        typeList: [],
        disDelete: true,
        urlArr: [],
        //添加类型
        editTypeVisible:false,
        addTypeVisible: false,
        addTypeForm: {
          type:'',
		  contractPrefix:'',
		  contractTypeId:''
        },
        addTypeRule: {
          attachment: [{
            required: true, validator: checkattachment, trigger: 'change'
          }],
          type: [{
            required: true, validator: checktype, trigger: 'blur'
          }]
        },
        //下载附件
        downloadVisible: false,
        downloadTable: [],
        fileData: [],
        contractTypeName: '',
        attachmentList: [],
        multipleSelection: [],
        pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
        },
      }
    },
    methods: {
      queryData(size,index){
        this.groupHttp.get("Contract/GetContractTypeList?PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
          if (res.data.isSuccess == true) {
            this.typeList = res.data.objects;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "出错了" + res.data.message
            });
          }
        }).catch(e => {
          console.log(e)
        });
      },
      selectionChange(val){
        this.multipleSelection = val;
        if (this.multipleSelection.length == 1) {
          this.disDelete = false;
        } else {
          this.disDelete = true;
        }
      },
      //添加类型
      addType(){
        let attachmentList = [];
        this.fileData.forEach(file => {
          attachmentList.push({
            attachmentName: file.name,
            attachmentUrl: file.url
          })
        });
        this.$refs['addTypeForm'].validate(valid => {
          if (valid) {
            this.groupHttp.post('Contract/AddContractType', {
              dto: {
                contractTypeName: this.addTypeForm.type,
                contractPrefix:this.addTypeForm.contractPrefix,
                attachmentList: attachmentList
              }
            }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.queryData();
                this.addTypeForm.contractPrefix = '';
                this.addTypeForm.type = '';
                this.fileData = [];
                this.addTypeVisible = false;
              } else {
                this.$message({
                  type: 'info',
                  message: '出错了!' + res.data.message
                })
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      },
      //编辑
      handleEdit(row){
		row.attachmentList.forEach(item=>{
			this.fileData.push({
				name: item.attachmentName,
				url: item.attachmentUrl
			})
		})
		this.addTypeForm.contractPrefix = row.contractPrefix;
		this.addTypeForm.type = row.contractTypeName;
		this.addTypeForm.contractTypeId=row.contractTypeId;
		this.editTypeVisible=true;
	  },
	  //关闭编辑弹框
	  handleCloseEdit(){
		 	this.addTypeForm.contractPrefix = '';
			this.addTypeForm.type = '';
      this.fileData = [];
	  },
	  //更新类型
      handleUpdateContractType(){
        let attachmentList = [];
        this.fileData.forEach(file => {
          attachmentList.push({
            attachmentName: file.name,
            attachmentUrl: file.url
          })
        });
        this.$refs['addTypeForm'].validate(valid => {
          if (valid) {
            this.groupHttp.post('Contract/UpdateContractType', {
             
				contractTypeName: this.addTypeForm.type,
				contractPrefix:this.addTypeForm.contractPrefix,
				attachmentList: attachmentList,
				contractTypeId:this.addTypeForm.contractTypeId
            }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.queryData();
                this.addTypeForm.contractPrefix = '';
                this.addTypeForm.type = '';
                this.fileData = [];
                this.editTypeVisible = false;
              } else {
                this.$message({
                  type: 'info',
                  message: '出错了!' + res.data.message
                })
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      },
      //删除类型
      deleteType(){
        this.$confirm("是否执行删除操作?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            this.groupHttp.get('Contract/DeleteContractType?contractTypeId=' + this.multipleSelection[0].contractTypeId).then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.queryData();
            } else {
              this.$message({
                type: 'info',
                message: '出错了!' + res.data.message
              })
            }
          }).catch(e => {
            console.log(e)
          })
        }).catch(e => {
          console.log(e)
        })
      },
      //文件上传
      attachmentUpload(val) {
        var f = new FormData();
        f.append("FileData", val.file);
        f.append("Category", "AirTicket");
        f.append("thumbnail", true);
        f.append("Folder", "Airline");
        this.fileUpload.post(val.action, f).then(res => {
          if (res.data.Status === true) {
            this.fileData.push({
              name: res.data.FileName,
              url: res.data.Url,
            })
            this.$refs.addTypeForm.validateField('attachment');//去验证文件上传
            this.$message({
              message: "上传成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.Message);
          }
        });
      },
      //上传前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //文件过多
      handleExceed(files, fileList) {
        this.$message.warning(`您只能上传 5 个附件`);
      },
      //删除确认
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //删除操作
      handleRemove(file, fileList) {
        this.fileData = fileList;
      },
      sizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      //附件内容
      downloadFile(data){
        this.downloadVisible = true;
        this.downloadTable = data.attachmentList
      },
      //下载附件
      handleSelectionChange(val){
        this.urlArr = [];
        val.forEach((item, index) => {
          this.urlArr.push(item.attachmentUrl)
        })
      },
      downloadFiles(){
        this.urlArr.forEach((item) => {
          var a = document.createElement('a');
          a.href = item
          a.download = item
          document.body.appendChild(a);
          a.click();
        })
      }
    },
    mounted(){
		this.queryData();
		// this.groupHttp.get('Contract/GetSignContractTemplate?orderId=1122').then(res => {
    //  console.log(res)
		// }).catch(e => {
		// console.log(e)
		// })

    }
  }
</script>
