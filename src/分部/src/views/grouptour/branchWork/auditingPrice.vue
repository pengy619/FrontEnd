<template>
    <div class="view" v-loading="viewLoading">
        <el-form size="small"  class="demo-form-inline">
         <el-form-item label="出发地" size="small"  label-width="80" class="margin_bottom">
              <el-select placeholder="请选择" v-model="lineCityId" @change = 'cityChange'>
                  <el-option v-for="(item,index) in lineSourceCities" :key="index" :label="item.name" :value='item.key'></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-table :data="productInfo"  size="small" style="width:100%" v-loading = 'table_loading'>
                  <el-table-column label="" size="small" align="center" >
                      <template slot-scope="scope">
                          {{priceTypeList[scope.row.priceType-1]}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="price" label="成人价" size="small" align="center"></el-table-column>
                  <el-table-column prop="oldPrice" label="老人价" size="small" align="center" ></el-table-column>
                  <el-table-column prop="childPrice" label="儿童价" size="small" align="center" ></el-table-column>
                  <!--<el-table-column prop="babyPrice" label="婴儿价"  size="small" align="center" ></el-table-column>-->
                  <el-table-column prop="priceType" label="币种"  size="small" align="center" >
                    <template slot-scope="scope">
                          {{currencyType[scope.row.currencyType]}}
                      </template>
                  </el-table-column>
              </el-table>
          </el-form-item>
          <div style="border-bottom:1px solid #ddd;">推广费</div>
          <el-form-item :label="(commisionTypeName||'固定金额')+' ：'">
            <span v-if="commisionTypeName =='按人数'">成人{{commisionValue}}元，老人{{commisionElderValue}}元，儿童{{commisionChildValue}}元</span>
            <span v-else>{{commisionValue + commisionTypeUnit}}</span>
          </el-form-item>
      </el-form>
      <div style='margin-left:40%;'>
          <el-button size="mini" type="primary" @click="auditApproved" v-show="auditShow" :loading = 'audit_loading' >审核</el-button>
          <el-button size="mini"  @click="auditReject" v-show="auditShow" :loading = 'audit_loading' >拒绝</el-button>
          <el-button size="mini"  @click="goBack">返 回</el-button>
      </div>
    </div>
</template>

<script>
import { dateFmt } from "../../../utils/tools.js";
export default {
  data() {
    return {
      viewLoading:true,
      audit_disabled:false,
      table_loading: false,
      audit_loading:false,
      lineId: this.$route.query.lineId,
      auditShow:false,//是否需要显示审核按钮
      lineSourceCities: [],
      productInfo: [
        // { teamDate: "", price: "", oldPrice: "", childPrice: "", babyPrice: "" }
      ],
      lineCityId: "",
      priceTypeList:['同行结算价','媒体外卖价','同行价','加盟结算价','直客销售价','内部价'],
      currencyType:{},
      commisionTypeName:this.$route.query.commisionTypeName,
      commisionTypeUnit:this.$route.query.commisionTypeUnit,
      commisionValue: this.$route.query.commisionValue,
      commisionElderValue:this.$route.query.commisionElderValue || 0,
      commisionChildValue:this.$route.query.commisionChildValue || 0
    };
  },
  methods: {
       //查询出发地
    queryDeparture() {
      this.groupHttp
        .get( "/GroupLine/GetApprovalGroupLineProductList?lineId=" + this.lineId)
        .then(res => {
          if (res.data.isSuccess == true) {
              this.lineSourceCities=res.data.objects;
              this.lineCityId = res.data.objects.length>0?res.data.objects[0].key:'';
              this.queryData();
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
    },
    //查询币种
    queryCurrency() {
      this.groupHttp
        .post("GroupLine/GeEnumCurrencyTypeList")
        .then(res => {
          if (res.data.isSuccess == true) {
              let keyValueList=res.data.keyValueList
              keyValueList.forEach(item => {
                this.currencyType[item.key]=item.name
              });
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
    },
    //查询数据
    queryData() {
      if(!this.lineCityId){
        setTimeout(()=>{
          this.$message({
            type: "info",
            message: "线路列表没有数据····"
          });
        },500)
        this.viewLoading=false;
        this.productInfo=[];
        this.auditShow=false;
        return false;
      }

      this.table_loading=true;
      this.groupHttp
        .get( "GroupLine/GetGroupLineProductPriceList?productId=" + this.lineCityId)
        .then(res => {
          if (res.data.isSuccess == true) {
              let priceList=JSON.parse(JSON.stringify(res.data.dto.priceList));
              this.auditShow=res.data.dto.canApproval;
              priceList.forEach((item,index)=>{
                if(item.priceType==4||item.priceType==3||item.priceType==6){
                  priceList.splice(index,1)
                }
              })
              priceList.forEach((item,index)=>{
                if(item.priceType==4||item.priceType==3||item.priceType==6){
                  priceList.splice(index,1)
                }
              })
              this.productInfo=priceList
              // this.CommisionValue = res.dto.commisionValue;
              this.table_loading=false;
              this.viewLoading=false;
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
    
    //审核通过
    auditApproved(){
      this.groupHttp.get("GroupLine/ApprovedGroupLine?productId="+this.lineCityId)
      .then(res => {
            if(res.data.isSuccess == true){
              this.$message({
                    type: "success",
                    message:'审核操作成功！'
                });
                this.audit_disabled = true;
                this.audit_loading = false;
                this.queryDeparture()
            }else {
                this.$message({
                    type: "info",
                    message: "出错了！ " + res.data.message
                });
                this.audit_loading = false;
            }
        }).catch(e => {
            console.log(e);
        });
    },
    //审核不通过
    auditReject(){
      this.audit_loading = true;
      this.groupHttp.get("GroupLine/RejectGroupLine?productId="+this.lineCityId)
      .then(res => {
            if(res.data.isSuccess == true){
               this.$message({
                    type: "success",
                    message: '拒绝操作成功！'
                });
                this.audit_disabled = true;
                this.audit_loading = false;
                this.queryDeparture()
            }else {
                this.$message({
                    type: "info",
                    message: "出错了！ " + res.data.message
                });
                this.audit_loading = false;
            }
        }).catch(e => {
            console.log(e);
        });
    },
    goBack(){
      this.$router.go(-1);
    },
    //出发地城市变更
    cityChange(val) {
      this.queryData();
    //    this.detailInfo.lineSourceCities.forEach((item,index)=>{
    //         if(item.productId == val){
    //             this.dataArr.SourceCityName = item.cityName
    //         }
    //    })
    },
    
  },
  mounted() {
    this.queryDeparture();
    this.queryCurrency();
  }
};
</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
</style>
