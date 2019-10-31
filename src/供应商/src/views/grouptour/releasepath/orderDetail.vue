<template>
  <div class="view" id="box">
    <h4>订单信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单号" size="small" label-width="100px">
            <span>{{details.orderNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" size="small" label-width="100px">
            <span>{{details.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="创建人" size="small" label-width="100px">
            <span>{{details.createUserName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单状态" size="small" label-width="100px">
            <span>{{details.statusName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>线路信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="线路名称" size="small" label-width="100px">
            <span>{{details.lineName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="出团日期" size="small" label-width="100px">
            <span>{{details.teamDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="线路类型" size="small" label-width="100px">
            <span>{{details.lineTypeName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>客户信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="客户名称" size="small" label-width="100px">
            <span>{{details.customerName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系人" size="small" label-width="100px">
            <span>{{details.linkMan}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" size="small" label-width="100px">
            <span>{{details.linkMobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="QQ" size="small" label-width="100px">
            <span>{{details.linkQQ}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Email" size="small" label-width="100px">
            <span>{{details.linkEmail}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="合同号" size="small" label-width="100px">
            <span>{{details.contractNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期" size="small" label-width="100px">
            <span>{{details.orderDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>预订信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系人" size="small" label-width="100px">
            <span>{{details.enumOrderSource==10?details.signerList[0].signerName:details.firstLinkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系电话" size="small" label-width="100px">
            <span>{{details.enumOrderSource==10?details.signerList[0].mobilePhone:details.firstLinkPhone}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期" size="small" label-width="100px">
            <span>{{details.orderDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>价格表</h4>
    <el-table size="small" ref="price" :data="price" border tooltip-effect="dark">
      <el-table-column size="small" prop="guestTypeName" label="价格名称" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column size="small" label="价格类型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{guestTypeList[scope.row.guestType-1]}}
        </template>
      </el-table-column>
      <el-table-column size="small" prop="unitPrice" label="直客销售价" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="costAmount" label="同行结算价" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="quantiy" label="人数" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="amount" label="合计" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <h4>附加费</h4>
    <el-table size="small" ref="additionalList" :data="additionalList" border tooltip-effect="dark">
      <el-table-column size="small" prop="additionalName" label="费用名" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="unitPrice" label="价格" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="quantity" label="数量" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="comment" label="说明" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="附加费合计：" size="small" label-width="120px">
            <span>{{details.additionTotalAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠：" size="small" label-width="120px">
            <span>{{details.discountAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总价：" size="small" label-width="120px">
            <span>{{details.amount}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4><span class="vercitals">| </span>小项目</h4>
    <el-row class="margin_left" v-if="subentrylist.length==0">无</el-row>
    <el-form v-else>
      <el-row :gutter="24" v-for="(item,index) in subentrylist" :key="index" class="margin_bottom_0">
        <el-col :span="24">
          <el-form-item label="" label-width="" class="margin_bottom_0">
            <span>{{item.smallItemsName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label='直客销售价' label-width='120px' class="margin_bottom_0 inline-block">
            <el-input size='small' :disabled="true" v-model="item.smallitemAmount" class="input_comm"></el-input>
          </el-form-item>
          <el-form-item label='同行结算价' label-width='120px' class="margin_bottom_0 inline-block">
            <el-input size='small' :disabled="true" v-model="item.costAmount" class="input_comm"></el-input>
            <span class="margin_left">人数：{{item.quantity}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>旅客信息</h4>
    <el-table ref="information" :data="information" border tooltip-effect="dark">
      <el-table-column prop="guestName" label="姓名" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="guestTypeName" label="旅客类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="guestGenderName" label="性别" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="birthday" label="出生日期" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="mobilePhone" label="手机号码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="certificateTypeName" label="证件类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="idCardNO" label="证件号码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gatherLocation" label="集合地" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <h4>备注</h4>
    <el-form>
      <el-form-item label="" size="small" label-width="120px">
        <span>{{details.comment}}</span>
      </el-form-item>
    </el-form>
    <el-row class="text-center margin_top">
      <el-button size="small" @click="back">返回</el-button>
    </el-row>

  </div>
</template>

<script>
  import {dateFmt} from '@/utils/tools'
  export default {
    data(){
      return {
        details: {},
        price: [{}],
        additionalList: [{}],
        information: [{}],
        subentrylist: [],
        guestTypeList: ['成人价', '老人价', '儿童价', '婴儿价']
      }
    },
    mounted () {
      this.groupHttp.get("/GetGroupLineOrderInfo?orderId=" + this.$route.query.orderId).then(res => {
        this.details = res.data;
        this.price = res.data.positionList
        this.information = res.data.guestList
        this.information.forEach((item) => {
          let date = new Date(item.birthday)
          item.birthday = dateFmt(date, 'yyyy-MM-dd')
        })
        this.additionalList = res.data.additionalList
      }).catch(e => {

      });
      this.getSmallitemslist();
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      //getSmallIteamlist(){
      //  var _this =this;
      //  _this.groupHttp.get('GetGroupLineOrderInfo?orderId='+this.$route.query.orderId).then(res=>{
      //    if(res.status==200){
      //      _this.smallIteamlist = res.data.lineSmallItemOrderRequest.smallItemOrderList;
      //    }
      //  }).catch(err=>{
      //    console.log(err);
      //  });
      //}
      getSmallitemslist() {
        var _this = this;
        _this.groupHttp.get('/GroupLineSmallItemSupplier/GetSmallItemOrder?OrderId=' + _this.$route.query.orderId).then(res => {
          console.log(res);
          if (res.data.isSuccess) {
            _this.subentrylist = res.data.objects;
            // console.log(_this.subentrylist);
          }
        }).catch(err => {
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .mysapn {
    font-weight: bold;
  }

  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }

  .vercitals {
    font-weight: bold;
    font-size: 20px;
  }
</style>

