<template>
	<div class="view">
		<div class="form-wrap">
				<el-form ref="form" :model="form" :rules="rules" label-width="160px" size="small">
				<el-form-item label="类型" prop="AirlineType">
					<el-select v-model="form.AirlineType" placeholder="请选择类型">
						<el-option label="国内" value="Domestic"></el-option>
						<el-option label="国外" value="International"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="航空公司名称" prop="Name">
					<el-input v-model="form.Name"></el-input>
				</el-form-item>
				<el-form-item label="标志" prop="Logo">
					<el-upload class="avatar-uploader" :http-request="upload" action="http://120.76.20.11:8004/image/upload" :show-file-list="false" :on-success="handleLogoSuccess" :before-upload="beforeLogoUpload" >
						<img v-if="form.Logo" :src="form.Logo" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="三字代码">
					<el-input v-model="form.Code"></el-input>
				</el-form-item>
				<el-form-item label="二字代码">
					<el-input v-model="form.IATACode"></el-input>
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="form.Contacts"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="form.Phone"></el-input>
				</el-form-item>
				<el-form-item label="手机">
					<el-input v-model="form.Mobile"></el-input>
				</el-form-item>
				<el-form-item label="传真号">
					<el-input v-model="form.Fax"></el-input>
				</el-form-item>
				<el-form-item label="结算方式">
					<el-input></el-input>
				</el-form-item>
				<el-form-item label="网址">
					<el-input v-model="form.WebSite"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="CityID">
					<template v-if="!editAdress">
						<span>{{adress}}</span>
						<el-button size="mini" @click="editAdress=!editAdress">修改</el-button>
					</template>
					<address-select v-if="editAdress" width="60%" :data-type="form.AirlineType" @result="addressResult"></address-select>
				</el-form-item>
				<el-form-item label="航空公司名单模版" prop="UploadFile">
					<el-upload class="avatar-uploader" :http-request="uploadFile" action="http://120.76.20.11:8004/file/upload" :on-exceed="handleExceed" :on-remove="handleRemoveFile" :show-file-list="true" :limit="1" :auto-upload="true" :file-list="fileList">
						<el-button type="primary" >上传</el-button>
					</el-upload>
					<a v-if="form.UploadFile" :href="form.UploadFile" type="primary" download="filename">下载</a>
				</el-form-item>
				<el-form-item label="航空公司政策">
					<el-input type="textarea" v-model="form.Policy"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="form.Remark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :disabled="editBtn" @click="onSubmit" :loading="submitLoading">保存</el-button>
					<el-button @click="handleCancel">返回</el-button>
				</el-form-item>
			</el-form>
			
		</div>
	</div>
</template>

