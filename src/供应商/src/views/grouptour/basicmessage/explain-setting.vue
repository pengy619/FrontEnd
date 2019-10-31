<template>
    <div class="view">
          <div class="tab-div">
               <!-- <el-button type="primary" @click="openDialog_add()" size="small" icon="el-icon-plus">添 加</el-button>
                <el-button type="danger" @click="removeFun()" size="small" :disabled="deleteBtn"  icon="el-icon-delete">删 除</el-button> -->
                    <el-table
                            ref="multipleTable"
                            :data="groupLine_explain"
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
                            label="预订说明"
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
        </div>
</template>

<script>
export default {
  data() {
    return {
      deleteBtn: true,
      submitLoading: false,
      tableLoading: false,
      groupLine_explain: [
        
      ],
      pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
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
          paramType: 3,
          pageSize: pageSize || 10,
          pageIndex:index || 1
        }).then(res => {
          console.log(res);
          if (res.data.isSuccess == true) {
            this.tableLoading= false;
                  this.groupLine_explain = res.data.objects;
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
    //添加
    openDialog_add(text) {
      text = text || '预订说明';
      this.$prompt(text, "添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^ ]+$/,
        inputErrorMessage: "不能为空且不能含有空格"
      })
        .then(({ value }) => {
          this.groupHttp
            .post("GroupLine/CreateGroupLineParam", {
              paramType: 3,
              paramName: value
            })
            .then(res => {
              console.log(res);
              if (res.data.isSuccess == true) {
                this.queryData(this.pagination.size,this.pagination.currentPage);
                this.$message({
                  type: "success",
                  message: "您已经成功添加 "  +  value
                });
              } else if(res.data.isSuccess == false){
                var msg = res.data.message+"!请重新编辑";
                this.openDialog_add(msg)
              }
            })
            .catch(e => {
              console.log(e);
            });
        }).catch(() => {});
    },
    //删除
    removeFun() {
      var id_arr = [];
      for(var i = 0; i<this.checkedItems.length; i++){
        id_arr.push(this.checkedItems[i].id)
      }
      var num = id_arr.length;
      this.$confirm("此操作将删除所选" + num + "项预订说明, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.groupHttp
            .post("GroupLine/DeleteGroupLineParam", {
              groupLineParamId: id_arr
            })
            .then(res => {
              console.log(res);
              if (res.data.isSuccess) {
                this.$message({
                  type: "success",
                  message: "您已经成功删除" + num + "项预订说明"
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
    //编辑
    updateModal(row,text) {
      text = text || '预订说明';
      var content = row.paramName;
      var id = row.id;
      this.$prompt(text, "编辑", {
        inputValue:content,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^ ]+$/,
        dangerouslyUseHTMLString:true,
        inputErrorMessage: "不能为空且不能含有空格"
      })
        .then(({ value }) => {
          if(value == content){
            var msg = "<span style='color:#fa5555;'>您还未做修改!</span>";
            this.updateModal(row,msg)
          }else{
            this.groupHttp
            .post("GroupLine/CreateGroupLineParam", {
              paramType: 3,
              paramName: value,
              id: id
            })
            .then(res => {
              console.log(res);
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "修改成功 "
                });
                this.queryData(this.pagination.size,1);
              } else{
                var msg = "<span style='color:#fa5555;'>"+res.data.message+"!请重新编辑</span>";
                  this.updateModal(row,msg)
              }
            })
            .catch(e => {
              console.log(e);
            });
          }
        })
        .catch(() => {
          
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

<style>

</style>
