<template>
	<div class="view" v-loading="tableLoading">
		<h4>航班信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="24">
				航空公司：{{obj.airlineName}}
			</el-col>
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

		<h4>预留信息</h4>
		<el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" style="width:50%">
			
			<el-form-item label="预留数量" prop="AdultQuantity">
				<el-input v-model="form.AdultQuantity"></el-input>
			</el-form-item>
		
			<el-form-item label="预留账号" prop="ReservedAccount">
					<el-input v-model="form.ReservedAccount"></el-input>
					<el-button size="small" >选用</el-button>
			</el-form-item>
		
			<el-form-item label="预留时间" required style="margin-bottom:0">
				<el-col style="padding-left:0">
					<el-form-item prop="date">
						<el-date-picker
						v-model="form.date"
						type="date"
						placeholder="选择订单日期"
							:picker-options="startAndEnd.pickerBegin"  class="date-input full-width">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col  >
					<el-form-item prop="time">
						<el-time-picker
						v-model="form.time"
						type="date"
						placeholder="选择订单时间"
							:picker-options="{selectableRange:startAndEnd.pickerBeginTime}" class="date-input full-width" @focus="handleTimeFocus">
						</el-time-picker>
					</el-form-item>
				</el-col>
			</el-form-item>
		
			<el-form-item label="预留联系人"  prop="Contacts">
				<el-input v-model="form.Contacts" :maxlength="20"></el-input>
			</el-form-item>
		
			<el-form-item label="预留电话" prop="ContactsPhone">
				<el-input v-model="form.ContactsPhone"  :maxlength="20"></el-input>
			</el-form-item>
		
			<el-form-item label="预留说明">
				<el-input
				type="textarea"
				:autosize="{ minRows: 3, maxRows:5}"
				placeholder="请输入内容"
				v-model="form.Remark">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button size="small" type="primary" @click="onSubmit">提交</el-button>
				<el-button size="small" @click="handleCancel">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	//caijiongrui
	import　{dateFmt}　from　'@/utils/tools'
	export default {
		data() {
			let checkNumber = (rule, value, callback) => {
				let num=this.obj.remainingQuantity-this.obj.reductionSaleQuantity;
				if (!value) {
					return callback(new Error('请填写预留数量'));
				}else if(isNaN(Number(value))){
					return callback(new Error('预留数量必须填写数字'));
				}else if(Number(value)<0){
					return callback(new Error('预留数量必须大于0'));
				}else if(value.toString().indexOf('.')>-1){
					return callback(new Error('预留数量必须为整数'));
				}else if(Number(value)>num){
					return callback(new Error(`该航班库存不足，请修改预留数量或重新选择航班`));
				}else{
					callback();
				}
			};
			return {
				value11:'',
				obj:{},
				form:{
					ProductId:this.$route.params.id,
					AdultQuantity:null,
					ReservedAccount:'',
					Contacts:'',
					ReservedTime:'',
					date:new Date(),
					time:new Date(),
					ContactsPhone:'',
					Remark:'',
				},
				date1:'',
				rules:{
					Contacts:[{
						required: true,
						message: '请输入预留联系人',
						trigger: 'blur'
					}],
					date:[{
						type:'date',
						required: true,
						message: '请选择预留日期',
						trigger: 'blur'
					}],
					time:[{
						type:'date',
						required: true,
						message: '请选择预留时间',
						trigger: 'blur'
					}],
					AdultQuantity:[{
						required: true,
						validator:checkNumber,
						trigger: 'blur'
					}],
					ReservedAccount:[{
						required: true,
						message: '请输入预留账号',
						trigger: 'blur'
					}],
					ContactsPhone:[{
						required: true,
						message: '请输入预留电话',
						trigger: 'blur'
					}],
				},
				tableLoading:false,
				startAndEnd:{
					pickerBegin:{
						disabledDate:(time)=> {
							return time.getTime() < Date.now();
						}
					},
					pickerBeginTime:''
				},
			}
		},
		mounted(){
			this.getInfo()
		},
		methods:{
			getInfo(){
				this.tableLoading=true;
				//+this.$route.params.pricingSalesId
				this.airHttp.get(`api/Common/GetDetailsTop?operatingRecordId=0&pricingSalesId=${this.$route.params.id}`)
				.then((res)=>{
					this.tableLoading=false;

					var objects=res.data.objects[0];
					// objects.departDate=objects.departDate.split(/T/)[0];
					// objects.flightType=objects.flightType==0?'国内':'国外';
					this.obj=objects;
				})
				
			},
			onSubmit(){
				this.$refs['form'].validate((valid) => {
		          if (valid) {
					  this.$confirm('确定提交本次操作？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
						}).then(() => {
							this.submitLoading=true
							this.form.ReservedTime=`${dateFmt(this.form.date,'yyyy-MM-dd')} ${dateFmt(this.form.time,'hh:mm:ss')}`;
							this.airHttp.post('api/airticket/submitreserved',this.form)
							.then((res)=>{
								this.submitLoading=false
								if(res.data.isSuccess){
									this.$message({
									message: '提交预留单成功！',
									type: 'success'
								});
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
			handleInfoSelectionChange(val){
				this.infoMultiSelection = val;
			},
			handleTimeFocus(){
				let date=new Date();
				let time=dateFmt(date,'hh:mm:ss');
				this.startAndEnd.pickerBeginTime=`${time}-23:59:59`
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
	.view .el-input,
	.view .el-date-editor.el-input{
		width: 200px;
	}
	.view .el-date-editor input,
	.view .el-select input
	{
		width: 100%!important;
	}
</style>