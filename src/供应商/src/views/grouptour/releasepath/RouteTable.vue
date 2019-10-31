<template>
  <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :inline="true" :model="formInPath" class="demo-form-inline">
      <el-form-item label="线路名称">
        <el-input v-model="formInPath.pathName" placeholder size="small"></el-input>
      </el-form-item>
      <el-form-item label="线路编号">
        <el-input v-model="formInPath.pathNum" placeholder size="small"></el-input>
      </el-form-item>
      <el-form-item label="线路类型">
        <el-select v-model="formInPath.pathType" placeholder="请选择" size="small">
          <el-option
            v-for="item in routeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInPath.status" placeholder="请选择" size="small" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <!-- <el-checkbox v-model="formInPath.isNoLineDate" v-if="formInPath.status == 2">无团期</el-checkbox> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData(pagination.size,1)" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="routerPush">创建详细路线</el-button>
    <el-button type="primary" @click="groupBegin" :disabled="btn_group">开团</el-button>
    <el-button type="primary" @click="setAddress" :disabled="btn_address">设置多出发地</el-button>
    <el-button type="primary" @click="DownSales" :disabled="btn_down">下架</el-button>
    <el-button type="primary" @click="onSales" :disabled="btn_up">上架</el-button>
    <el-button type="primary" @click="pathEdit" :disabled="btn_edit">编辑</el-button>
    <el-button type="primary" @click="copyLineProduct" :disabled="btn_copy">复制</el-button>
    <el-button type="primary" @click="pathDelete" :disabled="btn_delete">删除</el-button>
    <!-- <el-button type="primary" @click="goDetail" :disabled="btn_detail">查看</el-button> -->
    <el-table
      v-loading="loading"
      class="margin_15"
      ref="multipleTable"
      :data="pathData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="pathSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="lineCode" label="线路编号" align="center"></el-table-column>
      <el-table-column prop="fullName" label="线路名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="enumGroupLineTypeDesc" label="线路类型" align="center"></el-table-column>
      <el-table-column prop="enumGroupLineModeDesc" label="组团方式" align="center"></el-table-column>
      <el-table-column prop="tripDays" label="行程总天数" align="center"></el-table-column>
      <el-table-column prop="statusDesc" label="状态" align="center"></el-table-column>
      <!-- <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button 
            size="mini" type="text" @click="pathEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini" type="text"
            @click="copyLineProduct(scope.$index, scope.row)">复制</el-button>
          <el-button
            size="mini"
            type="text"
            @click="pathDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../../../style/common.scss";
