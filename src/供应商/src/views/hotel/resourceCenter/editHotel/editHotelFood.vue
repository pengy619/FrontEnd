<template>
	<div class="view">
		<el-form :model="infoForm" ref="infoForm" label-width="200px" class="demo-ruleForm" size="small">
			<el-form-item label="美食描述" >
				<editor id='editor_id2' height="260px" width="700px" :content="infoForm.description" uploadJson="/Home/UploadImage"
						pluginsPath="/static/kindeditor/plugins/"
						:allowFileManager="false"
						:loadStyleMode="false"
						@on-content-change="onContentChange"
				>
				</editor>
			</el-form-item>
			<el-form-item label="美食图片" >
				<span>（图片限2M以下，建议尺寸为885*487，格式为：jpg/png，数量限制10张，可自由设置主图有且仅有1张。）</span>
				<div class="upload-list">
				<div class="thumb-img" v-for="(item,index) in infoForm.hotelPicture" :key="item.path">
					<div class="img">
						<img :src="item.path" alt="">
					</div>
					<div>
						<div>
							<el-checkbox v-model="item.isMain" v-if="!isFirstTime&&index==0" checked>主图</el-checkbox>
							<el-checkbox v-model="item.isMain" v-else>主图</el-checkbox>
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
					:file-list="infoForm.hotelPicture"
					:limit="10"
					:multiple="true"
					accept="image/jpeg,image/png"
					:before-upload="beforeAvatarUpload"
					class="upload-btn"
					v-show="infoForm.hotelPicture.length < 10"
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
				isFirstTime:true,
				btnLoading:false,
				dialogVisible:false,
				dialogImageUrl:'',
				infoForm: {
					description:'',
					hotelPicture:[],
					enumHotelOtherType:2,
					hotelID:this.$route.query.hotelId,
				},
			};
		},
		mounted(){
			this.getInfo();
		},
		watch:{
			infoForm:{
				handler:function (val) {
					if(val.hotelPicture.length>1){
						let arr =[];
						val.hotelPicture.forEach((item,index)=>{
							if(item.isMain == true){
								arr.push(item)
								if(arr.length>1){
									this.$message.error('您已选择主图')
									val.hotelPicture[index].isMain = false;
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
				this.groupHttp.get('/HotelProduct/GetHotelOtherEditInfo',{
					params:{HotelId:this.$route.query.hotelId,EnumHotelOtherType:this.infoForm.enumHotelOtherType}
				})
				.then((res) => {
					if(res.data.isSuccess){
						this.infoForm = Object.assign(this.infoForm,res.data.object);
						this.isFirstTime=false;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
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
				this.btnLoading = true;
				if(this.infoForm.hotelPicture.length>0){
					var mainImg = false;//是否有主图
					this.infoForm.hotelPicture.forEach((item, index) => {//循环判断是否选择了主图
						if (item.isMain == true) {
							mainImg = true;
							return false;
						}
					})
					if (mainImg == false) {//如果没有选择主图则默认选择第一张图为主图
						this.infoForm.hotelPicture[0].isMain = true;
					}
				}

				this.groupHttp.post('/HotelProduct/CreateOrEditHotelOther', this.infoForm).then((res) => {
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
			},
			//图片删除
			handleRemove(uid){
				this.infoForm.hotelPicture.forEach((item, index) => {
					if (item.uid == uid) {
						this.infoForm.hotelPicture.splice(index, 1)
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
					this.infoForm.hotelPicture.push({
						name: res.data.formerName,
						path: res.data.url,
						hotelId: this.$route.query.hotelId,
						uid: val.file.uid,
						isMain: false,
						type:3
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
		}
	}
</script>
