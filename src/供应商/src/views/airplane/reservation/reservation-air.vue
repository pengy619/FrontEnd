<template>
	<div class="view" v-loading="tableLoading">
		<el-form ref="form" :model="form" :rules="rule" label-width="80px" size="small">
			<h4>航班信息</h4>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="8">
					商品编号：{{obj.productNo}}
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">航班类型：{{obj.flightType}}</el-col>
				<el-col :span="6">航空公司：{{obj.airlineName}}</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="6">
					航班号：{{obj.flightNo}}
				</el-col>
				<el-col :span="6">出发日期：{{obj.departDate}}</el-col>
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
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="8">
					<el-form-item label="客户" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4"><el-button type="default" size="small">选用</el-button></el-col>
				<el-col :span="8">
					<el-form-item label="销售渠道">
						 {{obj.arriveAirportName}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="8">
					<el-form-item label="联系人">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4"></el-col>
				<el-col :span="8">
					<el-form-item label="联系电话">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="8">
					<el-form-item label="QQ">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4"></el-col>
				<el-col :span="8">
					<el-form-item label="Email">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="8">
					<el-form-item label="合同号">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4"><el-button type="default" size="small">选用</el-button></el-col>
				<el-col :span="8">
					<el-form-item label="订单日期" prop="orderDate">
						<el-date-picker type="date" placeholder="选择订单日期" v-model="form.orderDate"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>

			<h4>预订信息</h4>
			<el-row :gutter="20" type="flex" class="info-row label-auto">
				<el-col :span="8">
					<el-form-item label="主要联系人" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="主要联系人电话"  prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-radio-group v-model="form.call">
						<el-radio :label="1">先生</el-radio>
						<el-radio :label="2">女士</el-radio>
					</el-radio-group>
					<el-checkbox v-model="form.addPassenger" style="margin-left:20px;">是否添加为游客</el-checkbox>
				</el-col>
			</el-row>
			<el-row :gutter="20" type="flex" class="info-row">
				<el-col :span="24">
					<el-form-item label="价格表" :required="true">
						<el-table :data="form.priceTable" border style="width: 100%" :span-method="arraySpanMethod">
							<el-table-column prop="type" label="">
							</el-table-column>
							<el-table-column label="成人">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.adult}}</span>
									<el-input-number v-model="scope.row.adult"  :controls="false" v-else-if="scope.row.num==2" :min='0' :max='9999999'></el-input-number>
									<!-- <el-input-number v-model="scope.row.total"  :controls="false" v-else :min='0' :max='9999999' :disabled="true"></el-input-number> -->
									<span v-else>{{countTotal()}}</span>
								</template>
							</el-table-column>
							<el-table-column label="儿童">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.child}}</span>
									<el-input-number v-model="scope.row.child"  :controls="false" v-else-if="scope.row.num==2" :min='0' :max='9999999'></el-input-number>
								</template>
							</el-table-column>
							<el-table-column prop="baby" label="婴儿">
								<template slot-scope="scope">
									<span v-if="scope.row.num==1">{{scope.row.baby}}</span>
									<el-input-number v-model="scope.row.baby"  :controls="false" v-else-if="scope.row.num==2" :min='0' :max='9999999'></el-input-number>
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
					<el-form-item label="优惠" prop="discount">
						<el-input-number v-model="form.discount"  :controls="false" :min='0' :max='9999999'></el-input-number>
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
			<el-table :data="form.surchargeTable" border @selection-change="handleCostSelectionChange">
				<el-table-column type="selection" width="30">
				</el-table-column>
				<el-table-column label="费用名">
					<template slot-scope="scope">
						<el-input v-model="scope.row.costName" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="价格">
					<template slot-scope="scope">
						<el-input-number v-model="scope.row.price" :controls="false" :min='0' :max='9999999'></el-input-number>
					</template>
				</el-table-column>
				<el-table-column label="数量">
					<template slot-scope="scope">
						<el-input-number v-model="scope.row.count" :controls="false" :min='0' :max='9999999'></el-input-number>
					</template>
				</el-table-column>
				<el-table-column label="说明">
					<template slot-scope="scope">
						<el-input v-model="scope.row.explain" ></el-input>
					</template>
				</el-table-column>
			</el-table>

			<h4>旅客信息</h4>
			<el-row  type="flex" class="info-row">
				<el-button type="primary" @click="handleInfoAddRow" size="small">增加行</el-button>
				<el-button @click="handleInfoDeleteRow" size="small"  :disabled="infoMultiSelection.length===0">删除</el-button>
				<el-button @click="handleInfoDownTemp" size="small">下载模板</el-button>
				<el-button @click="handleInfoImport" size="small">导入</el-button>
			</el-row>
			<el-table :data="form.infoTable" border @selection-change="handleInfoSelectionChange">
				<el-table-column type="selection" width="30">
				</el-table-column>
				<el-table-column label="姓名">
					<template slot-scope="scope">
						<el-input v-model="scope.row.name" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="旅客类型">
					<template slot-scope="scope">
						<el-select v-model="scope.row.type" placeholder="请选择">
							<el-option
							v-for="item in typeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="性别">
					<template slot-scope="scope">
						<el-select v-model="scope.row.sexy" placeholder="请选择">
							<el-option
							v-for="item in sexyList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="证件类型">
					<template slot-scope="scope">
						<el-select v-model="scope.row.certificateType" placeholder="请选择">
							<el-option
							v-for="item in certificateTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="证件号码">
					<template slot-scope="scope">
						<el-input v-model="scope.row.certificateNum" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="出生日期">
					<template slot-scope="scope">
						<el-input v-model="scope.row.birthday" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="手机号码">
					<template slot-scope="scope">
						<el-input v-model="scope.row.phone" ></el-input>
					</template>
				</el-table-column>
				<el-table-column label="机票号">
					<template slot-scope="scope">
						<el-input v-model="scope.row.airNum" ></el-input>
					</template>
				</el-table-column>
			</el-table>

			<h4>备注</h4>
			<el-row  type="flex" class="info-row">
				<el-input
					type="textarea"
					:autosize="{ minRows: 3, maxRows:5}"
					placeholder="请输入内容"
					v-model="form.remarks">
					</el-input>
			</el-row>

			<div class="footer-control-wrap">
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
			return {
				obj:{},
				form:{
					name:'',
					orderDate:new Date(),
					addPassenger:'',
					call:'',
					priceTable:[{
						num:1,
						type:'价格',
						adult:1999,
						child:999,
						baby:666
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
					discount:null,
					total:null,
					surcharge:null,
					grandTotal:null,
					surchargeTable:[{
						costName:'',
						price:null,
						count:null,
						explain:''
					}],
					infoTable:[{
						name:'',
						type:'',
						sexy:'',
						certificateType:'',
						certificateNum:'',
						birthday:'',
						phone:'',
						airNum:''
					}],
					remarks:'',
				},
				typeList:[{
					value:0,
					label:'成人'
				},{
					value:1,
					label:'儿童'
				},{
					value:2,
					label:'婴儿'
				}],
				sexyList:[{
					value:0,
					label:'男'
				},{
					value:1,
					label:'女'
				}],
				certificateTypeList:[{
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
					costName:'',
					price:null,
					count:null,
					explain:''
				},
				infoTableTemp:{
					name:'',
					type:'',
					sexy:'',
					certificateType:'',
					certificateNum:'',
					birthday:'',
					phone:'',
					airNum:''
				},
				rule:{
					name:[{
						required: true,
						message: '请输入供应商',
						trigger: 'blur'
					}],
					orderDate:[{
						type:'date',
						required: true,
						message: '请选择订单日期',
						trigger: 'blur'
					}],
					discount:[{
						type:'number',
						required: true,
						message: '请输入优惠',
						trigger: 'blur'
					}],
					adult:[{
						type:'number',
						required: true,
						validator:checkNumber,
						trigger: 'blur'
					}],
				},
				tableLoading:false,
				costMultiSelection:[],
				infoMultiSelection:[],
			}
		},
		mounted(){
			this.getInfo()
		},
		methods:{
			getInfo(){
				// this.tableLoading=true;
				// //+this.$route.params.pricingSalesId
				// this.airHttp.get('api/Common/GetDetailsTop?operatingRecordId='+this.$route.query.id+'&pricingSalesId='+this.$route.query.pricingSalesId)
				// .then((res)=>{
				// 	this.tableLoading=false;

				// 	var objects=res.data.objects[0];
				// 	objects.departDate=objects.departDate.split(/T/)[0];
				// 	objects.flightType=objects.flightType==0?'国内':'国外';
				// 	this.obj=objects;

				// 	this.stockTable[0].total=res.data.objects[0].quantity;   				//总座位数
				// 	this.stockTable[0].kongwei=res.data.objects[0].reservedQuantity;        //控位数量
				// 	this.stockTable[0].qiewei=res.data.objects[0].saleQuantity;   			//切位数量
				// 	this.stockTable[0].yuwei=res.data.objects[0].remainingQuantity;   		//余位数量
				// 	this.stockTable[0].shuaiwei=res.data.objects[0].reductionSaleQuantity;	//甩位数量

				// 	this.stockTable[1].total=res.data.objects[0].quantity;  
				// 	this.stockTable[1].qiewei=res.data.objects[0].saleQuantity;
				// 	this.stockTable[1].kongwei=res.data.objects[0].reservedQuantity;      
				// 	this.stockTable[1].shuaiwei=res.data.objects[0].reductionSaleQuantity;
				// 	this.stockTable[1].yuwei=res.data.objects[0].remainingQuantity; 
				// })
				// //+this.$route.params.id  +this.$route.query.id
				// this.airHttp.get('api/AirTicketOperatingRecord/GetAirTicketJilt?operatingRecordId='+this.$route.query.id)
				// .then((res)=>{
				// 	var objects=res.data.objects[0];
				// 	if(objects.refundRule&&objects.refundRule.refundRule==1){
				// 		if(objects.refundRule.refundWay==0){
				// 			objects.refundRule['ways']='全部';
				// 		}else if(objects.refundRule.refundWay==1){
				// 			objects.refundRule['ways']='可退';
				// 		}else if(objects.refundRule.refundWay==2){
				// 			objects.refundRule['ways']='不可退';
				// 		}else if(objects.refundRule.refundWay==3){
				// 			objects.refundRule['ways']='可退但需额外支付'+objects.refundRule.limit+'元';
				// 		}else if(objects.refundRule.refundWay==4){
				// 			objects.refundRule['ways']='可退但需额外支付定价的'+objects.refundRule.limit+'%';
				// 		}

				// 		if(objects.refundRule.refundWayTimeEnd==0){
				// 			objects.refundRule['endWays']='全部';
				// 		}else if(objects.refundRule.refundWayTimeEnd==1){
				// 			objects.refundRule['endWays']='可退';
				// 		}else if(objects.refundRule.refundWayTimeEnd==2){
				// 			objects.refundRule['endWays']='不可退';
				// 		}else if(objects.refundRule.refundWayTimeEnd==3){
				// 			objects.refundRule['endWays']='可退但需额外支付'+objects.refundRule.Limit+'元';
				// 		}else if(objects.refundRule.refundWayTimeEnd==4){
				// 			objects.refundRule['endWays']='可退但需额外支付定价的'+objects.refundRule.Limit+'%';
				// 		}
				// 		this.ruleData[0].refundTime='航班起飞前'+objects.refundRule.refundTimeStart+'小时前';
				// 		this.ruleData[0].refundWay=objects.refundRule.ways;
				// 		this.ruleData[1].refundTime='航班起飞后'+objects.refundRule.refundTimeEnd+'小时';
				// 		this.ruleData[1].refundWay=objects.refundRule.endWays;
				// 	}
					
				// 	var objlaijia={
				// 		priceName:'来价',
				// 		adultPrice:objects.costPrice,
				// 		childPrice:objects.costPrice,
				// 		babyPrice:objects.costPrice,
				// 		currency:0,
				// 	}
				// 	var objzhike={
				// 		priceName:'媒体外卖价',
				// 		adultPrice:objects.jiGoDirectGuestAdult,
				// 		childPrice:objects.jiGoDirectGuestChild,
				// 		babyPrice:objects.jiGoDirectGuestBaby,
				// 		currency:objects.jiGoDirectGuestCurrency,
				// 	}
				// 	var objtonghang={
				// 		priceName:'同行价',
				// 		adultPrice:objects.jiGoPeerPriceAdult,
				// 		childPrice:objects.jiGoPeerPriceChild,
				// 		babyPrice:objects.jiGoPeerPriceBaby,
				// 		currency:objects.jiGoPeerPriceCurrency,
				// 	}
				// 	var objjiameng={
				// 		priceName:'加盟结算价',
				// 		adultPrice:objects.jiGoJoinPriceAdult,
				// 		childPrice:objects.jiGoJoinPriceChild,
				// 		babyPrice:objects.jiGoJoinPriceBaby,
				// 		currency:objects.jiGoJoinPriceCurrency,
				// 	}
				// 	var objmenshi={
				// 		priceName:'直客销售价',
				// 		adultPrice:objects.jiGoMarketPriceAdult,
				// 		childPrice:objects.jiGoMarketPriceChild,
				// 		babyPrice:objects.jiGoMarketPriceBaby,
				// 		currency:objects.jiGoMarketPriceCurrency,
				// 	}
				// 	var objneibu={
				// 		priceName:'内部价',
				// 		adultPrice:objects.jiGoInternalPriceAdult,
				// 		childPrice:objects.jiGoInternalPriceChild,
				// 		babyPrice:objects.jiGoInternalPriceBaby,
				// 		currency:objects.jiGoInternalPriceCurrency,
				// 	}
				// 	var newArr=[];
				// 	newArr.push(objlaijia)
				// 	newArr.push(objzhike)
				// 	newArr.push(objtonghang)
				// 	newArr.push(objjiameng)
				// 	newArr.push(objmenshi)
				// 	newArr.push(objneibu)
				// 	newArr.forEach((item,index) => {
				// 		if(item.currency==0){
				// 			newArr[index].currency='人民币'
				// 		}else if(item.currency==1){
				// 			newArr[index].currency='美元'
				// 		}else if(item.currency==2){
				// 			newArr[index].currency='港币'
				// 		}else{
				// 			newArr[index].currency='欧元'
				// 		}
						
				// 	});
				// 	this.tableData=newArr;
				// 	this.obj2=objects;
				// })
				
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
			countTotal(){
				let arr=this.form.priceTable;
				this.form.total=(arr[0].adult*arr[1].adult + arr[0].child*arr[1].child + arr[0].baby*arr[1].baby)||0;
				return this.form.total;
			},
			countSurcharge(){
				let arr=this.form.surchargeTable;
				let num=0;
				arr.forEach(item => {
					console.log(item)
					num+=item.price*item.count;
				});
				console.log(num)
				this.form.surcharge=num;
				return num||0;
			},
			countGrandTotal(){
				this.form.grandTotal=(this.form.total+this.form.surcharge-this.form.discount)||0;
				return this.form.grandTotal;
			},
			handleCostAddRow(){
				this.form.surchargeTable.push(JSON.parse(JSON.stringify(this.surchargeTableTemp)))
			},
			handleCostDeleteRow(){
				this.costMultiSelection.forEach(item => {
					let index= this.form.surchargeTable.indexOf(item);
					this.form.surchargeTable.splice(index,1)
				});
			},
			handleCostSelectionChange(val){
				this.costMultiSelection = val;
			},
			handleInfoAddRow(){
				this.form.infoTable.push(JSON.parse(JSON.stringify(this.infoTableTemp)))
			},
			handleInfoDeleteRow(){
				this.infoMultiSelection.forEach(item => {
					let index= this.form.infoTable.indexOf(item);
					this.form.infoTable.splice(index,1)
				});
			},
			handleInfoSelectionChange(val){
				this.infoMultiSelection = val;
			},
			handleInfoImport(){

			},
			handleInfoDownTemp(){

			}
		}
	}
</script>

<style>
	.info-row {
		margin: 10px 0;
	}
	
	.air-info-box {
		border: 1px solid #ddd;
		margin: 10px 0;
		padding: 10px;
	}
	.el-form-item--small.el-form-item{
		margin-bottom: 0px;
	}
	.label-auto .el-form-item__label{
		width: 120px!important;
	}
	.label-auto .el-form-item__content{
		margin-left:120px!important;
	}
	.view .el-select input{
		width: 100%!important;
	}
</style>