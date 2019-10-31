<template>
	<div class="view">
		<el-header class="margin_bottom">
			<el-steps :active="7" align-center>
				<el-step title="基本信息" description=""></el-step>
				<el-step title="酒店房型" description=""></el-step>
				<el-step title="酒店餐厅" description=""></el-step>
				<el-step title="酒店美食" description=""></el-step>
				<el-step title="酒店会议室" description=""></el-step>
				<el-step title="配套设施" description=""></el-step>
				<el-step title="交通路线" description=""></el-step>
			</el-steps>
		</el-header>
		<el-form :model="infoForm" ref="infoForm" label-width="200px" class="demo-ruleForm" size="small">
			<el-form-item label="线路描述" >
				<editor id='editor_id' height="260px" width="700px" :content="infoForm.description" uploadJson="/Home/UploadImage"
						pluginsPath="/static/kindeditor/plugins/"
						:allowFileManager="false"
						:loadStyleMode="false"
						@on-content-change="onContentChange"
				>
				</editor>
			</el-form-item>
			<el-row type="flex">
				<el-form-item label="请标注酒店位置" >
				</el-form-item>
				<el-form-item label="经度" label-width="50px" >
					<el-input v-model="infoForm.longitude" />
				</el-form-item>
				<el-form-item label="纬度" label-width="50px" >
					<el-input v-model="infoForm.latitude" />
				</el-form-item>
				<el-form-item label="城市" label-width="50px">
					<el-input v-model="city" placeholder="请输入城市名称"/>
				</el-form-item>
				<el-form-item label="" label-width="10px">
					<el-button size="small" type="primary" @click="search" :loading='btnLoading1'>搜索</el-button>
				</el-form-item>
			</el-row>
			<el-form-item label="">
				<div class="map-box" id="mapBox"></div>
			</el-form-item>
		</el-form>
		<el-row class="text-center margin_top">
			<!-- <el-button size="small" type="primary" @click="submitForm('infoForm')" :loading='btnLoading'>保存</el-button> -->
			<el-button size="small" type="primary" @click="submitForm('infoForm')" :loading='btnLoading'>保存</el-button>
		</el-row>
	</div>
</template>
<style lang="scss" scoped>
	.map-box{
		width: 800px;
		height: 320px;
	}
</style>
<script>
  	import BMap from 'BMap'
	export default{
		data() {
			return {
				btnLoading1:false,
				btnLoading:false,
				dialogVisible:false,
				dialogImageUrl:'',
				infoForm: {
					description:'',
					enumHotelOtherType:5,
					hotelID:this.$route.query.hotelId,
					latitude:'',
					longitude:''
				},
				city:''
			};
		},
		mounted(){
			this.getGeolocation();
		},
		watch:{
		},
		methods: {
			search(){
				let _this=this;
				let map = new BMap.Map("mapBox");  // 创建Map实例
				if(this.infoForm.longitude&&this.infoForm.latitude){
					map.centerAndZoom(new BMap.Point(this.infoForm.longitude, this.infoForm.latitude),13);  // 初始化地图,设置中心点坐标和地图级别
					let marker = new BMap.Marker({
						lat:_this.infoForm.latitude,lng:_this.infoForm.longitude
					});  // 创建标注
					map.addOverlay(marker);              // 将标注添加到地图中
				}else if(this.city){
					map.centerAndZoom(this.city,13);      // 初始化地图,用城市名设置地图中心点
				}
				map.addEventListener("click",function(e){
					_this.infoForm.longitude=e.point.lng;
					_this.infoForm.latitude=e.point.lat;
				});
				map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
			},
			getGeolocation: function() {
				let _this=this;
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
						var map = new BMap.Map("mapBox");    // 创建Map实例
						map.centerAndZoom(new BMap.Point(r.longitude, r.latitude), 13);  // 初始化地图,设置中心点坐标和地图级别
						//单击获取点击的经纬度
						map.addEventListener("click",function(e){
							_this.infoForm.longitude=e.point.lng;
							_this.infoForm.latitude=e.point.lat;
						});
						map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

						var marker = new BMap.Marker(r.point);  // 创建标注
						map.addOverlay(marker);              // 将标注添加到地图中
						// var geoc = new BMap.Geocoder();
						// var pt = r.point;
						// geoc.getLocation(pt, function(rs) {
						// 	var addComp = rs.addressComponents;
						// 	// vm.search.city2 = addComp.city
						// 	console.log(addComp)
						// });
					} else {
						console.log('定位失败')
						// dialog.toast('定位失败', 'error', 1000)
					}
				}, {
					enableHighAccuracy: true
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

				this.groupHttp.post('/Hotel/CreateOrEditHotelOther', this.infoForm).then((res) => {
					if (res.data.isSuccess) {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
						this.$router.push({name:'hotelDBManagement'})
					} else {
						this.$message.error(res.data.message)
					}
					this.btnLoading = false;
				}).catch((e) => {
					console.log(e)
				})
			},
		}
	}
</script>
