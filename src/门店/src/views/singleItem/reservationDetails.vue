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
            <img v-for="(item,index) in productImageList" :key="index" :src="item.filePath" alt>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="产品介绍" size="small">
            <div v-html="introduce"></div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <h4>推广政策</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="推广费" size="small">
            <span>{{commissionSettingValue}}{{commissionCalculationType==1?'%':'元/人'}}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-form-item>
        <el-button size="small" type="primary" @click="linkPath">预订</el-button>
        <!-- <el-button size="small" @click="$router.go(-1)">返回</el-button> -->
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
      productImageList: [],
      productTypeName: "",
      productName: "",
      confirmTypeName: "",
      unitPrice: "",
      recommendDesc: "",
      introduce: "",
      commissionSettingValue: "",
      commissionCalculationType: ""
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    //获取产品信息
    getProduct() {
      this.loading = true;
      this.shopHttp.get("SingleProduct/SingleProductInfo?productId="+this.$route.query.productId)
        .then(res => {
            this.productTypeName = res.data.productCategoriesName;
            this.productName = res.data.productName;
            this.confirmTypeName = res.data.confimStr;
            this.recommendDesc = res.data.recommend;
            this.unitPrice = res.data.price;
            this.productImageList = res.data.optionParamForPictureDto;
            this.introduce = res.data.specialtyExplain;
            this.commissionSettingValue = res.data.promotionFee;
            this.commissionCalculationType = res.data.promotionFeeClassify;
            this.loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
    linkPath(){
      this.$router.push({path:'/singleItem/reservationsProduct',query:{productId:this.$route.query.productId}})
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