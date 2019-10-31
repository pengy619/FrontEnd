<template>
  <div class="view" id="box" v-loading="fullscreenLoading">
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
            <el-button
              size="small"
              @click="dialogFormVisible = true"
              v-show="details.orderSource=='Branch'&& details.canUpdateContractNo==true"
            >更换合同</el-button>
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
          <el-form-item label="供应商名称" size="small" label-width="100px">
            <span>{{details.supplierName}}</span>
          </el-form-item>
        </el-col>
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
          <el-form-item label="主要联系电话" size="small" label-width="100px">
            <span>{{details.enumOrderSource==10?details.signerList[0].mobilePhone:details.firstLinkPhone}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="主要联系人" size="small" label-width="100px">
            <span>{{details.enumOrderSource==10?details.signerList[0].signerName:details.firstLinkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4>价格表</h4>
    <el-table size="small" ref="price" :data="price" border tooltip-effect="dark">
      <el-table-column size="small" label="价格名称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{guestTypeNameList[scope.row.guestType-1]}}</template>
      </el-table-column>
      <el-table-column
        size="small"
        prop="guestTypeName"
        label="价格类型"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
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
    <el-table
      size="small"
      ref="additionalList"
      :data="additionalList"
      border
      max-height="800"
      tooltip-effect="dark"
    >
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

    <template
      v-if="Array.isArray(details.groupLineFinIncidentalDetail) && details.groupLineFinIncidentalDetail.length!=0"
    >
      <h4>
        <span class="vercitals">|</span>杂费
      </h4>
      <el-form>
        <el-row :gutter="24">
          <el-col :span="5" v-for="item in details.groupLineFinIncidentalDetail">
            <el-form-item :label="item.incidentalName" size="small" label-width="130px">
              <span>{{item.amount}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

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
      <el-row class="margin_left">{{details.comment}}</el-row>
    </template>

    <template v-if="this.canCreateChangeOrder && this.$route.query.save">
      <h4 class="red">变更申请</h4>
      <el-form
        :model="changeForm"
        label-width="100px"
        ref="changeForm"
        :rules="rules1"
        class="ui-form"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订单人数" size="small" label-width="100px">
              <el-radio-group v-model="changeForm.changePeople">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14" style="display:flex" v-if="changeForm.changePeople==true">
            <!-- <el-form-item size="small" label-width="100px" label="成人" prop="man">
              <el-input style="width:100px" v-model.number="changeForm.man" type="text"></el-input>
            </el-form-item>
            <el-form-item size="small" label-width="100px" label="老人" prop="oldman">
              <el-input style="width:100px" type="text" v-model.number="changeForm.oldman"></el-input>
            </el-form-item>
            <el-form-item size="small" label-width="100px" label="小孩" prop="child">
              <el-input style="width:100px" type="text" v-model.number="changeForm.child"></el-input>
            </el-form-item> -->
            <el-form-item size="small" label-width="100px" prop="quantity">
              <el-input style="width:200px" type="text" v-model.number="changeForm.quantity"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="变更订单金额" size="small" label-width="100px">
              <el-radio-group v-model="changeForm.changAamount">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              size="small"
              label-width="100px"
              v-if="changeForm.changAamount==true"
              prop="Aamount"
            >
              <el-input style="width:200px" v-model.number="changeForm.Aamount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row
          :gutter="20"
          style="display:flex"
          v-if="changeForm.changAamount || changeForm.changePeople"
        >
          <el-button type="primary" size="small" @click="priceList('changeForm')">查看价格明细</el-button>
          <el-col :span="4">
            <el-form-item label="订单金额" size="small" label-width="90px">
              <span>{{factAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="(供应商)应收金额" size="small" label-width="90px">
              <span>{{payableFee}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="(门市)应付金额" size="small" label-width="90px">
              <span>{{receivableFee}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="激励金额" size="small" label-width="90px">
              <span>{{encourageAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="推广费" size="small" label-width="150px">
              <span>{{commisionAmount}}</span>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="changeForm.remarks" :rows="3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="createChangeOrder('changeForm')"
            size="small"
            :loading="loading"
          >保存</el-button>
          <el-button class="mbackbtn" type="info" size="small" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template v-if="this.$route.query.ChangeOrderId && !this.$route.query.save">
      <h4 class="red">变更申请</h4>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="变更编号" size="small" label-width="150px">
              <span>{{changeOrderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="变更门店" size="small" label-width="150px">
              <span>{{shopName}}</span>
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
              <!-- <span>成人{{changeForm.man}}，老人{{changeForm.oldman}}，小孩{{changeForm.child}}</span> -->
              <span>{{changeForm.quantity}}</span>
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
        <el-step
          :title="supplierApprovedTime+supplierApproval "
          :description="supplierApprovalUserName"
        ></el-step>
      </el-steps>
      <el-row class="margin_top text-center">
        <el-button class="mbackbtn" size="small" @click="back">返回</el-button>
      </el-row>
    </template>
    <template v-if="!this.$route.query.ChangeOrderId && !this.canCreateChangeOrder">
      <el-row class="margin_top text-center">
        <el-button class="mbackbtn" size="small" @click="back">返回</el-button>
      </el-row>
    </template>
    <el-dialog title="合同更换" :visible.sync="dialogFormVisible" width="410px">
      <el-form :model="Form" ref="Form" :rules="rules">
        <el-form-item label="现用合同编号：" :label-width="formLabelWidth">
          <span>{{Form.oldContractNo}}</span>
        </el-form-item>
        <el-form-item label="新换合同编号：" :label-width="formLabelWidth" prop="newContractNo">
          <el-input
            v-model="Form.newContractNo"
            auto-complete="off"
            size="small"
            class="width_180px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('Form')" size="small">取 消</el-button>
        <el-button type="primary" @click="ChangeContractNo('Form')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools";
export default {
  data() {
    let RegNumber = (rule, value, callback) => {
      let reg = /^([1-9]\d*|[0]{1,1})$/;
      if (!reg.test(value)) {
        callback(new Error("人数必须为正整数"));
      } else {
        callback();
      }
    };
    let PriceNumber = (rule, value, callback) => {
      let reg = /^\d+(?:\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("金额必须为正数，且仅保留两位小数"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      subentrylist: [],
      dialogFormVisible: false,
      fullscreenLoading: false,
      contractNo: "",
      details: {},
      price: [],
      guestTypeNameList: ["成人价", "老人价", "儿童价", "婴儿价"],
      additionalList: [{}],
      information: [{}],
      formLabelWidth: "120px",
      Form: {
        oldContractNo: "",
        newContractNo: ""
      },
      canCreateChangeOrder: "",
      rules: {
        newContractNo: [
          { required: "true", message: "请填写合同编号", trigger: "blur" }
        ]
      },
      initLoading: false,
      changeOrderNo: "",
      shopName: "",
      changeForm: {
        changePeople: false,
        changAamount: false,
        Aamount: 0,
        remarks: "",
        man: 0,
        oldman: 0,
        child: 0,
        quantity:0,
      },
      //价格明细
      commisionAmount: "",
      encourageAmount: "",
      factAmount: "",
      payableFee: "",
      receivableFee: "",
      //变更审核
      shopApproval: "",
      shopApprovedTime: "",
      shopApprovalUserName: "",
      supplierApproval: "",
      supplierApprovalUserName: "",
      supplierApprovedTime: "",
      rules1: {
        quantity:{ type: "number", validator: RegNumber, trigger: "blur" },
        man: { type: "number", validator: RegNumber, trigger: "blur" },
        oldman: { type: "number", validator: RegNumber, trigger: "blur" },
        child: { type: "number", validator: RegNumber, trigger: "blur" },
        Aamount: { type: "number", validator: PriceNumber, trigger: "blur" }
      }
    };
  },
  watch: {
    "changeForm.changePeople": function(newName, oldName) {
      if (!newName) {
        this.changeForm.man = 0;
        this.changeForm.oldman = 0;
        this.changeForm.child = 0;
      }
    },
    "changeForm.changAamount": function(newName, oldName) {
      if (!newName) {
        this.changeForm.Aamount = 0;
      }
    }
  },
  mounted() {
    this.initMessage();
    this.getSmallitemslist();
    if (this.$route.query.ChangeOrderId) {
      this.getetChangeOrderInfo();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //初始化信息
    initMessage() {
      this.fullscreenLoading = true;
      let url = "";
      if (this.$route.query.orderNo) {
        switch (this.$route.query.orderType) {
          case 6:
            url =
              "GroupLine/GetGroupLineOrderInfo?orderNo=" +
              this.$route.query.orderNo;
            break;
        }
      } else {
        url =
          "GroupLine/GetGroupLineOrderInfo?orderId=" +
          this.$route.query.orderId;
      }
      this.fullscreenLoading = true;
      this.groupHttp
        .get(url)
        .then(res => {
          if (res.data.isSuccess) {
            this.details = res.data;
            this.Form.oldContractNo = this.details.contractNo;
            this.price = res.data.positionList;
            this.information = res.data.guestList;
            this.canCreateChangeOrder = res.data.canCreateChangeOrder;
            //this.subentrylist=res.data.lineSmallItemOrderRequest?res.data.lineSmallItemOrderRequest.smallItemOrderList:[]
            this.information.forEach(item => {
              let date = new Date(item.birthday);
              item.birthday = dateFmt(date, "yyyy-MM-dd");
            });
            this.additionalList = res.data.additionalList;
            this.fullscreenLoading = false;
          } else {
            this.$message({
              message: "出错了！" + res.data.message,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.fullscreenLoading = false;
        });
    },
    //获取价格信息
    priceList(changeForm) {
      this.$refs[changeForm].validate(valid => {
        if (valid) {
          this.groupHttp
            .post("GroupLineChangOrder/GetChangeOrderAmount", {
              OrderId: this.$route.query.orderId,
              ChangOrderId: this.$route.query.ChangeOrderId,
              PersonChanged: this.changeForm.changePeople,
              Man: this.changeForm.man,
              OldMan: this.changeForm.oldman,
              Children: this.changeForm.child,
              OrderAmountChanged: this.changeForm.changAamount,
              Amount: this.changeForm.Aamount,
              Comment: this.changeForm.remarks
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.commisionAmount = Number(res.data.commisionAmount).toFixed(
                  2
                );
                this.encourageAmount = Number(res.data.encourageAmount).toFixed(
                  2
                );
                this.factAmount = Number(res.data.factAmount).toFixed(2);
                this.payableFee = Number(res.data.payableFee).toFixed(2);
                this.receivableFee = Number(res.data.receivableFee).toFixed(2);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
        } else {
          return false;
        }
      });
    },
    //获取变更信息
    getetChangeOrderInfo() {
      this.groupHttp
        .post("GroupLineChangOrder/GetInfo", {
          OrderId: this.$route.query.orderId,
          ChangeOrderId: this.$route.query.ChangeOrderId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.changeOrderNo = res.data.changeOrderNo;
            this.shopName = res.data.shopName;
            this.changeForm.changePeople = res.data.personChanged;
            // this.changeForm.man = res.data.man;
            this.changeForm.changAamount = res.data.orderAmountChanged;
            // this.changeForm.oldman = res.data.oldMan;
            // this.changeForm.child = res.data.children;
            this.changeForm.quantity = res.data.quantity;
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
            if (res.data.supplierApprovalUserName != null) {
              this.supplierApprovalUserName = res.data.supplierApprovalUserName;
            }
            if (res.data.shopApprovalUserName != null) {
              this.shopApprovalUserName = res.data.shopApprovalUserName;
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //变更申请
    createChangeOrder(changeForm) {
      this.loading = true;
      this.$refs[changeForm].validate(valid => {
        if (valid) {
          if (
            this.changeForm.changAamount == false &&
            this.changeForm.changePeople == false
          ) {
            this.loading = false;
            this.$message({
              type: "warning",
              message: "未填写变更信息"
            });
          } else {
            this.groupHttp
              .post("GroupLineChangOrder/SaveChangeOrder", {
                OrderId: this.$route.query.orderId,
                ChangOrderId: this.$route.query.ChangeOrderId,
                PersonChanged: this.changeForm.changePeople,
                quantity:this.changeForm.quantity,
                OrderAmountChanged: this.changeForm.changAamount,
                ChangedAmount: this.changeForm.Aamount,
                Comment: this.changeForm.remarks
              })
              .then(res => {
                if (res.data.isSuccess == true) {
                  this.loading = false;
                  this.$message({
                    message: "变更申请成功",
                    type: "success"
                  });
                  this.$router.push({
                    path: "/grouptour/grouplinechangeorder"
                  });
                } else {
                  this.$message.error(res.data.message);
                  this.loading = false;
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        } else {
          return false;
        }
      });
    },
    //取消合同
    cancel(Form) {
      this.dialogFormVisible = false;
      this.$refs[Form].resetFields();
    },
    ChangeContractNo(Form) {
      this.groupHttp
        .post("/GroupLine/ChangeContractNo", {
          OrderId: this.$route.query.orderId,
          NewContractNo: this.Form.newContractNo
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.initMessage();
            this.$refs[Form].resetFields();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // getSmallitemslist(){
    //   let url = '';
    //   if(this.$route.query.orderNo){
    //     url = "/GroupLineSmallItem/GetSmallItemOrder?orderNo=" + this.$route.query.orderNo;
    //   }else{
    //     url = "/GroupLineSmallItem/GetSmallItemOrder?orderId=" + this.$route.query.orderId;
    //   }
    //   this.groupHttp.get(url).then(res=>{
    //       if(res.data.isSuccess){
    //             this.subentrylist = res.data.objects;
    //       }
    //   }).catch(err=>{
    //       console.log(err);
    //   })
    // }
    getSmallitemslist() {
      let url = "";
      if (this.$route.query.orderNo) {
        switch (this.$route.query.orderType) {
          case 6:
            url =
              "GroupLineSmallItem/GetSmallItemOrder?orderNo=" +
              this.$route.query.orderNo;
            break;
        }
      } else {
        url =
          "GroupLineSmallItem/GetSmallItemOrder?orderId=" +
          this.$route.query.orderId;
      }
      var _this = this;
      _this.groupHttp
        .get(url)
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

.view .el-input.width_180px {
  width: 180px;
}
.view {
  h4.red {
    color: red;
    border-color: red;
  }
}
.ui-form {
  .el-row {
    margin-bottom: 10px;
  }
}
</style>

