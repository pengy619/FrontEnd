<template>
  <div class="view">
    <el-form :inline="true" :model="form" class="demo-form-inline" label-width="70px" size="small">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="是否已读">
        <el-select v-model="form.isRead" placeholder="请选择" class="input">
          <el-option v-for="item in IsRead" :key="item.key" :label="item.name" :value="item.key"></el-option>
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
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="small"
      algin="center"
      :data="table"
      style="width: 100%"
      v-loading="table_loading"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" align="center" prop="no" label="公告编号"></el-table-column>
      <el-table-column size="small" align="center" prop="titles" label="标题"></el-table-column>
      <el-table-column size="small" align="center" prop="createTime" label="发布时间"></el-table-column>
      <el-table-column size="small" align="center" label="附件">
        <template slot-scope="scope">
          <i v-if="scope.row.files.length > 0" class="el-icon-document"></i>
        </template>
      </el-table-column>
      <el-table-column size="small" align="center" label="是否已读">
        <template slot-scope="scope">
          <span>{{scope.row.isRead?"已读":"未读"}}</span>
        </template>
      </el-table-column>
      <el-table-column size="small" align="center" fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkMessage(scope.row)">查看</el-button>
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
      IsRead: [
        { key: "", name: "全部" },
        { key: true, name: "已读" },
        { key: false, name: "未读" }
      ],
      form: {
        isRead: "",
        date: "",
        title: ""
      },
      table: []
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.table_loading = true;
      this.groupHttp
        .post("/Notice/GetNoticeReceivedList", {
          IsRead: this.form.isRead,
          Title: this.form.title,
          DateFrom: this.form.date[0] || "",
          DateTo: this.form.date[1] || "",
          PageSize: this.PageSize,
          PageIndex: this.PageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(obj => {
              let time = new Date(obj.createTime);
              obj.createTime = dateFmt(time, "yyyy-MM-dd hh:mm:ss");
            });
            this.table = res.data.objects;
            this.total = res.data.total;
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
    checkMessage(row) {
      this.$router.push({
        path: "/systemSettings/bulletinBoardDetail",
        query: { noticeId: row.id }
      });
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
