<template>
	<div class="view">
		<el-row class="margin_bottom"><el-button size="small" type="primary" @click="handleAddRoomType">添加房型</el-button></el-row>
		<el-table :data="tableList" v-loading ='tableLoading'>
			<el-table-column  prop="roomNO" label="房型ID" > </el-table-column>
			<el-table-column  prop="roomName" label="房型名称" > </el-table-column>
			<el-table-column  prop="orderStatusName" label="房型信息" > 
				<template slot-scope="scope">
					{{roomTypeInfo(scope.row)}}
				</template>
			</el-table-column>
			<el-table-column   label="操作" fixed="right" width='180' align="center">
				<template slot-scope="scope">
					<el-button type="text"  size="mini" @click="handleEditRoomType(scope.row)">编辑</el-button>
					<el-button type="text"  size="mini"  @click="handleDeleteRoomType(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination  class="pagination"
			fixed="right"
			:data = 'pagination'
			@size-change="sizeChange"
			@current-change="currentPageChange"
			:current-page="pagination.currentPage"
			:page-sizes="pagination.sizes"
			:page-size="pagination.size"
			layout="total, sizes, prev, pager, next, jumper"
			:total="pagination.total">
		</el-pagination>
		<el-row class="text-center margin_top">
			<!-- <el-button size="small" type="primary" @click="submitForm('roomForm')" :loading='btnLoading'>保存</el-button> -->
			<el-button size="small" type="" @click="goBack" :loading='btnLoading'>返回</el-button>
		</el-row>

		<el-dialog title="添加房型" :visible.sync="dialogVisible" width="800px" @close="handleClose">
			<el-form :model="roomForm" :rules="rules" ref="roomForm" label-width="80px" class="demo-ruleForm" size="small">
				<el-form-item label="房型名称" prop="hotelRoomNameId">
					<el-select v-model="roomForm.hotelRoomNameId" placeholder="请选房型">
						<el-option :key="item.key"
								:label="item.name"
								:value="Number(item.key)" v-for="item in roomTypeList"></el-option>
					</el-select>
				</el-form-item>
				<el-row type="flex">
					<el-form-item label="房间数量" prop="number">
						共 <el-input-number :controls="false" :min="0"  v-model="roomForm.number" style="width:100px;" ></el-input-number> 室
					</el-form-item>
					<el-form-item label="可住" prop="livingCount" label-width="70px">
						<el-input-number :controls="false" :min="0"  v-model="roomForm.livingCount"  style="width:100px;" ></el-input-number> 人
					</el-form-item>
				</el-row>
				<el-row type="flex" v-for="(item,index) in roomForm.hotelRoomBeds">
					<el-form-item :label="'床型'+(index+1)"  
						:prop="'hotelRoomBeds.' + index +'.bedTypeId'"
						:rules="{
							required: true, message: '请选择床型', trigger: 'change'
						}"
					>
						<el-select v-model="item.bedTypeId" placeholder="请选择床型" >
							<el-option :key="item.key"
									:label="item.name"
									:value="Number(item.key)" v-for="item in bedTypeList"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" label-width="20px"
						:prop="'hotelRoomBeds.' + index +'.bedSizeId'"
						:rules="{
							required: true, message: '请选择床尺寸', trigger: 'change'
						}"
					>
						<el-select v-model="item.bedSizeId" placeholder="请选择床尺寸" >
							<el-option :key="item.key"
									:label="item.name"
									:value="Number(item.key)" v-for="item in bedSizeList"></el-option>
						</el-select> m
					</el-form-item>
					<el-form-item label="共" label-width="50px"
						:prop="'hotelRoomBeds.' + index +'.bedNumber'"
						:rules="[{
							required: true,validator:checkNumber, trigger: 'blur'
						}]"
					>
						<el-input-number :controls="false" :min="0" v-model="item.bedNumber"  style="width:100px;" ></el-input-number> 张 
						<el-button size="small" class="margin_left_10" type="" v-if="index>0" @click="handleDeleteRoomBeds(index)">删除</el-button>
					</el-form-item>
						
				</el-row>
				<el-form-item label=""  >
					<el-button size="small" type="primary" @click="handleAddRoomBeds">添加床型</el-button>
				</el-form-item>
				<el-form-item label="建筑面积" prop="area" >
					<el-input  v-model="roomForm.area" class="input_comm" ></el-input> m²
				</el-form-item>
				<el-form-item label="楼层" prop="floor" >
					<el-input  v-model="roomForm.floor" class="input_comm"  ></el-input> 层
				</el-form-item>
				<el-form-item label="床型备注"  >
					<el-input v-model="roomForm.remark" class="input_comm"  ></el-input>
				</el-form-item>
				<el-form-item label="是否有窗" prop="hasWindows">
					<el-radio-group v-model="roomForm.hasWindows">
						<el-radio :label="0">有窗</el-radio>
						<el-radio :label="1">无窗</el-radio>
						<el-radio :label="2">内窗</el-radio>
						<el-radio :label="3">部分无窗</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="有无宽带" prop="hasNetwork">
					<el-radio-group v-model="roomForm.hasNetwork">
						<el-radio :label="true">有</el-radio>
						<el-radio :label="false">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="有无WIFI" prop="hasWiFi">
					<el-radio-group v-model="roomForm.hasWiFi">
						<el-radio :label="true">有</el-radio>
						<el-radio :label="false">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="房间设施" prop="facilitiesArr">
					<el-checkbox-group v-model="roomForm.facilitiesArr" v-if="roomfacilitiesList.length>0">
						<el-checkbox :label="item.key" v-for="item in roomfacilitiesList">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="图片" prop="hotelPicture">
					<span>（图片限2M以下，建议尺寸为885*487，格式为：jpg/png，数量限制10张，可自由设置主图有且仅有1张。）</span>
					<div class="upload-list">
					<div class="thumb-img" v-for="(item,index) in roomForm.hotelPicture" :key="item.path+index">
						<div class="img">
							<img :src="item.path" alt="">
						</div>
						<div>
							<div>
								<el-checkbox v-if="index==0&&!isEditRoomType" v-model="item.isMain" checked>主图</el-checkbox>
								<el-checkbox v-else v-model="item.isMain">主图</el-checkbox>
								<el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
							</div>
							<el-input class="width_full" v-model="item.name" size="mini" placeholder="请输入内容"></el-input>
						</div>
					</div>
					<el-upload
						action="/image/upload"
						list-type="picture-card"
						:http-request="imgUpload"
						:show-file-list="false"
						:file-list="roomForm.hotelPicture"
						:limit="10"
						:multiple="true"
						accept="image/jpeg,image/png"
						:before-upload="beforeAvatarUpload"
						class="upload-btn"
						v-show="roomForm.hotelPicture.length < 10"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="handleSubmit('roomForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		data() {
			let checkNumber=(rule, value, callback) => {
				if(value!=0&&!value){
					return callback(new Error('不能为空'));
				}else if ((value+'').indexOf('.')>-1) {
					return callback(new Error('请输入正整数'));
				}else {
					callback();
				}
			}
			return {
				checkNumber:checkNumber,
				isEditRoomType:false,
				dialogVisible:false,
				tableList:[],
				roomTypeList:[],
				bedTypeList:[],
				bedSizeList:[],
				roomfacilitiesList:[],
				btnLoading:false,
				tableLoading:false,
				roomForm: {
					hotelRoomNameId:'',
					roomName:'',
					number:'',
					livingCount:'',
					area:'',
					floor:'',
					remark:'',
					hasWindows:'',
					hasNetwork:'',
					hasWiFi:'',
					facilitiesArr:[],
					facilitiesList:[],
					hotelRoomBeds:[{
						bedTypeId:'',
						bedTypeName:'',
						bedNumber:'',
						bedSizeId:'',
						bedSizeName:'',
					}],
					hotelPicture:[],
					hotelID:this.$route.query.hotelId,
					id:0
				},
				roomFormTemp:{},
				rules: {
					hotelRoomNameId: [
						{required: true, message: '请选择房型名称', trigger: 'change'}
					],
					number: [
						{required: true,validator:checkNumber, trigger: 'blur'},
					],
					livingCount: [
						{required: true,validator:checkNumber, trigger: 'blur'},
					],
					area:[
						{required: true, message: '请输入建筑面积', trigger: 'blur'},
					],
					floor:[
						{required: true, message: '请输入楼层', trigger: 'blur'},
					],
					hasWindows:[{ type:'number',required: true, message: '请选择窗户类型', trigger: 'change'}],
					hasNetwork:[{ type:'boolean',required: true, message: '请选择宽带', trigger: 'change'}],
					hasWiFi:[{  type:'boolean',required: true, message: '请选择WIFI', trigger: 'change'}],
					facilitiesArr:[{  type:'array',required: true, message: '请选择房间设施', trigger: 'change'}],
					hotelPicture: [
						{required: true, type: 'array', required: true, message: '请上传图片', trigger: 'change'}
					]
				},
				//分页
				pagination:{
					sizes:[5,10,20,50],
					size:10,
					currentPage: 1,
					total:0
				},
			};
		},
		mounted(){
			this.queryData();
			this.getRoomTypeSelect();
			this.getBedTypeSelect();
			this.getBedSizeSelect();
			this.getRoomFacilities();
			this.roomFormTemp=JSON.parse(JSON.stringify(this.roomForm))
		},
		watch:{
			roomForm:{
				handler:function (val) {
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
				},
				deep:true
			}
		},
		methods: {
			//返回
			goBack(){
				this.$router.go(-1)
			},
			//添加房型
			handleAddRoomType(){
				this.roomForm.id=0;
				this.isEditRoomType=false;
				this.dialogVisible=true;
			},
			//编辑房型
			handleEditRoomType(row){
				this.isEditRoomType=true;
				this.groupHttp.get('/HotelProduct/GetHotelRoomForEdit',{
					params:{
						RoomId:row.id
					}
				})
				.then((res) => {
					if(res.data.isSuccess){
						let object=res.data.object;
						let arr=[];
						object.facilitiesList.forEach(item=>{
							this.roomfacilitiesList.forEach(item1=>{
								if(item.key==item1.key){
									arr.push(item1.key);
								}
							})
						})
						this.roomForm.facilitiesArr=arr;
						this.roomForm=Object.assign(this.roomForm,object);
						this.dialogVisible=true;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			handleDeleteRoomType(row){
				this.$confirm('删除房型?', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.groupHttp.post('/HotelProduct/DeleteHotelRoom',{
						RoomId:row.id
					})
					.then((res) => {
						if(res.data.isSuccess){
							this.$message({
								type:'success',
								message:'删除房型成功！'
							});
							this.queryData();
						}else{
							this.$message.error(res.data.message);
						}
					}).catch((e) => {
						console.log(e)
					})
				})
			},
			//房型信息
			roomTypeInfo(row){
				let str='面积：'+row.area+'m² ，位于：'+row.floor+'层，共：'+row.number+'室，可住：'+row.livingCount+'人，'
					+row.hasNetworkStr+'，'+row.hasWiFiStr+'，备注：'+(row.remark||'无');
				return str
			},
			//提交，下一步
			// submitForm(){
			// 	this.$router.push({name:'editHotelRestaurant',query:{hotelId:this.$route.query.hotelId}})
			// },
			//添加床型
			handleAddRoomBeds(){
				let obj={
					bedTypeId:'',
					bedTypeName:'',
					bedNumber:'',
					bedSizeId:'',
					bedSizeName:'',
				}
				this.roomForm.hotelRoomBeds.push(obj)
			},
			//删除床型
			handleDeleteRoomBeds(index){
				this.roomForm.hotelRoomBeds.splice(index,1)
			},
			//提交床型
			handleSubmit(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.roomTypeList.forEach(item=>{
							if(item.key==this.roomForm.hotelRoomNameId){
								this.roomForm.roomName=item.name;
							}
						})
						this.roomForm.hotelRoomBeds.forEach(item=>{
							this.bedTypeList.forEach(item1=>{
								if(item1.key==item.bedTypeId){
									item.bedTypeName=item1.name;
								}
							})
							this.bedSizeList.forEach(item1=>{
								if(item1.key==item.bedSizeId){
									item.bedSizeName=item1.name;
								}
							})
						})
                    	this.roomForm.facilitiesList=[];
						this.roomForm.facilitiesArr.forEach(item=>{
							this.roomfacilitiesList.forEach(item1=>{
								if(item==item1.key){
									this.roomForm.facilitiesList.push({
										key:item1.key,
										name:item1.name
									});
								}
							})
						})
						if(this.roomForm.hotelPicture.length>0){
							var mainImg = false;//是否有主图
							this.roomForm.hotelPicture.forEach((item, index) => {//循环判断是否选择了主图
								if (item.isMain == true) {
									mainImg = true;
									return false;
								}
							})
							if (mainImg == false) {//如果没有选择主图则默认选择第一张图为主图
								this.roomForm.hotelPicture[0].isMain = true;
							}
						}
						this.groupHttp.post('/HotelProduct/CreateOrEditHotelRoom',this.roomForm)
						.then((res) => {
							if(res.data.isSuccess){
								this.$message({
									type:'success',
									message:'保存房型成功！'
								});
								this.dialogVisible=false;
								this.queryData();
							}else{
								this.$message.error(res.data.message);
							}
						}).catch((e) => {
                    		this.btnLoading=false;
						})
					}
				})
			},
			//获取房型名称下拉框
			getRoomTypeSelect(){
				this.groupHttp.get('/HotelProduct/GetroomNameSelect')
				.then((res) => {
					if(res.data.isSuccess){
						this.roomTypeList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			//获取床型类型下拉框
			getBedTypeSelect(){
				this.groupHttp.get('/HotelProduct/GetBedTypeSelect')
				.then((res) => {
					if(res.data.isSuccess){
						this.bedTypeList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			//获取床型尺寸下拉框
			getBedSizeSelect(){
				this.groupHttp.get('/HotelProduct/GetBedSizeSelect')
				.then((res) => {
					if(res.data.isSuccess){
						this.bedSizeList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			//获取房型设施
			getRoomFacilities(){
				this.groupHttp.get('/HotelProduct/GetRoomFacilities')
				.then((res) => {
					if(res.data.isSuccess){
						this.roomfacilitiesList = res.data.keyValueList;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch((e) => {
					console.log(e)
				})
			},
			queryData(){
				this.tableLoading=true;
				this.groupHttp.get("/HotelProduct/GetHotelRoomListCreate",{
					params:{
						HotelId:this.$route.query.hotelId,
						PageSize:this.pagination.size,
						PageIndex:this.pagination.currentPage,
					}
				})
				.then(res=>{
					if(res.data.isSuccess){
						this.tableList=res.data.objects;
						this.pagination.total=res.data.total
					}else{
						this.$message.error(res.data.message);
					}
					this.tableLoading=false;
				})
			},
			handleClose(){
				this.$refs['roomForm'].resetFields();
           	 	// this.roomForm.remark=''
				this.roomForm=JSON.parse(JSON.stringify(this.roomFormTemp))
			},
			//图片删除
			handleRemove(uid){
				this.roomForm.hotelPicture.forEach((item, index) => {
					if (item.uid == uid) {
						this.roomForm.hotelPicture.splice(index, 1)
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
					this.roomForm.hotelPicture.push({
						name: res.data.formerName,
						path: res.data.url,
						hotelID: this.$route.query.hotelId,
						uid: val.file.uid,
						isMain: false,
						type:1,
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
			//分页
			sizeChange(val) {
				this.pagination.size = val;
				this.pagination.currentPage = 1;
				this.queryData();
			},
			currentPageChange(val) {
				this.pagination.currentPage = val;
				this.queryData();
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>