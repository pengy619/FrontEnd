<template>
    <div class="view" v-loading="page_loading">
        <h4>线路信息</h4>
        <el-popover ref="downinfomation" palcement="left" trigger="click">
            <table style="width:200px;padding:0px; margin:none;border:none;font-size:12px;">
                <tr style="line-height:36px;" v-for="(item,index) in detailInfo.lineAttachments" :key="index"><td style=" border-bottom:1px solid gainsboro;padding:0 10px"><a :href='item.attachmentUrl' download=''>{{item.attachmentName}}</a></td></tr>
            </table>
        </el-popover>
        <el-button type="primary" size="small" class="button-download" icon="el-icon-download" v-popover:downinfomation>下载行程信息</el-button>
        
        <el-form>
          <el-form-item label="线路名称" size="small" label-width="120px">
              <span class="spanmargin">{{detailInfo.lineName}}<span>（线路编号：{{detailInfo.lineCode}}）</span></span>
          </el-form-item>
           <el-form-item label="线路类型" size="small"  label-width="120px">
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
           <el-form-item label="集合地点" size="small" style="height:40px"  label-width="120px">
               <span class="spanmargin">
                   {{detailInfo.gatherAddressDesc}}
               </span>
          </el-form-item>
           <el-form-item label="线路图片" size="small"  label-width="120px">
              <img class="myimg spanmargin" v-for="(item,index) in detailInfo.linePictures" :key="index" :src='item' />
          </el-form-item>
         <!-- <el-form-item label="出发地" size="small"  label-width="120px">
              <el-select class="spanmargin" placeholder="请选择" v-model="lineCityId" @change = 'cityChange'>
                  <el-option v-for="(item,index) in detailInfo.lineSourceCities" :key="index" :label="item.cityName" :value='item.productId'></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-table :data="productInfo"  size="small" style="width:96%;margin-left:50px;" height="300" :loading = 'table_loading'>
                  <el-table-column prop="teamDate" label="出团日期" size="small" align="center" ></el-table-column>
                  <el-table-column prop="price" label="成人价" size="small" align="center"></el-table-column>
                  <el-table-column prop="oldPrice" label="老人价" size="small" align="center" ></el-table-column>
                  <el-table-column prop="childPrice" label="儿童价" size="small" align="center" ></el-table-column>
                  <el-table-column prop="babyPrice" label="婴儿价"  size="small" align="center" ></el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item>
              <div class="pagination">
                    <el-pagination
                        fixed="right"
                        :data = 'pagination'
                        @size-change="sizeChange"
                        @current-change="currentPageChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="pagination.sizes"
                        :page-size="pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>

          </el-form-item> -->
           <el-row v-if="subentrylist.length!=0"> 
                <span class="mysapn"><span class="verticals">| </span>小项目</span>
            <el-form-item>
                    <el-row :gutter="24" v-for="(item,index) in subentrylist" :key="index">
                        <el-col :span="24" style="margin-left:50px;">
                            <el-checkbox size='small' v-model="item.isCheck" :label="item.isCheck">{{item.smallItemsName}}</el-checkbox>
                        </el-col>
                        <el-row style="margin-left:50px;">
                            <el-col :span="7">
                                <el-form-item label='媒体外卖价'  label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.customerPrice" :disabled="false">50</el-input>
                                </el-form-item>
                                <el-form-item label='直客销售价' label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.marketPrice" :disabled="false">50</el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <!-- <el-form-item label='加盟结算价' label-width='100px'>
                                    <el-input size='small' type='number' v-model="item.franchiseSettlementPrice"  :disabled="false">50</el-input>
                                </el-form-item> -->
                                <el-form-item label='同行结算价' label-width='100px'>
                                    <el-input size='small' type='number' v-model.number="item.toPrice" :disabled="false">50</el-input>
                                </el-form-item>
                            </el-col>
                             <!--<el-col :span="7">
                                <el-form-item label='同行价' label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.peerPrice"  :disabled="false">50</el-input>
                                </el-form-item>
                                <el-form-item label='内部价' label-width='80px'>
                                    <el-input size='small' type='number' v-model="item.internalPrice" :disabled="false">50</el-input>
                                </el-form-item>
                            </el-col> -->
                        </el-row>
                    </el-row>
            </el-form-item>
                <el-form-item label='小项目说明' label-width='140px'>
                    <el-input type='textarea' v-model="instructions" size='small'></el-input>
                </el-form-item>
        </el-row>
          <el-form-item>
                <el-tabs style="margin-top:20px;width:96%;margin-left:50px" type="border-card">
                    <el-tab-pane label="行程信息">
                         <template>
                             <div v-for='(item,index) in detailInfo.routes' :key='index'>
                                 <span class="mysapn"><span class="verticals">| </span> {{item.routeTitle}}</span>
                                  <hr/>
                                  <el-form>
                                      <el-form-item label="行程" size="small" label-width="120px">
                                          <span class="spanmargin">{{item.routeName}}</span>
                                      </el-form-item>
                                      <el-form-item label="交通" size="small"  label-width="120px">
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
                                          <div v-html='item.routeDesc' style='margin-left:30px;'></div>
                                      </el-form-item>
                                  </el-form>
                             </div>
                         </template>
                    </el-tab-pane>
                    <el-tab-pane label="预订说明">
                        <el-form>
                            <template>
                                <el-form-item :label='item.bookingName' size="small" label-width="150px" v-for='(item,index) in detailInfo.lineBookingDescs' :key='index'>
                                    <div v-html='item.bookingDesc'></div>
                                </el-form-item>
                            </template>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="特殊人群限制">
                         <div>
                            <template>
                                <span style='display:inline-block;width:100%;' class="spanmargin" v-for='(item,index) in detailInfo.groupLineExceptionals' :key = 'index'>{{index+1}}.{{item}}</span>
                            </template>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="退款说明">
                      <div v-html = 'detailInfo.refundDesc' style='margin-left:30px;'></div>
                    </el-tab-pane>
                </el-tabs>
          </el-form-item>
          <el-form-item label="推广费" size="small" class="margin_bottom"  label-width="120px">
                <el-radio-group v-model="form.CommisionType" @change="handleChangeCommisionType">
                    <el-radio :label="2" class="margin_bottom"><el-input-number :disabled="form.CommisionType!==2" :controls="false" v-model="form2.CommisionValue2" :min="0" :max="999999999"></el-input-number> 元/单</el-radio>
                    <el-radio :label="1" class="margin_right"><el-input-number :disabled="form.CommisionType!==1" :controls="false" v-model="form2.CommisionValue1" :min="0" :max="100"></el-input-number> %/单</el-radio>
                    <el-radio :label="0" style="margin-left:0">
                        成人 <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionAdultValue" :min="0" :max="999999999"></el-input-number> 元/人
                        <span class="margin_left">老人</span> <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionElderValue" :min="0" :max="999999999"></el-input-number> 元/人
                        <span class="margin_left">儿童</span> <el-input-number :disabled="form.CommisionType!==0" :controls="false" v-model="form2.CommisionChildValue" :min="0" :max="999999999"></el-input-number> 元/人
                    </el-radio>
                </el-radio-group>
          </el-form-item>
          <el-form-item label="激励金" size="small" class="margin_bottom"  label-width="120px">
                <el-radio-group v-model="form.EncourageType" @change="handleChangeEncourageType">
                    <el-radio :label="2" class="margin_bottom"><el-input-number :disabled="form.EncourageType!==2" :controls="false" v-model="form2.EncourageValue2" :min="0" :max="999999999"></el-input-number> 元/单</el-radio>
                    <el-radio :label="1" class="margin_right"><el-input-number :disabled="form.EncourageType!==1" :controls="false" v-model="form2.EncourageValue1" :min="0" :max="100"></el-input-number> %/单</el-radio>
                    <el-radio :label="0" style="margin-left:0">
                        成人 <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageAdultValue" :min="0" :max="999999999"></el-input-number> 元/人
                        <span class="margin_left">老人</span> <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageElderValue" :min="0" :max="999999999"></el-input-number> 元/人
                        <span class="margin_left">儿童</span> <el-input-number :disabled="form.EncourageType!==0" :controls="false" v-model="form2.EncourageChildValue" :min="0" :max="999999999"></el-input-number> 元/人
                    </el-radio>
                </el-radio-group>
          </el-form-item>
      </el-form>
      <div style='margin-left:40%;'>
          <el-button size="mini" type="primary" @click="audit(false)" v-show='auditShow' :loading = 'audit_loading' :disabled = 'audit_disabled'>审核不通过</el-button>
          <el-button size="mini" type="primary" @click="audit(true)" v-show='auditShow' :loading = 'audit_loading' :disabled = 'audit_disabled'>审核通过</el-button>
          <el-button size="mini" type="primary" @click="goBack">返 回</el-button>
      </div>
    </div>
