<template>
  <div class="view">
      <div class="tab-div">
               <!-- <el-button type="primary" @click="openDialog_add()" size="small" icon="el-icon-plus">添 加</el-button>
                    <el-button type="danger" @click="removeFun()" size="small" :disabled="deleteBtn" icon="el-icon-delete">删 除</el-button> -->
                    <el-table
                            :data="groupLine_type"
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
                            prop="paramName"
                            label="线路类型"
                                >
                        </el-table-column>
                        <!-- <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                type="text"
                                size="mini"
                                @click="updateModal(scope.row)" icon="el-icon-edit">编辑</el-button>
                            </template>
                        </el-table-column> -->
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
                <el-dialog title="新增线路分类信息" :visible.sync="dialogFormVisible_add">
                    <el-form :model="addDialogForm" style="width:40%;" :rules="rules" ref="addDialogForm">
                        <el-form-item label="线路类型" prop="paramName">
                            <el-input v-model="addDialogForm.paramName" auto-complete="off" ></el-input>
                        </el-form-item>
                        <el-form-item prop="selections"
                            >
                            <p>对应说明范围</p>
                            <template>
                                <el-checkbox-group v-model="addDialogForm.selections"
                                    v-for="(item,index) in bookingInstructions"
                                        :key="index">
                                    <el-checkbox :label="index" name='selections'>
                                            {{item.paramName}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </el-form-item>
                    </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible_add = false">取 消</el-button>
                    <el-button type="primary" @click="addRouteType('addDialogForm')">确 定</el-button>
                </div>
        </el-dialog>

        <!-- 编辑 -->
           <el-dialog title="修改线路分类信息" :visible.sync="dialogFormVisible_modify">
            <el-form :model="modifyDialogForm" style="width:40%;" :rules="rules" ref="modifyDialogForm">
                <el-form-item label="线路类型" prop="paramName">
                    <el-input v-model="modifyDialogForm.paramName" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item prop="selections"
                    >
                    <p>对应说明范围</p>
                    <template>
                        <el-checkbox-group v-model="modifyDialogForm.selections"
                            v-for="(item,index) in bookingInstructions"
                                :key="index">
                            <el-checkbox :label="index" name='selections'>
                                    {{item.paramName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_modify = false">取 消</el-button>
                <el-button type="primary" @click="modifyRouteType('modifyDialogForm')">确 定</el-button>
            </div>
        </el-dialog>

  </div>
</template>
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
    var checkSelections = (rules,value,callback) => {
            if(value.length == 0){
                callback(new Error('请至少选择一项预订说明'))
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
        groupLine_type: [
            
        ],
        pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
          },
        addDialogForm: {
            paramName: "",
            selections:[]
        },
        bookingInstructions: [],
        modifyDialogForm1:[],
        modifyDialogForm:{
            id:'',
            paramName: "",
            selections:[]
        },
        rules: {
        paramName: [
          { required: true, validator: checkName, trigger: "blur" },
          {max:20,message:'类型名称不能过长'}
          ],
          selections: [
            {
              type: "array",
              required: true,
              validator:checkSelections,
              trigger: "change"
            }
          ]
        },
        checkedItems:[]
        };
  },
  methods: {
    //查询
    queryData(pageSize,index){
      this.tableLoading= true;
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 4,
          pageSize: pageSize || 10,
          pageIndex:index || 1
        }).then(res => {
            console.log(res);
          if (res.data.isSuccess == true) {
            this.tableLoading= false;
                  this.groupLine_type = res.data.objects;
                  this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "操作失败: " + res.data.message
            });
            setTimeout(() => {
              this.tableLoading= false;
            },500)
          }
        })
        .catch(e => {
          console.log(e);
        });
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
      //查询预订说明范围
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 3,
          pageSize: 100,
          pageIndex: 1
        }).then(res => {
            console.log(res);
          if (res.data.isSuccess == true) {
                  this.bookingInstructions = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "操作失败: " + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //添加线路类型
    addRouteType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var id_arr = [];
          this.addDialogForm.selections.forEach(index => {
              id_arr.push(this.bookingInstructions[index].id);
          })
          this.groupHttp
            .post("GroupLine/CreateGroupLineTypeParam", {
              paramType: 4,
              paramName: this.addDialogForm.paramName,
              bookingInstructions: id_arr
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.queryData(this.pagination.size,this.pagination.currentPage);
                this.$message({
                  type: "success",
                  message: "您已经成功添加 "  +  this.addDialogForm.paramName
                });
                //清空 添加模态框 数据
                this.addDialogForm = {
                  paramName: "",
                  selections: []
                },
                this.add_checkList = [];
                this.dialogFormVisible_add = false;
              } else {
                this.$message({
                  type: "info",
                  message: "操作失败: " + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //把要修改的数据显示在模态框里面
    updateModal(row) {
      //查询预订说明范围
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 3,
          pageSize: 100,

          pageIndex: 1
        }).then(res => {
            console.log(res);
          if (res.data.isSuccess == true) {
                  this.bookingInstructions = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "操作失败: " + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      this.row = row;
      this.modifyDialogForm.selections = []
      this.dialogFormVisible_modify = true;
      this.modifyDialogForm.paramName = row.paramName;
      this.modifyDialogForm1.paramName = row.paramName;
      this.modifyDialogForm.id = row.id;
      this.groupHttp
        .post("GroupLine/GetGroupLineTypeParam", {
          id: this.modifyDialogForm.id
        })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            res.data.bookingInstructions.forEach(id => {
              for(var i= 0;i<this.bookingInstructions.length;i++){
                if(this.bookingInstructions[i].id == id){
                  this.modifyDialogForm.selections.push(i);
                }
              }
            })
          } else {
            this.$message({
              type: "info",
              message: "操作失败:" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      this.modifyDialogForm1.selections = this.modifyDialogForm.selections;
    },
    //修改线路类型
    modifyRouteType(formName) {
      if(this.modifyDialogForm.paramName == this.modifyDialogForm1.paramName && this.modifyDialogForm.selections == this.modifyDialogForm1.selections){
        this.$message({
                  type: "info",
                  message: "您还未做任何修改"
                });
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          var id_arr = [];
          console.log(this.modifyDialogForm.selections);
          this.modifyDialogForm.selections.forEach(index => {
              id_arr.push(this.bookingInstructions[index].id);
          })
          console.log(id_arr);
          this.groupHttp
            .post("GroupLine/CreateGroupLineTypeParam", {
              paramType: 4,
              paramName: this.modifyDialogForm.paramName,
              bookingInstructions: id_arr,
              id: this.modifyDialogForm.id
            })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.queryData(this.pagination.size,1);
                this.dialogFormVisible_modify = false,
                this.modify_checkList = [];
                this.row.paramName = this.modifyDialogForm.paramName;
              } else {
                this.$message({
                  type: "info",
                  message: "操作失败: " + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
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
      this.$confirm("此操作将删除这" + num + "项, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.groupHttp
            .post("GroupLine/DeleteGroupLineParam", {
              groupLineParamId: id_arr
            })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "您已经成功删除" + num + "项"
                });
                this.queryData(this.pagination.size,1);
              } else {
                this.$message({
                  type: "info",
                  message: "操作失败: " + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
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

