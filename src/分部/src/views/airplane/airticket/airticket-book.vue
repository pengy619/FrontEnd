<template>
	<div class="view" v-loading="viewLoading">
		<el-form ref="form" :model="form" :rules="rule" class="demo-form-inline" label-width="80px" size="small">
			<h4>航班信息</h4>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">航空公司：{{obj.airlineName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">
					航班号：{{obj.flightNo}}
				</el-col>
				<el-col :span="6">出发日期：{{obj.departDate?obj.departDate.split('T')[0]:''}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">
					出发地：{{obj.departProvinceName}}
				</el-col>
				<el-col :span="6">目的地：{{obj.arriveProvinceName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">
					起飞时间：{{obj.departTime}}
				</el-col>
				<el-col :span="6">到达时间：{{obj.arriveTime}}</el-col>
				<el-col :span="8">飞行时长：{{obj.flightDurationHours+"小时"+obj.flightDurationMinutes+"分钟"}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">
					起飞机场：{{obj.departAirporName}}
				</el-col>
				<el-col :span="6">到达机场：{{obj.arriveAirportName}}</el-col>
			</el-row>

			<h4>客户信息</h4>
			<div class="customer-info">
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="8">
						<el-form-item label="客户" prop="CustomerName">
							<el-input v-model="form.CustomerName"></el-input>
							<el-button type="default" size="small">选用</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="销售渠道">
							{{obj.distributionChannel}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="8">
						<el-form-item label="联系人">
							<el-input v-model="form.CustomerContacts"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系电话">
							<el-input v-model="form.CustomerContactsPhone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="8">
						<el-form-item label="QQ">
							<el-input v-model="form.CustomerContactsQQ"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Email">
							<el-input v-model="form.CustomerContactsEmail"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" type="flex" class="info-row">
					<el-col :span="8">
						<el-form-item label="合同号">
							<el-input v-model="form.CustomerContractNumber"></el-input>
							<el-button type="default" size="small">选用</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订单日期" prop="OrderTime">
							<el-date-picker type="date" placeholder="选择订单日期" v-model="form.OrderTime"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<h4>预订信息</h4>
			<el-row :gutter="20" type="flex" class="info-row full-width">
				<el-col :span="8">
					<el-form-item label="主要联系人" prop="KeyContacts">
						<el-input v-model="form.KeyContacts"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="主要联系人电话"  prop="KeyContactsPhone">
						<el-input v-model="form.KeyContactsPhone"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-radio-group v-model="form.SexType">
						<el-radio :label="0">先生</el-radio>
						<el-radio :label="1">女士</el-radio>
					</el-radio-group>
					<el-checkbox v-model="form.IsAddTourist" style="margin-left:20px;">是否添加为游客</el-checkbox>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">
					<el-form-item label="价格表" :required="true">
						<el-table :data="priceTable" border style="width: 100%" :span-method="arraySpanMethod">
							<el-table-column prop="type" label="">
							</el-table-column>
							<el-table-column label="成人">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.adult}}</span>
									<el-form-item prop="AdultQuantity" v-else-if="scope.row.num==2">
										<el-input v-model="form.AdultQuantity" class="left-input" ></el-input>
									</el-form-item>
									<span v-else>{{countTotal()}}</span>
								</template>
							</el-table-column>
							<el-table-column label="儿童">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.child}}</span>
									<el-form-item prop="ChildQuantity" v-else-if="scope.row.num==2">
										<el-input v-model="form.ChildQuantity" class="left-input" ></el-input>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="baby" label="婴儿">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.baby}}</span>
									<el-form-item prop="BabyQuantity" v-else-if="scope.row.num==2">
										<el-input v-model="form.BabyQuantity" class="left-input" ></el-input>
									</el-form-item>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="5">
					<el-form-item label="附加费">
						<span>{{countSurcharge()}}</span>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="优惠" prop="Discounts">
						<el-input-number v-model="form.Discounts"  :controls="false" :min='0' :max='9999999' @blur="handleChangeDiscounts"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="总价">
						<span>{{countGrandTotal()}}</span>
					</el-form-item>
				</el-col>
			</el-row>

			<h4>附加费</h4>
			<el-row  type="flex" class="info-row">
				<el-button type="primary" @click="handleCostAddRow" size="small">增加行</el-button>
				<el-button @click="handleCostDeleteRow" size="small" :disabled="costMultiSelection.length===0">删除</el-button>
			</el-row>
			<el-table :data="surchargeTable" border @selection-change="handleCostSelectionChange" max-height="300">
				<el-table-column type="selection" width="30">
				</el-table-column>
				<el-table-column label="费用名">
					<template slot-scope="scope">
						<el-input v-model="scope.row.Name" size="small"  :maxlength="20"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="价格">
					<template slot-scope="scope">
						<el-input-number v-model="scope.row.Price" :controls="false" :min='0' :max='9999999' size="small"></el-input-number>
						<span style="display:none;">{{scope.row.Price=Number(scope.row.Price?scope.row.Price.toFixed(2):0)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量">
					<template slot-scope="scope">
						<el-input-number v-model="scope.row.Quantity" :controls="false" :min='0' :max='9999999' size="small"></el-input-number>
						<span style="display:none;">{{scope.row.Quantity=Math.ceil(scope.row.Quantity)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="说明">
					<template slot-scope="scope">
						<el-input v-model="scope.row.Remark" size="small" ></el-input>
					</template>
				</el-table-column>
			</el-table>

			<h4>旅客信息</h4>
			<el-row  type="flex" class="info-row">
				<el-button type="primary" @click="handleInfoAddRow" size="small">增加行</el-button>
				<el-button @click="handleInfoDeleteRow" size="small"  type="primary" :disabled="infoMultiSelection.length===0">删除</el-button>
				<el-button @click="handleDownLoadFile" size="small"  type="primary">下载</el-button>
				<!-- <a class="download-temp" size="small" href="http://120.76.20.11:8004/Upload/AirTicket/Airline/20180108/ee444dfce26c4a2b808364be5e43ef2a.xls" type="primary" download="filename"><span>下载模板</span></a> -->
				<el-upload style="margin-left:10px" :http-request="uploadFile" action="http://120.76.20.11:8004/file/upload" :show-file-list="true"  :limit="1" :auto-upload="true" :before-upload="beforeLogoUpload" >
					<el-button  size="small"  type="primary">导入</el-button>
				</el-upload>

			</el-row>
			<el-table :data="infoTable" border @selection-change="handleInfoSelectionChange" class="info-table" max-height="300">
				<el-table-column type="selection" width="30">
				</el-table-column>
				<el-table-column label="姓名" width="120">
					<template slot-scope="scope">
						<el-input v-model="scope.row.Name" size="small" :maxlength="20"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="旅客类型" >
					<template slot-scope="scope">
						<el-select v-model="scope.row.PassengerType" placeholder="请选择" class="full-width"  size="small">
							<el-option
							v-for="item in PassengerTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="性别">
					<template slot-scope="scope">
						<el-select v-model="scope.row.SexType" placeholder="请选择"  class="full-width" size="small">
							<el-option
							v-for="item in SexTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="证件类型">
					<template slot-scope="scope">
						<el-select v-model="scope.row.IDType" placeholder="请选择" class="full-width" size="small">
							<el-option
							v-for="item in IDTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="证件号码" width="210" >
					<template slot-scope="scope">
						<el-input v-model="scope.row.IDNumber" size="small" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="出生日期" width="160">
					<template slot-scope="scope">
						<el-date-picker v-model="scope.row.BirthDate"   class="full-width" type="date" placeholder="选择日期" size="small"></el-date-picker>
					</template>
				</el-table-column>
				<el-table-column label="手机号码">
					<template slot-scope="scope">
						<el-input v-model="scope.row.Phone" size="small" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="机票号">
					<template slot-scope="scope">
						<el-input v-model="scope.row.TicketNumber" size="small" ></el-input>
					</template>
				</el-table-column>
			</el-table>

			<h4>备注</h4>
			<el-row  type="flex" class="info-row">
				<el-input
					type="textarea"
					:autosize="{ minRows: 3, maxRows:5}"
					placeholder="请输入内容"
					v-model="form.Remark">
					</el-input>
			</el-row>

			<div class="footer-control-wrap">
				<el-button size="small" @click="onSubmit" type="primary">提交</el-button>
				<el-button size="small" @click="handleCancel">返回</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	//caijiongrui
	export default {
		data() {
			let checkNumber = (rule, value, callback) => {
				if(value.toString().indexOf('.')>-1){
					return callback(new Error('请输入整数'));
				}else{
					callback();
				}
			};
			let checkQuantity = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请填写座位数'));
				}else if(isNaN(Number(value))){
					return callback(new Error('座位数必须填写数字'));
				}else if(Number(value)<0){
					return callback(new Error('座位数必须大于0'));
				}else if(value.toString().indexOf('.')>-1){
					return callback(new Error('座位数必须为整数'));
				}else{
					callback();
				}
			};
			return {
				obj:{},
				form:{
					ProductId:this.$route.query.id,
					ReservedOrderId:this.$route.query.reservedId,
					CustomerName:'',
					DistributionChannel:'',
					CustomerContacts:'',
					CustomerContactsPhone:'',
					CustomerContactsQQ:'',
					CustomerContactsEmail:'',
					CustomerContractNumber:'',
					OrderTime:new Date(),
					KeyContacts:'',
					KeyContactsPhone:'',
					IsAddTourist:false,
					SexType:'',
					AdultQuantity:null,
					ChildQuantity:null,
					BabyQuantity:null,
					Amount:null,
					Surcharge:null,
					Discounts:null,
					OrderAmount:null,
					Remark:'',
					AirTicketSurcharge:'',
					Passengers:''
				},
				surchargeTable:[{
					Name:'',
					Price:null,
					Quantity:null,
					Remark:''
				}],
				infoTable:[{
					Name:'',
					PassengerType:'',
					SexType:'',
					IDType:'',
					IDNumber:'',
					BirthDate:'',
					Phone:'',
					TicketNumber:''
				}],
				uploadFileUrl:'',
				priceTable:[{
					num:1,
					type:'价格',
					adult:2,
					child:2,
					baby:3
				},{
					num:2,
					type:'数量',
					adult:null,
					child:null,
					baby:null
				},{
					num:3,
					type:'金额小计',
					total:null,
				}],
				PassengerTypeList:[{
					value:0,
					label:'成人'
				},{
					value:1,
					label:'儿童'
				},{
					value:2,
					label:'婴儿'
				}],
				SexTypeList:[{
					value:0,
					label:'男'
				},{
					value:1,
					label:'女'
				}],
				IDTypeList:[{
					value:0,
					label:'身份证'
				},{
					value:1,
					label:'护照'
				},{
					value:2,
					label:'驾驶证'
				}],
				surchargeTableTemp:{
					Name:'',
					Price:0,
					Quantity:0,
					Remark:''
				},
				infoTableTemp:{
					Name:'',
					PassengerType:'',
					SexType:'',
					IDType:'',
					IDNumber:'',
					BirthDate:'',
					Phone:'',
					TicketNumber:''
				},
				rule:{
					CustomerName:[{
						required: true,
						message: '请输入客户名称',
						trigger: 'blur'
					}],
					OrderTime:[{
						type:'date',
						required: true,
						message: '请选择订单日期',
						trigger: 'blur'
					}],
					KeyContacts:[{
						required: true,
						message: '请输入主要联系人',
						trigger: 'blur'
					}],
					KeyContactsPhone:[{
						required: true,
						message: '请输入主要联系人电话',
						trigger: 'blur'
					}],
					Discounts:[{
						type:'number',
						required: true,
						message: '请输入优惠',
						trigger: 'blur'
					}],
					AdultQuantity:[{
						required: true,
						validator:checkQuantity,
						trigger: 'blur'
					}],
					ChildQuantity:[{
						required: true,
						validator:checkQuantity,
						trigger: 'blur'
					}],
					BabyQuantity:[{
						required: true,
						validator:checkQuantity,
						trigger: 'blur'
					}],
				},
				viewLoading:false,
				costMultiSelection:[],
				infoMultiSelection:[],
			}
		},
		mounted(){
			this.getInfo()
		},
		methods:{
			getInfo(){
				this.viewLoading=true;
				this.airHttp.get(`api/Common/GetDetailsTop?operatingRecordId=0&pricingSalesId=${this.$route.query.id}`)
				.then((res)=>{
					this.viewLoading=false;
					// if(res.data.isSuccess){
						var objects=res.data.objects[0];
						this.priceTable[0].adult=objects.peerPriceAdult;
						this.priceTable[0].child=objects.peerPriceChild;
						this.priceTable[0].baby=objects.peerPriceBaby;
						this.obj=objects;
					// }

				})
			},
			onSubmit(){
				this.$refs['form'].validate((valid) => {
		          if (valid) {
					if(this.form.OrderAmount<0){
						this.$message({
							message: '总价不能小于0！',
							type: 'error'
						});
						return false;
					}
					  this.$confirm('确定提交本次操作？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
						}).then(() => {
							this.submitLoading=true
							this.form.AirTicketSurcharge=JSON.stringify(this.surchargeTable);
							this.form.Passengers=JSON.stringify(this.infoTable);
							this.airHttp.post('api/airticket/submitorder',this.form)
							.then((res)=>{
								this.submitLoading=false
								if(res.data.isSuccess){
									this.$message({
										message: '预定机票成功！',
										type: 'success'
									});
									this.editBtn=true
									setTimeout(()=>{
										this.$router.go(-1)
									},2000)
								}
							}).catch(() => {
						        this.submitLoading=false
							});
						}).catch(() => {

						});

				} else {
		            console.log('error submit!!');
		            return false;
		          }
				})
			},
			handleCancel(){
				this.$router.go(-1)
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 2) {
					if (columnIndex === 1) {
						return [1, 3];
					}
				}
			},
			handleDownLoadFile(){
				window.location.href="http://120.76.20.11:8004/Upload/AirTicket/Airline/20180109/a9ae82e9edf14fb29dc52a30597b4870.xls";
			},
			handleChangeDiscounts(){
				this.form.Discounts=Number(this.form.Discounts?this.form.Discounts.toFixed(2):0)
			},
			countSurcharge(){
				let arr=this.surchargeTable;
				let num=0;
				arr.forEach(item => {
					num+=item.Price*item.Quantity;
				});
				this.form.Surcharge=Number(num?num.toFixed(2):0);

				return this.form.Surcharge||0;
			},
			countTotal(){
				this.priceTable[1].adult=this.form.AdultQuantity;
				this.priceTable[1].child=this.form.ChildQuantity;
				this.priceTable[1].baby=this.form.BabyQuantity;
				let arr=this.priceTable;
				this.form.Amount=Number((arr[0].adult*arr[1].adult + arr[0].child*arr[1].child + arr[0].baby*arr[1].baby).toFixed(2))||0;
				return this.form.Amount;
			},
			countGrandTotal(){
				this.form.OrderAmount=Number((this.form.Amount+this.form.Surcharge-this.form.Discounts).toFixed(2))||0;
				return this.form.OrderAmount;
			},
			handleCostAddRow(){
				this.surchargeTable.push(JSON.parse(JSON.stringify(this.surchargeTableTemp)))
			},
			handleCostDeleteRow(){
				this.costMultiSelection.forEach(item => {
					let index= this.surchargeTable.indexOf(item);
					this.surchargeTable.splice(index,1)
				});
			},
			handleCostSelectionChange(val){
				this.costMultiSelection = val;
			},
			handleInfoAddRow(){
				this.infoTable.push(JSON.parse(JSON.stringify(this.infoTableTemp)))
			},
			handleInfoDeleteRow(){
				this.infoMultiSelection.forEach(item => {
					let index= this.infoTable.indexOf(item);
					this.infoTable.splice(index,1)
				});
			},
			handleInfoSelectionChange(val){
				this.infoMultiSelection = val;
			},
			beforeLogoUpload(file) {
				console.log(file.type)
				const isExcel = file.type === 'application/vnd.ms-excel';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(file.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
					this.$message.error('请导入正确的游客信息!');
					return false;
				}
				if(!isExcel) {
					this.$message.error('导入旅客信息只能是 excel 文件!');
				}
				if(!isLt2M) {
					this.$message.error('导入旅客信息文件大小不能超过 2MB!');
				}
				return isExcel && isLt2M;
			},
			uploadFile(val){	//上传文件
				var f=new FormData()
				f.append('FileData',val.file)
				f.append('Category','AirTicket')
				f.append('thumbnail',false)
				f.append('Folder','Airline')
				this.fileUpload.post(val.action,f)
				.then((res)=>{
					if(res.data.state){
						this.uploadFileUrl=res.data.url;
						this.airHttp.post('api/airticket/uploadtemplate',{fileUrl:res.data.url})
						.then((res)=>{
							if(res.data.isSuccess){
								let objects=res.data.objects;
								if(objects.length>0){
									this.infoTable=[];
									objects.forEach(item=>{
										let obj={
											Name:item.name,
											PassengerType:item.passengerType,
											SexType:item.sex,
											IDType:item.certificateType,
											IDNumber:item.certificateNo,
											BirthDate:item.dateOfBirth,
											Phone:item.phoneNumber,
											TicketNumber:item.ticketNo
										}
										this.infoTable.push(obj)
									})
								}
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped>
	.info-row {
		margin: 10px 0;
	}
	.air-info-box {
		border: 1px solid #ddd;
		margin: 10px 0;
		padding: 10px;
	}
	.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
		width:auto;
	}
	.view .el-input,
	.view .el-input--small{
		width:200px;
	}
	.view .info-table .el-input,
	.view .el-date-editor input,
	.view .el-select input{
		width: 100%!important;
	}
	.download-temp {
		  display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		border: 1px solid #409EFF;
		-webkit-appearance: none;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		outline: 0;
		margin: 0 0 0 10px;
		-webkit-transition: .1s;
		transition: .1s;
		font-weight: 500;
		padding: 9px 15px;
		font-size: 12px;
		border-radius: 3px;
		color: #fff;
		background-color: #409EFF;
	}
	.download-temp:focus, .download-temp:hover {
		background: #66b1ff;
		border-color: #66b1ff;
		color: #fff;
	}
	.view .customer-info .el-col-8{
		min-width:400px;
	}
	.view .el-input-number{
		width: 200px;
	}
</style>
<style>
	.view .full-width .el-form-item__label {
      width: 120px !important;
    }
    .view .full-width .el-form-item__content {
      margin-left: 120px !important;
    }
</style>
