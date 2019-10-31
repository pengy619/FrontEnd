<template>
  <div class='view' v-loading.fullscreen.lock="fullscreenLoading">
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
          <el-col :span="2" class="text1">出团团期</el-col>
          <el-col :span="20">{{groupTime}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">线路类型</el-col>
          <el-col :span="20">{{routeType}}</el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div>
        <h4>客户信息</h4>
      </div>
      <div>  
        <el-form ref="form2" :model="form2" :rules='rules2' label-width="120px" id="form2" size="small" :inline="true">
          <el-form-item label="客户" class="form-inline-input" prop='CustomerId'>
            <el-select
              v-model="form2.CustomerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="getLinkMessage"
              :loading="loading">
              <el-option
                v-for="item in options4"
                :key="item.disCompanyInfoId"
                :label="item.customerName"
                :value="item.disCompanyInfoId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" class="form-inline-input" prop='LinkMan'>
            <el-input v-model="form2.LinkMan"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" class="form-inline-input" prop='LinkMobile'>
            <el-input v-model="form2.LinkMobile"></el-input>
          </el-form-item>
          <el-form-item label="QQ" class="form-inline-input" prop='LinkQQ'>
            <el-input v-model="form2.LinkQQ"></el-input>
          </el-form-item>
          <el-form-item label="Email" class="form-inline-input" prop='LinkEmail'>
            <el-input v-model="form2.LinkEmail"></el-input>
          </el-form-item>
          <el-form-item label="订单日期" class="form-inline-input" prop='orderDate'>
            <el-date-picker
              v-model="form2.orderDate"
              type="date"
              placeholder="选择日期"
              :picker-options="StartDisableDate"
              >
            </el-date-picker>
          </el-form-item>
        <el-form-item label="合同类别" class="form-inline-input" prop='CategoryId'>
					<el-select v-model="form2.CategoryId" @change="handleChangeCategoryId">
						<el-option
							v-for="item in contractCategoryList"
							:key="item.categoryId"
							:label="item.categoryName"
							:value="item.categoryId">
						</el-option>
					</el-select>
				</el-form-item>
			<el-form-item label="合同号" class="form-inline-input" prop='ContractNo' v-if="form2.CategoryId==1">
				<el-select
				v-model="form2.ContractNo"
				filterable
				remote
				reserve-keyword
				placeholder="请输入关键词"
				:remote-method="searchContractNo"
				:loading="loading">
					<el-option
						v-for="item in options"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="ContractTypeId" label="合同类型" size="small"  class="form-inline-input"  v-if="form2.CategoryId==2">
				<el-select v-model="form2.ContractTypeId" placeholder="请选择" @change="handleChangeContractTypeId">
					<el-option
						v-for="item in contractTypeList"
						:key="item.id"
						:label="item.name"
						:value="item.id"
						v-show="item.name !='全部'">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="合同号" class="form-inline-input" v-show="form2.CategoryId==2">
				{{form2.ContractNo}}
			</el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <div>
        <h4>预订信息</h4>
      </div>
      <div>
        <el-form ref="form3" :model="form3" :rules='rules3' label-width="120px" id="form3" size="small">
          <el-form-item label="主要联系人" prop='FirstLinkMan'>
            <el-input v-model="form3.FirstLinkMan"></el-input>
          </el-form-item>
          <el-form-item label="主要联系人电话" prop='FirstLinkPhone'>
            <el-input v-model="form3.FirstLinkPhone"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form3.FirstLinkGender">
              <el-radio :label="1">先生</el-radio>
              <el-radio :label="2">女士</el-radio>
             </el-radio-group>
          </el-form-item>
          <el-form-item label="添加为游客">
            <el-radio-group v-model="IsAddCustomer">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出发地" prop='CustomerSource'>
            <el-select v-model="form3.CustomerSource" placeholder="请选择" @visible-change="clientSiteFun" @change="seleSite">
              <el-option
                v-for="item in clientSite"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源" >
            <el-select v-model="form3.CommunityShopId" placeholder="请选择" @change="handleCommunityChange">
              <el-option
                v-for="item in communityList"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内部编码" prop='InnerCode'>
            <el-input v-model="form3.InnerCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <h4>附加表</h4>
        <div>
          <el-table :data="tableData1" border show-summary style="margin-bottom:20px;" :summary-method="getSummaries">
            <el-table-column prop="priceName"
                             label="价格名称"
            >
            </el-table-column>
            <el-table-column prop="priceTypeName"
                             label="价格类型">
            </el-table-column>
            <el-table-column prop="salesPrice" label="直客销售价">
            </el-table-column>
            <el-table-column prop="retailPrice"
                             label="同行结算价" v-if="companyType==2">
            </el-table-column>
            
            <el-table-column prop="costPrice" label="媒体外卖价">
            </el-table-column>
            <el-table-column
              label="人数" prop="Quantiy">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.Quantiy" :min='0' :max='999999'></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
       <div v-if="smallItemlist.length!=0">
      <h4>小项目</h4>
      <el-form>
           <el-row :gutter="24" v-for="(item,index) in smallItemlist" :key="index" class="margin_bottom_0">
              <el-col :span="24">
                <el-form-item label='' label-width='' class="margin_bottom_0">
                        <el-checkbox size='small'  v-model="item.isCheck">{{item.smallItemsName}}</el-checkbox>
                  </el-form-item>
              </el-col>
            <el-col :span="24">
              <el-form-item label='直客销售价' label-width='120px' class="margin_bottom_0">
                  <el-input size='small' :disabled="true" v-model="item.marketPrice" ></el-input>
                 <span class="margin_left">人数：</span> <el-input-number size='small' :min="0" :max="maxCount"  v-model="item.personCount" ></el-input-number>
              </el-form-item>
            </el-col>
            
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24" >
                <el-form-item label='合计' label-width='120px'>
                  <el-input size='small' :disabled="true" v-model="smallCount"></el-input>
              </el-form-item>
            </el-col>
         </el-row>
        </el-form>
        
    </div>
    <h4>附加费用</h4>
		<el-button type="primary" @click="addTr" class="but_marginbom"  size="small"  v-if="companyType!=2">添加行</el-button>
		<el-button type="primary" @click="addTr('price')" class="but_marginbom" size="small" v-if="companyType!=2">加价</el-button>
		<div>
			<el-table :data="tableData2"  v-if="companyType!=2"
					border
					class="margin_bottom inner-full">
			<el-table-column prop="AdditionalName"
							label="费用名">
				<template slot-scope="scope">
				<el-input size="small" v-model="scope.row.AdditionalName"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="UnitPrice"
							label="价格">
				<template slot-scope="scope">
				<el-input-number size="small" v-model="scope.row.UnitPrice"  :min="0" :max="999999999" :controls="false"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="Quantity"
							label="数量">
				<template slot-scope="scope">
				<el-input-number size="small" v-model="scope.row.Quantity"  :min="0" :max="999999999" :controls="false"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="Comment"
							label="说明">
				<template slot-scope="scope">
				<el-input size="small" v-model="scope.row.Comment"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="Amount"
							label="合计">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
				<el-button
					size="mini"
					type="danger"
					@click="handleDelete1(scope.$index, scope.row)">删除
				</el-button>
				</template>
			</el-table-column>
			</el-table>
			<!--<span class="demonstration">内部价: </span>-->
			<!--<el-input style='width:15%;margin-right:20px;' size="small" v-model="interiorAmount" :disabled="true"></el-input>-->
			<span class="demonstration" v-if="companyType!=2">附加费: </span>
			<el-input class="input_comm margin_right"  v-if="companyType!=2" size="small" v-model="additionAmount" :disabled="true"></el-input>
			<span class="demonstration" v-if="companyType!=2">优惠: </span>
			<el-input-number class="input_comm margin_right"  v-if="companyType!=2" :min="0" :max="999999999" :controls="false" size="small"  @change="discounts" v-model="DiscountAmount"></el-input-number>
			<span class="demonstration">直客总价: </span>
			<el-input  class="input_comm margin_right" size="small" :disabled="true" v-model="aggregateAmount"></el-input>
			<span class="demonstration"  v-if="companyType==2">同行总价: </span>
			<el-input  class="input_comm" size="small" :disabled="true" v-model="retailPriceMount"  v-if="companyType==2"></el-input>
		</div>
	</div>
    <div>
      <div>
        <h4>旅客信息</h4>
      </div>
      <div>
        <el-button type="primary" @click="addTr1" class="but_marginbom" icon='el-icon-plus' size='small'>添加行</el-button>
        <!-- <el-button type="primary">导入</el-button> -->
      </div>
      <el-table
        :data="table3"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="GuestName"
          label="姓名"
          >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.GuestName"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="GuestType"
          label="类型"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.GuestType" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="GuestGender"
          label="性别"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.GuestGender" placeholder="请选择" size="small" >
              <el-option
                v-for="item in sex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="MobilePhone"
          label="手机号"
          >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.MobilePhone"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="CertificateType"
          label="证件类型"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.CertificateType" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in cardList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="IDCardNO"
          label="证件号码"
          width="160"
         >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.IDCardNO"></el-input>
          </template>
        </el-table-column>
         <el-table-column
          prop="Birthday"
          label="出生日期"
          width="150"
          >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.Birthday"
              type="date"
              placeholder="选择日期" size="small" class="date_width" style='width:100%;'>
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="GatherLocation"
          label="集合地点"
         >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.GatherLocation"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
         >
          <template slot-scope="scope">
            <el-button @click="handleDelete2(scope.$index, scope.row)" type="danger" size="small" icon='el-icon-delete'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <h4>备注</h4>
      <el-input type="textarea" :rows="4" v-model="Comment"></el-input>
      <div style="margin-top:15px;">
        <el-button type="primary" size="small" @click="onSubmit('form2','form3')" :loading="submitLoading1">确 定</el-button>
        <el-button type="" size="small" @click="goBack">返 回</el-button>
			<el-button type="primary" size="small" @click="onSubmit('form2','form3','payment')" v-if="companyType==1" :loading="submitLoading2">收款</el-button>
			<el-button type="primary" size="small" @click="onSubmit('form2','form3','joinPayment')" v-else-if="companyType==2" :disabled="confirmType!=4" :loading="submitLoading2">支付</el-button>
      </div>
    </div>
  </div>
</template>
<script>
	//预留单页面
	import { dateFmt } from "@/utils/tools";
	var _index = 1;
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
		StartDisableDate: {
			disabledDate: date => {
			return date.getTime() < Date.now() - 3600 * 1000 * 24;
			}
        },
		confirmType:this.$route.query.confirmType,
		companyType:localStorage.getItem('companyType'),
		smallItemlist:[],//小项目列表
		contractCategoryList:[],//合同类别列表
		contractTypeList:[],//合同类型列表
		smallCount:'',//小项目合计
		smallPeerCount:0,//小项目同行价合计
		pricecount:0,//附加表各项价格数量
		submitLoading1: false,
		submitLoading2: false,
		additionAmount: 0, //附加费用
		interiorAmount: 0, //价格
		peerAmount:0,//附加表同行价合计
		DiscountAmount: 0, //折扣金额
		IsAddCustomer: false,
		client: [],
		clientSite: [],
		sex: [
			{
			value: "1",
			label: "男"
			},
			{
			value: "2",
			label: "女"
			}
		],
		ProductId: "",
		typeList: [],
		cardList: [],
		lineId: "",
		routeName: "",
		routeType: "",
		groupTime: "",
		groupNum: "",
		teamNo: "",
		SourceCityName: "",
		Comment: "",
		form2: {
			CustomerId: "",
			LinkMan: "",
			LinkMobile: "",
			LinkQQ: "",
			LinkEmail: "",
			ContractNo: "",
			ContractId: 0,
			orderDate: ""
		},
		rules2: {
			CustomerId: [
			{
				type: "number",
				required: true,
				message: "您还没有选择客户名称",
				trigger: "change"
			}
			],
			ContractNo: [{ required: true, message: "您还没有输入合同号", trigger: "blur" }],
			orderDate: [
			{ required: true, validator: checkOrderDate, trigger: "blur" }
			]
		},
		pricetypename: "",
		peopleNumber: "",
		fullscreenLoading: false,
		options4: [],
		list: [],
		options: [],
		contractList: [],
		loading: false,
		curPriceType: "",
		form3: {
			FirstLinkMan: "",
			pFirstLinkPhonehone: "",
			FirstLinkGender: 1,
			CustomerSource: "",
			CommunityShopId:'',
			CommunityShopName:'',
      InnerCode:''
		},
		communityList:[{key:'',value:'请选择'}],
		rules3: {
			FirstLinkMan: [
			{ required: true, message: "您还没有输入联系人", trigger: "blur" }
			],
			FirstLinkPhone: [
			{ required: true, validator: checkPhone, trigger: "blur" }
			],
			CustomerSource: [
			{ required: true, message: "您还没有选择出发地", trigger: "change" }
			],
      InnerCode:[
        {required: true,message:'您还没有输入内部编码', trigger: 'blur'}
      ]
		},
		table1: [
			{
			priceName: "成人价",
			priceTypeName: "成人",
			GuestType: 1,
			PriceType: 5,
			retailPrice: 0,
			costPrice:0,
			salesPrice:0,
			Quantiy: "",
			Amount: ""
			},
			{
			priceName: "老人价",
			priceTypeName: "老人",
			GuestType: 2,
			PriceType: 5,
			retailPrice: 0,
			costPrice:0,
			salesPrice:0,
			Quantiy: "",
			Amount: ""
			},
			{
			priceName: "儿童价",
			priceTypeName: "儿童",
			PriceType: 5,
			GuestType: 3,
			retailPrice: 0,
			costPrice:0,
			salesPrice:0,
			Quantiy: "",
			Amount: ""
			},
			//{
			//  priceName: "婴儿价",
			//  priceTypeName: "婴儿",
			//  PriceType: 5,
			//  GuestType: 4,
			//  retailPrice: 0,
			//  costPrice:0,
			//  salesPrice:0,
			//  Quantiy: "",
			//  Amount: ""
			//}
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
			GuestGender: "",
			GuestName: "",
			CertificateType: "",
			IDCardNO: "",
			Birthday: "",
			MobilePhone: "",
			GatherLocation: ""
			}
		]
		};
	},
	computed: {
		tableData1() {
			this.personQuantiy=0;
			this.interiorAmount=0;
			this.peerAmount=0;
			var interiorArr = [];
			var peopleNumArr = [];
			let count =0;
			this.smallCount=0;
			this.smallPeerCount=0;
			this.table1.map((v, i) => {
				this.personQuantiy+=(v.Quantiy||0);
				v.Amount = v.salesPrice * (v.Quantiy||0);
				// interiorArr[i] = v.Amount;
				peopleNumArr[i] = (v.Quantiy||0);
				count += (v.Quantiy||0);
				this.peopleNumber = peopleNumArr.reduce((prev, curr) => {
				return prev + curr;
				});
				this.interiorAmount += v.Amount;
				this.peerAmount += v.retailPrice * (v.Quantiy||0);
			});
			this.maxCount=count;
			let smalllistlength = this.smallItemlist.length;
			for(let i=0;i<smalllistlength;i++){
				if(this.smallItemlist[i].isCheck){
					if(this.smallItemlist[i].personCount>count){
						this.smallItemlist[i].personCount=count;
					}
					this.smallCount += Number(this.smallItemlist[i].marketPrice)*Number(this.smallItemlist[i].personCount||0);
					this.smallPeerCount += Number(this.smallItemlist[i].toPrice)*Number(this.smallItemlist[i].personCount||0);
				}
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
			return (
				Number(this.additionAmount) +
				Number(this.interiorAmount) -
				Number(this.DiscountAmount)+  Number(this.smallCount)
			);
		},
		retailPriceMount: function() {
			return (
				Number(this.additionAmount) +
				Number(this.peerAmount) -
				Number(this.DiscountAmount||0) +  Number(this.smallPeerCount)
			);
		},
	},
	mounted() {
		this.typeListFun();
		this.cardListFun();
		this.getConvertInfo();
		this.getCurPriceType();
		this.form2.orderDate = dateFmt(new Date(), "yyyy-MM-dd");
		this.priceTypeText();
		this.getLineSmallitem();
		this.GetContractType();
		this.GetContractCategoryList();
		this.getOrderSource();
	},
	watch: {
		table3: {
		handler: function(newVal) {
			newVal.forEach((item, index) => {
			if (item.CertificateType == 1 && item.IDCardNO.length == 18) {
				let yyyy = item.IDCardNO.substring(6, 10);
				let mm = item.IDCardNO.substring(10, 12);
				let dd = item.IDCardNO.substring(12, 14);
				item.Birthday = yyyy + "-" + mm + "-" + dd;
			}
			});
		},
		deep: true
		}
	},
	methods: {
		getSummaries(param) {
		const { columns, data } = param;
		const sums = [];
		let columnNum=4;
			if(this.companyType==2){
			columnNum=5;
			}
		columns.forEach((column, index) => {
			if (index === 0) {
			sums[index] = "合计";
			return;
			}
			const values = data.map(item => Number(item[column.property]));
			sums[columnNum] = values.reduce((prev, curr) => {
			const value = Number(curr);
			if (!isNaN(value)) {
				return prev + curr;
			} else {
				return prev;
			}
			}, 0);
		});
		return sums;
		},
		//获取价格类型
		getCurPriceType() {
		this.shopHttp.post("/GroupLine/GetCurPriceType").then(res => {
			if (res.status == 200) {
			this.curPriceType = res.data;
			}
		});
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
		//获取基本资料
		getConvertInfo() {
		this.fullscreenLoading == true;
		this.shopHttp
			.get(
			"/GroupLine/GetConvertInfo?purchaseId=" + this.$route.query.purchaseId
			)
			.then(res => {
			if (res.data.isSuccess == true) {
				this.fullscreenLoading = false;
				this.groupNum = res.data.dto.lineCode;
				this.lineId = res.data.dto.lineId;
				this.routeName = res.data.dto.lineName;
				this.routeType = res.data.dto.lineTypeName;
				this.teamNo = res.data.dto.teamCode;
				let time = new Date(res.data.dto.teamDate);
				this.groupTime = dateFmt(time, "yyyy-MM-dd");
			} else {
				this.$message.error(res.date.message);
				this.fullscreenLoading = false;
			}
			})
			.catch(e => {
			console.log(e);
			});
		},
		goBack() {
		this.$router.go(-1);
		},
		getLinkMessage(val) {
		this.shopHttp
			.post("/SettleClient/GetCustomerOrder", { DisCompanyInfoId: val })
			.then(res => {
			this.form2.LinkMan = res.data.contanct;
			this.form2.LinkMobile = res.data.mobilePhone;
			this.form2.LinkEmail = res.data.mailbox;
			});
		},
		//客户资料
		remoteMethod(query) {
		// if (query !== "") {
			this.loading = true;
			this.shopHttp
			.get("SettleClient/GetCustomerDrop?CustomerName=" + query)
			.then(res => {
				if (res.data.isSuccess == true) {
				this.list = res.data.objects;
				this.loading = false;
				this.options4 = this.list.filter(item => {
					return item.customerName.indexOf(query) > -1;
				});
				}
			});
		// } else {
		//   this.options4 = [];
		// }
		},
		getLineSmallitem(){//获取小项目列表
			var _this = this;
			_this.shopHttp.get('/GroupLineSmallItemShop/GroupLineSmallItemPriceOrderList?Id=0&pageSize=99999&LineId='+this.$route.query.lineId).then(res=>{
				console.log(res);
				if(res.data.isSuccess){
					_this.smallItemlist = res.data.objects;
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		//合同搜索
		searchContractNo(query){
			// if (query !== '') {
			this.loading = true;
			this.shopHttp.get('Contract/GetAvailableContractNos?ContractNo='+query).then(res=>{
				if(res.data.isSuccess == true){
				console.log(res.data.objects)
				this.contractList = res.data.objects;
				this.loading = false;
				this.options = this.contractList.filter(item => {
					return item.indexOf(query) > -1;
				});
				}
			})
			// } else {
			//   this.options = [];
			// }
		},
		//获取合同类型
		GetContractType(){
			this.shopHttp.get('/Contract/GetContractTypeNames').then(res=>{
				if(res.data.isSuccess == true){
					this.contractTypeList = res.data.objects
				}else{
					this.$message.error(res.data.message)
				}
			})
		},
		//获取合同类别
		GetContractCategoryList(){
			this.shopHttp.get('/Contract/GetContractCategoryList').then(res=>{
				if(res.data.isSuccess == true){
				this.contractCategoryList=res.data.list;
				}else{
				this.$message.error(res.data.message);
				}
			})
		},
		//改变合同类型
		handleChangeCategoryId(val){
		if(val==1){
			this.form2.ContractTypeId=''
		}else{
			this.form2.ContractNo= ""
		}
		},
		handleChangeContractTypeId(val){
			this.shopHttp.get('/Contract/GenerateContractNumber?ContractTypeId='+val).then(res=>{
				if(res.data.isSuccess == true){
					this.form2.ContractNo = res.data.objects[0]
				}else{
				this.form2.ContractNo='';
					this.$message.error(res.data.message)
				}
			})
		},
		onSubmit(form2, form3, type) {
		var obj = {};
		obj.ProductId = this.ProductId;
		obj.DepartureDate = this.groupTime;
		obj.SourceCityName = this.SourceCityName;
		obj.AdditionalAmount = this.additionAmount;
		obj.DiscountAmount = this.DiscountAmount;
		obj.Amount = this.aggregateAmount;
		
		//加一个 小项目单价  小项目ID  小项目名称 list集合
			obj.SmallItemOrderList = [];
			for(let i=0;i<this.smallItemlist.length;i++){
				if(this.smallItemlist[i].isCheck){
					let nobj = {};
					nobj['SmallItemPriceId'] = this.smallItemlist[i].smallItemPriceId;
					nobj['SmallItemsName'] = this.smallItemlist[i].smallItemsName;
					nobj['SmallitemAmount'] = this.smallItemlist[i].marketPrice;
					obj.SmallItemOrderList .push(nobj);
				}
			}

		obj.CustomerId = this.form2.CustomerId;
		this.options4.forEach(item => {
			if (item.disCompanyInfoId == this.form2.CustomerId) {
			obj.CustomerName = item.customerName;
			}
		});
		obj.orderDate = this.form2.orderDate;
		obj.LinkMan = this.form2.LinkMan;
		obj.LinkMobile = this.form2.LinkMobile;
		obj.LinkQQ = this.form2.LinkQQ;
		obj.LinkEmail = this.form2.LinkEmail;
		obj.ContractNo = this.form2.ContractNo;
		obj.ContractId = this.form2.ContractId;
		obj.FirstLinkMan = this.form3.FirstLinkMan;
		obj.FirstLinkPhone = this.form3.FirstLinkPhone;
		obj.FirstLinkGender = this.form3.FirstLinkGender;
		obj.CustomerSource = this.form3.CustomerSource;
		obj.CommunityShopId= this.form3.CommunityShopId;
		obj.CommunityShopName= this.form3.CommunityShopName;
    obj.InnerCode = this.form3.InnerCode;
		(obj.TeamNo = this.teamNo), (obj.Comment = this.Comment);
		obj.PositionList = this.table1;
		obj.AdditionalList = this.table2;
		this.table3.forEach((item, index) => {
			for (let k in item) {
			if (item[k] != "") {
				obj.GuestList = this.table3;
			}
			}
		});
		this.$refs["form2"].validate(valid => {
			if (valid) {
			this.$refs["form3"].validate(valid => {
				if (valid) {
				if (this.peopleNumber != this.$route.query.quantity) {
					this.$message.error("合计报名人数必须与预留人数一致");
				} else {
					if (type == "payment") {
					this.submitLoading2 = true;
					} else {
					this.submitLoading1 = true;
          }

          this.contractTypeList.forEach(item => {
            if (item.id == this.form2.ContractTypeId) {
              this.form2.ContractTypeName = item.name;
            }
          })
          this.contractCategoryList.forEach(item => {
            if (item.categoryId == this.form2.CategoryId) {
              this.form2.CategoryName = item.categoryName
            }
          })
          obj.ContractTypeId = this.form2.ContractTypeId;
          obj.ContractTypeName = this.form2.ContractTypeName;
          obj.CategoryId = this.form2.CategoryId;
          obj.CategoryName = this.form2.CategoryName;

					this.shopHttp
					.post("/GroupLine/ConvertToLineOrder", {
						IsAddCustomer: this.IsAddCustomer,
						PurchaseId: this.$route.query.purchaseId,
						Dto: obj
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
							query: { settlementIds: arr,disSettleClientId: res.data.customerSettlementClientId },
							});
						}else if (type == "joinPayment") {
							this.submitLoading2 = false;
							let arr = [];
							arr.push(res.data.orderId);
							this.$router.push({
							name: "lineOrderPayment",
							query: { orderIds: arr},
							});
						} else {
							this.submitLoading1 = false;
							this.$router.go(-1);
						}
						} else {
						this.$message.error("出错了:" + res.data.message);
						setTimeout(() => {
							if (type == "payment") {
							this.submitLoading2 = false;
							} else {
							this.submitLoading1 = false;
							}
						}, 500);
						}
					})
					.catch(e => {
						this.$message.error(e);
						setTimeout(() => {
						if (type == "payment") {
							this.submitLoading2 = false;
						} else {
							this.submitLoading1 = false;
						}
						}, 500);
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
		},
		addTr() {
			this.table2.push({
				AdditionalName: "",
				UnitPrice: 0,
				Quantity: 0,
				Comment: "",
				Amount: 0
			});
		},
		discounts(val) {
			var reg = /^([1-9]*[1-9][0-9]*|[0]{1,1})$/;
			if (reg.test(val) || "") {
				this.DiscountAmount = Number(val);
			}
		},
		//添加行
		addTr1() {
			this.table3.push({
				GuestType: "",
				GuestGender: "",
				GuestName: "",
				CertificateType: "",
				IDCardNO: "",
				Birthday: "",
				MobilePhone: "",
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
		cardListFun() {
		this.shopHttp
			.post("/GroupLine/GeEnumCardList")
			.then(res => {
			this.cardList = res.data.keyValueList;
			})
			.catch(e => {
			console.log(e);
			});
		},
		//订单来源
		getOrderSource() {
		this.shopHttp
			.get("/Member/GetCommunityShopListByShopId")
			.then(res => {
			if(res.data.isSuccess){
				this.communityList = this.communityList.concat(res.data.objects);
			}else{
					this.$message.error(res.data.message)
			}
			
			})
			.catch(e => {
			console.log(e);
			});
		},
		handleCommunityChange(val){
		this.communityList.forEach(item=>{
			if(this.form3.CommunityShopId==item.key){
			this.form3.CommunityShopName=item.value;
			}
		})
		},
		//出发地
		clientSiteFun(open, close) {
		if (open) {
			this.shopHttp
			.post("/GroupLine/GetCustomerSource", {
				TeamDate: this.groupTime,
				lineId: this.lineId
			})
			.then(res => {
				this.clientSite = res.data.keyValueList;
			})
			.catch(e => {
				console.log(e);
			});
		}
		},
		seleSite(val) {
		this.ProductId = val;
		this.clientSite.forEach((item, index) => {
			if (item.key == val) {
			this.SourceCityName = item.name;
			}
		});
		this.shopHttp
			.post("/GroupLine/GetProductPrice", {
			TeamDate: this.groupTime,
			ProductId: val
			})
			.then(res => {
			let data = res.data.priceList;
			data.forEach(
				function(item) {
				if(this.companyType==2){
					if (item.priceType == 1) {
					this.table1[0].retailPrice = item.price;
					this.table1[1].retailPrice = item.oldPrice;
					this.table1[2].retailPrice = item.childPrice;
					//this.table1[3].retailPrice = item.babyPrice;
					}
				}
				if (item.priceType == 2) {
					this.table1[0].costPrice = item.price;
					this.table1[1].costPrice = item.oldPrice;
					this.table1[2].costPrice = item.childPrice;
					//this.table1[3].costPrice = item.babyPrice;
				}
				if (item.priceType == 5) {
					this.table1[0].salesPrice = item.price;
					this.table1[1].salesPrice = item.oldPrice;
					this.table1[2].salesPrice = item.childPrice;
					//this.table1[3].salesPrice = item.babyPrice;
				}
				}.bind(this)
			);
			})
			.catch(e => {
			console.log(e);
			});
		},
		
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
