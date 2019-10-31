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
            <img v-for="(item,index) in productImageList" :key="index" :src="item.image" alt>
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
      <h4>推广政策</h4>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="推广费"
            size="small"
          >
            <el-radio v-model="CommissionCalculationType" :label="2">
              <el-input
                :disabled="CommissionCalculationType==2?false:true"
                v-model="form.CommissionSettingValue2"
              ></el-input>元/单
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            size="small"
          >
            <el-radio v-model="CommissionCalculationType" :label="1">
              <el-input-number
                :controls="false"
                :disabled="CommissionCalculationType==1?false:true"
                v-model="form.CommissionSettingValue1"
                :max="100"
                :min="0"
              ></el-input-number>%/单
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="激励金"
            size="small"
          >
            <el-radio v-model="EncourageCalculationType" :label="2">
              <el-input
                :disabled="EncourageCalculationType==2?false:true"
                v-model="form.EncourageSettingValue2"
              ></el-input>元/单
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            size="small"
          >
            <el-radio v-model="EncourageCalculationType" :label="1">
              <el-input-number
                :controls="false"
                :disabled="EncourageCalculationType==1?false:true"
                v-model="form.EncourageSettingValue1"
                :max="100"
                :min="0"
              ></el-input-number>%/单
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="dialogFormVisible = true"
        >审核不通过</el-button>
        <el-button
          type="primary"
          size="small"
          @click="auditProduct(true)" 
          :loading="loading2"
        >审核通过</el-button>
        <el-button size="small" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="审核拒绝理由" :visible.sync="dialogFormVisible" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
    <el-form size="small" label-width="100px">
      <el-form-item>
        <el-input v-model="content" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
    <el-button type="primary" @click="auditProduct(false)" :loading="loading1" size="small">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible:false,
      loading1: false,
      loading2: false,
      CommissionCalculationType: 1,
      EncourageCalculationType: 1,
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
    auditProduct(boole) {
      let commissionSettingValue, encourageSettingValue;
      if (this.CommissionCalculationType == 1) {
        this.form.CommissionSettingValue2 = "";
        commissionSettingValue = this.form.CommissionSettingValue1;
      } else {
        this.form.CommissionSettingValue1 = "";
        commissionSettingValue = this.form.CommissionSettingValue2;
      }
      if (this.EncourageCalculationType == 1) {
        this.form.EncourageSettingValue2 = "";
        encourageSettingValue = this.form.EncourageSettingValue1;
      } else {
        this.form.EncourageSettingValue1 = "";
        encourageSettingValue = this.form.EncourageSettingValue2;
      }
      let reg = /^\d+(?:\.\d{1,2})?$/;
      let approvalComment="";
      if (reg.test(commissionSettingValue) && reg.test(encourageSettingValue)) {
        if (boole) {
          this.loading2 = true;
          this.groupHttp.post("SingleProduct/ApprovalProduct", {
            ProductId: this.$route.query.productId,
            CommissionCalculationType: this.CommissionCalculationType,
            EncourageCalculationType: this.EncourageCalculationType,
            CommissionSettingValue:commissionSettingValue,
            EncourageSettingValue:encourageSettingValue,
            Approved: boole,
            ApprovalComment:approvalComment
          })
          .then(res => {
            if (res.data.isSuccess == true) {
                this.loading2 = false;
                this.$message({
                  type: "success",
                  message: "审核通过"
                });
              this.$router.go(-1);
            } else {
              this.loading2 = false;
              this.$message.error(res.data.message);
            }
          })
          .catch(e => {
            console.log(e);
        });
        } else {
          if(this.content){
            this.loading1 = true;
            approvalComment = this.content
            this.groupHttp.post("SingleProduct/ApprovalProduct", {
            ProductId: this.$route.query.productId,
            CommissionCalculationType: this.CommissionCalculationType,
            EncourageCalculationType: this.EncourageCalculationType,
            CommissionSettingValue:commissionSettingValue,
            EncourageSettingValue:encourageSettingValue,
            Approved: boole,
            ApprovalComment:approvalComment
          })
          .then(res => {
            if (res.data.isSuccess == true) {
                this.loading1 = false;
                this.$message({
                  type: "warning",
                  message: "审核未通过"
                });
              this.$router.go(-1);
            } else {
              this.loading1 = false;
              this.$message.error(res.data.message);
            }
          })
          .catch(e => {
            console.log(e);
        });
      }else{
        this.$message.error('请输入拒绝理由')
      }
        }
      } else {
        this.$message.error("金额必须为正数，且仅保留两位小数");
      }
    },
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
            this.productImageList = res.data.productImageList;
            this.introduce = res.data.introduce;
            if(res.data.commissionSettingValue && res.data.encourageSettingValue){
              if(res.data.commissionCalculationType ==1){
                this.form.CommissionSettingValue1 = res.data.commissionSettingValue
              }else{
                this.form.CommissionSettingValue2 = res.data.commissionSettingValue
              }
              if(res.data.encourageCalculationType == 1){
                this.form.EncourageSettingValue1 = res.data.encourageSettingValue
              }else{
                this.form.EncourageSettingValue2 = res.data.encourageSettingValue
              }
              this.CommissionCalculationType = res.data.commissionCalculationType
              this.EncourageCalculationType = res.data.encourageCalculationType
            }
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
