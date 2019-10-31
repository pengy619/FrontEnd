<template>
  <div class="view" v-loading="page_loading">
    <span class="mysapn">
      <span class="verticals">|</span>线路信息
    </span>
    <el-popover ref="downinfomation" palcement="left" trigger="click">
      <table style="width:200px;padding:0px; margin:none;border:none;font-size:12px;">
        <tr
          style="line-height:36px;"
          v-for="(item,index) in detailInfo.lineAttachments"
          :key="index">
          <td style=" border-bottom:1px solid gainsboro;padding:0 10px">
            <a :download='item.attachmentName' :href="item.attachmentUrl">{{item.attachmentName}}</a>
          </td>
        </tr>
      </table>
    </el-popover>
    <el-button
      type="primary"
      size="small"
      style="position:absolute;right:50px"
      icon="el-icon-download"
      v-popover:downinfomation>下载行程信息</el-button>
    <hr>
    <el-form>
      <el-form-item label="线路名称" size="small" label-width="120px">
        <span class="spanmargin">
          {{detailInfo.lineName}}
          <span>（线路编号：{{detailInfo.lineCode}}）</span>
        </span>
      </el-form-item>
      <el-form-item label="线路类型" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.lineType}}</span>
      </el-form-item>
      <el-form-item label="组团方式" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.lineMode}}</span>
      </el-form-item>
      <el-form-item label="行程总天数" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.tripDays}}</span>
      </el-form-item>
      <el-form-item label="确认规则" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.confirmType}}</span>
      </el-form-item>
      <el-form-item label="供应商" size="small" label-width="120px">
        <span class="spanmargin">{{detailInfo.supplierName}}</span>
      </el-form-item>
      <el-form-item label="集合地点" size="small" style="height:40px" label-width="120px">
        <span class="spanmargin">{{detailInfo.gatherAddressDesc}}</span>
      </el-form-item>
      <el-form-item label="线路图片" size="small" label-width="120px">
        <img
          class="myimg spanmargin"
          v-for="(item,index) in detailInfo.linePictures"
          :key="index"
          :src="item"
        >
      </el-form-item>
      <el-form-item label="出发地" size="small" label-width="120px">
        <el-select class="spanmargin" placeholder="请选择" v-model="lineCityId" @change="cityChange">
          <el-option
            v-for="(item,index) in detailInfo.lineSourceCities"
            :key="index"
            :label="item.cityName"
            :value="item.productId"
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
          <el-table-column prop="teamDate" label="出团日期" size="small" align="center"></el-table-column>
          <el-table-column prop="price" label="成人价" size="small" align="center"></el-table-column>
          <el-table-column prop="oldPrice" label="老人价" size="small" align="center"></el-table-column>
          <el-table-column prop="childPrice" label="儿童价" size="small" align="center"></el-table-column>
          <!--<el-table-column prop="babyPrice" label="婴儿价"  size="small" align="center" ></el-table-column>-->
          <el-table-column label="操作" size="small" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="cashOrderdetail(scope.row)"
                :disabled="!scope.row.isSetOrder"
              >下单</el-button>
            </template>
          </el-table-column>
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
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </el-form-item>
      <div v-if="subentrylist.length>0">
        <span class="mysapn">
          <span class="verticals">|</span>小项目
        </span>
        <el-form-item>
          <el-row
            :gutter="24"
            style="width:1000px;margin-left:20px;"
            v-for="(item,index) in subentrylist"
            :key="index"
          >
            <el-col :span="24">
              <el-checkbox
                size="small"
                v-model="item.isCheck"
                :label="item.isCheck"
              >{{item.smallItemsName}}</el-checkbox>
            </el-col>

            <el-row style="margin-left:30px">
              <el-col :span="6">
                <el-form-item label="直客销售价" label-width="120px">
                  <el-input
                    size="small"
                    type="number"
                    v-model="item.marketPrice"
                    :disabled="true"
                  >50</el-input>
                </el-form-item>

                <el-form-item label="同行结算价" label-width="120px">
                  <el-input
                    size="small"
                    type="number"
                    v-model.number="item.toPrice"
                    :disabled="true"
                  >50</el-input>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="6">
                                <el-form-item label='媒体外卖价'  label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.customerPrice" :disabled="true">50</el-input>
                                </el-form-item>
                               <el-form-item label='加盟结算价' label-width='100px'>
                                    <el-input size='small' type='number' v-model="item.franchiseSettlementPrice"  :disabled="true">50</el-input>
                                </el-form-item>
                            </el-col>
                        
                            <el-col :span="6">
                                <el-form-item label='同行价' label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.peerPrice"  :disabled="true">50</el-input>
                                </el-form-item>
                                <el-form-item label='内部价' label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.internalPrice" :disabled="true">50</el-input>
                                </el-form-item>
              </el-col>-->
            </el-row>
          </el-row>
        </el-form-item>
        <el-form-item label="小项目说明" label-width="100px">
          <el-input type="textarea" v-model="instructions" size="small"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-tabs style="margin-top:20px;width:96%;margin-left:50px" type="border-card">
          <el-tab-pane label="行程信息">
            <template>
              <div v-for="(item,index) in detailInfo.routes" :key="index">
                <span class="mysapn">
                  <span class="verticals">|</span>
                  {{item.routeTitle}}
                </span>
                <hr>
                <el-form>
                  <el-form-item label="行程" size="small" label-width="120px">
                    <span class="spanmargin">{{item.routeName}}</span>
                  </el-form-item>
                  <el-form-item label="交通" size="small" label-width="120px">
                    <span class="spanmargin">{{item.traffic}}</span>
                  </el-form-item>
                  <el-form-item label="用餐" size="small" label-width="120px">
                    <span class="spanmargin">{{item.mealInfo}}</span>
                  </el-form-item>
                  <el-form-item label="酒店" size="small" label-width="120px">
                    <span class="spanmargin">{{item.hotel}}</span>
                  </el-form-item>
                  <el-form-item label="城市" size="small" label-width="120px">
                    <span class="spanmargin">{{item.cityName}}</span>
                  </el-form-item>
                  <el-form-item label="行程内容" size="small" label-width="120px">
                    <!-- <span class="spanmargin">{{item.routeDesc}}</span> -->
                    <div v-html="item.routeDesc" style="margin-left:30px;"></div>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="预订说明">
            <el-form>
              <template>
                <el-form-item
                  :label="item.bookingName"
                  size="small"
                  label-width="150px"
                  v-for="(item,index) in detailInfo.lineBookingDescs"
                  :key="index"
                >
                  <div v-html="item.bookingDesc"></div>
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="特殊人群限制">
            <div>
              <template>
                <span
                  style="display:inline-block;width:100%;"
                  class="spanmargin"
                  v-for="(item,index) in detailInfo.groupLineExceptionals"
                  :key="index"
                >{{index+1}}.{{item}}</span>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="退款说明">
            <div v-html="detailInfo.refundDesc" style="margin-left:30px;"></div>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFmt } from "../../utils/tools.js";
