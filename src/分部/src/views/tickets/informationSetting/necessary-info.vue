<template>
  <div class="view">
      <div class="tab-div">
                <el-button type="primary" @click="openDialog_add()" size="small" icon="el-icon-plus">添 加</el-button>
                <el-button type="danger" @click="removeFun()" size="small" :disabled="deleteBtn" icon="el-icon-delete">删 除</el-button>
                    <el-table
                            :data="ticket_type"
                            tooltip-effect="dark"
                            style="width:100%"
                            @selection-change="handleSelectionChange"
                            v-loading = 'false'
                            >
                        <el-table-column
                            type="selection"
                                >
                        </el-table-column>
                        <el-table-column
                            prop="info"
                            label="客户必填信息"
                            align='center'
                                >
                        </el-table-column>
                        <el-table-column label="操作" align='center'>
                            <template slot-scope="scope">
                                <el-button
                                type="text"
                                size="mini"
                                @click="updateModal(scope.row)" icon="el-icon-edit">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination
                        fixed="right"
                        :data = 'pagination'
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="pagination.sizes"
                        :page-size="pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>
                <!-- 添加 -->
        <el-dialog title="添加必填信息" :visible.sync="dialogFormVisible_add" width="360px">
                <el-form :model="addDialogForm" :rules="rules" ref="addDialogForm">
                    <el-form-item label="必填信息" prop="info" size='small'>
                            <el-input v-model="addDialogForm.info" auto-complete="off" ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addNecessaryInfo('addDialogForm')" size='small'>确 定</el-button>
                </div>
        </el-dialog>

        <!-- 编辑 -->
           <el-dialog title="编辑必填信息" :visible.sync="dialogFormVisible_modify" width="410px">
            <el-form :model="modifyDialogForm"  :rules="rules" ref="modifyDialogForm">
                <el-form-item label="必填信息" prop="info" size='small'>
                    <el-input v-model="modifyDialogForm.info" auto-complete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifyNecessaryInfo('modifyDialogForm')" size='small'>确 定</el-button>
            </div>
        </el-dialog>

  </div>
</template>
<style scoped lang="scss">
  .el-dialog .el-input{
      width:200px;
  }
  .dialog-footer{
      margin-top:-30px;
  }
  .tab-div .el-button{
      margin: 5px 10px 15px 15px;
  }
