<template>
    <div class="page">
        <cube-scroll :options="options" :scroll-events="['scroll']" @pulling-down="onPullingDown"    ref="scroll">
            <div class="line-detail-wrap">
                <div class="line-detail-banner">
                    <div class="back" @click="goBack"><van-icon name="arrow-left" /></div>
                    <van-swipe :autoplay="3000" :show-indicators="false" @change="slideChange" :touchable='false'>
                        <van-swipe-item v-for="(item, index) in details.groupLinePictures" :key="index">
                            <img :src="item.path" @click="imgPreview"/>
                        </van-swipe-item>
                    </van-swipe>
                    <span class="banner-pageNum" v-cloak>{{banner.activeIndex}}/{{details.groupLinePicturesCount}}</span>
                </div>
                <div class="line-title-info">
                    <div class="line-name">
                        {{details.lineName}}
                    </div>
                    <div class="line-booking-btn">
                        <div>
                            <span class="price">￥<span class="font-size-18">{{details.priceDisplay||'--'}}</span></span><span class="font-size-12 font-grey">起</span>
                            <del class="font-grey font-size-12">￥{{details.outPriceDisplay||'--'}}元</del>
                        </div>
                    </div>
                </div>
                <div class="desc-box desc-box1">
                    <div class="desc-title">
                        — <span class="desc-title1">产品经理推荐</span> —
                    </div>
                    <div class="desc-content jingdian">
                        <p>{{details.recommendDesc||'无'}}</p>
                    </div>
                </div>
                <van-tabs @click="handleChangeTab" class="tab-list">
                    <van-tab title="其他费用">
                        <div class="desc-box">
                            <div class="desc-content" v-for="(item,key) in details.groupLineSmallItemPrices" :key="key">
                                <p :class="key>0?'mar-t-10':''">{{item.smallItemsName}}:<span class="ylt-text-price">{{item.marketPrice||'--'}}</span>元</p>
                            </div>
                            <div class="desc-content" v-show="smallItemLen==0">
                                <p>无</p>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="行程说明">
                        <div class="tour-plan-warn">* 以下行程仅供参考，最终行程可能会根据实际情况进行微调，敬请以签约行程为准。 </div>
                        <div class="desc-box tour-plan">
                            <div class="desc-content" ref="xingcheng">
                                <div class="tour-item" v-for="(item,key) in details.groupLineRoutes" :style="{'padding-top':key>0?'.12rem':''}" :key="key">
                                    <div class="tour-day">
                                        <span class="day-title">{{item.routeTitle}}</span>
                                    </div>
                                    <div class="top-box">
                                        <!-- <span class="title">{{item.routeTitle}}</span> -->
                                        <div class="route-name">
                                            {{item.routeName}}
                                        </div>
                                        <div class="content-desc">
                                            <span v-html="item.tickets"></span>
                                            <!-- <span v-html="test"></span> -->
                                        </div>
                                    </div>
                                    <div class="tour-content">
                                        <div class="content-item">
                                            <div class="item-title">
                                                <van-icon name="gift" /> 交通
                                            </div>
                                            <div class="item-desc">
                                                <p>{{item.trafficArrStr||'无'}}</p>
                                            </div>
                                        </div>
                                        <div class="content-item">
                                            <div class="item-title">
                                                <van-icon name="gift" /> 酒店
                                            </div>
                                            <div class="item-desc">
                                                <p>{{item.hotels||'无'}}</p>
                                            </div>
                                        </div>
                                        <div class="content-item">
                                            <div class="item-title">
                                                <van-icon name="gift" /> 餐饮
                                            </div>
                                            <div class="item-desc">
                                                <p>{{item.mealInfoStr||'无'}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="注意事项">
                        <div class="desc-box">
                            <div class="desc-content">
                                <template v-for="item in details.groupLineBookingDescs">
                                    <p>{{item.bookingName}}</p>
                                    <div v-html="item.bookingDesc">
                                    </div>
                                </template>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </cube-scroll>
        <div class="fixed-btn">
            <button class="ui-button orange full"  @click="handleBooking">预定</button>
        </div>
    </div>
</template>

<script>
import { ImagePreview } from "vant";
import event from "@/vuex/eventCenter";
import { Style, Scroll } from "cube-ui";
export default {
  name: "GroupLineDetail",
  components: {
    cubeScroll: Scroll
  },
  data() {
    return {
      img: [],
      options: {
        pullDownRefresh: {
          threshold: 90,
          stop: 40,
          txt: "刷新成功"
        }
      },
      tabList: ["其他费用", "行程说明", "注意事项"],
      banner: {
        activeIndex: 1
      },
      details: {},
      GoDate: "",
      params: {
        BranchId: this.$route.query.BranchId,
        EnumGroupLineType: this.$route.query.EnumGroupLineType,
        LineId: this.$route.query.LineId,
        CommunityShopId: this.$route.query.CommunityShopId
      },
      trafficList: {
        "1": "大巴",
        "2": "火车",
        "4": "高铁",
        "8": "动车",
        "16": "飞机",
        "32": "自备车",
        "64": "渡船"
      },
      mealList: {
        "1": "早餐",
        "2": "午餐",
        "4": "晚餐"
      },
      groupLineBookingDesc: "",
      smallItemLen: 0,
      test: ""
    };
  },
  mounted() {
    this.$toast.loading({ duration: 0, mask: true });
    this.queryData();
    event.$emit("header", {
      show: false
    });
  },
  methods: {
    imgPreview() {
      ImagePreview({
        images: this.img
      });
    },
    handleChangeTab() {},
    slideChange(index) {
      this.banner.activeIndex = index + 1;
    },
    goBack() {
      this.$router.go(-1);
    },
    handleBooking() {
      if (localStorage.getItem("token")) {
        this.$router.push({
          name: "GroupLineChoiceDate",
          query: {
            LineId: this.params.LineId,
            BranchId: this.params.BranchId,
            EnumGroupLineType: this.params.EnumGroupLineType,
            StartDate: this.GoDate,
            CommunityShopId: this.params.CommunityShopId
          }
        });
      } else {
        this.$router.push({
          name: "Login",
          query: {
            BranchId: this.params.BranchId,
            CommunityShopId: this.params.CommunityShopId
          }
        });
      }
    },
    queryData() {
      let _this = this;
      this.http
        .get(
          "/GroupLine/GetGroupLineDetailH5?BranchId=" +
            this.params.BranchId +
            "&EnumGroupLineType=" +
            this.params.EnumGroupLineType +
            "&LineId=" +
            this.params.LineId
        )
        .then(res => {
          if (res.data.isSuccess) {
            this.details = res.data.objects[0];
            this.details.groupLinePictures.forEach((item, index) => {
              this.img.push(item.path);
            });
            this.GoDate = this.details.goDate.split("T")[0];
            this.SourceCityName = this.details.sourceCityName;
            if (this.details.groupLineBookingDescs.length > 0) {
              this.groupLineBookingDesc = this.details.groupLineBookingDescs[0].bookingDesc;
            }
            this.smallItemLen = this.details.groupLineSmallItemPrices.length;
            this.details.groupLineRoutes.forEach(function(item) {
              item.mealInfoStr = "";
              item.trafficArrStr = "";
              if (item.returnMealInfo != null) {
                var mealArr = item.returnMealInfo.split(",");
                mealArr.splice(mealArr.indexOf(""), 1);
                mealArr.forEach(function(item1, index) {
                  if (index > 0) {
                    item.mealInfoStr += " " + _this.mealList[item1];
                  } else {
                    item.mealInfoStr += _this.mealList[item1];
                  }
                });
              } else {
                item.mealInfoStr = "无";
              }
              if (item.returnTraffic != null) {
                let trafficArr = item.returnTraffic.split(",");
                trafficArr.splice(trafficArr.indexOf(""), 1);
                trafficArr.forEach(function(item1, index) {
                  if (index > 0) {
                    item.trafficArrStr += " " + _this.trafficList[item1];
                  } else {
                    item.trafficArrStr += _this.trafficList[item1];
                  }
                });
              } else {
                item.trafficArrStr = "无";
              }
            });
            this.$nextTick(() => {
              this.$refs.xingcheng.querySelectorAll("img").forEach(img => {
                img.style.width = "100%";
              });
            });
          } else {
            // this.$dialog.toast({mes:resdata.message, icon:'none',timeout: 2000});
          }
          this.$toast.clear();
        });
    },
    onPullingDown() {
      this.queryData();
      this.$refs.scroll.forceUpdate();
    }
  }
};
</script>

<style scoped lang=scss>
@import "../../style/theme.scss";
.page {
  margin-top: 0;
}
.line-detail-wrap {
  .line-detail-banner {
    position: relative;
  }
  .van-swipe {
    height: 2.2rem;
    img {
      width: 100%;
      min-height: 2.2rem;
    }
  }
  .banner-pageNum {
    position: absolute;
    bottom: 0.15rem;
    right: 0.15rem;
    z-index: 2;
    font-size: 0.16rem;
    color: #fff;
  }
  .back {
    width: 0.33rem;
    height: 0.33rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    position: absolute;
    left: 0.15rem;
    top: 0.15rem;
    z-index: 2;
    text-align: center;
    color: #fff;
    i {
      font-size: 0.16rem;
      line-height: 0.33rem;
    }
  }
  .line-title-info {
    padding: 0.1rem;
    background-color: #fff;
    .line-name {
      margin-bottom: 0.1rem;
      /* max-height: .4rem;
                line-height: .2rem;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical; */
    }
    .line-booking-btn {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }
  }
  .desc-box {
    padding: 0.1rem;
    background-color: #fff;
  }
  .desc-box1 {
    margin: 0.08rem 0;
  }
  .desc-title {
    text-align: center;
    font-size: 0.16rem;
    color: #e5e5e5;
    .desc-title1 {
      color: #666;
    }
  }
  .desc-content.jingdian {
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.1rem;
    color: #666;
  }

  .tour-plan-warn {
    padding: 0.15rem 0.1rem;
    background-color: #f5f5f5;
  }
  .tab-list {
    padding-bottom: 0.4rem;
  }
  .tour-plan {
    padding: 0 0.1rem 0.1rem;
    .tour-day {
      margin: 0 -0.1rem;
      border-top: 2px solid $theme-orange1;
      .day-title {
        position: relative;
        display: inline-block;
        height: 0.24rem;
        line-height: 0.24rem;
        padding: 0 0.05rem 0 0.15rem;
        background-color: $theme-orange1;
        color: #fff;
        &:after {
          position: absolute;
          content: "";
          right: -0.2rem;
          top: 0;
          border-width: 0.12rem 0.1rem;
          border-style: solid;
          border-color: $theme-orange1 transparent transparent $theme-orange1;
        }
      }
    }
    .tour-item {
      .top-box {
        .route-name {
          margin: 0.1rem 0;
          font-size: 0.16rem;
          color: #333;
          text-align: center;
        }
        .content-desc {
          margin: 0.1rem 0;
          line-height: 1.5;
          img {
            max-width: 100% !important;
          }
        }
      }
      .tour-content {
        border-left: 1px solid #eee;
        margin-left: 0.15rem;
        padding-left: 0.2rem;
        position: relative;
        .content-title {
          text-align: center;
          padding: 0.1rem 0;
          font-size: 0.15rem;
          margin-bottom: 0.1rem;
          span {
            background: #f5f5f5;
            padding: 0.05rem 0.15rem;
            border-radius: 0.15rem;
          }
        }
        .content-item {
          margin-top: 0.1rem;
          margin-left: -0.28rem;
          .item-title {
            color: #333;
            font-size: 0.15rem;
            i {
              margin-right: 0.1rem;
              color: #999;
            }
          }
          .item-desc {
            color: #999;
            padding-left: 0.3rem;
            text-indent: 0;
            p {
              margin-top: 0.1rem;
              font-size: 0.12rem;
              text-indent: 0;
            }
          }
        }
      }
    }
  }
}
.fixed-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  .ui-button {
    border-radius: 0;
  }
}
.content-desc {
  margin: 0.1rem 0;
  line-height: 1.5;
  img {
    max-width: 100% !important;
  }
}
</style>
