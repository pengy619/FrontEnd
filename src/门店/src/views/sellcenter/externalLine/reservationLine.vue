<template>
  <div class="view" v-loading="page_loading">
    <div>
      <div>
        <h4>线路信息</h4>
      </div>
      <div>
        <el-row>
          <el-col :span="2" class="text1">线路名称</el-col>
          <el-col :span="20">{{routeName}}(线路编号：{{groupNum}})</el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">线路套餐</el-col>
          <el-col :span="20">
            <el-select
              v-model="linePackageId"
              placeholder="请选择"
              size="small"
              @change="getLinePriceDateDetail"
            >
              <el-option
                v-for="item in linePackageList"
                :key="item.packageId"
                :label="item.name"
                :value="item.packageId"
                :disabled="item.countForPlayDay == 0"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">出团团期</el-col>
          <el-col :span="3">{{groupTime}}</el-col>
          <el-col :span="2">
            <el-button size="small" type="primary" @click="selectDate">选择日期</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">线路类型</el-col>
          <el-col :span="20">{{routeType}}</el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div>
        <h4>门店信息</h4>
      </div>
      <div>
        <el-form
          ref="form2"
          :model="form2"
          :rules="rules2"
          label-width="120px"
          id="form2"
          size="small"
          :inline="true"
        >
          <el-form-item label="客户" class="form-inline-input" prop="CustomerId">
            <el-input disabled v-model="form2.CustomerName"></el-input>
          </el-form-item>
          <el-form-item label="联系人" class="form-inline-input" prop="LinkMan">
            <el-input disabled v-model="form2.LinkMan"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" class="form-inline-input" prop="LinkMobile">
            <el-input disabled v-model="form2.LinkMobile"></el-input>
          </el-form-item>
          <el-form-item label="订单日期" class="form-inline-input" prop="orderDate">
            <el-date-picker
              disabled
              v-model="form2.orderDate"
              type="date"
              placeholder="选择日期"
              :picker-options="StartDisableDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类别" class="form-inline-input" prop="CategoryId">
            <el-select v-model="form2.CategoryId" @change="handleChangeCategoryId">
              <el-option
                v-for="item in contractCategoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同号"
            class="form-inline-input"
            prop="ContractNo"
            v-if="form2.CategoryId==1"
          >
            <el-select
              v-model="form2.ContractNo"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="searchContractNo"
              :loading="loading"
            >
              <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="ContractTypeId"
            label="合同类型"
            size="small"
            class="form-inline-input"
            v-if="form2.CategoryId==2"
          >
            <el-select
              v-model="form2.ContractTypeId"
              placeholder="请选择"
              @change="handleChangeContractTypeId"
            >
              <el-option
                v-for="item in contractTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-show="item.name !='全部'"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同号"
            class="form-inline-input"
            v-show="form2.CategoryId==2"
          >{{form2.ContractNo}}</el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <div>
        <h4>预订信息</h4>
      </div>
      <div>
        <el-form
          ref="form3"
          :model="form3"
          :rules="rules3"
          label-width="120px"
          id="form3"
          size="small"
        >
          <el-form-item label="主要联系人" prop="FirstLinkMan">
            <el-input v-model="form3.FirstLinkMan"></el-input>
          </el-form-item>
          <el-form-item label="主要联系人电话" prop="FirstLinkPhone">
            <el-input v-model="form3.FirstLinkPhone"></el-input>
            <el-button type="primary" @click="addCustomer">添加为游客</el-button>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form3.FirstLinkGender">
              <el-radio :label="1">先生</el-radio>
              <el-radio :label="2">女士</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内部编码">
            <el-input v-model="form3.InnerCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <h4>报名下单</h4>
        <div>
          <el-table :data="tableData1" border style="margin-bottom:20px;">
            <el-table-column prop="priceTypeName" label="价格类型"></el-table-column>
            <el-table-column prop="SalesPrice" label="销售价"></el-table-column>
            <el-table-column prop="SettlementPrice" label="结算价"></el-table-column>
            <el-table-column label="人数" prop="Quantity">
              <template slot-scope="scope">
                <el-input-number
                  size="small"
                  v-model="scope.row.Quantity"
                  :min="0"
                  :max="999999"
                  v-if="scope.$index ==4"
                ></el-input-number>
                <el-input-number
                  v-else
                  @change="changeNum"
                  size="small"
                  v-model="scope.row.Quantity"
                  :min="0"
                  :max="999999"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="this.smallItemlist.length !=0">
        <h4>小项目</h4>
        <el-table :data="smallItemlist" border style="margin-bottom:20px;">
          <el-table-column prop="name" label="项目类型"></el-table-column>
          <el-table-column prop="markerPrice" label="销售价"></el-table-column>
          <el-table-column prop="settlementPrice" label="结算价"></el-table-column>
          <el-table-column label="人数" prop="Quantity">
            <template slot-scope="scope">
              <el-input-number
                size="small"
                :min="0"
                :max="maxCount"
                v-model="scope.row.personCount"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <h4>附加费用</h4> -->
      <el-button
        type="primary"
        @click="addTr"
        class="but_marginbom"
        size="small"
        v-if="companyType!=2"
      >添加行</el-button>
      <el-button
        type="primary"
        @click="addTr('price')"
        class="but_marginbom"
        size="small"
        v-if="companyType!=2"
      >加价</el-button>
      <div>
        <el-table :data="tableData2" v-if="companyType!=2" border class="margin_bottom inner-full">
          <el-table-column prop="AdditionalName" label="费用名">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.AdditionalName"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="UnitPrice" label="价格">
            <template slot-scope="scope">
              <el-input-number
                size="small"
                v-model="scope.row.UnitPrice"
                :min="0"
                :max="999999999"
                :controls="false"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="Quantity" label="数量">
            <template slot-scope="scope">
              <el-input-number
                size="small"
                v-model="scope.row.Quantity"
                :min="0"
                :max="999999999"
                :controls="false"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="Comment" label="说明">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.Comment"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Amount" label="合计"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete1(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span class="demonstration" v-if="companyType!=2">附加费:</span>
        <el-input
          class="input_comm margin_right"
          v-if="companyType!=2"
          size="small"
          v-model="additionAmount"
          :disabled="true"
        ></el-input>
        <span class="demonstration" v-if="companyType!=2">优惠:</span>
        <el-input-number
          class="input_comm margin_right"
          v-if="companyType!=2"
          :min="0"
          :max="999999999"
          :controls="false"
          size="small"
          @change="discounts"
          v-model="DiscountAmount"
        ></el-input-number>
        <span class="demonstration">销售总价:</span>
        <el-input
          class="input_comm margin_right"
          size="small"
          :disabled="true"
          v-model="aggregateAmount"
        ></el-input>
        <span class="demonstration">结算总价:</span>
        <el-input
          class="input_comm"
          size="small"
          :disabled="true"
          v-model="retailPriceMount"
          v-if="companyType==2"
        ></el-input>
      </div>
    </div>

    <div>
      <div>
        <h4>旅客信息</h4>
      </div>
      <div>
        <el-button type="primary" @click="addTr1" class="but_marginbom" size="small">添加行</el-button>
        <el-upload
          style="display:inline"
          action="/GroupLine/ExcelToGuestList"
          :limit="1"
          :show-file-list="false"
          :http-request="excelUpload"
          :before-upload="beforeExcelUpload"
          ref="excelUpload"
        >
          <el-button size="small" type="primary">导入Excel</el-button>
        </el-upload>
        <a download="游客表格模板.xlsx" href="/static/游客表格模板.xlsx" style="color:#409eff">下载Excel模板</a>
      </div>
      <el-table :data="table3" border style="width: 100%">
        <!-- <el-table-column fixed type="selection" width="50"></el-table-column> -->
        <el-table-column prop="Name" label="姓名" width="100">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.Name"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="GuestType" label="类型">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.GuestType"
              placeholder="请选择"
              size="small"
              class="select_width"
            >
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Sex" label="性别">
          <template slot-scope="scope">
            <el-select v-model="scope.row.Sex" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in sex"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Phone" label="手机号">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.Phone"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="CredentialsType" label="证件类型">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.CredentialsType"
              placeholder="请选择"
              size="small"
              class="select_width"
            >
              <el-option
                v-for="item in cardList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Credentials" label="证件号码">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.Credentials"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="Birthday" label="出生日期">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.Birthday"
              type="date"
              placeholder="选择日期"
              size="small"
              class="date_width"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="GatherLocation" label="集合地点">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.GatherLocation"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="handleDelete2(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <h4>备注</h4>
      <el-input type="textarea" :rows="4" v-model="Comment"></el-input>
      <div style="margin-top:15px;">
        <el-button
          type="primary"
          size="small"
          @click="onSubmit('form2','form3')"
          :loading="submitLoading1"
        >确 定</el-button>
        <el-button type="info" size="small" @click="goBack">返 回</el-button>
        <el-button
          type="primary"
          size="small"
          @click="onSubmit('form2','form3','payment')"
          v-if="companyType==1"
          :loading="submitLoading2"
        >收款</el-button>
        <el-button
          type="primary"
          size="small"
          @click="onSubmit('form2','form3','joinPayment')"
          v-else-if="companyType==2"
          :disabled="confirmType!=1"
          :loading="submitLoading2"
        >支付</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" width="65%" custom-class="ui-dialog">
      <price-table
        ref="priceTable"
        :price-data="priceData"
        @childData="getCurMonthDate"
        @nexMonthDate="getNexMonthDate"
        @preMonthDate="getPreMonthDate"
      ></price-table>
    </el-dialog>
  </div>
</template>
<script>
import { dateFmt } from "@/utils/tools";
import priceTable from "@/components/priceTable";
export default {
  data() {
    var checkQQ = (rule, value, callback) => {
      if (!value) {
        callback(new Error("您还没有输入QQ号码"));
      } else if (!/^\d{5,10}$/.test(value)) {
        callback(new Error("您的QQ号码有误"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("您还没有输入邮箱"));
      } else if (
        !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          value
        )
      ) {
        callback(new Error("您的邮箱格式有误"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("您还没有手机号码"));
      } else if (!/^1[0-9][0-9]\d{8}$/.test(value)) {
        callback(new Error("您的手机号码有误"));
      } else {
        callback();
      }
    };
    var checkOrderDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("您还没有选择订单日期"));
      } else {
        callback();
      }
    };
    return {
      page_loading: true,
      dialogTableVisible: false,
      priceData: [],
      name: "",
      linePackageId: "",
      confirmType: "",
      companyType: localStorage.getItem("companyType"),
      StartDisableDate: {
        disabledDate: date => {
          return date.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      maxCount: 0,
      smallItemlist: [], //小项目列表
      smallCount: 0, //小项目直客价合计
      smallPeerCount: 0, //小项目同行价合计
      pricecount: 0, //附加表各项价格数量
      pricetypename: "",
      submitLoading1: false,
      submitLoading2: false,
      additionAmount: 0, //附加费用
      interiorAmount: 0, //附加表直客价合计
      peerAmount: 0, //附加表同行价合计
      //        aggregateAmount:0,  //总价
      DiscountAmount: 0, //折扣金额
      IsAddCustomer: true,
      client: [],
      linePackageList: [],
      sex: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }
      ],
      ProductId: this.$route.query.productId ? this.$route.query.productId : "",
      typeList: [],
      cardList: [
        { key: 1, name: "身份证" },
        { key: 2, name: "护照" },
        { key: 3, name: "台胞证" },
        { key: 4, name: "港澳通行证" },
        { key: 5, name: "其他" }
      ],
      lineId: this.$route.query.productId,
      routeName: "",
      routeType: "",
      groupTime: this.$route.query.dateOne,
      groupNum: "",
      SourceCityName: this.$route.query.SourceCityName
        ? this.$route.query.SourceCityName
        : "",
      Comment: "",
      form2: {
        CustomerId: "",
        CustomerName: "",
        LinkMan: "",
        LinkMobile: "",
        LinkQQ: "",
        LinkEmail: "",
        ContractNo: "",
        ContractId: 0,
        orderDate: new Date(),
        CategoryId: '',
        ContractTypeId: ""
      },
      rules2: {
        // CustomerId: [
        //   {
        //     required: true,
        //     message: "您还没有选择客户名称",
        //     trigger: "blur"
        //   }
        // ],
        ContractNo: [
          { required: true, message: "您还没有输入合同号", trigger: "change" }
        ],
        CategoryId: [
          { required: true, message: "您还没有选择合同类别", trigger: "change" }
        ],
        ContractTypeId: [
          { required: true, message: "您还没有选择合同类型", trigger: "change" }
        ]
        // orderDate: [
        //   { required: true, validator: checkOrderDate, trigger: "blur" }
        // ]
      },
      contractCategoryList: [], //合同类别列表
      contractTypeList: [], //合同类型列表
      isCusInfoPass: false,
      options4: [],
      personQuantity: 0,
      list: [],
      options: [],
      contractList: [],
      loading: false,
      curPriceType: "",
      form3: {
        FirstLinkMan: "",
        FirstLinkPhone: "",
        FirstLinkGender: 1,
        // CommunityShopId: "",
        CommunityShopName: "",
        InnerCode: ""
      },
      // communityList: [{ key: "", value: "请选择" }],
      rules3: {
        FirstLinkMan: [
          { required: true, message: "您还没有输入联系人", trigger: "blur" }
        ],
        FirstLinkPhone: [
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        CustomerSource: [
          {
            type: "number",
            required: true,
            message: "您还没有选择出发地",
            trigger: "change"
          }
        ]
      },
      table1: [
        {
          PriceName: 1,
          priceTypeName: "成人",
          Quantity: 1,
          SalesPrice: 0,
          SettlementPrice: 0
        },
        {
          priceName: 2,
          priceTypeName: "儿童占位",
          Quantity: "",
          SalesPrice: 0,
          SettlementPrice: 0
        },
        {
          priceName: 3,
          priceTypeName: "儿童不占位",
          Quantity: "",
          SalesPrice: 0,
          SettlementPrice: 0
        },
        {
          priceName: 4,
          priceTypeName: "60岁以上老人",
          Quantity: "",
          SalesPrice: 0,
          SettlementPrice: 0
        },
        {
          priceName: 5,
          priceTypeName: "单房差",
          Quantity: "",
          SalesPrice: 0,
          SettlementPrice: 0
        }
      ],
      table2: [
        {
          AdditionalName: "",
          UnitPrice: 0,
          Quantity: 0,
          Comment: "",
          Amount: 0
        }
      ],
      table3: [
        {
          GuestType: "",
          Sex: "",
          Name: "",
          CredentialsType: "",
          Credentials: "",
          Birthday: "",
          Phone: "",
          GatherLocation: ""
        }
      ]
    };
  },
  components: {
    priceTable
  },
  computed: {
    tableData1() {
      this.personQuantity = 0;
      this.interiorAmount = 0;
      this.peerAmount = 0;
      let count = 0;
      this.smallCount = 0;
      this.smallPeerCount = 0;
      this.table1.map((v, i) => {
        let a = this.personQuantity;
        this.personQuantity += v.Quantity || 0;
        v.Amount = v.SalesPrice * (v.Quantity || 0);
        this.interiorAmount += v.Amount;
        this.peerAmount += v.SettlementPrice * (v.Quantity || 0);
        count += v.Quantity || 0;
      });
      this.maxCount = count;
      let smalllistlength = this.smallItemlist.length;
      // let smallprice = 0;
      for (let i = 0; i < smalllistlength; i++) {
        if (this.smallItemlist[i].personCount > count) {
          this.smallItemlist[i].personCount = count;
        }
        this.smallCount +=
          Number(this.smallItemlist[i].markerPrice) *
          Number(this.smallItemlist[i].personCount || 0);
        this.smallPeerCount +=
          Number(this.smallItemlist[i].settlementPrice) *
          Number(this.smallItemlist[i].personCount || 0);
      }
      return this.table1;
    },
    tableData2() {
      var additionArr = [];
      this.table2.map((v, i) => {
        v.Amount = v.UnitPrice * v.Quantity;
        let amount = Number(v.Amount);
        if (!isNaN(amount)) {
          additionArr[i] = v.Amount;
          this.additionAmount = additionArr.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              this.$message.error("价格和数量必须为正数");
            }
          });
        } else {
          this.$message.error("价格和数量必须为正数");
        }
      });
      return this.table2;
    },
    aggregateAmount: function() {
      return Number(this.interiorAmount) + Number(this.smallCount);
    },
    retailPriceMount: function() {
      return Number(this.peerAmount) + Number(this.smallPeerCount);
    }
  },
  mounted() {
    this.getlineData();
    this.typeListFun();
    this.getCurPriceType();
    this.form2.orderDate = dateFmt(new Date(), "yyyy-MM-dd");
    this.priceTypeText();
    this.GetContractType();
    this.GetContractCategoryList();
    this.getShopInfo();
  },
  watch: {
    table3: {
      handler: function(newVal) {
        newVal.forEach((item, index) => {
          if (item.CredentialsType == 1 && item.Credentials.length == 18) {
            let yyyy = item.Credentials.substring(6, 10);
            let mm = item.Credentials.substring(10, 12);
            let dd = item.Credentials.substring(12, 14);
            item.Birthday = yyyy + "-" + mm + "-" + dd;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    changeNum(newVal, oldVal, index) {
      console.log(index);
      if (newVal > oldVal) {
        this.addTr1();
      } else {
        this.handleDelete2();
      }
    },
    //日历列表
    getLinePriceDate(date = "") {
      this.shopHttp
        .post("ResourcePlatform/LinePriceDate", {
          lineId: this.lineId,
          packageId: this.linePackageId,
          Date: date
        })
        .then(res => {
          this.priceData = res.data.data
          this.$refs.priceTable.updateVal(this.priceData)
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取线路信息
    getlineData() {
      this.shopHttp
        .post("ResourcePlatform/LineDetail", {
          lineId: this.lineId
        })
        .then(res => {
          this.confirmType = res.data.confimClassify;
          this.routeName = res.data.productName;
          this.groupNum = res.data.productNo;
          this.routeType = res.data.productCateName;
          this.linePackageList = res.data.linePackageList;
          this.linePackageId = this.$route.query.linePackageId ? this.$route.query.linePackageId: this.linePackageList[0].packageId;
          this.smallItemlist = res.data.lineExtraFeeList;
          // this.getLinePriceDate()
          this.getLinePriceDateDetail();
          this.page_loading = false;
        })
        .catch(e => {
          this.page_loading = false;
          console.log(e);
        });
    },
    getCurMonthDate(val) {
      this.groupTime = val.date;
      this.dialogTableVisible = false;
      this.getLinePriceDateDetail();
    },
    getPreMonthDate(predate) {
      this.getLinePriceDate(predate);
    },
    getNexMonthDate(nexdate) {
      this.getLinePriceDate(nexdate);
    },
    selectDate() {
      this.getLinePriceDate();
      this.dialogTableVisible = true;
    },
    //获取价格明细
    getLinePriceDateDetail() {
      this.shopHttp
        .post("ResourcePlatform/LinePriceDateDetail", {
          lineId: this.lineId,
          packageId: this.linePackageId,
          Date: this.groupTime
        })
        .then(res => {
          let data = res.data.data;
          data.forEach(item => {
            if (item.priceClassify == 1) {
              //结算价
              this.table1[0].SettlementPrice = item.adultPrice;
              this.table1[1].SettlementPrice = item.childBedPrice;
              this.table1[2].SettlementPrice = item.childNoBedPrice;
              this.table1[3].SettlementPrice = item.oldManPrice;
              this.table1[4].SettlementPrice = item.singleRoomPrice;
            }
            if (item.priceClassify == 2) {
              //销售价
              this.table1[0].SalesPrice = item.adultPrice;
              this.table1[1].SalesPrice = item.childBedPrice;
              this.table1[2].SalesPrice = item.childNoBedPrice;
              this.table1[3].SalesPrice = item.oldManPrice;
              this.table1[4].SalesPrice = item.singleRoomPrice;
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    //添加游客信息
    addCustomer() {
      if (this.form3.FirstLinkMan == "" || this.form3.FirstLinkPhone == "") {
        this.$message.error("请将联系人/电话填写完整");
      } else {
        this.table3[0].Name = this.form3.FirstLinkMan;
        this.table3[0].Phone = this.form3.FirstLinkPhone;
        this.table3[0].Sex= this.form3.FirstLinkGender == 1 ? '男' : '女'
      }
    },
    //获取合同类型
    GetContractType() {
      this.shopHttp.get("/Contract/GetContractTypeNames").then(res => {
        if (res.data.isSuccess == true) {
          this.contractTypeList = res.data.objects;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getShopInfo() {
      this.shopHttp.get("/ShopAccount/GetShopBasicInfo").then(res => {
        if (res.data.isSuccess) {
          this.form2.CustomerId = res.data.objects[0].id;
          this.form2.CustomerName = res.data.objects[0].name;
          this.form2.LinkMan = res.data.objects[0].contanct;
          this.form2.LinkMobile = res.data.objects[0].mobilePhone;
        }
      });
    },
    // getSummaries(param) {
    //   const { columns, data } = param;
    //   const sums = [];
    //   let columnNum = 3;
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = "合计";
    //       return;
    //     }
    //     const values = data.map(item => Number(item[column.property]));
    //     sums[columnNum] = values.reduce((prev, curr) => {
    //       const value = Number(curr);
    //       if (!isNaN(value)) {
    //         return prev + curr;
    //       } else {
    //         return prev;
    //       }
    //     }, 0);
    //   });
    //   return sums;
    // },
    goBack() {
      this.$router.go(-1);
    },
    priceTypeText() {
      this.shopHttp
        .get("GroupLine/GetPriceTypeText")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.pricetypename = res.data.object;
          }
        })
        .catch(e => {});
    },
    //获取价格类型
    getCurPriceType() {
      this.shopHttp.post("/GroupLine/GetCurPriceType").then(res => {
        if (res.status == 200) {
          this.curPriceType = res.data;
        }
      });
    },
    // //根据客户id获取客户资料
    // getLinkMessage(val) {
    //   this.shopHttp
    //     .post("/SettleClient/GetCustomerOrder", { DisCompanyInfoId: val })
    //     .then(res => {
    //       this.form2.LinkMan = res.data.contanct;
    //       this.form2.LinkMobile = res.data.mobilePhone;
    //       this.form2.LinkEmail = res.data.mailbox;
    //     });
    // },
    // //获取客户
    // remoteMethod(query) {
    //   // if (query !== "") {
    //   this.loading = true;
    //   this.shopHttp
    //     .get("/SettleClient/GetCustomerDrop?CustomerName=" + query + "")
    //     .then(res => {
    //       if (res.data.isSuccess == true) {
    //         this.list = res.data.objects;
    //         this.loading = false;
    //         this.options4 = this.list.filter(item => {
    //           return item.customerName.indexOf(query) > -1;
    //         });
    //       }
    //     });
    //   // } else {
    //   //   this.options4 = [];
    //   // }
    // },
    //合同搜索
    searchContractNo(query) {
      if (query !== "") {
        this.loading = true;
        this.shopHttp
          .get("Contract/GetAvailableContractNos?ContractNo=" + query)
          .then(res => {
            if (res.data.isSuccess == true) {
              this.contractList = res.data.objects;
              this.loading = false;
              this.options = this.contractList.filter(item => {
                return item.indexOf(query) > -1;
              });
            }
          });
      } else {
        this.options = [];
      }
    },
    //获取合同类别
    GetContractCategoryList() {
      this.shopHttp.get("/Contract/GetContractCategoryList").then(res => {
        if (res.data.isSuccess == true) {
          this.contractCategoryList = res.data.list;
          this.form2.CategoryId = 1;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //改变合同类型
    handleChangeCategoryId(val) {
      if (val == 1) {
        this.form2.ContractTypeId = "";
        this.form2.ContractNo = "";
      } else {
        this.form2.ContractNo = "";
      }
    },
    handleChangeContractTypeId(val) {
      this.shopHttp
        .get("/Contract/GenerateContractNumber?ContractTypeId=" + val)
        .then(res => {
          if (res.data.isSuccess == true) {
            this.form2.ContractNo = res.data.objects[0];
          } else {
            this.form2.ContractNo = "";
            this.$message.error(res.data.message);
          }
        });
    },
    onSubmit(form2, form3, type) {
      let isValidate = false;
      for(let i = 0; i<this.table3.length; i++){
        if (this.table3[i].Name != "") {
          //循环看 如果有输入姓名
          // if (item.GuestType == "") {
          //   this.$message({ type: "info", message: "请选择类型" });
          //   isValidate = false;
          //   return;
          // } else {
          //   if (item.GuestType != "3" && item.GuestType != "4") {
          //     if (item.CredentialsType == "") {
          //       this.$message({ type: "info", message: "请选择证件类型" });
          //       isValidate = false;
          //       return;
          //     } else {
          //       isValidate = true;
          //     }
          //     if (item.Credentials == "") {
          //       this.$message({ type: "info", message: "请输入证件号码" });
          //       isValidate = false;
          //       return;
          //     } else {
          //       isValidate = true;
          //     }
          //   } else {
          //     //if(item.GuestType == '3' || item.GuestType == '4'){
          //     //	item.CertificateType = '身份证';
          //     //}
          //     isValidate = true;
          //   }
          // }
          if (this.table3[i].Phone == "") {
            this.$message({ type: "info", message: "请输入手机号码" });
            isValidate = false;
            return;
          } else {
            isValidate = true;
          }
        } else {
          //如果没有输入姓名
          if (
            // item.CredentialsType != "" ||
            // item.Sex != "" ||
            // item.GuestType != "" ||
            // item.Credentials != ""
            this.table3[i].Phone !=""
          ) {
            isValidate = false;
            this.$message({ type: "info", message: "请输入姓名" });
            return;
          } else {
            isValidate = true;
          }
        }
      };
      if (isValidate) {
        var obj = {};
        obj.ProductId = this.ProductId;
        obj.Schedule = this.groupTime;
        obj.PackageId = this.linePackageId;
        obj.Price = this.table1;
        // obj.AdditionalAmount = this.additionAmount;
        // obj.DiscountAmount = this.DiscountAmount;
        obj.Amount = this.retailPriceMount;
        //加一个 小项目单价  小项目ID  小项目名称 list集合
        obj.ExtraFee = [];
        for (let i = 0; i < this.smallItemlist.length; i++) {
          let nobj = {};
          nobj["LineExtraFeeId"] = this.smallItemlist[i].id;
          nobj["SmallItemName"] = this.smallItemlist[i].name;
          nobj["SalesPrice"] = this.smallItemlist[i].salesPrice;
          nobj["SettlementPrice"] = this.smallItemlist[i].settlementPrice;
          nobj["Quantity"] = this.smallItemlist[i].personCount;
          obj.ExtraFee.push(nobj);
        }
        obj.CustomerId = this.form2.CustomerId;
        obj.CustomerName = this.form2.CustomerName;
        obj.OrderDate = this.form2.orderDate;
        obj.LinkMan = this.form2.LinkMan;
        obj.LinkMobile = this.form2.LinkMobile;
        obj.LinkQQ = this.form2.LinkQQ;
        obj.LinkEmail = this.form2.LinkEmail;
        obj.ContractNo = this.form2.ContractNo;
        obj.ContractId = this.form2.ContractId;
        obj.FirstLinkMan = this.form3.FirstLinkMan;
        obj.FirstLinkPhone = this.form3.FirstLinkPhone;
        obj.FirstLinkGender = this.form3.FirstLinkGender;
        obj.CommunityShopId = this.form3.CommunityShopId;
        obj.CommunityShopName = this.form3.CommunityShopName;
        obj.InnerCode = this.form3.InnerCode;
        obj.Remark = this.Comment;
        // obj.PositionList = this.table1;
        // obj.AdditionalList = this.table2;
        // let lsguestlist = [];
        // for (let i = 0; i < this.table3.length; i++) {
        //   if (
        //     this.table3[i].Name != "" &&
        //     this.table3[i].GuestType != "" &&
        //     this.table3[i].Sex != ""
        //   ) {
        //     if (this.table3[i].CredentialsType == "身份证") {
        //       this.table3[i].CredentialsType = "1";
        //     }
        //     lsguestlist.push(this.table3[i]);
        //   }
        // }
        obj.TouristList = this.table3
        this.$refs["form2"].validate(valid => {
          if (valid) {
            this.$refs["form3"].validate(valid => {
              if (valid) {
                if (this.personQuantity == 0) {
                  this.$message.error("合计报名人数不能为0");
                } else {
                  // if(!this.isCusInfoPass){
                  //    this.$message.error("请完善旅客信息！！");
                  //   return false;
                  // }
                  // obj.GuestList = this.table3;
                  if (type) {
                    this.submitLoading2 = true;
                  } else {
                    this.submitLoading1 = true;
                  }
                  this.contractTypeList.forEach(item => {
                    if (item.id == this.form2.ContractTypeId) {
                      obj.ContractTypeName = item.name;
                    }
                  });
                  this.contractCategoryList.forEach(item => {
                    if (item.categoryId == this.form2.CategoryId) {
                      this.form2.CategoryName = item.categoryName;
                    }
                  });
                  obj.ContractTypeId = this.form2.ContractTypeId;
                  obj.CategoryId = this.form2.CategoryId;
                  obj.CategoryName = this.form2.CategoryName;
                  this.shopHttp
                    .post("ResourcePlatform/CreateLineOrder", {
                      IsAddCustomer: this.IsAddCustomer,
                      OrderInfo: obj
                    })
                    .then(res => {
                      if (res.data.isSuccess == true) {
                        this.$message({
                          type: "success",
                          message: "下单成功"
                        });
                        if (type == "payment") {
                          this.submitLoading2 = false;
                          let arr = [];
                          arr.push(res.data.settlementId);
                          this.$router.push({
                            name: "receivables",
                            query: {
                              settlementIds: arr,
                              disSettleClientId:
                                res.data.customerSettlementClientId
                            }
                          });
                        } else if (type == "joinPayment") {
                          this.submitLoading2 = false;
                          let arr = [];
                          arr.push(res.data.orderId);
                          this.$router.push({
                            name: "lineOrderPayment",
                            query: { orderIds: arr }
                          });
                        } else {
                          this.submitLoading1 = false;
                          this.$router.go(-1);
                        }
                      } else {
                        this.$message.error("出错了:" + res.data.message);
                        this.submitLoading2 = false;
                        this.submitLoading1 = false;
                      }
                    })
                    .catch(e => {
                      this.$message.error(e);
                      this.submitLoading2 = false;
                      this.submitLoading1 = false;
                    });
                }
              } else {
                this.$message.error("您的预订信息还没有完善");
              }
            });
          } else {
            this.$message.error("您的客户信息还没有完善");
          }
        });
      }
    },
    addTr(str) {
      if (str == "price") {
        this.table2.push({
          AdditionalName: "加价",
          UnitPrice: 0,
          Quantity: 0,
          Comment: "",
          Amount: ""
        });
      } else {
        this.table2.push({
          AdditionalName: "",
          UnitPrice: 0,
          Quantity: 0,
          Comment: "",
          Amount: ""
        });
      }
    },
    discounts(val) {
      var reg = /^([1-9]*[1-9][0-9]*|[0]{1,1})$/;
      if (reg.test(val) || "") {
        this.DiscountAmount = Number(val || 0);
      }
    },
    //添加行
    addTr1() {
      this.table3.push({
        GuestType: "",
        Sex: "",
        Name: "",
        CredentialsType: "",
        Credentials: "",
        Birthday: "",
        Phone: "",
        GatherLocation: ""
      });
    },
    //删除行
    handleDelete1(index, row) {
      this.additionAmount = this.additionAmount - row.Amount;
      this.table2.splice(index, 1);
    },
    handleDelete2(index, row) {
      this.table3.splice(index, 1);
    },
    typeListFun() {
      this.shopHttp
        .post("/GroupLine/GeEnumGuestTypeList")
        .then(res => {
          this.typeList = res.data.keyValueList;
        })
        .catch(e => {
          console.log(e);
        });
    },

    // handleCommunityChange(val) {
    //   this.communityList.forEach(item => {
    //     if (this.form3.CommunityShopId == item.key) {
    //       this.form3.CommunityShopName = item.value;
    //     }
    //   });
    // },
    // seleSite(val) {
    //   this.ProductId = val || this.$route.query.ProductId;
    //   this.linePackageList.forEach((item, index) => {
    //     if (item.key == val) {
    //       this.SourceCityName = item.name;
    //     }
    //   });
    //   this.shopHttp
    //     .post("/GroupLine/GetProductPrice", {
    //       TeamDate: this.groupTime,
    //       ProductId: val || this.$route.query.ProductId
    //     })
    //     .then(res => {
    //       let data = res.data.priceList;
    //       data.forEach(
    //         function(item) {
    //           if (this.companyType == 2) {
    //             if (item.priceType == 1) {
    //               this.table1[0].retailPrice = item.price;
    //               this.table1[1].retailPrice = item.oldPrice;
    //               this.table1[2].retailPrice = item.childPrice;
    //               //this.table1[3].retailPrice = item.babyPrice;
    //             }
    //           }
    //           if (item.priceType == 2) {
    //             this.table1[0].costPrice = item.price;
    //             this.table1[1].costPrice = item.oldPrice;
    //             this.table1[2].costPrice = item.childPrice;
    //             //this.table1[3].costPrice = item.babyPrice;
    //           }
    //           if (item.priceType == 5) {
    //             this.table1[0].salesPrice = item.price;
    //             this.table1[1].salesPrice = item.oldPrice;
    //             this.table1[2].salesPrice = item.childPrice;
    //             //this.table1[3].salesPrice = item.babyPrice;
    //           }
    //         }.bind(this)
    //       );
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
    beforeExcelUpload(file) {
      var reg = /^.*\.(?:xls|xlsx)$/i; //文件名可以带空格
      if (!reg.test(file.name)) {
        //校验不通过
        this.$message.error(
          "请上传Excel类型的文件，建议直接下载模板修改后上传"
        );
        return false;
      }
      return true;
    },
    excelUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      this.uploadHttp
        .post(val.action, f, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          if (res.data.isSuccess) {
            this.table3 = [];
            res.data.objects.forEach(item => {
              var guest = {
                GuestType: item.guestType + "",
                Name: item.guestName,
                CredentialsType: item.certificateType,
                Credentials: item.idCardNO,
                Birthday: item.birthday,
                Sex: item.guestGenderName,
                Phone: item.mobilePhone,
                GatherLocation: item.gatherLocation
              };
              this.table3.push(guest);
            });
          } else {
            this.$message.error(res.data.message);
          }
          this.$refs.excelUpload.clearFiles();
        });
    }
  }
};
</script>
<style scoped lang="scss">
.view .el-date-editor.el-input {
  width: 100%;
}
#form3 .el-form-item {
  width: 40%;
  float: left;
}
.el-form .el-input {
  width: 100%;
}
.text1 {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.form-inline-input {
  width: 40%;
  // float: left;
}

.form-inline-input .el-input {
  width: 70%;
  margin-right: 5%;
}

#form2::after,
#form3::after {
  clear: both;
  content: ".";
  display: block;
  width: 0;
  height: 0;
}

.el-row {
  margin: 5px 0 15px 0;
  padding-left: 10px;
}

.el-col {
  padding-right: 25px;
}
.but_marginbom {
  margin-bottom: 10px;
}
.el-form .el-input {
  width: 200px;
}
</style>
