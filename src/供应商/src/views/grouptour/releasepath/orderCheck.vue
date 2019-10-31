<template>
  <div class="view" id="box" v-loading="viewLoading">
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
        <el-col :span="10">
          <el-form-item label="团号" size="small" label-width="100px">
            <span>{{details.teamNo}}</span>
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
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="门店名称" size="small" label-width="100px">
            <span>{{details.shopName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>预订信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系人" size="small" label-width="100px">
            <span>{{details.firstLinkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系电话" size="small" label-width="100px">
            <span>{{details.firstLinkPhone}}</span>
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
      <el-table-column
        size="small"
        prop="guestTypeName"
        label="价格名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        size="small"
        prop="guestType"
        label="价格类型"
        align="center"
        show-overflow-tooltip
      >
      <template slot-scope="scope">{{guestTypeList[scope.row.guestType-1]}}</template>
      </el-table-column>
      <el-table-column
        size="small"
        prop="unitPrice"
        label="直客销售价"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        size="small"
        prop="costAmount"
        label="同行结算价"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column size="small" prop="quantiy" label="人数" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="amount" label="合计" align="center" show-overflow-tooltip></el-table-column>
    </el-table>

    <template v-if="subentrylist.length!=0">
      <h4>
        <span class="vercitals">|</span>小项目
      </h4>
      <el-form>
        <el-row
          :gutter="24"
          v-for="(item,index) in subentrylist"
          :key="index"
          class="margin_bottom_0"
        >
          <el-col :span="24">
            <el-form-item label label-width class="margin_bottom_0">
              <span>{{item.smallItemsName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="直客销售价" label-width="120px" class="margin_bottom_0 inline-block">
              <el-input
                size="small"
                :disabled="true"
                v-model="item.smallitemAmount"
                class="input_comm"
              ></el-input>
            </el-form-item>
            <el-form-item label="同行结算价" label-width="120px" class="margin_bottom_0 inline-block">
              <el-input size="small" :disabled="true" v-model="item.costAmount" class="input_comm"></el-input>
              <span class="margin_left">人数：{{item.quantity}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <h4>附加费</h4>
    <el-table size="small" ref="additionalList" :data="additionalList" border tooltip-effect="dark">
      <el-table-column
        size="small"
        prop="additionalName"
        label="费用名"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        size="small"
        prop="unitPrice"
        label="价格"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column size="small" prop="quantity" label="数量" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="comment" label="说明" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-form>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="附加费合计：" size="small" label-width="120px">
            <span>{{details.additionTotalAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠：" size="small" label-width="120px">
            <span>{{details.discountAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总价：" size="small" label-width="120px">
            <span>{{details.amount}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template v-if="information.length!=0">
      <h4>旅客信息</h4>
      <el-table
        ref="information"
        :data="information"
        border
        max-height="800"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="guestName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="guestTypeName" label="旅客类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="guestGenderName" label="性别" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="birthday" label="出生日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobilePhone" label="手机号码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="certificateTypeName"
          label="证件类型"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="idCardNO" label="证件号码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gatherLocation" label="集合地" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </template>

    <template v-if="details.comment">
      <h4>备注</h4>
      <el-form>
        <el-form-item label size="small" label-width="120px">
          <span>{{details.comment}}</span>
        </el-form-item>
      </el-form>
    </template>

    <template v-if="this.$route.query.ChangeOrderId">
      <h4 class="red">变更申请</h4>
      <el-form>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="变更编号" size="small" label-width="150px">
                <span>{{changeForm.changeOrderNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="变更门店" size="small" label-width="150px">
                <span>{{changeForm.shopName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="是否变更人数" size="small" label-width="150px">
                <span>{{changeForm.changePeople?'是':'否'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="人数" size="small" label-width="150px">
                <span>成人{{changeForm.man}}，老人{{changeForm.oldman}}，小孩{{changeForm.child}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="是否变更订单总金额" size="small" label-width="150px">
                <span>{{changeForm.changAamount?'是':'否'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="变更订单总金额" size="small" label-width="150px">
                <span>{{changeForm.Aamount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="备注" size="small" label-width="150px">
                <span>{{changeForm.remarks}}</span>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>

    <h4 class="red">变更审核</h4>
    <el-steps :active="2">
      <el-step :title="shopApprovedTime+shopApproval" :description="shopApprovalUserName"></el-step>
      <el-step :title="supplierApprovedTime+supplierApproval " :description="supplierApprovalUserName"></el-step>
    </el-steps>

    </template>
   

    <el-row class="text-center margin_top">
      <el-button size="small" @click="back">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools";
export default {
  data() {
    return {
      details: {},
      price: [{}],
      additionalList: [{}],
      information: [{}],
      subentrylist: [],
      viewLoading: true,
      guestTypeList: ["成人价", "老人价", "儿童价", "婴儿价"],
      //变更信息
      changeForm: {
        shopName: "",
        changeOrderNo: "",
        changePeople: "",
        changAamount: "",
        Aamount: "",
        remarks: "",
        man: "",
        oldman: "",
        child: ""
      },
      //变更审核
      shopApproval: "",
      shopApprovedTime: "",
      shopApprovalUserName:'',
      supplierApproval: "",
      supplierApprovalUserName:'',
      supplierApprovedTime: "",
    };
  },
  mounted() {
    this.groupHttp
      .get("/GetGroupLineOrderInfo?orderId=" + this.$route.query.orderId)
      .then(res => {
        this.details = res.data;
        this.price = res.data.positionList;
        this.information = res.data.guestList;
        //this.subentrylist = res.data.lineSmallItemOrderRequest.smallItemOrderList;
        this.information.forEach(item => {
          let date = new Date(item.birthday);
          item.birthday = dateFmt(date, "yyyy-MM-dd");
        });
        this.additionalList = res.data.additionalList;
        this.viewLoading = false;
      })
      .catch(e => {
        this.viewLoading = false;
      });

    this.getSmallitemslist();
    if (this.$route.query.ChangeOrderId) {
      this.getChangeOrderInfo();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    getSmallitemslist() {
      var _this = this;
      _this.groupHttp
        .get(
          "/GroupLineSmallItemSupplier/GetSmallItemOrder?OrderId=" +
            _this.$route.query.orderId
        )
        .then(res => {
          console.log(res);
          if (res.data.isSuccess) {
            _this.subentrylist = res.data.objects;
            // console.log(_this.subentrylist);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取变更信息
    getChangeOrderInfo() {
      this.groupHttp
        .post("GroupLineChangOrder/GetInfo", {
          OrderId: this.$route.query.orderId,
          ChangeOrderId: this.$route.query.ChangeOrderId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.changeForm.shopName = res.data.shopName;
            this.changeForm.changeOrderNo = res.data.changeOrderNo;
            this.changeForm.changePeople = res.data.personChanged;
            this.changeForm.man = res.data.man;
            this.changeForm.changAamount = res.data.orderAmountChanged;
            this.changeForm.oldman = res.data.oldMan;
            this.changeForm.child = res.data.children;
            this.changeForm.Aamount = res.data.changedAmount;
            this.changeForm.remarks = res.data.comment;
            if (res.data.shopApproval != null) {
              if (res.data.shopApproval) {
                this.shopApproval = "门店通过审核";
              } else {
                this.shopApproval = "门店拒绝审核";
              }
            }
            if (
              res.data.shopApprovedTime != null &&
              res.data.shopApprovedTime != ""
            ) {
              this.shopApprovedTime = dateFmt(
                new Date(res.data.shopApprovedTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            if (
              res.data.supplierApproval != null &&
              res.data.supplierApproval != ""
            ) {
              if (res.data.supplierApproval) {
                this.supplierApproval = "供应商通过审核";
              } else {
                this.supplierApproval = "供应商拒绝审核";
              }
            }
            if (res.data.supplierApprovedTime != null) {
              this.supplierApprovedTime = dateFmt(
                new Date(res.data.supplierApprovedTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
             if(res.data.supplierApprovalUserName !=null){
              this.supplierApprovalUserName = res.data.supplierApprovalUserName
            }
            if(res.data.shopApprovalUserName !=null){
              this.shopApprovalUserName = res.data.shopApprovalUserName
            }
          } else {
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
.mysapn {
  font-weight: bold;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 5px !important;
}

.vercitals {
  font-weight: bold;
  font-size: 20px;
}
.view {
  h4.red {
    color: red;
    border-color: red;
  }
}
</style>

