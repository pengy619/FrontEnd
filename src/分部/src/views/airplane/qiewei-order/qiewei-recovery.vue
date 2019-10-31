<template>
	<div class="view" v-loading="tableLoading">

		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">商品编号：{{basicInfo.productNo}} </el-col>
			<el-col :span="6">航空公司：{{basicInfo.airlineName}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				航班号：{{basicInfo.flightNo}} 
			</el-col>
			<!-- <el-col :span="6">出发日期：{{this.basicInfo.departDate.split('T')[0]}}</el-col> -->
			<el-col :span="6">出发日期：{{basicInfo.departDate!=null?this.basicInfo.departDate.split('T')[0]:''}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				出发地：{{basicInfo.departProvinceName}} 
			</el-col>
			<el-col :span="6">目的地：{{basicInfo.arriveProvinceName}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞时间：{{basicInfo.departTime}} 
			</el-col>
			<el-col :span="6">到达时间：{{basicInfo.arriveTime}} </el-col>
			<el-col :span="6">飞行时长：{{basicInfo.flightDurationHours+'小时'+basicInfo.flightDurationMinutes+'分钟'}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				起飞机场：{{basicInfo.departAirporName}} 
			</el-col>
			<el-col :span="6">到达机场：{{basicInfo.arriveAirportName}}</el-col>
		</el-row>
		
		<h4>分配账户</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				客户名称： {{basicInfo.cutCustomerName}} 
			</el-col>
			<el-col :span="6">切位数量：{{basicInfo.cutNumber}} </el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				切位单价：{{basicInfo.originalPrice}} 
			</el-col>
			 <el-col :span="6">切位总价：{{basicInfo.cutNumber*basicInfo.originalPrice}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				切位时间：{{basicInfo.cutDateTime?basicInfo.cutDateTime.split('T')[0]:''}} 
			</el-col>
			 <el-col :span="6">切位联系人：{{basicInfo.cutTangentContact}}</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="6">
				联系方式：{{basicInfo.cutContactInformation}} 
			</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			 <el-col :span="24">说明：{{basicInfo.remark}}</el-col>
		</el-row>

		<h4>回收信息</h4>
		<el-form  ref="form" :model="form" :rules="rules" label-width="120px" size="small" style="margin-top: 10px;width: 50%;">
			<el-form-item label="回收库存" prop="RecycleQuantity">
				<el-input-number style="width: 200px" :min="0" :controls="false" v-model="form.RecycleQuantity"  class="left-input" @blur="handleChangeReturnNumber"></el-input-number>
			</el-form-item>
			<el-form-item label="回收切位单价" prop="RecyclePrice">
				<el-input-number v-model="form.RecyclePrice"  style="width: 200px;" :min="0" :max="99999999" class="left-input" placeholder="库存单价" :controls="false"  @blur="handleChangePrice">
    		</el-input-number>
			</el-form-item>
			<el-form-item label="回收切位总价" prop="Amount">
				<el-input-number v-model="form.Amount"  style="width: 200px;" :min="0" :max="99999999" class="left-input" placeholder="库存总金额" :controls="false">
    		</el-input-number>
			</el-form-item>
			<el-form-item label="备注">
				<el-input
					  type="textarea"
					  prop="Remark"
					  :rows="2"
					  placeholder="请输入内容" v-model="form.Remark">
					</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
				<el-button @click="getReturn">返回</el-button>
			</el-form-item>
		</el-form>

	</div>
</template>

<script>
	export default {
		data() {
			let checkNumber = (rule, value, callback) => {
				let num=this.basicInfo.cutNumber;
				if(value.toString().indexOf('.')>-1){
					return callback(new Error('回收切位数量必须为整数'));
				}else if(value>num){
					return callback(new Error(`回收切位数量必须需小于等于${num}`));
				}else{
					callback();
				}
			};
			return {
				form: {
					RecycleQuantity:null,
					RecyclePrice: null,
					Amount:null,
					Remark:"",
					SaleOrderId:null,
				},
				basicInfo:{},
				tableLoading:false,
				submitLoading: false,
				 rules: {
					RecycleQuantity: [{
						required: true,
						validator:checkNumber,
						trigger: "blur"
					}],
					RecyclePrice: [{
						required: true,
						type:"number",
						message: "请输入回收切位单价",
						trigger: "blur"
					}],
					Amount: [{
						required: true,
						type:"number",
						message: "请输入回收切位总价",
						trigger: "blur"
					}],
				},
			}
		},
		mounted() {
		    this.getBasicInfo();
		},
		methods:{
			//根据ID查询切位订单信息
				getBasicInfo(){
					this.tableLoading=true;
					this.airHttp.get('api/AirTicketOrder/GetTicketSaleOrderInfo?SaleOrderId='+this.$route.params.id)
					.then((res)=>{
						var restop=res.data.objects[0];
						this.basicInfo=restop;
						this.form.SaleOrderId=this.$route.params.id;
						this.tableLoading=false;
					})
				},

				//返回列表
				getReturn(){
					this.$router.go(-1)
				},
				onSubmit() {
					this.$refs['form'].validate(valid => {
						if (valid) {
							this.$confirm("是否确认回收切位", "提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								this.submitLoading = true;
								this.airHttp.post("api/AirTicketOrder/RecyclingCutoff", this.form)
									.then(res => {
									this.submitLoading = false;
									if (res.data.isSuccess) {
										this.$message({
										message: "保存回收切位信息成功！",
										type: "success"
										});

										setTimeout(() => {
										this.$router.go(-1);
										}, 1000);
									}
							});
							})
						} else {
							this.$message.error("请确认输入内容是否正确！");
						}
					})
					.catch(() => {
						this.submitLoading = false;
					});
				},
				handleChangeReturnNumber(val){
					this.form.Amount=this.form.RecycleQuantity*this.form.RecyclePrice;
				},
				handleChangePrice(val){
					this.form.Amount=this.form.RecycleQuantity*this.form.RecyclePrice;
				}
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
</style>