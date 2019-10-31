<template>
	<div class='view' v-loading="viewLoading">
		<h3 class="text-center">{{template.contractTemplateName}}</h3>
		<el-form ref="form" :model="form" label-width="200px" id="form" size="small">
			<div class="margin_bottom"><el-button size="small" type="primary" @click='addPassenger'>添加游客</el-button></div>
			<el-table :data="form.SignerList" border  >
				<el-table-column prop="SignerDesc" label="角色" width="150">
				</el-table-column>
				<el-table-column label="姓名">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.OutUserName"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="手机号">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.OutMobile"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="Email(用于收取已签署电子合同邮件)">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.Email"></el-input>
					</template>
				</el-table-column>
				<el-table-column width="80">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click='deletePassenger(scope.row,scope.$index)' v-if="scope.row.canDelete">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="danger">*注：请仔细填写姓名与手机号码，如果信息错误将会影响到合同的合法性。</div>
			<div class="margin_top">
				<h4>合同需填信息</h4>
				<el-row >
					<el-col :span="item.InputType!='T'?12:24" v-for="(item,index) in templateInfoList">
						<el-form-item :label="item.labelName">
							<el-input v-model="item.InputDefaultValue" v-if="item.InputType=='A'" class="input_comm"></el-input>
							<el-input type="textarea" v-model="item.InputDefaultValue" v-else-if="item.InputType=='B'" autosize class="input_comm"></el-input>
							<el-radio-group v-model="item.InputDefaultValue" v-else-if="item.InputType=='C'">
								<el-radio :label="item1" v-for="(item1,index1) in item.InputDefaultValueList">{{item1}}</el-radio>
								<!-- <el-radio label="不同意">不同意</el-radio> -->
							</el-radio-group>
							<el-date-picker
								v-model="item.InputDefaultValue"
								type="date"
								value-format="yyyy-MM-dd"
								placeholder="选择日期" size="small" :id="'date'+index"  v-else-if="item.InputType=='D'">
							</el-date-picker>
							<div v-else-if="item.InputType=='E'||item.InputType=='F'">
								<el-upload
									action="/file/upload"
									:http-request="imgUpload"
									:limit="1"
									:multiple="true"
									accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
									:file-list="qualificationsList"
									:before-upload="beforeAvatarUpload"
									class="upload-demo"
									name="uploadWordFile"
									id="uploadWordFile"
								>
									<el-button size="small" type="primary">点击上传</el-button>
  									<div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过15M</div>
								</el-upload>
							</div>
							<div v-else-if="item.InputType=='T'">
								<div class="margin_bottom"><el-button type="primary" @click="addRow" size="small">新增</el-button></div>
								<el-table :data="tableArr" border  >
									<el-table-column label="操作" width="50" fixed>
										<template slot-scope="scope">
											<el-button type="text" @click="deleteRow(scope.row,scope.$index)" size="mini">删除</el-button>
										</template>
									</el-table-column>
									<el-table-column :label="item2" v-for="(item2,index) in item.InputDefaultValue">
										<template slot-scope="scope">
											<el-input size="small" v-model="scope.row['value'+index]"></el-input>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		
		<div class="margin_top text-center">
			<el-button type="primary" @click="onSubmit" size="small" :disabled="loading" :loading="loading">生成合同</el-button>
		</div>
	</div>