</template>

<script>
import { dateFmt } from "../../../utils/tools.js";
export default {
  data() {
    return {
      audit_disabled:false,
      page_loading: true,
      table_loading: false,
      audit_loading:false,
      lineId: this.$route.query.lineId,
      auditShow:this.$route.query.txt,//是否需要显示审核按钮
      dataArr: [],
      subentrylist:[],//增加的小项目 显示
      instructions:'',//小项目说明 显示
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
      },
      form:{
          LineId:'',
          Approved:'',
          CommisionType:'',
          CommisionValue:'',
          CommisionElderValue:'',
          CommisionChildValue:'',
          EncourageType:'',
          EncourageValue:'',
          EncourageElderValue:'',
          EncourageChildValue:''
      },
      form2:{
          CommisionValue1:'',
          CommisionValue2:'',
          CommisionAdultValue:'',
          CommisionElderValue:'',
          CommisionChildValue:'',
          EncourageValue1:'',
          EncourageValue2:'',
          EncourageAdultValue:'',
          EncourageElderValue:'',
          EncourageChildValue:'',
      }
    };
  },
  methods: {
    //查询数据
    queryData(productId, size, index) {
      this.table_loading = true;
      this.groupHttp
        .get( "GroupLine/GetGroupLineProductDetail?ProductId=" + productId + "&PageSize=" + (size || 10) +"&PageIndex=" + (index || 1))
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(obj => {
              let date = new Date(obj.teamDate);
              obj.teamDate = dateFmt(date, "yyyy-MM-dd");
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
          this.$message({type:"error",message:'请求失败'});
        });
    },
    handleChangeCommisionType(){
        if(this.form.CommisionType===0){
            this.form2.CommisionValue1=''
            this.form2.CommisionValue2=''
        }else if(this.form.CommisionType===1){
            this.form2.CommisionValue2=''
            this.form2.CommisionAdultValue=''
            this.form2.CommisionElderValue=''
            this.form2.CommisionChildValue=''
        }else if(this.form.CommisionType===2){
            this.form2.CommisionValue1=''
            this.form2.CommisionAdultValue=''
            this.form2.CommisionElderValue=''
            this.form2.CommisionChildValue=''
        }
    },
    handleChangeEncourageType(){
        if(this.form.EncourageType===0){
            this.form2.EncourageValue1=''
            this.form2.EncourageValue2=''
        }else if(this.form.EncourageType===1){
            this.form2.EncourageValue2=''
            this.form2.EncourageAdultValue=''
            this.form2.EncourageElderValue=''
            this.form2.EncourageChildValue=''
        }else if(this.form.EncourageType===2){
            this.form2.EncourageValue1=''
            this.form2.EncourageAdultValue=''
            this.form2.EncourageElderValue=''
            this.form2.EncourageChildValue=''
        }
    },
    //审核
    audit(bool){
      this.audit_loading = true;
      this.form.Approved=bool;
      this.form.LineId=this.lineId;
      if(this.form.CommisionType===0){
          this.form.CommisionValue=this.form2.CommisionAdultValue;
          this.form.CommisionElderValue=this.form2.CommisionElderValue;
          this.form.CommisionChildValue=this.form2.CommisionChildValue;
      }else if(this.form.CommisionType==1){
          this.form.CommisionValue=this.form2.CommisionValue1;
      }else if(this.form.CommisionType==2){
          this.form.CommisionValue=this.form2.CommisionValue2;
      }
      if(this.form.EncourageType===0){
          this.form.EncourageValue=this.form2.EncourageAdultValue;
          this.form.EncourageElderValue=this.form2.EncourageElderValue;
          this.form.EncourageChildValue=this.form2.EncourageChildValue;
      }else if(this.form.EncourageType==1){
          this.form.EncourageValue=this.form2.EncourageValue1;
      }else if(this.form.EncourageType==2){
          this.form.EncourageValue=this.form2.EncourageValue2;
      }
      this.groupHttp.post("GroupLine/Auditing",this.form).then(res => {
            if(res.data.isSuccess == true){
                if(bool==true){
                    this.$message({
                        type: "success",
                        message: "审核通过操作成功！ "
                    });
                }else{
                    this.$message({
                        type: "success",
                        message: "审核不通过操作成功！ "
                    });
                }
                this.$router.go(-1);
                this.audit_disabled = true;
                this.audit_loading = false;
            }else {
                this.$message({
                    type: "info",
                    message: "出错了！ " + res.data.message
                });
                this.audit_loading = false;
            }
        }).catch(e => {
            console.log(e);
            this.$message({type:"error",message:'请求失败'});
        });
    },
    goBack(){
      this.$router.go(-1);
    },
    //出发地城市变更
    cityChange(val) {
      this.queryData(val, 10, 1);
       this.dataArr.ProductId = val;
       this.detailInfo.lineSourceCities.forEach((item,index)=>{
            if(item.productId == val){
                this.dataArr.SourceCityName = item.cityName
            }
       })
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
     getSubentrylist(){
           //获取小项目名称
           var _this = this;
           //  http://172.16.2.24:82/GroupLineSmallItemSupplier/PartGroupLineSmallItem?Id=0&LineId=1098  this.lineId
           _this.groupHttp.get('/GroupLineSmallItem/PartGroupLineSmallItem?Id=0&LineId='+this.lineId).then(res=>{
               console.log(res);
               if(res.data.isSuccess){
                  _this.instructions = res.data.partGroupLineSmallItemPriceDto.instructions;
                  _this.subentrylist = res.data.partGroupLineSmallItemPriceDto.smallItemPriceList;
                    // _this.subentrylist = res.data.objects;
                    // console.log(_this.subentrylist);
               }else{
                   _this.$message({type:"info",message:'出错了'});
               }
           }).catch(err=>{
               console.log(err);
               _this.$message({type:"error",message:'小项目请求失败'});
           })
       }
  },
  mounted() {
    this.groupHttp.get("GroupLine/GetGroupLineDetail?LineId=" + this.lineId)
      .then(res => {
        console.log(res)
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
          this.dataArr.ProductId = this.lineCityId
          this.detailInfo.lineSourceCities.forEach((item,index)=>{
            if(item.productId == this.lineCityId){
                this.dataArr.SourceCityName = item.cityName
            } 
          })

          //激励和推广费
          this.form.CommisionType = res.data.detailInfo.commisionType;//推广费计算类型
          this.form.EncourageType = res.data.detailInfo.encourageType;//激励计算类型
          //推广费赋值
          if (res.data.detailInfo.commisionType == 0) {
            this.form2.CommisionAdultValue = res.data.detailInfo.commisionValue;
            this.form2.CommisionElderValue = res.data.detailInfo.commisionElderValue;
            this.form2.CommisionChildValue = res.data.detailInfo.commisionChildValue;
          }
          else if (res.data.detailInfo.commisionType == 1) {
            this.form2.CommisionValue1 = res.data.detailInfo.commisionValue;
          }
          else if (res.data.detailInfo.commisionType == 2) {
            this.form2.CommisionValue2 = res.data.detailInfo.commisionValue;
          }

          //激励赋值
          if (res.data.detailInfo.encourageType == 0) {
            this.form2.EncourageAdultValue = res.data.detailInfo.encourageValue;
            this.form2.EncourageElderValue = res.data.detailInfo.encourageElderValue;
            this.form2.EncourageChildValue = res.data.detailInfo.encourageChildValue;
          }
          else if (res.data.detailInfo.encourageType == 1) {
            this.form2.EncourageValue1 = res.data.detailInfo.encourageValue;
          }
          else if (res.data.detailInfo.encourageType == 2) {
            this.form2.EncourageValue2 = res.data.detailInfo.encourageValue;
          }

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
        this.$message({type:"error",message:'请求失败'});
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
  margin-bottom: 0px;
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
.button-download{
    position: absolute;
    right: 15px;
    top:35px;
}
</style>
