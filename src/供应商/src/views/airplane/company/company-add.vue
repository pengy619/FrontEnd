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
					<el-input v-model="form.Name"  maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="标志" prop="Logo">
					<el-upload class="avatar-uploader" :http-request="upload" action="/attachment/upload" :show-file-list="false" :on-success="handleLogoSuccess" :before-upload="beforeLogoUpload">
						<img v-if="form.Logo" :src="form.Logo" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="三字代码">
					<el-input v-model="form.Code" maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="二字代码">
					<el-input v-model="form.IATACode" maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="form.Contacts" maxlength="20"></el-input>
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
					<el-input  maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="网址">
					<el-input v-model="form.WebSite"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="CityID">
					<!--<el-cascader :options="addressOptions" @active-item-change="addressItemChange" :props="props"></el-cascader>-->
					<address-select width="60%" :data-type="form.AirlineType" @result="addressResult"></address-select>
				</el-form-item>
				<el-form-item label="航空公司名单模版" prop="UploadFile">
					<el-upload class="avatar-uploader" :http-request="uploadFile" action="http://120.76.20.11:8004/file/upload" :on-exceed="handleExceed" :on-remove="handleRemoveFile" :show-file-list="true" :limit="1" :auto-upload="true" >
						<el-button type="primary" :disabled="addBtn">上传</el-button>
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
					<el-button type="primary" :disabled="addBtn" @click="onSubmit" :loading="submitLoading">保存</el-button>
					<el-button @click="handleCancel">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import addressSelect from '@/components/address-select/index'
	export default {
		components: {
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
					AirlineType: 'Domestic',
					Logo: '',
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
				submitLoading: false,
				addBtn: false
			}
		},
		methods: {
			onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$confirm('确定提交本次操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitLoading = true
              this.airHttp.post('api/airline/save', this.form)
                .then((res) => {
                  this.submitLoading = false
                  if (res.data.isSuccess) {
                    this.$message({
                      message: '添加航空公司成功！',
                      type: 'success'
                    });
                    this.$refs['form'].resetFields();
                    this.addBtn = true
                    setTimeout(() => {
                      this.$router.push({name: 'company-list'})
                    }, 1000)
                  }
                })
            }).catch(() => {

            });
          }
        })
      },
			//接受地址选择器的结果
			addressResult(val) {
				if(this.form.AirlineType == 'Domestic') {
					this.form.ProvinceID = val.first.id
					this.form.ProvinceName = val.first.name
					this.form.CityID = val.second.id
					this.form.CityName = val.second.name
				}
				if(this.form.AirlineType == 'International') {
					this.form.CountryID = val.first.id
					this.form.CountryName = val.first.name
					this.form.ProvinceID = val.second.id
					this.form.ProvinceName = val.second.name
					this.form.CityID = val.third.id
					this.form.CityName = val.third.name
				}

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
			handleCancel() {
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
