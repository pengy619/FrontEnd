<template>
	<div class="view" v-loading="viewLoading">
		<el-header class="margin_bottom">
			<el-steps :active="3" align-center>
				<el-step title="选择酒店" description=""></el-step>
				<el-step title="选择房型" description=""></el-step>
				<el-step title="产品设置" description=""></el-step>
				<el-step title="价格设置" description=""></el-step>
			</el-steps>
		</el-header>
		<el-form size="small"  label-width="100px">
            <el-form-item label="酒店名称">
                <span  >{{hotelName}}</span>
				<el-button  class="margin_left" type="text" size="mini" v-if="!isEdit"  @click='handleReChooseHotel'>重新选择</el-button>
            </el-form-item>
			<el-form-item label="房型名称">
                <span  >{{roomTypeName}}</span>
				<el-button class="margin_left" type="text" size="mini"  @click='handleReChooseRoomType'>重新选择</el-button>
            </el-form-item>
        </el-form>
		<h4>产品设置</h4>
		<el-form size="small" :model="infoForm" :rules="rules" ref="infoForm" label-width="120px">
            <!-- <el-form-item label="资源确认" prop="confirmResource">
                <el-radio-group v-model="infoForm.confirmResource">
					<el-radio :label="false">无需确认</el-radio>
					<el-radio :label="true">需确认</el-radio>
				</el-radio-group>
            </el-form-item> -->
			<el-row type="flex">
				<el-form-item label="退款规则" prop="canRefund">
					<el-radio-group v-model="infoForm.canRefund">
						<el-radio :label="false">不可退</el-radio>
						<el-radio :label="true">可退</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" label-width="20px" prop="refundLeadDay" v-if="infoForm.canRefund">
					请在入住前 <el-input-number :controls="false" :min="0" v-model="infoForm.refundLeadDay" style="width:60px;" /> 天申请退款
				</el-form-item>
			</el-row>
			<el-form-item label="资源确认" prop="paymentType">
                <el-radio-group v-model="infoForm.paymentType">
					<el-radio :label="0">无需确认</el-radio>
					<el-radio :label="1">需确认</el-radio>
				</el-radio-group>
            </el-form-item>
			<el-form-item label="资源方联系人" prop="linkMan" v-if="infoForm.paymentType==1">
                <el-input v-model="infoForm.linkMan" class="input_comm"/>
            </el-form-item>
			<el-form-item label="联系电话" prop="linkMobile" v-if="infoForm.paymentType==1">
                <el-input v-model="infoForm.linkMobile" class="input_comm" />
            </el-form-item>
			<el-form-item label="推广费" prop="promotionType">
                <el-radio-group v-model="infoForm.promotionType" @change="handleChangepromotionType">
					<el-radio :label="0">固定金额 <el-input-number :disabled="infoForm.promotionType!=0" :controls="false" :min="0" v-model="promotionValue1" style="width:80px;" /> 元/间</el-radio>
					<el-radio :label="1">百分比 <el-input-number :disabled="infoForm.promotionType!=1" :controls="false" :min="0" v-model="promotionValue2" style="width:60px;" /> %/间</el-radio>
				</el-radio-group>
            </el-form-item>
			<el-form-item label="销售激励" prop="incentiveType">
                <el-radio-group v-model="infoForm.incentiveType" @change="handleChangeincentiveType">
					<el-radio :label="0">固定金额 <el-input-number :disabled="infoForm.incentiveType!=0" :controls="false" :min="0" v-model="incentiveValue1" style="width:80px;" /> 元/间</el-radio>
					<el-radio :label="1">百分比 <el-input-number :disabled="infoForm.incentiveType!=1" :controls="false" :min="0" v-model="incentiveValue2" style="width:60px;" /> %/间</el-radio>
				</el-radio-group>
            </el-form-item>
			<el-form-item label="早餐配置" prop="breakfastTypeId">
                <el-select v-model="infoForm.breakfastTypeId" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in breakfastTypeList"
                    :key="item.key"
                    :label="item.name"
                    :value="Number(item.key)">
                    </el-option>
                </el-select>
            </el-form-item>
			<el-row type="flex">
				<el-form-item label="是否加床" prop="canExtraBed">
					<el-radio-group v-model="infoForm.canExtraBed">
						<el-radio :label="false">不可</el-radio>
						<el-radio :label="true">可加</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" label-width="20px" prop="extraBedPrice" v-if="infoForm.canExtraBed">
					<el-input-number :controls="false" :min="0" v-model="infoForm.extraBedPrice" style="width:80px;" /> 元/张，最多可以加
				</el-form-item>
				<el-form-item label="" label-width="20px" prop="extraBedNumber" v-if="infoForm.canExtraBed">
					<el-input-number :controls="false" :min="0" v-model="infoForm.extraBedNumber" style="width:80px;" /> 张
				</el-form-item>
			</el-row>
			<el-row type="flex">
				<el-form-item label="是否加早" prop="canExtraBreakfast">
					<el-radio-group v-model="infoForm.canExtraBreakfast">
						<el-radio :label="false">不可</el-radio>
						<el-radio :label="true">可加</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" label-width="20px" prop="extraBreakfaskPrice" v-if="infoForm.canExtraBreakfast">
					<el-input-number :controls="false" :min="0" v-model="infoForm.extraBreakfaskPrice" style="width:80px;" /> 元/人，最多可以加
				</el-form-item>
				<el-form-item label="" label-width="20px" prop="extraBreakfaskNumber" v-if="infoForm.canExtraBreakfast">
					<el-input-number :controls="false" :min="0" v-model="infoForm.extraBreakfaskNumber" style="width:80px;" /> 人
				</el-form-item>
			</el-row>
			<el-form-item label="商品名称" prop="productName">
                <el-input v-model="infoForm.productName" class="input_comm" :maxlength="12" placeholder="12汉字以内"/>
            </el-form-item>
			<el-form-item label="上架管理" prop="onSales">
				<el-radio-group v-model="infoForm.onSales">
					<el-radio :label="true">上架</el-radio>
					<el-radio :label="false">下架</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="补充说明" >
                <el-input type='textarea' :rows="2" v-model="infoForm.additionalRemarks" style="width:50%" />
            </el-form-item>
        </el-form>
		<el-row class="text-center margin_top">
			<el-button size="small" type="" v-if="isEdit" @click="$router.go(-1)" :loading='btnLoading'>返回</el-button>
			<el-button size="small" type="primary" @click="submitForm('infoForm')" :loading='btnLoading'>保存，下一步</el-button>
		</el-row>
	</div>