</style>
<script>
export default {
  data() {
    var checkName = (rules,value,callback) => {
            if(!value){
                callback(new Error('输入内容不能为空'))
            }else if(!(/^[^ ]+$/.test(value))){
                callback(new Error('不能含有空格'));
            }else{
                callback()
            }
        }
    return {
        dialogFormVisible_add: false,
        dialogFormVisible_modify:false,
        deleteBtn:true,
        submitLoading: false,
        tableLoading: false,
        ticket_type: [
            {info: "姓名"},
            {info: "手机号"},
            {info: "有效证件号"}
        ],
        pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
          },
        addDialogForm: {
            info: "",
            selections:[]
        },
        bookingInstructions: [],
        modifyDialogForm1:[],
        modifyDialogForm:{
            id:'',
            info: ""
            
        },
        rules: {
        info: [
            { required: true, validator: checkName, trigger: "blur" },
            {max:20,message:'类型名称不能过长'}
          ]
        },
        checkedItems:[]
        };
  },
  methods: {
    //查询
    queryData(pageSize,index){
      this.tableLoading= true;
    //   this.groupHttp
    //     .post("GroupLine/GetGroupLineParamList", {
    //       paramType: 4,
    //       pageSize: pageSize || 10,
    //       pageIndex:index || 1
    //     }).then(res => {
    //         console.log(res);
    //       if (res.data.isSuccess == true) {
    //         this.tableLoading= false;
    //               this.groupLine_type = res.data.objects;
    //               this.pagination.total = res.data.total;
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: "操作失败: " + res.data.message
    //         });
    //         setTimeout(() => {
    //           this.tableLoading= false;
    //         },500)
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    },
    //点击添加线路类型按钮时   
    openDialog_add(){
      //清空对话框的数据
      if(this.$refs['addDialogForm']){
        this.$refs['addDialogForm'].resetFields();
        this.$refs['addDialogForm'].clearValidate();
      }
      setTimeout(() => {
        var els = document.getElementsByClassName('el-form-item__error');
        if(els){
          for(var i = 0;i < els.length; i++){
            els[i].innerHTML = "";
          }
        }
      },100)
      this.dialogFormVisible_add = true;
    },
    //添加客户必填信息
    addNecessaryInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var id_arr = [];
          this.addDialogForm.selections.forEach(index => {
              id_arr.push(this.bookingInstructions[index].id);
          })
        //   this.groupHttp
        //     .post("GroupLine/CreateGroupLineTypeParam", {
        //       paramType: 4,
        //       info: this.addDialogForm.info,
        //       bookingInstructions: id_arr
        //     })
        //     .then(res => {
        //       if (res.data.isSuccess == true) {
        //         this.queryData(this.pagination.size,this.pagination.currentPage);
        //         this.$message({
        //           type: "success",
        //           message: "您已经成功添加 "  +  this.addDialogForm.info
        //         });
        //         //清空 添加模态框 数据
        //         this.addDialogForm = {
        //           info: "",
        //           selections: []
        //         },
        //         this.add_checkList = [];
        //         this.dialogFormVisible_add = false;
        //       } else {
        //         this.$message({
        //           type: "info",
        //           message: "操作失败: " + res.data.message
        //         });
        //       }
        //     })
        //     .catch(e => {
        //       console.log(e);
        //     });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //把要修改的数据显示在模态框里面
    updateModal(row) {
      this.row = row;
      this.modifyDialogForm.selections = []
      this.dialogFormVisible_modify = true;
      this.modifyDialogForm.info = row.info;
      this.modifyDialogForm1.info = row.info;
      this.modifyDialogForm.id = row.id;
    //   this.groupHttp
    //     .post("GroupLine/GetGroupLineTypeParam", {
    //       id: this.modifyDialogForm.id
    //     })
    //     .then(res => {
    //       console.log(res);
    //       if (res.status == 200) {
    //         res.data.bookingInstructions.forEach(id => {
    //           for(var i= 0;i<this.bookingInstructions.length;i++){
    //             if(this.bookingInstructions[i].id == id){
    //               this.modifyDialogForm.selections.push(i);
    //             }
    //           }
    //         })
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: "操作失败:" + res.data.message
    //         });
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
      this.modifyDialogForm1.selections = this.modifyDialogForm.selections;
    },
    //修改客户必填信息
    modifyNecessaryInfo(formName) {
      if(this.modifyDialogForm.info == this.modifyDialogForm1.info && this.modifyDialogForm.selections == this.modifyDialogForm1.selections){
        this.$message({
                  type: "info",
                  message: "您还未做任何修改"
                });
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
        //   this.groupHttp
        //     .post("GroupLine/CreateGroupLineTypeParam", {
        //       paramType: 4,
        //       info: this.modifyDialogForm.info,
        //       bookingInstructions: id_arr,
        //       id: this.modifyDialogForm.id
        //     })
        //     .then(res => {
        //       if (res.data.isSuccess) {
        //         this.$message({
        //           type: "success",
        //           message: "修改成功"
        //         });
        //         this.queryData(this.pagination.size,1);
        //         this.dialogFormVisible_modify = false,
        //         this.modify_checkList = [];
        //         this.row.info = this.modifyDialogForm.info;
        //       } else {
        //         this.$message({
        //           type: "info",
        //           message: "操作失败: " + res.data.message
        //         });
        //       }
        //     })
        //     .catch(e => {
        //       console.log(e);
        //     });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removeFun() {
      var id_arr = [];
      for(var i = 0; i<this.checkedItems.length; i++){
        id_arr.push(this.checkedItems[i].id)
      }
      var num = id_arr.length;
      this.$confirm("是否继续删除操作?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //   this.groupHttp
        //     .post("GroupLine/DeleteGroupLineParam", {
        //       groupLineParamId: id_arr
        //     })
        //     .then(res => {
        //       if (res.data.isSuccess) {
        //         this.$message({
        //           type: "success",
        //           message: "您已经成功删除" + num + "项"
        //         });
        //         this.queryData(this.pagination.size,1);
        //       } else {
        //         this.$message({
        //           type: "info",
        //           message: "操作失败: " + res.data.message
        //         });
        //       }
        //     })
        //     .catch(e => {
        //       console.log(e);
        //     });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //分页
    handleSizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
    handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
    handleSelectionChange(val) {
         this.checkedItems = val;
      if (this.checkedItems.length > 0) {
        this.deleteBtn = false;
      } else {
        this.deleteBtn = true;
      }
    }
  },
  mounted() {
    this.queryData();
  }
};
</script>