</template>
<script>
	import { dateFmt } from "@/utils/tools";
	export default {
		data() {
			return {
				template:'',
				tableTemp:{},
				tableArr:[],
				templateInfoList:[],
				form:{
					OrderNo:'',
					IsOfflineOrder:this.$route.query.isOfflineOrder,
          IsRemark:this.$route.query.isRemark,
					ContractNo:'',
					SignerList:[],
					HgyList:[],
				},
				Qualifications:'',
				qualificationsList:[],
				viewLoading:true,
				passengerId:'',
				outUserCode:'',
        loading:false,
			};
		},
		mounted() {
			this.groupHttp
			.get("Contract/GetSignContractTemplate?OrderNo="+this.$route.query.orderNo+"&IsOfflineOrder="+this.$route.query.isOfflineOrder+"&IsRemark="+this.$route.query.isRemark)
			.then(res => {
				if(res.data.isSuccess == true) {
					let objects=res.data.objects[0];
					
					this.form.OrderNo=objects.orderNo;
					this.form.ContractNo=objects.contractNumber;
					
					if(objects.signerList.length>0){
						objects.signerList.forEach((item,index)=>{
							if(index==0){
								this.passengerId=item.signerID;
								this.outUserCode=item.outUserCode;
							}
							let obj={
								SignerDesc: item.signerDesc,
								SignerID: item.signerID,
								OutUserCode:item.outUserCode,
								OutUserName:item.outUserName,
								OutIdCardNo:item.outIdCardNo,
								OutMobile: item.outMobile,
								Email: item.email,
							}
							this.form.SignerList.push(obj);
						})
					}
					if(objects.templateJsonValList.length>0){
						objects.templateJsonValList.forEach(item=>{
							let obj=JSON.parse(item.tableJson)
							let len=obj.InputKey.search(/_\d\d/g);
							if(len>-1){
								obj.labelName=obj.InputKey.substr(len+3)
							}
							obj.InputDefaultValue=obj.InputDefaultValue||'';
							if(obj.InputType=='T'){
								obj.InputDefaultValue.forEach((item2,index)=>{
									this.tableTemp['value'+index]=''
								})
								this.tableArr.push(JSON.parse(JSON.stringify(this.tableTemp)));
							}	
							if(obj.InputType=='C'){
								obj.InputDefaultValueList= obj.InputDefaultValue;
								obj.InputDefaultValue=obj.InputDefaultValueList[0];
							}
							this.templateInfoList.push(obj);
						})
					}
					this.template=objects;
					this.viewLoading=false;
				}
			})
			.catch(e => {});
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			//添加游客
			addPassenger(){
				let obj={
					SignerDesc:'游客',
					SignerID:this.passengerId,
					OutUserCode:this.outUserCode,
					OutUserName:'',
					OutIdCardNo: "",
					OutMobile: "",
					Email: "",
					canDelete:true
				}
				this.form.SignerList.splice(-1,0,obj);
			},
			//删除游客
			deletePassenger(row,index){
				this.form.SignerList.splice(index,1);
			},
			addRow(){
				this.tableArr.push(JSON.parse(JSON.stringify(this.tableTemp)))
			},
			deleteRow(row,index){
				this.tableArr.splice(index,1);
			},
			handleRemoveQualifications(){
				this.qualificationsList=[];
				this.Qualifications='';
			},
			imgUpload(val)
			{ 	
				// let _this = this;
				// var reader = new FileReader();//5.实例化一个FileReader()接口
				// reader.readAsDataURL(val.file);//6.通过readAsDataURL()方法读取文件
				// reader.onload = function(evt) {//7.调用FileReader()的onload事件，当文件读取成功时，执行8
				// 	_this.Qualifications=evt.target.result;//8
				// }
			},
	//      限制图片
			beforeAvatarUpload(file){
				const isImg = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
				const isLt2M = file.size / 1024 / 1024 < 15;
				if (!isImg) {
					this.$message.error('上传文件只能是 docx 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 15MB!');
				}
				return isImg && isLt2M;
			},
      onValidateInfo(InputKey,InputValues){
        let falg = true;
        //var labelName = InputKey;
        //let len=InputKey.search(/_\d\d/g);
        //if(len>-1){
        //  labelName=InputKey.substr(len+3);
        //}

        //var btList = ["旅游者（逗号分隔）","旅游者人数","旅游线路名称","旅游目的地","出发时间","结束时间","结束时间","成人费用","旅游费用合计","旅游费用支付方式","旅游费用支付时间"
        //,"旅行社机构所属:名称-(部门/门市/分社)","旅行社联系人姓名","旅游者签约日期","旅行社销售姓名","旅行社联系电话","旅行社签约日期","签约地点","旅游报名表出团时间"];

       //for(var i=0; i <= btList.length; i++){
       //  if(labelName==btList[i] && InputValues==""){
       //    this.$message.error(labelName+" 不能为空");
       //    falg = false;
       //    return falg;
       //  }
       //}
       return falg;
      },
			onSubmit(form,type) {
				// this.$refs[form].validate(valid => {
				// 	if(valid) {
        let falg = true;
					let _this=this;
					this.templateInfoList.forEach(item=>{
						let InputValues=item.InputDefaultValue
						if(item.InputType=='T'){
							InputValues=[]
							this.tableArr.forEach(item2=>{
								let num=0;
								for(let key in item2){
									InputValues.push(item2['value'+num])
									num++;
								}
							})
							InputValues=JSON.stringify(InputValues) 
						}
						// if(item.InputType=='E'||item.InputType=='F'){
						// 	InputValues=_this.Qualifications;
						// }
						let obj={
							InputKey:item.InputKey,
							InputValues: InputValues
						}
						this.form.HgyList.push(obj);
            if(falg && !this.onValidateInfo(obj.InputKey,obj.InputValues)){
               falg = false;
               return false;
            }
					});
          if(falg== false){return;}
          this.loading=true;
					this.groupHttp
						.post("Contract/SignElectronicContract", this.form)
						.then(res => {
              this.loading=false;
							if(res.data.isSuccess == true) {
								this.$message({
									type: "success",
									message: "合同签订成功"
								});
								
								this.$router.go(-1);
							} else {
								this.$message.error("出错了:" + res.data.message);
							}
						})
						.catch(e => {
              this.loading=false;
							this.$message.error(e);
							setTimeout(() => {
								if(type == "payment") {
									this.submitLoading2 = false;
								} else {
									this.submitLoading1 = false;
								}
							}, 500);
						});
						// }
							
				// });
			},
			
		}
	};
</script>
<style scoped lang="scss">
	
	.el-col {
		margin-bottom: 0px;
	}
	.el-form-item{
		margin-bottom: 10px!important;
	}
	
</style>
