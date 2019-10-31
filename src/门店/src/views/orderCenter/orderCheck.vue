<template>
  <div class="view" id="box" v-loading="fullscreenLoading">
    <h4>
      <span class="vercitals">|</span>订单信息
       <a
       v-if="fileUrl"
      type="primary"
      size="small"
      style="position:absolute;right:50px;color:red"
      icon="el-icon-download"
      :href="fileUrl"
      download=""
      >下载出团通知书</a>
    </h4>
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
    <h4>
      <span class="vercitals">|</span>线路信息
    </h4>
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
    <h4>
      <span class="vercitals">|</span>客户信息
    </h4>
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
              v-show="details.canUpdateContractNo==true"
            >更换合同</el-button>
             <!-- <el-button
              size="small"
              v-show="details.canReleaseContractNo"
              @click="releaseContract"
            >释放合同</el-button> -->
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
      </el-row>
    </el-form>
    <h4>
      <span class="vercitals">|</span>预订信息
    </h4>
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
    <h4>
      <span class="vercitals">|</span>价格表
    </h4>
    <el-table size="small" ref="price" :data="price" border max-height="800" tooltip-effect="dark">
      <el-table-column
        size="small"
        prop="guestTypeName"
        label="价格名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column size="small" label="价格类型" align="center" show-overflow-tooltip>
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
        v-if="companyType==2"
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
              <span class="margin_left" v-if="companyType!=2">人数：{{item.quantity}}</span>
            </el-form-item>
            <el-form-item
              label="同行结算价"
              label-width="120px"
              class="margin_bottom_0 inline-block"
              v-if="companyType==2"
            >
              <el-input size="small" :disabled="true" v-model="item.costAmount" class="input_comm"></el-input>
              <span class="margin_left">人数：{{item.quantity}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <h4>
      <span class="vercitals">|</span>附加费
    </h4>
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
        <!-- <el-col :span="6">
          <el-form-item label="直客销售总价：" size="small" label-width="120px">
            <span>{{details.amount}}</span>
          </el-form-item>
        </el-col> -->
        <el-col :span="6" v-if="companyType==2">
          <el-form-item label="同行销售总价：" size="small" label-width="120px">
            <span>{{details.orderCostAmount}}</span>
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
      <h5>{{Array.isArray(details.groupLineFinIncidentalDetail)}}</h5>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in details.groupLineFinIncidentalDetail">
            <el-form-item :label="item.incidentalName" size="small" label-width="120px">
              <span>{{item.amount}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <template v-if="information.length!=0">
      <h4>
        <span class="vercitals">|</span>旅客信息
      </h4>
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
        <el-table-column
          prop="birthday"
          :formatter="fixbirthday"
          label="出生日期"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
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
      <h4>
        <span class="vercitals">|</span>备注
      </h4>
      <el-row class="margin_left">{{details.comment}}</el-row>
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
    </template>
    <el-row class="margin_top text-center">
      <el-button class="mbackbtn" size="small" @click="back">返回</el-button>
    </el-row>

    <el-dialog title="合同更换" :visible.sync="dialogFormVisible" width="410px">
      <el-form :model="Form" ref="Form" :rules="rules">
        <el-form-item label="现用合同编号：" :label-width="formLabelWidth">
          <span>{{Form.oldContractNo}}</span>
        </el-form-item>
        <el-form-item label="是否已使用" :label-width="formLabelWidth" prop="isUse">
          <el-radio-group v-model="Form.isUse">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新换合同编号：" :label-width="formLabelWidth" prop="newContractNo">
          <el-select
            v-model="Form.newContractNo"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option v-for="item in contractList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
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
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      fileUrl:'',
      contractList: [],
      subentrylist: [],
      dialogFormVisible: false,
      fullscreenLoading: false,
      contractNo: "",
      details: {},
      price: [{}],
      additionalList: [{}],
      information: [{}],
      orderId: this.$route.query.orderId,
      formLabelWidth: "120px",
      Form: {
        oldContractNo: "",
        newContractNo: "",
        isUse: ""
      },
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
      shopApprovalUserName: "",
      supplierApproval: "",
      supplierApprovalUserName: "",
      supplierApprovedTime: "",
      rules: {
        isUse: [{ required: "true", message: "是否已使用", trigger: "change" }],
        newContractNo: [
          { required: "true", message: "请选择合同编号", trigger: "change" }
        ]
      },
      guestTypeList: ["成人价", "老人价", "儿童价", "婴儿价"],
      companyType: localStorage.getItem("companyType")
    };
  },
  mounted() {
    this.initMessage();
    this.getSmallitemslist();
    if (this.$route.query.ChangeOrderId) {
      this.getChangeOrderInfo();
    }
    this.searchContractNo();
    this.getGroupNoticeBook();
  },
  methods: {
    getGroupNoticeBook(){
      this.shopHttp.get('/ResourcePlatform/GetGroupNoticeBook?orderNo='+this.$route.query.orderNo).then(res=>{
        if(res.data.isSuccess == true){
          this.fileUrl = JSON.parse(res.data.data);
        }else{
          this.$message.error(res.data.info);
        }
      }).catch(e=>{
        console.log(e)
      })
    },
    back() {
      this.$router.go(-1);
    },
    //初始化
    initMessage() {
      this.fullscreenLoading = true;
      let   url ="GroupLine/GetGroupLineOrderInfo?orderId=" +this.$route.query.orderId;
      // if (this.$route.query.orderNo) {
      //   url =
      //     "GroupLine/GetGroupLineOrderInfo?orderNo=" +
      //     this.$route.query.orderNo;
      // } else {
      
      // }
      this.shopHttp
        .get(url)
        .then(res => {
          this.details = res.data;
          this.Form.oldContractNo = this.details.contractNo;
          this.price = res.data.positionList;
          this.information = res.data.guestList;
          this.additionalList = res.data.additionalList;
          this.fullscreenLoading = false;
        })
        .catch(e => {
          this.fullscreenLoading = false;
        });
    },
    //合同搜索
    searchContractNo() {
      this.shopHttp
        .get("Contract/GetAvailableContractNos?ContractNo=")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.contractList = res.data.objects;
          }
        });
    },
    //获取变更信息
    getChangeOrderInfo() {
      this.shopHttp
        .post("GroupLineChangOrder/GetInfo", {
          OrderId: this.$route.query.orderId,
          ChangeOrderId: this.$route.query.ChangeOrderId
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.changeForm.shopName = res.data.shopName;
            this.changeForm.changeOrderNo = res.data.changeOrderNo;
            this.changeForm.changePeople = res.data.personChanged;
            // this.changeForm.man = res.data.man;
            this.changeForm.changAamount = res.data.personChanged;
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
          conole.log(e);
        });
    },
    //取消合同
    cancel(Form) {
      this.dialogFormVisible = false;
      this.$refs[Form].resetFields();
    },
    ChangeContractNo(Form) {
      this.$refs[Form].validate(valid => {
        if (valid) {
          this.shopHttp
            .post("/GroupLine/ChangeContractNo", {
              OrderId: this.$route.query.orderId,
              NewContractNo: this.Form.newContractNo,
              OldUsed: this.Form.isUse
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getSmallitemslist() {
      var _this = this;
      _this.shopHttp
        .get(
          "/GroupLineSmallItemShop/GetSmallItemOrder?OrderId=" +
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
    fixbirthday(val) {
      let oTime = val.birthday;
      if (oTime != null && oTime != "") {
        let tTime = oTime.substring(0, oTime.lastIndexOf("T"));
        // let sTime = oTime.substring(oTime.indexOf('T')+1,oTime.lastIndexOf('.'));
        return tTime;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
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