</template>
<style lang="scss" scoped>
</style>
<script>
	export default{
		data() {
			return {
				isEdit:false,
				viewLoading:false,
				hotelId:'',
				hotelName:'',
				roomTypeName:'',
				btnLoading:false,
				promotionValue1:'',
				promotionValue2:'',
				incentiveValue1:'',
				incentiveValue2:'',
				breakfastTypeList:[],
				infoForm: {
					roomID:this.$route.query.roomTypeId,
					// confirmResource:false,
					linkMan:'',
					linkMobile:'',
					canRefund:false,
					refundLeadDay:'',
					paymentType:0,
					promotionType:0,
					promotionValue:'',
					incentiveType:0,
					incentiveValue:'',
					breakfastTypeId:'',
					canExtraBed:false,
					extraBedPrice:'',
					extraBedNumber:'',
					canExtraBreakfast:false,
					extraBreakfaskPrice:'',
					extraBreakfaskNumber:'',
					productName:'',
					onSales:true,
					additionalRemarks:'',
					id:0
				},
				rules: {
					// confirmResource: [{required: true, message: '请选择确认类别', trigger: 'change'}],
					linkMobile: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
					linkMan: [{required: true, message: '请输入资源方联系人', trigger: 'blur'}],
					canRefund:[{required: true, message: '请输入退款规则', trigger: 'change'}],
					refundLeadDay:[{required: true, message: '请输入退款时长', trigger: 'blur'}],
					paymentType:[{ type:'number',required: true, message: '请选择资源确认', trigger: 'change'}],
					promotionType:[{ type:'number',required: true, message: '请选择推广费类型', trigger: 'change'}],
					incentiveType:[{  type:'number',required: true, message: '请选择推激励类型', trigger: 'change'}],
					breakfastTypeId:[{required: true, message: '请选择早餐类型', trigger: 'change'}],
					canExtraBed:[{ required: true, message: '请选择是否加床', trigger: 'change'}],
					extraBedPrice:[{required: true, message: '请输入加床价格', trigger: 'blur'}],
					extraBedNumber:[{required: true, message: '请输入最多加人数', trigger: 'blur'}],
					canExtraBreakfast:[{ required: true, message: '请选择是否加早', trigger: 'change'}],
					extraBreakfaskPrice:[{required: true, message: '请输入加早价格', trigger: 'blur'}],
					extraBreakfaskNumber:[{required: true, message: '请输入最多加人数', trigger: 'blur'}],
					productName:[{required: true, message: '请输入产品名称', trigger: 'blur'}],
					onSales:[{required: true, message: '请选择上架状态', trigger: 'change'}],
				},
			};
		},
		mounted(){
			this.getBreakfastType();
			this.isEdit=this.$route.query.isEdit;
			if(!this.isEdit){
				this.queryHotelAndRoom();
			}else{
				this.viewLoading=true;
				this.queryData();
			}
		},
		methods: {
			//查询商品信息
			queryData(){
				this.tableLoading=true;
				this.groupHttp.get("/HotelProduct/GetHotelProductEditInfo",{params:{
					ProductId:this.$route.query.productId
				}})
				.then(res => {
					if (res.data.isSuccess) {
						this.infoForm=Object.assign(this.infoForm,res.data.object)
						if(this.infoForm.promotionType==0){
							this.promotionValue1=this.infoForm.promotionValue;
						}else{
							this.promotionValue2=this.infoForm.promotionValue;
						}
						if(this.infoForm.incentiveType==0){
							this.incentiveValue1=this.infoForm.incentiveValue;
						}else{
							this.incentiveValue2=this.infoForm.incentiveValue;
						}
						this.queryHotelAndRoom();
					} else {
						this.$message.error(res.data.message);
					}
				});
			},
			//查询酒店和房型
			queryHotelAndRoom(){
				this.tableLoading=true;
				this.groupHttp.get("/HotelProduct/GetHotelProductSetHotelAndRoom",{params:{
					RoomId:this.infoForm.roomID
				}})
				.then(res => {
					if (res.data.isSuccess) {
						this.hotelId=res.data.object.hotelId;
						this.hotelName=res.data.object.hotelName;
						this.roomTypeName=res.data.object.roomName;
					} else {
						this.$message.error(res.data.message);
					}
					this.viewLoading=false;
				});
			},
			//重新选择酒店
			handleReChooseHotel(){
				this.$router.go(-2)
			},
			//重新选择房型
			handleReChooseRoomType(){
				if(this.isEdit){
					this.$router.push({name:'chooseRoomType',query:{hotelId:this.hotelId,productId:this.infoForm.id,isEdit:this.isEdit}})
				}else{
					this.$router.go(-1)
				}
			},
			//改变推广费
			handleChangepromotionType(val){
				if(val==0){
					this.promotionValue2='';
				}else{
					this.promotionValue1='';
				}
			},
			//改变销售激励
			handleChangeincentiveType(val){
				if(val==0){
					this.incentiveValue2='';
				}else{
					this.incentiveValue1='';
				}
			},
			//提交房型
			submitForm(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.breakfastTypeList.forEach(item=>{
							if(item.key==this.infoForm.breakfastTypeId){
								this.infoForm.breakfastType=item.name;
							}
						})
						if(this.infoForm.promotionType==0){
							this.infoForm.promotionValue=this.promotionValue1;
						}else{
							this.infoForm.promotionValue=this.promotionValue2;
						}
						if(this.infoForm.incentiveType==0){
							this.infoForm.incentiveValue=this.incentiveValue1;
						}else{
							this.infoForm.incentiveValue=this.incentiveValue2;
						}

						this.groupHttp.post('/HotelProduct/CreateOrEidtHotelProduct',this.infoForm)
						.then((res) => {
							if(res.data.isSuccess){
								this.$message({
									type:'success',
									message:'保存产品设置成功！'
								});
								if(this.isEdit){
									this.$router.push({name:'priceSetting',query:{productId:res.data.productId,isEdit:this.isEdit}})
								}else{
									this.$router.push({name:'priceSetting',query:{productId:res.data.productId}})
								}
								
							}else{
								this.$message.error(res.data.message);
							}
						}).catch((e) => {
							console.log(e)
						})
					}
				})
			},
			//获取早餐类型
			getBreakfastType(){
				this.groupHttp.get('/HotelProduct/GetHotelOnlySetSelect')
				.then((res) => {
					if(res.data.isSuccess){
						this.breakfastTypeList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			
		}
	}
</script>
