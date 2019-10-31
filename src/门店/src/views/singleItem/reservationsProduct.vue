<template>
  <div class="view">
    <h4>单项信息</h4>
    <el-form
      label-width="110px"
      v-loading="loading"
      size="small"
      :inline="true"
      :model="form"
      :rules="rules"
      ref="form"
    >
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
            <span>{{form.productName}}</span>
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
      <h4>门店信息</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="客户" size="small">
            <span>{{form.customerName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系人" size="small" class="img-box">
            <span>{{form.linkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系电话" size="small">
            <span>{{form.linkMobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期" size="small" class="img-box">
            <span>{{form.orderDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="合同类别" prop="CategoryId">
            <el-select v-model="form.CategoryId" @change="handleChangeCategoryId">
              <el-option
                v-for="item in contractCategoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="合同号" prop="ContractNo" v-if="form.CategoryId==1">
            <el-select v-model="form.ContractNo" filterable placeholder="请输入关键词">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同类型"
            size="small"
            class="form-inline-input"
            v-if="form.CategoryId==2"
          >{{form.ContractTypeName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item
          label="合同号"
          v-show="form.CategoryId==2"
        >{{form.ContractNo}}</el-form-item>
      </el-row>
      <h4>预定信息</h4>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系人" prop="FirstLinkMan">
            <el-input v-model="form.FirstLinkMan"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="主要联系电话" prop="FirstLinkPhone">
            <el-input v-model="form.FirstLinkPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别">
            <el-radio-group v-model="form.FirstLinkGender">
              <el-radio :label="1">先生</el-radio>
              <el-radio :label="2">女士</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="添加为游客">
            <el-radio-group v-model="form.IsAddCustomer">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="内部编码">
            <el-input v-model="form.InnerCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>费用信息</h4>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="数量" prop="Quantity">
            <el-input v-model="form.Quantity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="同行价">
            <span>{{unitPrice}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总同行价">{{Amount}}</el-form-item>
        </el-col>
      </el-row>
      <h4>备注</h4>
      <el-row>
        <el-input type="textarea" v-model="form.Remark"></el-input>
      </el-row>
      <el-form-item style="margin-top:20px">
        <el-button type="primary" :loading="loading1" @click="onSubmit('form')">确定</el-button>
        <el-button type="primary" :loading="loading2" @click="onSubmit('form','payment')" v-if="confirmType==1">支付</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    var checkNun = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入数量"));
      } else if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("您还没有手机号码"));
      } else if (!/^1[0-9][0-9]\d{8}$/.test(value)) {
        callback(new Error("您的手机号码有误"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loading1: false,
      loading2: false,
      contractCategoryList: [], //合同类别
      options: [], //合同号选项
      productImageList: [],
      productTypeName: "",
      confirmTypeName: "",
      confirmType:'',
      unitPrice: "",
      recommendDesc: "",
      form: {
        customerId: "",
        customerName: "",
        ProductId: this.$route.query.productId,
        productName: "",
        linkMan: "",
        linkMobile: "",
        orderDate: "",
        ContractId: 0,
        ContractNo: "",
        CategoryId: "",
        CategoryName: "纸质合同",
        ContractTypeId: "",
        ContractTypeName: "",
        FirstLinkMan: "",
        FirstLinkPhone: "",
        FirstLinkGender: 1,
        IsAddCustomer: true,
        InnerCode: "",
        Quantity: "",
        Amount: "",
        Remark: ""
      },
      rules: {
        FirstLinkMan: [
          { required: true, message: "您还没有输入联系人", trigger: "blur" }
        ],
        FirstLinkPhone: [
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        Quantity: [{ required: true, validator: checkNun, trigger: "blur" }],
        ContractNo: [
          { required: true, message: "请输入合同号", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    Amount: function() {
      this.form.Amount = this.form.Quantity * this.unitPrice;
      return this.form.Amount;
    }
  },
  mounted() {
    this.getProduct();
    this.form.orderDate = dateFmt(new Date(), "yyyy-MM-dd");
    this.getShopInfo();
    this.GetContractCategoryList();
    this.searchContractNo();
  },
  methods: {
    onSubmit(form, payment) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (payment == "payment") {
            this.loading2 = true;
          } else {
            this.loading1 = true;
          }
          let objects = {};
          this.shopHttp
            .post("SingleProductOrder/CreateSingleProductOrder", {
              Object: this.form
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "预定成功"
                });
                if (payment == "payment") {
                  this.loading2 = false;
                      this.$router.push({
                      name: "singleOrderPayment",
                      query: { orderIds: res.data.orderId }
                    });
                } else {
                  this.loading1 = false;
                  this.$router.push({path:'/singleItem/singleOrderList'});
                }
              } else {
                if (payment == "payment") {
                  this.loading2 = false;
                } else {
                  this.loading1 = false;
                }
                 this.$message.error(res.data.message)
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
    //获取产品信息
    getProduct() {
      this.loading = true;
     this.shopHttp.get("SingleProduct/SingleProductInfo?productId="+this.$route.query.productId)
        .then(res => {
            this.productTypeName = res.data.productCategoriesName;
            this.form.productName = res.data.productName;
            this.confirmTypeName = res.data.confimStr;
            this.recommendDesc = res.data.recommend;
            this.unitPrice = res.data.price;
            this.productImageList = res.data.optionParamForPictureDto;
            this.confirmType = res.data.confimClassify
            this.loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取合同类别
    GetContractCategoryList() {
      this.shopHttp.get("/Contract/GetContractCategoryList").then(res => {
        if (res.data.isSuccess == true) {
          this.contractCategoryList = res.data.list;
          this.form.CategoryId = 1;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //改变合同类型
    handleChangeCategoryId(val) {
      if (val == 1) {
        this.form.ContractNo = "";
        this.form.CategoryName = "纸质合同";
        this.form.ContractTypeId = "";
         this.form.ContractTypeName = ""
      } else {
        this.form.CategoryName = "电子合同";
        this.getDXContractNumber();
      }
    },
    //获取合同号列表
    searchContractNo() {
      this.shopHttp
        .get("Contract/GetAvailableContractNos?ContractNo=")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.options = res.data.objects;
          }
        });
    },
    //获取电子合同号
    getDXContractNumber() {
      this.shopHttp.get("Contract/GetDXContractNumber").then(res => {
        if (res.data.isSuccess == true) {
          this.form.ContractTypeName = res.data.contractTypeName;
          this.form.ContractTypeId = res.data.contractTypeId;
          this.form.ContractNo = res.data.contractNo;
        }
      });
    },
    //获取门店信息
    getShopInfo() {
      this.shopHttp.get("/ShopAccount/GetShopBasicInfo").then(res => {
        if (res.data.isSuccess) {
          this.form.customerId = res.data.objects[0].id;
          this.form.customerName = res.data.objects[0].name;
          this.form.linkMan = res.data.objects[0].contanct;
          this.form.linkMobile = res.data.objects[0].mobilePhone;
        }
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