<script>
	import addressSelect from '@/components/address-select/index'
	export default {
		components:{
			addressSelect
		},
		data() {
			let checkAdress = (rule, value, callback) => {
		        if (value === '') {
		          return callback(new Error('请选择地址'));
		        }else{
		        	callback();
		        }
		        
		      };
			return {
				form: {
					Name: '',
					AirlineType: '',
					Logo: 'http://www.airchina.com.cn/cn/images/logo.gif',
					Code: '',
					IATACode: '',
					Contacts: '',
					Phone: '',
					Mobile: '',
					Fax: '',
					CountryID: '1',
					CountryName: '中国',
					ProvinceID: '',
					ProvinceName: '',
					CityID: '',
					CityName: '',
					DistrictID: '',
					DistrictName: '',
					WebSite: '',
					Policy: '',
					Remark: '',
					UploadFile:'',
					UploadFileName:'',
				},
				rules: {
					Name: [{
						required: true,
						message: '请输入航空公司名称',
						trigger: 'blur'
					}],
					AirlineType: [{
						required: true,
						message: '请选择类型',
						trigger: 'change'
					}],				
				},
				adress:[],
				editAdress:false,
				submitLoading:false,
				editBtn:false,
				fileList: [{name: '', url: ''}],
			}
		},
		mounted(){
			this.getInfo()
		},
		methods: {
			getInfo(){
				this.airHttp.get('api/airline/detail?Id='+this.$route.params.id)
				.then((res)=>{
					this.form.Name=res.data.objects[0].name
					this.form.AirlineType=res.data.objects[0].airlineType==0?'Domestic':'International'
					this.form.Logo=res.data.objects[0].logo
					this.form.Code=res.data.objects[0].code
					this.form.IATACode=res.data.objects[0].iataCode
					this.form.Contacts=res.data.objects[0].contacts
					this.form.Phone=res.data.objects[0].phone
					this.form.Mobile=res.data.objects[0].mobile
					this.form.Fax=res.data.objects[0].fax
					this.form.CountryID=res.data.objects[0].countryID
					this.form.CountryName=res.data.objects[0].countryName
					this.form.ProvinceID=res.data.objects[0].provinceID
					this.form.ProvinceName=res.data.objects[0].provinceName
					this.form.CityID=res.data.objects[0].cityID
					this.form.CityName=res.data.objects[0].cityName
					this.form.DistrictID=res.data.objects[0].districtID
					this.form.DistrictName=res.data.objects[0].districtName
					this.form.WebSite=res.data.objects[0].webSite
					this.form.Policy=res.data.objects[0].policy
					this.form.Remark=res.data.objects[0].remark
					this.form.Id=res.data.objects[0].id
					this.form.UploadFile=res.data.objects[0].uploadFile
					this.form.UploadFileName=res.data.objects[0].uploadFileName
					this.fileList[0].name=res.data.objects[0].uploadFileName
					this.fileList[0].url=res.data.objects[0].uploadFile
					if(JSON.stringify(res.data.objects[0].uploadFileName)=="null")
					{
						this.fileList=[];
					}
					if(this.form.AirlineType=='International'){
						this.adress.push(this.form.CountryName,this.form.ProvinceName,this.form.CityName)
					}
					if(this.form.AirlineType=='Domestic'){
						this.adress.push(this.form.ProvinceName,this.form.CityName)
					}
					this.adress=this.adress.join(' / ')
				})
			},
			upload(val){
				var f=new FormData()
				f.append('FileData',val.file)
				f.append('Category','AirTicket')
				f.append('thumbnail',true)
				f.append('Folder','Airline')
				this.fileUpload.post(val.action,f)
				.then((res)=>{
					this.form.Logo=res.data.url
				})
			},
			uploadFile(val){	//上传文件
				var f=new FormData()
				f.append('FileData',val.file)
				f.append('Category','AirTicket')
				f.append('thumbnail',false)
				f.append('Folder','Airline')
				this.fileUpload.post(val.action,f)
				.then((res)=>{
					
					this.form.UploadFileName=val.file.name
					this.form.UploadFile=res.data.url
				})
			},
			onSubmit() {
				this.$refs['form'].validate((valid) => {
		          if (valid) {
					  this.$confirm('确定提交本次操作？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
						}).then(() => {
							this.submitLoading=true
							this.airHttp.post('api/airline/save',this.form)
							.then((res)=>{
								this.submitLoading=false
								if(res.data.isSuccess){
									this.$message({
									message: '编辑航空公司成功！',
									type: 'success'
								});
									this.editBtn=true
									setTimeout(()=>{
										this.$router.push({name:'company-list'})
									},2000)
								}
							})
						}).catch(() => {
						         
						});
					
				} else {
		            console.log('error submit!!');
		            return false;
		          }
				})
			},
			//接受地址选择器的结果
			addressResult(val) {
				if(this.form.AirlineType=='Domestic'){
					this.form.ProvinceID=val.first.id
					this.form.ProvinceName=val.first.name
					this.form.CityID=val.second.id
					this.form.CityName=val.second.name
				}
				if(this.form.AirlineType=='International'){
					this.form.CountryID=val.first.id
					this.form.CountryName=val.first.name
					this.form.ProvinceID=val.second.id
					this.form.ProvinceName=val.second.name
					this.form.CityID = val.third.id
					this.form.CityName = val.third.name
				}
				
			},
			handleLogoSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeLogoUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleCancel(){
				this.$router.go(-1)
			},
			handleRemoveFile(){
				this.form.UploadFile=""
				this.from.UploadFileName=""
			},
			handleExceed(){
				this.$message.error('最多上传一个文件，请先移除已上传文件！');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-wrap {
		width: 50%;
		.el-input {
			width: 200px;
		}
	}
	
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>