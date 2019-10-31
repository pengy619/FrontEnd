<template>
  <div class="view" v-loading="page_loading">
    <h4>
      <span class="vercitals">|</span>线路信息
      <!-- <el-button
        type="primary"
        size="small"
        style="position:absolute;right:50px;top:35px;"
        icon="el-icon-download"
      >
        <a :href="fileUrl" style="color:#fff">下载行程信息</a>
      </el-button>-->
    </h4>
    <el-form>
      <el-form-item label="线路名称" size="small" label-width="120px">
        <span class="spanmargin">
          {{detailInfo.title}}
          <span>（线路编号：{{detailInfo.lineCode}}）</span>
        </span>
      </el-form-item>
      <el-form-item label="线路类型" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.function}}</span>
      </el-form-item>
      <el-form-item label="行程总天数" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.numDay}}天</span>
      </el-form-item>
      <el-form-item label="供应商" size="small" label-width="120px">
        <span class="spanmargin">北京优耐德</span>
      </el-form-item>
      <el-form-item label="出发/抵达" size="small" style="height:40px" label-width="120px">
        <span class="spanmargin">{{detailInfo.placeLeave}}/{{detailInfo.placeReturn}}</span>
      </el-form-item>
      <el-form-item label="线路特色" size="small" label-width="120px">
        <div class="spanmargin" v-html="detailInfo.feature"></div>
      </el-form-item>
      <el-form-item label="线路图片" size="small" label-width="120px">
        <img
          class="myimg spanmargin"
          v-for="(item,index) in detailInfo.imgCode"
          :key="index"
          :src="item"
        >
      </el-form-item>
      <!-- <el-form-item label="线路名称" size="small" label-width="120px">
        <el-select
          class="spanmargin"
          placeholder="请选择"
          v-model="linePackageId"
          @change="cityChange"
        >
          <el-option
            v-for="(item,index) in detailInfo.linePackageList"
            :key="index"
            :label="item.name"
            :value="item.packageId"
            :disabled="item.countForPlayDay == 0"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item class="margin_top">
        <el-table
          :data="detailInfo.routeDates"
          size="small"
          style="width:96%;margin-left:50px;"
          height="300"
          :loading="table_loading"
        >
        <el-table-column prop="productName" label="产品名称" size="small" align="center"></el-table-column>
          <el-table-column prop="datestart" label="出团日期" size="small" align="center"></el-table-column>
          <el-table-column prop="adultPrice" label="成人价" size="small" align="center"></el-table-column>
          <!-- <el-table-column prop="oldManPrice" label="老人价" size="small" align="center"></el-table-column> -->
          <el-table-column prop="childPrice" label="儿童" size="small" align="center"></el-table-column>
          <el-table-column prop="singleRoom" label="单房差" size="small" align="center"></el-table-column>
          <!-- <el-table-column prop="actualInventory" label="库存" size="small" align="center"></el-table-column> -->
          <!-- <el-table-column label="操作" size="small" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="cashOrderdetail(scope.row)">下单</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
      <!-- <el-form-item>
        <div class="pagination">
          <el-pagination
            fixed="right"
            :data="pagination"
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </el-form-item>-->
      <el-form-item>
        <el-tabs style="margin-top:20px;width:96%;margin-left:50px" type="border-card">
          <el-tab-pane label="详细行程">
            <template>
              <div v-for="(item,index) in detailInfo.lineDays" :key="index">
                <span class="mysapn">
                  <span class="verticals">|</span>
                  第{{item.dayNumber}}天
                </span>
                <hr>
                <el-form>
                  <el-form-item label="用餐" size="small" label-width="120px">
                    <span
                      class="spanmargin"
                    >早餐:{{item.breakfast}},午餐:{{item.lunch}},晚餐:{{item.dinner}}</span>
                  </el-form-item>
                  <el-form-item label="酒店" size="small" label-width="120px">
                    <span class="spanmargin">{{item.dayHotel}}</span>
                  </el-form-item>
                  <div v-for="(items,index) in item.itineraryDay" :key="index">
                    <el-form-item label="行程" size="small" label-width="120px">
                      <span class="spanmargin">{{items.trafficName}}</span>
                    </el-form-item>
                    <el-form-item label="行程内容" size="small" label-width="120px">
                      <div v-html="items.sightIntro" style="margin-left:30px;"></div>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="行程信息">
            <template>
              <div style="display:inline-block;width:100%;" class="spanmargin" v-for="(item,index) in detailInfo.lineIntros" :key="index"
              >
              <p class="title-style">{{item.orderNum}}{{item.title}}({{item.channelType}})</p>
              <p v-html="item.content"></p>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline" size="small" v-if="this.$route.query.isAudit">
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
        <el-radio v-model="promotionFeeClassify" :label="2">按人头</el-radio>
        <el-input-number
          v-model="promotionFee2"
          style="width:160px"
          :disabled="promotionFeeClassify ==1"
          :min="0"
          :max="9999999"
        ></el-input-number>
        <span>元（含占座）</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="LineOnSale" :loading="auditLoading">审核</el-button>
      </el-form-item>
    </el-form>
    <div class="footer-control-wrap" style="text-align:center;margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      isPDF: false,
      promotionFeeClassify:"",
      auditLoading: false,
      promotionFee1: 0,
      promotionFee2: 0,
      lineData: this.$route.query,
      page_loading: true,
      table_loading: false,
      lineId: this.$route.query.lineId,
      dataArr: [],
      fileUrl: "",
      orderNotice: "", //预定说明
      feature: "", //特色线路
      themeStr: "",
      endCities: "",
      costDescription: "",
      detailInfo: {},
      productInfo: [],
      linePackageId: "",
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      }
    };
  },
  methods: {
    //审核
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
            productId: this.$route.query.lineId
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.auditLoading = false;
              this.$message({
                type: "success",
                message: "审核成功"
              });
              this.$router.push({ path: "/grouptour/unauditedProduct" });
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
  },
  mounted() {
    this.groupHttp.get(
        "ResourcePlatform/GetLineDetailForUTour?lineCode=" +
          this.$route.query.lineCode
      )
      .then(res => {
        this.promotionFeeClassify = res.data.item.promotionFeeClassify
        if(this.promotionFeeClassify == 1){
          this.promotionFee1 = res.data.item.promotionFee;
        }else{
          this.promotionFee2 = res.data.item.promotionFee;
        }
        res.data.item.imgCode = res.data.item.imgCode ? res.data.item.imgCode.split(",") : [];
        this.detailInfo = res.data.item;
        this.page_loading = false;
      })
      .catch(e => {
        this.page_loading = false;
        console.log(e);
      });
  }
};
</script>

<style lang="scss" scoped>
.detailspan {
  font-weight: bold;
  margin-left: 8px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px !important;
}
.myimg {
  display: inline-block;
  width: 130px;
  height: 130px;
  border: 1px solid black;
}
.spanmargin {
  margin-left: 30px;
  .title-style{
      color:#409EFF;font-weight: bold;font-size:20px;
  }
}
tr:hover {
  background: #f8f8ff;
  padding: 0;
  cursor: pointer;
}
.pagination {
  position: absolute;
  top: -20px !important;
  right: 30px;
}
</style>
