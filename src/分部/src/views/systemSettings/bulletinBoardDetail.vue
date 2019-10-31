<template>
  <div class="view">
    <el-form class="demo-ruleForm" label-width="80px" size="small" v-loading="view_loading">
      <el-form-item label="版块类型">{{kindName}}</el-form-item>
      <el-form-item label="标题">{{titles}}</el-form-item>
      <el-form-item label="发布日期">{{createTime}}</el-form-item>
      <el-form-item label="发布内容">
        <div v-html="descs"></div>
      </el-form-item>
      <el-form-item label="附件">
        <el-table size="small" algin="center" :data="table" style="width: 100%">
          <el-table-column size="small" align="center" prop="name" label="附件名称"></el-table-column>
          <el-table-column size="small" align="center" fixed="right" width="280" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini">
                <a :href="table[scope.$index].urls" :download="table[scope.$index].name">下载</a>
                <!-- <a @click="download(table[scope.$index].urls,table[scope.$index].name)">下载</a> -->
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="readNotice" :loading="loading">已读</el-button>
        <el-button @click="back">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      loading: false,
      view_loading: false,
      kindName: "",
      table: [],
      titles: "",
      createTime: "",
      descs: ""
    };
  },
  mounted() {
    this.getNotice();
  },
  methods: {
    download(src, name) {
      let img = document.createElement("img");
      img.src = src;
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        let url = canvas.toBaseUrl("image/png"); //得到图片的base64编码数据
        var a = document.createElement("a");
        var event = new MouseEvent("click");
        a.download = name || "photo";
        a.href = url;
        a.dispatchEvent(event);
      };
    },
    //获取信息
    getNotice() {
      this.view_loading = true;
      this.groupHttp
        .get(`/Notice/GetNotice?noticeId=${this.$route.query.noticeId}`)
        .then(res => {
          this.kindName = res.data.kindName;
          this.titles = res.data.titles;
          this.createTime = dateFmt(
            new Date(res.data.createTime),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.descs = res.data.descs;
          this.table = res.data.files;
          this.view_loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
    //公告已读
    readNotice() {
      this.loading = true;
      this.groupHttp
        .get(`Notice/ReadNotice?noticeId=${this.$route.query.noticeId}`)
        .then(res => {
          if (res.data.isSuccess == true) {
            this.loading = false;
            this.$message({
              type: "success",
              message: "此公告已读"
            });
            this.getUnReadNoticeCount();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取公告未读数
    getUnReadNoticeCount() {
      this.groupHttp
        .get("/Notice/GetUnReadNoticeCount")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$emit("childByValue", res.data.count);
            this.back();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
