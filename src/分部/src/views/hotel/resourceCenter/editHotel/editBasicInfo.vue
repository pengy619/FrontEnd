<template>
	<div class="view" v-loading="viewLoading">
		<el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="200px" class="demo-ruleForm" size="small">
			<el-form-item label="酒店主题" >
				<el-select v-model="infoForm.hotelThemeID" placeholder="请选择酒店主题">
					<el-option :key="item.key"
							:label="item.name"
							:value="Number(item.key)" v-for="item in hotelThemeList"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="酒店名称" prop="hotelName">
				<el-input v-model="infoForm.hotelName" class="input_comm" placeholder="请填写酒店名称"></el-input>
			</el-form-item>
			<el-form-item label="酒店英文名称" prop="englishHotelName" v-if="infoForm.hotelsType>0">
				<el-input v-model="infoForm.englishHotelName" class="input_comm" placeholder="请填写酒店英文名称"></el-input>
			</el-form-item>
			<el-form-item label="酒店星级" prop="starRated">
				<el-select v-model="infoForm.starRated" placeholder="请选择酒店星级" >
					<el-option :key="item.key"
							:label="item.value"
							:value="item.key" v-for="item in starRatedList"></el-option>
				</el-select>
			</el-form-item>
			<el-row type="flex"  v-if="infoForm.hotelsType==2">
				<el-form-item label="酒店地址" prop="countryID">
						<el-select v-model="infoForm.countryID" placeholder="  请选择国家" @change="getProvince">
							<el-option v-for="item in CountryList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item  label="" prop="provinceID" label-width="20px">
						<el-select v-model="infoForm.provinceID" placeholder=" 请选择省" @change="provinceChange">
							<el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item  label="" prop="cityID" label-width="20px">
						<el-select v-model="infoForm.cityID" placeholder=" 请选择市">
							<el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
						</el-select>
				</el-form-item>
				<!-- <address-select ref="addressSelect" :data-type="addressType" @result="addressResult" style="width:300px"></address-select> -->
			</el-row>
			<el-row type="flex" v-else>
				<el-form-item label="酒店地址" prop="provinceID">
						<el-select v-model="infoForm.provinceID" placeholder="  请选择省" @change="provinceChange">
							<el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item  label="" prop="cityID" label-width="20px">
						<el-select v-model="infoForm.cityID" placeholder=" 请选择市" @change="cityChange">
							<el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item  label="" prop="districtID" label-width="20px">
						<el-select v-model="infoForm.districtID" placeholder=" 请选择区（县）">
							<el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
						</el-select>
				</el-form-item>
              </el-row>
			<el-form-item label="" prop="address">
				<el-input v-model="infoForm.address"  placeholder="请填写详细地址" style="width:300px"></el-input>
			</el-form-item>
			<el-form-item label="酒店电话" prop="contactNO">
				<el-input v-model="infoForm.contactNO" class="input_comm"></el-input>
			</el-form-item>
			<el-form-item label="酒店介绍" prop="description">
				<editor id='editor_id' height="260px" width="700px" :content="infoForm.description" uploadJson="/Home/UploadImage"
						pluginsPath="/static/kindeditor/plugins/"
						:allowFileManager="false"
						:loadStyleMode="false"
						@on-content-change="onContentChange"
				>
				</editor>
			</el-form-item>
			<el-form-item label="图片" prop="hotelPictures">
				<span>（图片限2M以下，建议尺寸为885*487，格式为：jpg/png，数量限制10张，可自由设置主图有且仅有1张。）</span>
				<div class="upload-list">
				<div class="thumb-img" v-for="(item,index) in infoForm.hotelPictures" :key="item.path">
					<div class="img">
						<img :src="item.path" alt="">
					</div>
					<div>
						<div>
							<el-checkbox v-model="item.isMain">主图</el-checkbox>
							<el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
							<el-button type="text" @click="handlePictureCardPreview(item.path)">放大</el-button>
						</div>
						<el-input class="width_full" v-model="item.name" size="mini" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<el-upload
					action="/image/upload"
					list-type="picture-card"
					:http-request="imgUpload"
					:show-file-list="false"
					:file-list="infoForm.hotelPictures"
					:limit="10"
					:multiple="true"
					accept="image/jpeg,image/png"
					:before-upload="beforeAvatarUpload"
					class="upload-btn"
					v-show="infoForm.hotelPictures.length < 10"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible" size="tiny">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
				</div>
			</el-form-item>
		</el-form>
		<el-row class="text-center margin_top">
			<el-button size="small" type="primary" @click="submitForm('infoForm')" :loading='btnLoading'>保存</el-button>
			<el-button size="small" type="" @click="goBack" :loading='btnLoading'>返回</el-button>
		</el-row>
	</div>
