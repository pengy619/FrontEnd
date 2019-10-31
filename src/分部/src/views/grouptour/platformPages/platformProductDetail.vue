<template>
  <div class="view" v-loading="page_loading">
    <h4>
      <span class="vercitals">|</span>线路信息
      <el-button
        type="primary"
        size="small"
        style="position:absolute;right:50px;top:35px;"
        icon="el-icon-download"
      >
        <a :href="fileUrl" style="color:#fff">下载行程信息</a>
      </el-button>
    </h4>
    <el-form>
      <el-form-item label="线路名称" size="small" label-width="120px">
        <span class="spanmargin">
          {{detailInfo.productName}}
          <span>（线路编号：{{detailInfo.lineCode}}）</span>
        </span>
      </el-form-item>
      <el-form-item label="线路类型" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.lineType}}</span>
      </el-form-item>
      <el-form-item label="行程总天数" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.tripDays}}天</span>
      </el-form-item>
      <!-- <el-form-item label="确认规则" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.confirmType}}</span>
      </el-form-item>-->
      <el-form-item label="供应商" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.supplierName}}</span>
      </el-form-item>
      <el-form-item label="出发/抵达" size="small" style="height:40px" label-width="120px">
        <span class="spanmargin">{{detailInfo.startCity}}/{{endCities}}</span>
      </el-form-item>
      <el-form-item label="线路主题" size="small" style="height:40px" label-width="120px">
        <span class="spanmargin">{{themeStr}}</span>
      </el-form-item>
      <el-form-item label="线路图片" size="small" label-width="120px">
        <img
          class="myimg spanmargin"
          v-for="(item,index) in detailInfo.linePictures"
          :key="index"
          :src="item"
        >
      </el-form-item>
      <el-form-item label="线路套餐" size="small" label-width="120px">
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
      </el-form-item>
      <el-form-item class="margin_top">
        <el-table
          :data="productInfo"
          size="small"
          style="width:96%;margin-left:50px;"
          height="300"
          :loading="table_loading"
        >
          <el-table-column prop="playDay" label="出团日期" size="small" align="center"></el-table-column>
          <el-table-column prop="adultPrice" label="成人价" size="small" align="center"></el-table-column>
          <el-table-column prop="oldManPrice" label="老人价" size="small" align="center"></el-table-column>
          <el-table-column prop="childBedPrice" label="儿童占位" size="small" align="center"></el-table-column>
          <el-table-column prop="childNoBedPrice" label="儿童不占位" size="small" align="center"></el-table-column>
          <el-table-column prop="actualInventory" label="库存" size="small" align="center"></el-table-column>
          <!-- <el-table-column label="操作" size="small" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="cashOrderdetail(scope.row)">下单</el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
      <el-form-item>
        <el-tabs style="margin-top:20px;width:96%;margin-left:50px" type="border-card">
          <el-tab-pane label="特色线路">
            <el-form>
              <template>
                <div v-html="feature"></div>
              </template>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="行程信息">
            <template>
              <div v-for="(item,index) in detailInfo.lineTripList" :key="index">
                <span class="mysapn">
                  <span class="verticals">|</span>
                  第{{item.tripDay}}天
                </span>
                <hr>
                <el-form>
                  <el-form-item label="行程" size="small" label-width="120px">
                    <span class="spanmargin">{{item.shopping}}</span>
                  </el-form-item>
                  <el-form-item label="用餐" size="small" label-width="120px">
                    <span class="spanmargin">{{item.cateringStr}}</span>
                  </el-form-item>
                  <el-form-item label="酒店" size="small" label-width="120px">
                    <span class="spanmargin">{{item.hotel}}</span>
                  </el-form-item>
                  <el-form-item label="行程内容" size="small" label-width="120px">
                    <div v-html="item.tripDescription" style="margin-left:30px;"></div>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="费用说明">
            <template>
              <div
                style="display:inline-block;width:100%;"
                class="spanmargin"
                v-html="costDescription"
              ></div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="预订须知">
            <el-form>
              <template>
                <div v-html="orderNotice"></div>
              </template>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="同行须知">
            <div v-html="detailInfo.peerNotice" style="margin-left:30px;"></div>
          </el-tab-pane>
           <el-tab-pane label="行程预览" v-if="isPDF">
              <template>
               <iframe style="width:100%;height:640px" :src="fileUrl"></iframe>
              </template>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline" size="small" v-if="this.$route.query.isAudit">
      <el-form-item label="推广费">
        <el-radio v-model="promotionFeeClassify" :label="1">按比例</el-radio>
        <el-input-number v-model="promotionFee1" style="width:160px" :min="0" :max="100" :disabled="promotionFeeClassify ==2"></el-input-number>
        <span style="margin-right:20px;">%</span>
        <el-radio v-model="promotionFeeClassify" :label="2">按人头</el-radio>
        <el-input-number v-model="promotionFee2" style="width:160px" :disabled="promotionFeeClassify ==1" :min="0" :max="9999999"></el-input-number>
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
      isPDF:false,
      promotionFeeClassify:'',
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
      detailInfo: {
        confirmType: "",
        enumConfirmType: "",
        enumGroupLineMode: "",
        startCity: "",
        lineAttachments: [{ attachmentName: "", attachmentUrl: "" }],
        lineBookingDescs: [{ bookingName: "", bookingDesc: "" }],
        lineCode: "",
        lineMode: "",
        lineName: "",
        linePictures: [],
        linePackageList: [],
        lineType: "",
        peerNotice: "",
        lineTripList: [],
        tripDays: ""
      },
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
      let promotionFee
      if(this.promotionFeeClassify == 1){
        promotionFee = this.promotionFee1;
      }else{
         promotionFee = this.promotionFee2;
      }
     if(promotionFee!=undefined){
       this.groupHttp
        .post("ResourcePlatform/LineOnSale", {
          PromotionFeeClassify:this.promotionFeeClassify,
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
     }else{
       this.auditLoading = false;
       this.$message.error('推广费不能为空');
     }
    },
    //查询数据
    queryData(packageId, size, index) {
      this.table_loading = true;
      this.groupHttp
        .post("ResourcePlatform/LinePriceDetail", {
          lineId: this.$route.query.lineId,
          packageId: packageId,
          Page: index,
          PageSize: size
        })
        .then(res => {
          if(res.data.data){
            res.data.data.forEach(obj => {
            let date = new Date(obj.playDay);
            obj.playDay = dateFmt(date, "yyyy-MM-dd");
            });
          }
          this.productInfo = res.data.data;
          this.table_loading = false;
          this.pagination.total = res.data.totalCount;
          setTimeout(() => {
            this.table_loading = false;
          }, 500);
        })
        .catch(e => {
          console.log(e);
        });
    },
    //出发地城市变更
    cityChange(val) {
      this.queryData(val, 10, 1);
      this.dataArr.ProductId = val;
      this.detailInfo.linePackageList.forEach((item, index) => {
        if (item.packageId == val) {
          this.dataArr.SourceCityName = item.cityName;
        }
      });
    },
    //分页
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(
        this.linePackageId,
        this.pagination.size,
        this.pagination.currentPage
      );
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(
        this.linePackageId,
        this.pagination.size,
        this.pagination.currentPage
      );
    },
    // cashOrderdetail(data) {
    //   this.$router.push({
    //     path: "/sellcenter/reservationLine",
    //     query: {
    //       productId: this.lineId,
    //       dateOne: data.playDay,
    //       linePackageId: this.linePackageId
    //     }
    //   });
    // },
    getPopoer(row) {
      //console.log(row);
    }
  },
  mounted() {
    this.groupHttp
      .post("ResourcePlatform/LineDetail", {
        lineId: this.lineId
      })
      .then(res => {
        // if (res.data.isSuccess == true) {
        // res.data.productInfo.objects.forEach(obj => {
        //   let date = new Date(obj.teamDate);
        //   obj.teamDate = dateFmt(date, "yyyy-MM-dd");
        // });
        // this.productInfo = res.data.productInfo.objects;
        this.promotionFeeClassify = res.data.promotionFeeClassify
        if(res.data.promotionFeeClassify == 1){
          this.promotionFee1 = res.data.promotionFee;
        }else{
          this.promotionFee2 = res.data.promotionFee;
        }
        this.detailInfo.productName = res.data.productName;
        this.detailInfo.lineCode = res.data.productNo;
        this.detailInfo.lineType = res.data.productCateName;
        this.detailInfo.tripDays = res.data.days;
        this.detailInfo.supplierName = res.data.supplierName;
        this.fileUrl = res.data.file;
        this.orderNotice = res.data.orderNotice;
        this.isPDF = res.data.file ? res.data.file.indexOf('.pdf')> 0 : false;
        this.feature = res.data.feature;
        this.themeStr = res.data.themeStr;
        this.endCities = res.data.endCities;
        this.costDescription = res.data.costDescription;
        this.detailInfo.lineTripList = res.data.lineTripList;
        this.detailInfo.startCity = res.data.startCity;
        this.detailInfo.linePictures = res.data.imageList;
        this.detailInfo.linePackageList = res.data.linePackageList;
        this.detailInfo.peerNotice = res.data.peerNotice;
        this.dataArr.groupLineTypeName = this.productCateName;
        this.dataArr.lineCode = this.detailInfo.lineCode;
        this.dataArr.lineId = this.lineId;
        this.dataArr.teamNo = this.$route.query.teamNo;
        this.linePackageId = res.data.linePackageList[0]
          ? res.data.linePackageList[0].packageId
          : "";
        this.dataArr.ProductId = this.linePackageId;
        this.queryData(this.linePackageId, 10, 1);
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
