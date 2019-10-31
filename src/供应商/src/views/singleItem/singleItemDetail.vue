<template>
  <div class="view">
    <h4>单项信息</h4>
    <el-form label-width="100px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="分类" size="small">
            <span>{{productTypeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="确认规则" size="small">
            <span>{{confirmTypeName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="产品名称" size="small">
            <span>{{productName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="产品推荐" size="small">
            <span>{{recommendDesc}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="同行价" size="small">
            <span>{{unitPrice}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="图片" size="small" class="img-box">
            <img v-for="(item,index) in productImageList" :key="index" :src="item.image" alt>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="产品介绍" size="small">
            <div v-html='introduce'></div>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="status == 1">
      <h4>推广政策</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="推广费" size="small">
            <span>{{commissionSettingValue}}{{commissionCalculationType==1?'%/单':'元/单'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="激励金" size="small">
            <span>{{encourageSettingValue}}{{encourageCalculationType==1?'%/单':'元/单'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      </div>
      <h4>操作日志</h4>
      <el-table :data="singleProductLog" size="small" algin="center">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="time" label="操作时间"></el-table-column>
        <el-table-column prop="content" label="日志内容"></el-table-column>
      </el-table>
      <div v-if="this.approvalComment">
        <h4>备注</h4>
        <div>{{approvalComment}}</div>
      </div>
      <el-form-item style="margin-top:15px">
        <el-button size="small" @click="$router.push({path:'/singleItem/singleItemList'})">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      status:'',
      loading: false,
      singleProductLog: [],
      productImageList: [],
      productTypeName: "",
      productName: "",
      confirmTypeName: "",
      unitPrice: "",
      recommendDesc: "",
      introduce: "",
      commissionSettingValue: "",
      encourageSettingValue: "",
      encourageCalculationType:'',
      commissionCalculationType:'',
      approvalComment:''
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    //获取产品信息
    getProduct() {
      this.loading = true;
      this.groupHttp
        .post("SingleProduct/GetProduct", { id: this.$route.query.productId })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.loading = false;
            this.productTypeName = res.data.productTypeName;
            this.productName = res.data.productName;
            this.confirmTypeName = res.data.confirmTypeName;
            this.recommendDesc = res.data.recommendDesc;
            this.unitPrice = res.data.unitPrice;
            this.status = res.data.status;
              res.data.singleProductLog.forEach(obj => {
              let date1 = new Date(obj.time);
              obj.time = dateFmt(date1, "yyyy-MM-dd hh:mm:ss");
            });
            this.singleProductLog = res.data.singleProductLog;
            this.productImageList = res.data.productImageList;
            this.introduce = res.data.introduce;
            this.commissionSettingValue = res.data.commissionSettingValue;
            this.encourageSettingValue = res.data.encourageSettingValue;
            this.encourageCalculationType = res.data.encourageCalculationType;
            this.commissionCalculationType = res.data.commissionCalculationType;
            this.approvalComment = res.data.approvalComment
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.img-box {
  img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
}
</style>

