<template>
	<div class='view'>
		<el-form ref="form" :model="form.GroupLineOfflineOrder" :rules="rules" label-width="120px" id="form" size="small" :inline="true">
			<div>
				<div>
					<h4>线路信息</h4>
				</div>
				<div>
					<el-form-item label="线路名称" class="form-inline-input" prop="LineName">
						<el-input v-model="form.GroupLineOfflineOrder.LineName" ></el-input>
					</el-form-item>
					<el-form-item label="出团日期" class="form-inline-input" prop="DepartureDate">
						<el-date-picker v-model="form.GroupLineOfflineOrder.DepartureDate" type="date" placeholder="选择日期" :picker-options="StartDisableDate">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="团号" class="form-inline-input" prop="TeamNo">
						<el-input v-model="form.GroupLineOfflineOrder.TeamNo"></el-input>
					</el-form-item>

          <el-form-item label="行程单" class="form-inline-input" prop="TripFileUrl">
            <el-upload
              action="/file/upload"
              :http-request="tripUpload"
              :limit="2"
              :multiple="true"
              accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              :file-list="tripList"
              :before-upload="tripBeforeAvatarUpload"
              :on-remove="tripHandleRemoveQualifications"
              class="upload-demo"
              name="uploadWordFile"
              id="uploadWordFile"
								>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过15M</div>
            </el-upload>
          </el-form-item>
				</div>
			</div>
			<div>
				<div>
					<h4>客户信息</h4>
				</div>
				<div>
					<el-form-item label="客户" class="form-inline-input" prop='CustomerId'>
						<el-select v-model="form.GroupLineOfflineOrder.CustomerId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" @change="getLinkMessage" :loading="loading">
							<el-option v-for="item in customerList" :key="item.disCompanyInfoId" :label="item.customerName" :value="item.disCompanyInfoId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系人" class="form-inline-input" prop='LinkMan'>
						<el-input v-model="form.GroupLineOfflineOrder.LinkMan"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" class="form-inline-input" prop='LinkMobile'>
						<el-input v-model="form.GroupLineOfflineOrder.LinkMobile"></el-input>
					</el-form-item>
					<el-form-item label="QQ" class="form-inline-input">
						<el-input v-model="form.GroupLineOfflineOrder.LinkQQ"></el-input>
					</el-form-item>
					<el-form-item label="Email" class="form-inline-input">
						<el-input v-model="form.GroupLineOfflineOrder.LinkEmail"></el-input>
					</el-form-item>
					<el-form-item label="订单日期" class="form-inline-input" prop='OrderDate'>
						<el-date-picker
						v-model="form.GroupLineOfflineOrder.OrderDate"
						type="date"
						placeholder="选择日期"
						:picker-options="StartDisableDate"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="合同类别" class="form-inline-input" prop='CategoryId'>
						<el-select v-model="form.GroupLineOfflineOrder.CategoryId" @change="handleChangeCategoryId">
							<el-option
								v-for="item in contractCategoryList"
								:key="item.categoryId"
								:label="item.categoryName"
								:value="item.categoryId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="合同号" class="form-inline-input" prop='ContractNo' v-if="form.GroupLineOfflineOrder.CategoryId==1">
						<el-select
						v-model="form.GroupLineOfflineOrder.ContractNo"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="searchContractNo"
						:loading="loading">
							<el-option
								v-for="item in contractList"
								:key="item"
								:label="item"
								:value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="ContractTypeId" label="合同类型" size="small"  class="form-inline-input"  v-if="form.GroupLineOfflineOrder.CategoryId==2">
						<el-select v-model="form.GroupLineOfflineOrder.ContractTypeId" placeholder="请选择" @change="handleChangeContractTypeId">
							<el-option
								v-for="item in contractTypeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
								v-show="item.name !='全部'">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="合同号" class="form-inline-input" v-show="form.GroupLineOfflineOrder.CategoryId==2">
						{{form.GroupLineOfflineOrder.ContractNo}}
					</el-form-item>
				
				</div>
				<div>
					<h4>预订信息</h4>
				</div>
				<div>
					<el-form-item label="主要联系人" prop="FirstLinkMan">
						<el-input v-model="form.GroupLineOfflineOrder.FirstLinkMan"></el-input>
					</el-form-item>
					<el-form-item label="主要联系人电话" prop="FirstLinkPhone">
						<el-input v-model="form.GroupLineOfflineOrder.FirstLinkPhone"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="form.GroupLineOfflineOrder.FirstLinkGender">
							<el-radio :label="1">先生</el-radio>
							<el-radio :label="2">女士</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="添加为游客">
						<el-radio-group v-model="form.IsAddCustomer">
							<el-radio :label="true">是</el-radio>
							<el-radio :label="false">否</el-radio>
						</el-radio-group>
					</el-form-item>
          <el-form-item label="内部编码">
            <el-input v-model="form.GroupLineOfflineOrder.InnerCode"></el-input>
          </el-form-item>
				</div>
				<div>
					<h4>价格表</h4>
					<div>
						<el-table :data="tableData1" border show-summary style="width: 100%;margin-bottom:20px;" :summary-method="getSummaries" required>
							<el-table-column prop="priceName" label="价格名称">
							</el-table-column>
							<el-table-column prop="priceTypeName" label="价格类型">
							</el-table-column>
							<el-table-column label="同行结算价">
								<template slot-scope="scope">
									<el-input-number :controls="false" size="small" v-model="scope.row.retailPrice" :min='0' :max='999999'></el-input-number>
								</template>
							</el-table-column>
							<el-table-column label="人数" prop="Quantiy">
								<template slot-scope="scope">
									<el-input-number size="small" v-model="scope.row.Quantiy" :min='0' :max='999999'></el-input-number>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			
			<h4>附加费用</h4>
			<el-button type="primary" @click="addTr" class="but_marginbom"  size="small">添加行</el-button>
			<div>
				<el-table :data="tableData2" border style="width: 100%" class="margin_bottom inner-full">
					<el-table-column prop="AdditionalName" label="费用名">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.AdditionalName"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="UnitPrice" label="价格">
						<template slot-scope="scope">
							<el-input-number  :min="0" :max="999999999" :controls="false" size="small" v-model="scope.row.UnitPrice"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="Quantity" label="数量">
						<template slot-scope="scope">
							<el-input-number  :min="0" :max="999999999" :controls="false" size="small" v-model="scope.row.Quantity"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="Comment" label="说明">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.Comment"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="danger" @click="handleDelete1(scope.$index, scope.row)">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<span class="demonstration">附加费: </span>
				<el-input class="input_comm margin_right"  size="small" v-model="form.GroupLineOfflineOrder.AdditionalAmount" :disabled="true"></el-input>
				<span class="demonstration">优惠: </span>
				<el-input-number class="input_comm margin_right"  :min="0" :max="999999999" :controls="false" size="small" @change="discounts" v-model="form.GroupLineOfflineOrder.DiscountAmount"></el-input-number>
				<span class="demonstration">总价: </span><span style="display:none;">{{aggregateAmount}}</span>
				<el-input class="input_comm"  size="small" :disabled="true" v-model="form.GroupLineOfflineOrder.Amount"></el-input>
			</div>
		</div>
		</el-form>
		<div>
			<div>
				<h4>旅客信息</h4>
			</div>
			<div>
				<el-button type="primary" @click="addTr1" class="but_marginbom" size="small">添加行</el-button>
				<!-- <el-button type="primary" size="small">导入</el-button>
				<el-button type="primary" size="small">导出</el-button> -->
			</div>
			<el-table :data="form.GroupLineOfflineOrderGuests" border style="width: 100%" class="inner-full">
				<el-table-column fixed type="selection" width="50">
				</el-table-column>
				<el-table-column prop="GuestName" label="姓名" width="100">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.GuestName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="GuestType" label="类型">
					<template slot-scope="scope">
						<el-select v-model="scope.row.GuestType" placeholder="请选择" size="small" class="select_width">
							<el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.key">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="GuestGender" label="性别">
					<template slot-scope="scope">
						<el-select v-model="scope.row.GuestGender" placeholder="请选择" size="small" class="select_width">
							<el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="MobilePhone" label="手机号">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.MobilePhone"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="CertificateType" label="证件类型">
					<template slot-scope="scope">
						<el-select v-model="scope.row.CertificateType" placeholder="请选择" size="small" class="select_width">
							<el-option v-for="item in cardList" :key="item.key" :label="item.name" :value="item.key">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="IDCardNO" label="证件号码">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.IDCardNO"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="Birthday" label="出生日期">
					<template slot-scope="scope">
						<el-date-picker v-model="scope.row.Birthday" type="date" placeholder="选择日期" size="small" class="date_width">
						</el-date-picker>
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
			<div>
				<h4>供应商信息</h4>
			</div>
			<div>
				<el-form ref="form" :model="form.GroupLineOfflineSupplier" :rules="rules" label-width="120px" id="form" size="small" :inline="true">
					<el-row>
						<el-form-item label="供应商名称" class="form-inline-input" prop="SupplierName">
							<el-input v-model="form.GroupLineOfflineSupplier.SupplierName"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="联系人" class="form-inline-input" prop="LinkName">
							<el-input v-model="form.GroupLineOfflineSupplier.LinkName"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="联系方式" class="form-inline-input" prop="LinkPhone">
							<el-input v-model="form.GroupLineOfflineSupplier.LinkPhone"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-col style="width:355px;margin-bottom:0;padding-right:0">
							<el-form-item label="联系地址" prop="ProvinceID">
								<el-select v-model="form.GroupLineOfflineSupplier.ProvinceID" placeholder="  请选择省" @change="provinceChange">
										<el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col style="width:230px;margin-bottom:0;">
							<el-form-item label="" prop="CityID">
								<el-select v-model="form.GroupLineOfflineSupplier.CityID" placeholder=" 请选择市" @change="cityChange">
										<el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col style="width:230px;margin-bottom:0;">
							<el-form-item label="" prop="DistrictID">
								<el-select v-model="form.GroupLineOfflineSupplier.DistrictID" placeholder=" 请选择区（县）">
										<el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label="详细地址" class="form-inline-input" prop="Address">
							<el-input v-model="form.GroupLineOfflineSupplier.Address"></el-input>
						</el-form-item>
					</el-row>
          <el-row>
            <el-form-item label="资质上传" size="small" prop="Qualifications">
              <span>（图片格式为jpg/png/bmp，最大为2M，最多为5张。）</span> 
              <el-upload action="/image/upload"
                         list-type="picture-card"
                         :http-request="imgUpload"
                         :show-file-list="true"
                         :limit="5"
                         :multiple="true"
                         accept="image/jpeg,image/png,image/bmp"
                         :on-remove="handleRemoveQualifications"
                         :before-upload="beforeAvatarUpload"
                         class="upload-btn">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-row>
				</el-form>
			</div>
			<h4>备注</h4>
			<el-input type="textarea" :rows="4" v-model="form.GroupLineOfflineOrder.Comment"></el-input>
			<div style="margin-top:15px;">
				<el-button type="primary" @click="onSubmit('form')" :loading="submitLoading1" size="small">确 定</el-button>
				<el-button type="" @click="goBack" size="small">返 回</el-button>
				<el-button type="primary" @click="onSubmit('form','payment')" :loading="submitLoading2" size="small">去支付</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { dateFmt } from "@/utils/tools";
	export default {
		data() {
			var checkQQ = (rule, value, callback) => {
				if(!value) {
					callback(new Error("您还没有输入QQ号码"));
				} else if(!/^\d{5,10}$/.test(value)) {
					callback(new Error("您的QQ号码有误"));
				} else {
					callback();
				}
			};
			var checkEmail = (rule, value, callback) => {
				if(!value) {
					callback(new Error("您还没有输入邮箱"));
				} else if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
						value
					)) {
					callback(new Error("您的邮箱格式有误"));
				} else {
					callback();
				}
			};
			var checkPhone = (rule, value, callback) => {
				if(!value) {
					callback(new Error("您还没有手机号码"));
				} else if(!/^1[0-9][0-9]\d{8}$/.test(value)) {
					callback(new Error("您的手机号码有误"));
				} else {
					callback();
				}
			};
			var checkOrderDate = (rule, value, callback) => {
				if(!value) {
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
				form:{
					GroupLineOfflineOrder:{
						LineName:'',
						DepartureDate:'',
						TeamNo:'',
						CustomerName:'',
						CustomerId: "",
						LinkMan: "",
						LinkMobile: "",
						LinkQQ: "",
						LinkEmail: "",
						ContractNo: "",
						ContractId: 0,
						OrderDate:'',
						FirstLinkMan: "",
						FirstLinkPhone: "",
						FirstLinkGender: 1,
						AdultPrice:0,
						OldPrice:0,
						ChildPrice:0,
						BabyPrice:0,
						AdultNumber:0,
						OldNumber:0,
						ChildNumber:0,
						BabyNumber:0,
						AdditionalAmount:0,
						DiscountAmount:0,
						Amount:0,
						Comment:'',
						CustomerSource:1,
						CategoryId:1,
						ContractTypeId:'',
            TripFileName:'',
            TripFileUrl:'',
            InnerCode:''
					},
					GroupLineOfflineAdditionals:[{
						AdditionalName:'',
						UnitPrice:0,
						Quantity:0,
						Amount:0,
						Comment:'',
					}],
					GroupLineOfflineOrderGuests:[{
						GuestType:'',
						GuestName:'',
						CertificateType:'',
						IDCardNO:'',
						Birthday:'',
						GuestGender:'',
						MobilePhone:'',
						GatherLocation:''
					}],
					GroupLineOfflineSupplier:{
						SupplierName:'',
						LinkName:'',
						LinkPhone:'',
						Qualifications:'',
						ProvinceID:'',
						ProvinceName:'',
						CityID:'',
						CityName:'',
						DistrictID:'',
						DistrictName:'',
						Address:''
					},
					IsAddCustomer: false,
				},
				rules: {
					LineName:[{
						required: true,
						message: "请输入线路名称",
						trigger: "blur"
					}],
					DepartureDate:[{
						required: true,
						type: "date",
						message: "请输出团时间",
						trigger: "change"
					}],
					TeamNo:[{
						required: true,
						message: "请输入团号",
						trigger: "blur"
					}],
					CustomerId: [{
						type: "number",
						required: true,
						message: "您还没有选择客户名称",
						trigger: "change"
					}],
					LinkMan : [
						{required: true,message:'您还没有输入联系人', trigger: 'blur'}
					],
					LinkMobile : [
						{required: true,validator:checkPhone, trigger: 'blur'}
					],
					ContractNo: [{
						required: true,
						message: "您还没有输入合同号",
						trigger: "change"
					}],
					OrderDate: [
					  { required: true, validator: checkOrderDate, trigger: "change" }
					],
					FirstLinkMan: [
						{ required: true, message: "您还没有输入联系人", trigger: "blur" }
					],
					FirstLinkPhone: [
						{ required: true, validator: checkPhone, trigger: "blur" }
					],
					SupplierName: [
						{ required: true, message: "请输入供应商名称", trigger: "blur" }
					],
					LinkName: [
						{ required: true, message: "请输入联系人", trigger: "blur" }
					],
					LinkPhone: [
						{ required: true, message: "请输入联系方式", trigger: "blur" }
					],
					Qualifications: [
						{ required: true, message: "请上传供应商资质", trigger: "blur" }
					],
					ProvinceID: [
						{ type:"number",required: true, message: "请选择省份", trigger: "change" }
					],
					CityID: [
						{ type:"number",required: true, message: "请选择城市", trigger: "change" }
					],
					DistrictID: [
						{ type:"number",required: true, message: "请选择区", trigger: "change" }
					],
					Address: [
						{ required: true, message: "请输入详细地址", trigger: "blur" }
					]
				},
				StartDisableDate: {
					disabledDate: date => {
						return date.getTime() < Date.now() - 3600 * 1000 * 24;
					}
				},
				contractCategoryList:[],//合同类别列表
     		contractTypeList:[],//合同类型列表
				qualificationsList:[],
        tripList: [],//行程单集合
				totalPrice:0,
				pricetypename: "",
				submitLoading1: false,
				submitLoading2: false,
				sexList: [{
						value: "1",
						label: "男"
					},
					{
						value: "2",
						label: "女"
					}
				],
				ProvinceList: [],  //省
				CityList: [],  //城市
				DistrictList: [],   //县
				typeList: [],
				cardList: [],
				customerList: [],
				contractList: [],
				loading: false,
				priceTable: [{
					priceName: "成人价",
					priceTypeName: "成人",
					GuestType: 1,
					PriceType: 6,
					retailPrice: 0,
					Quantiy: "",
					Amount: ""
				},{
					priceName: "老人价",
					priceTypeName: "老人",
					GuestType: 2,
					PriceType: 6,
					retailPrice: 0,
					Quantiy: "",
					Amount: ""
				},{
					priceName: "儿童价",
					priceTypeName: "儿童",
					PriceType: 6,
					GuestType: 3,
					retailPrice: 0,
					Quantiy: "",
					Amount: ""
				//},{
				//	priceName: "婴儿价",
				//	priceTypeName: "婴儿",
				//	PriceType: 6,
				//	GuestType: 4,
				//	retailPrice: 0,
				//	Quantiy: "",
				//	Amount: ""
				}],
			};
		},
		computed: {
			tableData1() {
				var interiorArr = [];
				this.priceTable.map((v, i) => {
					v.Amount = v.retailPrice * v.Quantiy;
					interiorArr[i] = v.Amount;
					this.totalPrice = interiorArr.reduce((prev, curr) => {
						const value = Number(curr);
						if(!isNaN(value)) {
							return prev + curr;
						} else {
							this.$message.error("请输入数字");
						}
					});
				});
				return this.priceTable;
			},
			tableData2() {
				var additionArr = [];
				this.form.GroupLineOfflineAdditionals.map((v, i) => {
					v.Amount = v.UnitPrice * v.Quantity;
					let amount = Number(v.Amount);
					if(!isNaN(amount)) {
						additionArr[i] = v.Amount;
						this.form.GroupLineOfflineOrder.AdditionalAmount = additionArr.reduce((prev, curr) => {
							const value = Number(curr);
							if(!isNaN(value)) {
								return prev + curr;
							} else {
								this.$message.error("请输入数字");
							}
						});
					} else {
						this.$message.error("请输入数字");
					}
				});
				return this.form.GroupLineOfflineAdditionals;
			},
			aggregateAmount: function() {
				var value=Number(this.form.GroupLineOfflineOrder.AdditionalAmount) +
							Number(this.totalPrice) -
							Number(this.form.GroupLineOfflineOrder.DiscountAmount);
					this.form.GroupLineOfflineOrder.Amount=value;
				return value;
			},
		},
		mounted() {
			this.getCountryID();
			this.typeListFun();
			this.cardListFun();
			this.GetContractType();
			this.GetContractCategoryList();
		},
		watch: {
			
			table3: {
				handler: function(newVal) {
					newVal.forEach((item, index) => {
						if(item.CertificateType == 1 && item.IDCardNO.length == 18) {
							let yyyy = item.IDCardNO.substring(6, 10);
							let mm = item.IDCardNO.substring(10, 12);
							let dd = item.IDCardNO.substring(12, 14);
							item.Birthday = yyyy + "-" + mm + "-" + dd;
						}
					});
				},
				deep: true
			},
		},
		methods: {
			getCountryID(){
                  this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                    this.ProvinceList = res.data;
                   }).catch((e) => {
                    // console.log(e);
                })
            },
            provinceChange(val){
              this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
                    this.CityList = res.data;
                    this.form.GroupLineOfflineSupplier.CityID = '';
                    this.form.GroupLineOfflineSupplier.DistrictID = '';
              }).catch( (e) => {
                          //console.log(e);
                    })
            },
            cityChange(val){
              this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
                    this.DistrictList = res.data;
                    this.form.GroupLineOfflineSupplier.DistrictID = '';
              }).catch( (e) => {
                          //console.log(e);
                    })
			 },
			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = "合计";
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					sums[3] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if(!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0);
				});
				return sums;
			},
			goBack() {
				this.$router.go(-1);
			},
      handleRemoveQualifications(file){
        //删除供应商资质集合中所选中的元素
        if (this.qualificationsList) {
          for (var i = 0; i < this.qualificationsList.length; i++) {
            if (this.qualificationsList[i].uid == file.uid) {
              this.qualificationsList.splice(i, 1);
              break;
            }
          }
        }  
			},
      tripHandleRemoveQualifications(file){ 
        //删除供应商资质集合中所选中的元素
        if (this.tripList) {
          for (var i = 0; i < this.tripList.length; i++) {
            if (this.tripList[i].uid == file.uid) {
              this.tripList.splice(i, 1);
              break;
            }
          }
        }  
			},
			imgUpload(val)
			{
				var f = new FormData();
				f.append('FileData', val.file);
				f.append('Category', 'AirTicket');
				f.append('thumbnail', true);
				f.append('Folder', 'Airline');
				this.fileUpload.post(val.action, f)
					.then((res) => {
						if (res.data.state == false) {
							this.$message.error(res.data.message);
						}
            else {
              //资质uid和rul
              var qualification = {
                uid: val.file.uid,
                url: res.data.url
              };
              this.qualificationsList.push(qualification);
            }
					})
			},
			tripUpload(val)
			{
				var f = new FormData();
				f.append('FileData', val.file);
				f.append('Category', 'AirTicket');
				f.append('thumbnail', true);
				f.append('Folder', 'Airline');
				this.fileUpload.post(val.action, f)
					.then((res) => {
						if (res.data.state == false) {
							this.$message.error(res.data.message);
            }
            else {
            this.tripList=[];
              //行程单
              var trip = {
                uid: val.file.uid,
                url: res.data.url,
                name:val.file.name
              }; 
              this.tripList.push(trip);
              this.form.GroupLineOfflineOrder.TripFileUrl=trip.url;
              this.form.GroupLineOfflineOrder.TripFileName=trip.name;
              
            }
					
					})
			},
      //限制行程单文件
			tripBeforeAvatarUpload(file){      
				const isDoc = file.name.toLowerCase().indexOf('.doc')>0 || file.name.toLowerCase().indexOf('.docx')>0;
				const isLt15M = file.size / 1024 / 1024 < 15;
				if (!isDoc) {
					this.$message.error('上传行程单文件只能是 doc/docx 格式!');
				}
				if (!isLt15M) {
					this.$message.error('上传行程单文件大小不能超过 15MB!');
				}
				return isDoc && isLt15M;
			},
      //限制图片
			beforeAvatarUpload(file){
				const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isImg) {
					this.$message.error('上传头像图片只能是 JPG/PNG/BMP 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isImg && isLt2M;
			},
			priceTypeText() {
				this.groupHttp
					.get("GroupLine/GetPriceTypeText")
					.then(res => {
						if(res.data.isSuccess == true) {
							this.pricetypename = res.data.object;
						}
					})
					.catch(e => {});
			},
			//根据客户id获取客户资料
			getLinkMessage(val) {
				this.groupHttp.post('/Customers/GetCustomerOrder',{DisCompanyInfoId:val}).then(res=>{
						this.form.GroupLineOfflineOrder.LinkMan = res.data.contanct;
						this.form.GroupLineOfflineOrder.LinkMobile = res.data.mobilePhone;
						this.form.GroupLineOfflineOrder.LinkEmail = res.data.mailbox;
					});
			},
			//获取客户
			remoteMethod(query) {
				// if(query !== "") {
					this.loading = true;
					this.groupHttp.post('/Customers/GetCustomerDrop',{CustomerName:query})
						.then(res => {
							if(res.data.isSuccess == true) {
								let objects = res.data.objects;
								this.loading = false;
								this.customerList = objects.filter(item => {
									return item.customerName.indexOf(query) > -1;
								});
							}
						});
				// } else {
				// 	this.customerList = [];
				// }
			},
			//合同搜索
			searchContractNo(query) {
				// if(query !== "") {
					this.loading = true;
					this.groupHttp
						.get("Contract/GetAvailableContractNos?ContractNo=" + query)
						.then(res => {
							if(res.data.isSuccess == true) {
								let objects = res.data.objects;
								this.loading = false;
								this.contractList = objects.filter(item => {
									return item.indexOf(query) > -1;
								});
							}
						});
				// } else {
				// 	this.contractList = [];
				// }
			},
			//获取合同类型
			GetContractType(){
				this.groupHttp.get('/Contract/GetContractTypeNames').then(res=>{
					if(res.data.isSuccess == true){
						this.contractTypeList = res.data.objects
					}else{
						this.$message.error(res.data.message)
					}
				})
			},
			//获取合同类别
			GetContractCategoryList(){
				this.groupHttp.get('/Contract/GetContractCategoryList').then(res=>{
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
					this.form.GroupLineOfflineOrder.ContractTypeId=''
					this.form.GroupLineOfflineOrder.ContractNo= ""
				}else{
					this.form.GroupLineOfflineOrder.ContractNo= ""
				}
			},
			handleChangeContractTypeId(val){
				this.groupHttp.get('/Contract/GenerateContractNumber?ContractTypeId='+val).then(res=>{
					if(res.data.isSuccess == true){
						this.form.GroupLineOfflineOrder.ContractNo = res.data.objects[0]
					}else{
					this.form.GroupLineOfflineOrder.ContractNo='';
						this.$message.error(res.data.message)
					}
				})
			},
      onSubmit(form, type) {
        //供应商资质赋值
        if (this.form.GroupLineOfflineSupplier.Qualifications == null || this.form.GroupLineOfflineSupplier.Qualifications == "") {
          this.qualificationsList.forEach(item => {
            if (this.form.GroupLineOfflineSupplier.Qualifications) {
              this.form.GroupLineOfflineSupplier.Qualifications += ',' + item.url;
            }
            else {
              this.form.GroupLineOfflineSupplier.Qualifications = item.url;
            }
          })
        }
      
				this.$refs[form].validate(valid => {
          if (valid) { 
						if(this.totalPrice == 0) {
							this.$message.error("合计报名人数不能为0");
						} else {
							if(type == "payment") {
								this.submitLoading2 = true;
							} else {
								this.submitLoading1 = true;
							}
							this.priceTable.forEach((item,index)=>{
								if(index==0){
									this.form.GroupLineOfflineOrder.AdultPrice=item.retailPrice;
									this.form.GroupLineOfflineOrder.AdultNumber=item.Quantiy
								}else if(index==1){
									this.form.GroupLineOfflineOrder.OldPrice=item.retailPrice;
									this.form.GroupLineOfflineOrder.OldNumber=item.Quantiy
								}else if(index==2){
									this.form.GroupLineOfflineOrder.ChildPrice=item.retailPrice;
									this.form.GroupLineOfflineOrder.ChildNumber=item.Quantiy
								//}else if(index==3){
								//	this.form.GroupLineOfflineOrder.BabyPrice=item.retailPrice;
								//	this.form.GroupLineOfflineOrder.BabyNumber=item.Quantiy
								}
							})
							this.ProvinceList.forEach(item=>{
								if(item.id==this.form.GroupLineOfflineSupplier.ProvinceID){
									this.form.GroupLineOfflineSupplier.ProvinceName=item.name;
									return;
								}
							})
							this.CityList.forEach(item=>{
								if(item.id==this.form.GroupLineOfflineSupplier.CityID){
									this.form.GroupLineOfflineSupplier.CityName=item.name;
									return;
								}
							})
							this.DistrictList.forEach(item=>{
								if(item.id==this.form.GroupLineOfflineSupplier.DistrictID){
									this.form.GroupLineOfflineSupplier.DistrictName=item.name;
									return;
								}
							})
							this.customerList.forEach(item=>{
								if(item.disCompanyInfoId==this.form.GroupLineOfflineOrder.CustomerId){
									this.form.GroupLineOfflineOrder.CustomerName=item.customerName;
									return;
								}
							})
							this.form.GroupLineOfflineOrderGuests.forEach((item,index)=>{
								if(item.GuestType==''&&item.GuestName==''&&item.CertificateType==''&&item.IDCardNO==''&&item.Birthday==''&&item.GuestGender==''&&item.MobilePhone==''&&item.GatherLocation==''){
									this.form.GroupLineOfflineOrderGuests.splice(index,1)
								}
							})

							
							this.contractTypeList.forEach(item=>{
								if(item.id==this.form.GroupLineOfflineOrder.ContractTypeId){
									this.form.GroupLineOfflineOrder.ContractTypeName=item.name;
								}
							})
							this.contractCategoryList.forEach(item=>{
								if(item.categoryId==this.form.GroupLineOfflineOrder.CategoryId){
									this.form.GroupLineOfflineOrder.CategoryName=item.categoryName
								}
							})
							
							this.groupHttp
								.post("/GroupLineOffline/CreateOfflineOrder", this.form)
								.then(res => {
									if(res.data.isSuccess == true) {
										this.$message({
											type: "success",
											message: "下单成功"
										});
										if(type == "payment") {
											this.submitLoading2 = false;
											let arr = [];
											arr.push(res.data.orderId);
											this.$router.push({
												name: "offlineOrderReceivables",
												query: {
													orderIds: arr
												}
											});
										} else {
											this.submitLoading1 = false;
											this.$router.go(-1);
										}
									} else {
										this.$message.error("出错了:" + res.data.message);
										setTimeout(() => {
											if(type == "payment") {
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
										if(type == "payment") {
											this.submitLoading2 = false;
										} else {
											this.submitLoading1 = false;
										}
									}, 500);
								});
							}
							
					} else {
						this.$message.error("您的信息还没有完善");
					}
				});
			},
			addTr(str) {
				this.form.GroupLineOfflineAdditionals.push({
					AdditionalName: "",
					UnitPrice: 0,
					Quantity: 0,
					Comment: "",
					Amount: ""
				});
			},
			discounts(val) {
				var reg = /^([1-9]*[1-9][0-9]*|[0]{1,1})$/;
				if(reg.test(val) || "") {
					this.form.GroupLineOfflineOrder.DiscountAmount = Number(val);
				}
			},
			//添加行
			addTr1() {
				this.form.GroupLineOfflineOrderGuests.push({
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
				this.form.GroupLineOfflineOrder.AdditionalAmount = this.form.GroupLineOfflineOrder.AdditionalAmount - row.Amount;
				this.form.GroupLineOfflineAdditionals.splice(index, 1);
			},
			handleDelete2(index, row) {
				this.form.GroupLineOfflineOrderGuests.splice(index, 1);
			},
			typeListFun() {
				this.groupHttp
					.post("/GroupLine/GeEnumGuestTypeList")
					.then(res => {
						this.typeList = res.data.keyValueList;
					})
					.catch(e => {
						console.log(e);
					});
			},
			cardListFun() {
				this.groupHttp
					.post("/GroupLine/GeEnumCardList")
					.then(res => {
						this.cardList = res.data.keyValueList;
					})
					.catch(e => {
						console.log(e);
					});
			},
			//日期格式
			// dateFormat() {
			//   var time = new Date();
			//   this.groupTime = dateFmt(time, "yyyy-MM-dd");
			// },
			
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
	
	// .el-row {
	// 	margin: 5px 0 15px 0;
	// 	padding-left: 10px;
	// }
	
	.el-col {
		padding-right: 25px;
		margin-bottom: 15px;
	}
	
	.but_marginbom {
		margin-bottom: 10px;
	}
	
	.el-form .el-input {
		width: 200px;
	}
</style>
