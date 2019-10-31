<template>
  <div class="view">
    <el-form :inline="true" :model="form" class="demo-form-inline" label-width="70px" size="small">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="版块类型">
        <el-select v-model="form.type" placeholder="请选择" class="input">
          <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="margin_bottom">
      <el-button size="small" type="primary" @click="addNotice">新增</el-button>
      <el-button size="small" type="primary" @click="exportList">导出</el-button>
    </div>
    <el-table
      size="small"
      algin="center"
      :data="table"
      style="width: 100%"
      v-loading="table_loading"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" align="center" prop="no" label="公告编号"></el-table-column>
      <el-table-column size="small" align="center" prop="kindName" label="公告类型"></el-table-column>
      <el-table-column size="small" align="center" prop="titles" label="标题"></el-table-column>
      <el-table-column size="small" align="center" prop="receiveDes" label="展示范围"></el-table-column>
      <el-table-column size="small" align="center" prop="createTime" label="发布时间"></el-table-column>
      <el-table-column size="small" align="center" label="附件">
        <template slot-scope="scope">
          <i v-if="scope.row.files.length > 0" class="el-icon-document"></i>
        </template>
      </el-table-column>
      <el-table-column size="small" align="center" fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteMessage(scope.row)">删除</el-button>
          <el-button type="text" size="mini" @click="editMessage(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageIndex"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      PageSize: 10,
      PageIndex: 1,
      total: 0,
      table_loading: false,
      typeList: [{ key: "", name: "全部" }],
      form: {
        type: "",
        date: "",
        title: ""
      },
      table: []
    };
  },
  mounted() {
    this.getNoticeType();
    this.queryData();
    this.getUnReadNoticeCount()
  },
  methods: {
    //获取公告类型
    getNoticeType() {
      this.groupHttp
        .post("/Notice/GetNoticeType")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.typeList = this.typeList.concat(res.data.keyValueList);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    queryData() {
      this.table_loading = true;
      this.groupHttp
        .post("/Notice/GetNoticePagedList", {
          NoticeType: this.form.type,
          Title: this.form.title,
          DateFrom: this.form.date[0] || "",
          DateTo: this.form.date[1] || "",
          PageSize: this.PageSize,
          PageIndex: this.PageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.total = res.data.total;
            res.data.objects.forEach(obj => {
              let time = new Date(obj.createTime);
              obj.createTime = dateFmt(time, "yyyy-MM-dd hh:mm:ss");
            });
            this.table = res.data.objects;
            this.table_loading = false;
          } else {
            this.table_loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //导出
    exportList() {
      let sDate = this.form.date[0] || "",
        eDate = this.form.date[0] || "";
      let url =
        process.env.WEB_API +
        "/Notice/ExportNoticeList?NoticeType=" +
        this.form.type +
        "&Title=" +
        this.form.title +
        "&DateFrom=" +
        sDate +
        "&DateTo=" +
        eDate +
        "&PageSize=" +
        this.PageSize +
        "&PageIndex=" +
        this.PageIndex +
        "&BranchId=";
      this.groupHttp.get("/GroupLine/GetBranchId").then(function(res) {
        window.location.href = url + res.data;
      });
    },
    editMessage(row) {
      this.$router.push({
        path: "/systemSettings/addBulletin",
        query: { noticeId: row.id }
      });
    },
    deleteMessage(row) {
      this.$confirm("是否删除此公告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("Notice/DeleteNotice?noticeId=" + row.id)
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryData();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {
          return;
        });
    },
    //获取公告未读数
    getUnReadNoticeCount() {
      this.groupHttp
        .get("/Notice/GetUnReadNoticeCount")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$emit("childByValue", res.data.count);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addNotice() {
      this.$router.push("/systemSettings/addBulletin");
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.PageIndex = val;
      this.queryData();
    }
  }
};
</script>

<style>
</style>
