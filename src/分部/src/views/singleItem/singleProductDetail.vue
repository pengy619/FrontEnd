<template>
  <div class="view">
    <h4>单项信息</h4>
    <el-form label-width="100px" :model="form" v-loading="loading">
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
      <div v-if="this.$route.query.isAudit">
        <h4>推广政策</h4>
        <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="推广费">
            <el-radio v-model="promotionFeeClassify" :label="1">按比例</el-radio>
            <el-input-number
            v-model="promotionFee1"
            style="width:160px"
            :min="0"
            :max="100"
            :disabled="promotionFeeClassify ==2"
            ></el-input-number>
            <span style="margin-right:20px;">%</span>
            <el-radio v-model="promotionFeeClassify" :label="2">按数量</el-radio>
            <el-input-number
            v-model="promotionFee2"
            style="width:160px"
            :disabled="promotionFeeClassify ==1"
            :min="0"
            :max="9999999"
            ></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="LineOnSale" :loading="auditLoading">审核</el-button>
        </el-form-item>
        </el-form>
      </div>
    <div class="footer-control-wrap" style="text-align:center;margin-top:30px">
      <el-button size="small" @click="$router.go(-1)" v-if="this.$route.query.isAudit">返回</el-button>
    </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      promotionFeeClassify:'',
      auditLoading: false,
      promotionFee1: 0,
      promotionFee2: 0,
      form: {
        CommissionSettingValue1: "",
        CommissionSettingValue2: "",
        EncourageSettingValue1: "",
        EncourageSettingValue2: ""
      },
      content:'',
      loading: false,
      productImageList: [],
      productTypeName: "",
      productName: "",
      confirmTypeName: "",
      unitPrice: "",
      recommendDesc: "",
      introduce: ""
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    //获取产品信息
    getProduct() {
      this.loading = true;
      this.groupHttp.get("/SingleProduct/GetProductInfo?productId="+this.$route.query.productId)
        .then(res => {
            this.promotionFeeClassify = res.data.promotionFeeClassify
            if(res.data.promotionFeeClassify == 1){
            this.promotionFee1 = res.data.promotionFee;
            }else{
            this.promotionFee2 = res.data.promotionFee;
            }
            this.productTypeName = res.data.productCategoriesName;
            this.productName = res.data.productName;
            this.confirmTypeName = res.data.confimStr;
            this.recommendDesc = res.data.recommend;
            this.unitPrice = res.data.price;
            this.productImageList = res.data.optionParamForPictureDto;
            this.introduce = res.data.specialtyExplain;
            this.loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
     LineOnSale() {
      this.auditLoading = true;
      let promotionFee;
      if (this.promotionFeeClassify == 1) {
        promotionFee = this.promotionFee1;
      } else {
        promotionFee = this.promotionFee2;
      }
      if (promotionFee != undefined) {
        this.groupHttp
          .post("ResourcePlatform/LineOnSale", {
            PromotionFeeClassify: this.promotionFeeClassify,
            PromotionFee: promotionFee,
            productId: this.$route.query.productId
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.auditLoading = false;
              this.$message({
                type: "success",
                message: "审核成功"
              });
              this.$router.go(-1);
            } else {
              this.auditLoading = false;
              this.$message({
                type: "warning",
                message: res.data.info
              });
            }
          })
          .catch(e => {
            this.auditLoading = false;
            console.log(e);
          });
      } else {
        this.auditLoading = false;
        this.$message.error("推广费不能为空");
      }
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