.el-button {
  padding: 7px 5px;
}
.el-form .el-form-item {
  margin-right: 25px;
}
.margin_15 {
  margin-top: 15px;
}
</style>
<script>
export default {
  data() {
    return {
      lineIds: [],
      btn_detail: true,
      btn_address: true,
      btn_group: true,
      btn_down: true,
      btn_up: true,
      btn_edit: true,
      btn_copy: true,
      btn_delete: true,
      fullscreenLoading: false,
      statusList: [],
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      formInPath: {
        pathName: "",
        pathNum: "",
        pathType: "",
        status: "",
      },
      loading: false,
      pathData: [],
      multipleSelection: [],
      routeTypeOptions: [
        {
          label: "不限",
          value: ""
        }
      ]
    };
  },
  mounted() {
    //获取线路类型  赋值给routeTypeOptions
    this.groupHttp
      .post("GroupLine/GetGroupLineParamList", {
        paramType: 4,
        PageSize: 100,
        PageIndex: 1
      })
      .then(res => {
        if (res.data.isSuccess == true) {
          res.data.objects.forEach(val => {
            var obj = {};
            obj.label = val.paramName;
            obj.value = val.id;
            this.routeTypeOptions.push(obj);
          });
        } else {
          this.$message({
            type: "info",
            message: "加载失败: " + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    //获取线路状态
    this.groupHttp
      .get("GroupLine/GetEnumGroupLineStatus")
      .then(res => {
        if (res.data.isSuccess) {
          this.statusList = res.data.objects;
        } else {
          this.$message({
            type: "info",
            message: "加载失败: " + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    //初始化数据
    this.queryData();
  },
  methods: {
    queryData(size, index) {
      this.loading = true;
      this.groupHttp
        .post("GroupLine/LineList", {
          LineCode: this.formInPath.pathNum,
          lineName: this.formInPath.pathName,
          enumGroupLineType: this.formInPath.pathType,
          Status:this.formInPath.status,
          pageSize: size || 10,
          pageIndex: index || 1
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.pathData = res.data.objects;
            this.pagination.currentPage = index || 1;
            this.pagination.total = res.data.total;
            this.loading = false;
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
    routerPush() {
      this.$router.push({ path: "/grouptour/RouteMessage" });
    },
    //上架
    onSales() {
      this.groupHttp
        .get("GroupLine/GroupLineOnSales", {
          params: { lineIds: this.lineIds }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type: "success",
              message: "上架成功"
            });
            this.queryData(this.pagination.size, 1);
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
    //下架
    DownSales() {
      this.groupHttp
        .get("GroupLine/GroupLineDownSales", {
          params: { lineIds: this.lineIds }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type: "success",
              message: "下架成功"
            });
            this.queryData(this.pagination.size, 1);
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
    //复制
    copyLineProduct(index, data) {
      this.$prompt("请输入路线名称", "路线", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^ ]+$/,
        inputErrorMessage: "线路类型名称不能为空 且不能含有空格"
      })
        .then(({ value }) => {
          this.fullscreenLoading = true;
          this.groupHttp
            .post("/GroupLine/CopyLineProduct", {
              LineId: this.multipleSelection[0].lineId,
              LineName: value
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.fullscreenLoading = false;
                this.$message({
                  type: "success",
                  message: "你的路线是: " + value
                });
                this.queryData(this.pagination.size, 1);
              }
            })
            .catch(e => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //编辑
    pathEdit() {
      this.$router.push({
        path: "/grouptour/Editmessage",
        query: { lineId: this.multipleSelection[0].lineId }
      });
    },
    //查看
    goDetail() {
      this.$router.push({
        path: "/grouptour/routeDetails",
        query: { lineId: this.multipleSelection[0].lineId }
      });
    },
    //删除
    pathDelete() {
      this.$confirm("此操作将永久删除该线路, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .get(
              "GroupLine/DeleteGroupLine?lineId=" +
                this.multipleSelection[0].lineId,
              {}
            )
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.queryData(this.pagination.size, 1);
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
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //全选
    pathSelectionChange(val) {
      this.lineIds = [];
      this.multipleSelection = val;
      if (this.multipleSelection.length == 0) {
        this.btn_address = true;
        this.btn_group = true;
        this.btn_down = true;
        this.btn_up = true;
        this.btn_edit = true;
        this.btn_copy = true;
        this.btn_delete = true;
      } else if (this.multipleSelection.length == 1) {
        this.btn_address = !this.multipleSelection[0].showSetProduct;
        this.btn_group = !this.multipleSelection[0].showTeamSet;
        this.btn_down = !this.multipleSelection[0].showDownSales;
        this.btn_up = !this.multipleSelection[0].showUpSales;
        this.btn_edit = !this.multipleSelection[0].showModify;
        this.btn_copy = !this.multipleSelection[0].showCopy;
        this.btn_delete = !this.multipleSelection[0].showDelete;
        this.lineIds.push(val[0].lineId);
      } else {
        this.btn_down = false;
        this.btn_up = false;
        val.forEach(item => {
          if (!item.showDownSales) {
            this.btn_down = true;
          }
          if (!item.showUpSales) {
            this.btn_up = true;
          }
          this.lineIds.push(item.lineId);
        });
      }
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    //开团
    groupBegin() {
      this.$router.push({
        path: "/grouptour/GroupMessage",
        query: {
          lineId: this.multipleSelection[0].lineId,
          fullName: this.multipleSelection[0].fullName
        }
      });
    },
    //设置多出发地
    setAddress() {
      this.$router.push({
        path: "/grouptour/PlaceOfDeparture",
        query: { lineId: this.multipleSelection[0].lineId }
      });
    }
    //切换激励方式
    // handleChangeCommisionType(val){
    //   if(val==1){
    //     this.EncourageValue=''
    //   }else if(val==2){
    //     this.EncouragePercentValue=''
    //   }
    // },
  }
};
</script>