export default {
  data() {
    return {
      lineData: this.$route.query,
      page_loading: true,
      table_loading: false,
      lineId: this.$route.query.lineId,
      dataArr: [],
      subentrylist: [], //增加的小项目 显示
      instructions: "", //小项目说明 显示
      detailInfo: {
        confirmType: "",
        enumConfirmType: "",
        enumGroupLineMode: "",
        gatherAddressDesc: "",
        groupLineExceptionals: [""],
        lineAttachments: [{ attachmentName: "", attachmentUrl: "" }],
        lineBookingDescs: [{ bookingName: "", bookingDesc: "" }],
        lineCode: "",
        lineMode: "",
        lineName: "",
        linePictures: [""],
        lineSourceCities: [{ productId: "", cityName: "" }],
        lineType: "",
        refundDesc: "",
        routes: [
          {
            routeTitle: "",
            routeName: "",
            traffic: "",
            mealInfo: "",
            hotel: "",
            cityName: "",
            routeDesc: ""
          }
        ],
        tripDays: ""
      },
      productInfo: [
        { teamDate: "", price: "", oldPrice: "", childPrice: "", babyPrice: "" }
      ],
      lineCityId: "",
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      }
    };
  },
  methods: {
    //查询数据
    queryData(productId, size, index) {
      this.table_loading = true;
      this.shopHttp
        .get(
          "GroupLine/GetGroupLineProductDetail?ProductId=" +
            productId +
            "&PageSize=" +
            (size || 10) +
            "&PageIndex=" +
            (index || 1)
        )
        .then(res => {
          // console.log(res);
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(obj => {
              let date = new Date(obj.teamDate);
              obj.teamDate = dateFmt(date, "yyyy-MM-dd");
              // console.log(obj.teamDate);
            });
            this.productInfo = res.data.objects;
            this.table_loading = false;
            this.pagination.currentPage = index || 1;
          } else {
            this.$message({
              type: "info",
              message: "出错了!" + res.data.message
            });
            setTimeout(() => {
              this.table_loading = false;
            }, 500);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //出发地城市变更
    cityChange(val) {
      this.queryData(val, 10, 1);
      this.dataArr.ProductId = val;
      this.detailInfo.lineSourceCities.forEach((item, index) => {
        if (item.productId == val) {
          this.dataArr.SourceCityName = item.cityName;
        }
      });
    },
    //分页
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(
        this.lineCityId,
        this.pagination.size,
        this.pagination.currentPage
      );
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(
        this.lineCityId,
        this.pagination.size,
        this.pagination.currentPage
      );
    },
    cashOrderdetail(data) {
      this.lineData.ProductId = this.lineCityId;
      this.lineData.dateTeamDate = data.teamDate;
      this.$router.push({ name: "baoming", query: this.lineData });
    },
    getPopoer(row) {
      //console.log(row);
    },
    getSubentrylist() {
      //获取小项目名称
      var _this = this;
      //  http://172.16.2.24:82/GroupLineSmallItemSupplier/PartGroupLineSmallItem?Id=0&LineId=1098  this.lineId
      _this.shopHttp
        .get(
          "/GroupLineSmallItemShop/PartGroupLineSmallItem?Id=0&LineId=" +
            this.lineId
        )
        .then(res => {
          // console.log(res);
          if (res.data.isSuccess) {
            _this.instructions =
              res.data.partGroupLineSmallItemPriceDto.instructions;
            _this.subentrylist =
              res.data.partGroupLineSmallItemPriceDto.smallItemPriceList;
            // _this.subentrylist = res.data.objects;
            // console.log(_this.subentrylist);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.shopHttp
      .get("GroupLine/GetGroupLineDetail?LineId=" + this.lineId)
      .then(res => {
        //console.log(res)
        if (res.data.isSuccess == true) {
          this.detailInfo = res.data.detailInfo;
          res.data.productInfo.objects.forEach(obj => {
            let date = new Date(obj.teamDate);
            obj.teamDate = dateFmt(date, "yyyy-MM-dd");
          });
          this.productInfo = res.data.productInfo.objects;
          this.dataArr.fullName = this.detailInfo.lineName;
          this.dataArr.groupLineTypeName = this.detailInfo.lineType;
          this.dataArr.lineCode = this.detailInfo.lineCode;
          this.dataArr.lineId = this.lineId;
          this.dataArr.teamNo = this.$route.query.teamNo;
          this.pagination.total = res.data.productInfo.total;
          this.lineCityId = res.data.detailInfo.lineSourceCities[0]
            ? res.data.detailInfo.lineSourceCities[0].productId
            : "";
          this.dataArr.ProductId = this.lineCityId;
          this.detailInfo.lineSourceCities.forEach((item, index) => {
            if (item.productId == this.lineCityId) {
              this.dataArr.SourceCityName = item.cityName;
            }
          });
          this.page_loading = false;
        } else {
          this.$message({
            type: "info",
            message: "出错了!" + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    this.getSubentrylist();
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