</template>
<style lang="scss" scoped>
</style>
<script>
	export default{
		data() {
			return {
				viewLoading:true,
				isFirstTime:true,
				hotelThemeList:[],
				starRatedList:[],
				btnLoading:false,
				dialogVisible:false,
				dialogImageUrl:'',
				CountryList:[],
				ProvinceList:[],
				CityList:[],
				DistrictList:[],
				infoForm: {
					hotelThemeID:'',
					hotelThemeName:'',
					hotelName:'',
					englishHotelName:'',
					hotelsType:'',
					starRated:'',
					countryID:'',
					countryName:'',
					provinceID:'',
					provinceName:'',
					cityID:'',
					cityName:'',
					districtID:'',
					districtName:'',
					address:'',
					contactNO:'',
					description:'',
					hotelPictures:[],
					id:0,
				},
				rules: {
					hotelName: [
						{required: true, message: '请输入酒店名称', trigger: 'blur'}
					],
					englishHotelName: [
						{required: true, message: '请输入酒店英文名称', trigger: 'blur'}
					],
					starRated: [
						{required: true, message: '请选择酒店星级', type: 'number', trigger: 'change'}
					],
					countryID:[{type:'number', required: true, message: '请选择酒店地址', trigger: 'change'}],
					provinceID:[{type:'number', required: true, message: '请选择省', trigger: 'change'}],
					cityID:[{type:'number', required: true, message: '请选择市', trigger: 'change'}],
					districtID:[{type:'number', required: true, message: '请选择区（县）', trigger: 'change'}],
					address:[{ required: true, message: '请填写详细地址', trigger: 'blur'}],
					contactNO: [{required: true,message: '请填写酒店电话',trigger:'blur'}],
					description: [
						{required: true,  message: '请输入酒店介绍', trigger: 'blur'}
					],
					hotelPictures: [
						{required: true, type: 'array', required: true, message: '请上传图片', trigger: 'change'}
					]
				}
			};
		},
		mounted(){
			this.getInfo();
			this.getHotelTheme();
			this.getStarRate();
		},
		watch:{
			infoForm:{
				handler:function (val) {
					if(val.hotelPictures.length>1){
						let arr =[];
						val.hotelPictures.forEach((item,index)=>{
							if(item.isMain == true){
								arr.push(item)
								if(arr.length>1){
									this.$message.error('您已选择主图')
									val.hotelPictures[index].isMain = false;
								}
							}
						})
					}
				},
				deep:true
			}
		},
		methods: {
			//返回
			goBack(){
				this.$router.go(-1)
			},
			//获取信息
			getInfo(){
				this.groupHttp.get('/Hotel/GetHotelInfoForEdit',{
					params:{HotelID:this.$route.query.hotelId}
				})
				.then((res) => {
					if(res.data.isSuccess){
						this.infoForm = Object.assign(this.infoForm,res.data.object);
						if(this.infoForm.hotelsType!=2){
							this.getProvince();
						}else{
							this.getCountry();
						}
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			getCountry(){
                this.addressHttp.post('/AreaAddress/GetCountry?CountryId=0').then((res)=>{
					this.CountryList = res.data;
					this.getProvince(this.infoForm.countryID)
                }).catch((e) => {
                    // console.log(e);
                })
            },
			getProvince(){
                this.addressHttp.post('/AreaAddress/GetProvince?CountryId='+this.infoForm.countryID).then((res)=>{
					this.ProvinceList = res.data;
					if(this.isFirstTime){
						this.provinceChange(this.infoForm.provinceID)
					}else{
						this.infoForm.provinceID = '';
						this.infoForm.cityID = '';
					}
                }).catch((e) => {
                    // console.log(e);
                })
            },
            provinceChange(val){
				this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
					this.CityList = res.data;
					if(this.isFirstTime&&this.infoForm.hotelsType!=2){
						this.cityChange(this.infoForm.cityID);
					}else if(this.isFirstTime&&this.infoForm.hotelsType==2){
						this.isFirstTime=false;
						this.viewLoading=false;
					}else{
						this.infoForm.cityID = '';
						this.infoForm.districtID = '';
					}
				}).catch( (e) => {
                          //console.log(e);
                })
            },
            cityChange(val){
				this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
					this.DistrictList = res.data;
					if(!this.isFirstTime){
						this.infoForm.districtID = '';
					}else{
						this.isFirstTime=false;
						this.viewLoading=false;
					}
				}).catch( (e) => {
							//console.log(e);
				})
            },
			//富文本框内容改变
			onContentChange(data){
				this.infoForm.description = data.value;
			},
			handlePictureCardPreview(url){
				this.dialogImageUrl = url;
				this.dialogVisible = true;
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.infoForm.hotelsType==2){
							this.CountryList.forEach((item) => {
								if(item.id == this.infoForm.countryID){
									this.infoForm.countryName = item.name;
								}
							})
						}else{
							this.DistrictList.forEach((item) => {
								if(item.id == this.infoForm.districtID){
									this.infoForm.districtName = item.name;
								}
							})
						}
						this.ProvinceList.forEach((item) => {
							if(item.id == this.infoForm.provinceID){
								this.infoForm.provinceName = item.name;
							}
						})
						this.CityList.forEach((item) => {
							if(item.id == this.infoForm.cityID){
									this.infoForm.cityName = item.name;
							}
						})
						this.btnLoading = true;
						var mainImg = false;//是否有主图
						this.infoForm.hotelPictures.forEach((item, index) => {//循环判断是否选择了主图
							if (item.isMain == true) {
								mainImg = true;
								return false;
							}
						})
						if (mainImg == false) {//如果没有选择主图则默认选择第一张图为主图
							this.infoForm.hotelPictures[0].isMain = true;
						}

						//主题名称赋值
						this.hotelThemeList.forEach(item=>{
							if(item.key==this.infoForm.hotelThemeID){
								this.infoForm.hotelThemeName=item.name;
							}
						})

						this.groupHttp.post('/Hotel/CreateOrEditHotel', this.infoForm).then((res) => {
							if (res.data.isSuccess) {
								this.$message({
									message: '保存成功',
									type: 'success'
								})
							} else {
								this.$message.error(res.data.message)
							}
							this.btnLoading = false;
						}).catch((e) => {
							console.log(e)
						})
					} else {
						return false;
					}
				});
			},
			//图片删除
			handleRemove(uid){
				this.infoForm.hotelPictures.forEach((item, index) => {
					if (item.uid == uid) {
						this.infoForm.hotelPictures.splice(index, 1)
					}
				})
			},
			imgUpload(val){
				var f = new FormData();
				f.append('FileData', val.file);
				f.append('Category', 'AirTicket');
				f.append('thumbnail', true);
				f.append('Folder', 'Airline');
				this.fileUpload.post(val.action, f)
				.then((res) => {
					this.infoForm.hotelPictures.push({
						name: res.data.formerName,
						path: res.data.url,
						hotelId: this.$route.query.hotelId,
						uid: val.file.uid,
						isMain: false,
						type:0,
					})
					if (res.data.state == false) {
						this.$message.error(res.data.message);
					}
				})
			},
			//限制图片
			beforeAvatarUpload(file){
				const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isImg) {
					this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isImg && isLt2M;
			},
			getHotelTheme(){
				this.groupHttp.get('/Hotel/GetHotelThemeSelect')
				.then((res) => {
					if(res.data.isSuccess){
						this.hotelThemeList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
					
				}).catch((e) => {
					console.log(e)
				})
			},
			getStarRate(){
				this.groupHttp.get('/Hotel/GetHotelStar')
				.then((res) => {
					if(res.data.isSuccess){
						this.starRatedList = res.data.objects;
					}else{
						this.$message.error(res.data.message);
					}
					
				}).catch((e) => {
					console.log(e)
				})
			}
		}
	}
</script>
