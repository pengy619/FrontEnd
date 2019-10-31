<template>
    <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
        <!-- <el-button type="warning" class="add_jourmey margin_bottom" :class="{'fixed-button':isFixed}" @click="addJourney" size="small" icon="el-icon-plus">添加行程</el-button> -->
        <el-form :model="item" :rules="rules" ref="item" label-width="100px" class="demo-journeyForm" size="small" v-for="(item,index) in itemForm">
          <el-form-item>
            <el-input  class="journey_day" :disabled="true" v-model="item.routeTitle"></el-input>
            <input type="hidden" v-model="item.sortOrder = index">
            <input type="hidden" v-model="item.lineId">
            <!-- <el-button type="danger" @click="removeJourney(index)" v-show="index > 0" icon="el-icon-delete">删除</el-button> -->
          </el-form-item>
          <el-form-item label="行程">
            <el-input v-model="item.routeName" style="width:400px" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="交通">
            <el-checkbox-group v-model="item.returnTraffic">
              <el-checkbox :label="item.key" name="type" v-for="item in traffic">{{item.value}}</el-checkbox>
            </el-checkbox-group>
            <input type="hidden" v-model="item.trafficArr = item.returnTraffic">
          </el-form-item>
          <el-form-item label="用餐" prop="returnMealInfo">
            <el-checkbox-group v-model="item.returnMealInfo">
              <el-checkbox :label="item.key" name="type" v-for="item in mealInfo">{{item.value}}</el-checkbox>
            </el-checkbox-group>
            <input type="hidden" v-model="item.mealInfoArr = item.returnMealInfo">
          </el-form-item>
          <el-form-item label="住宿酒店">
            <el-input v-model="item.hotels"></el-input>
          </el-form-item>
          <el-form-item label="住宿城市">
            <el-input v-model="item.cityName" ></el-input>
          </el-form-item>
          <el-form-item label="行程景点">
            <editor :id="'editor_id-'+index" height="260px" width="700px" :content="item.tickets" uploadJson="/Home/UploadImage"
                    pluginsPath="/static/kindeditor/plugins/"
                    :allowFileManager="false"
                    :loadStyleMode="false"
                    @on-content-change="onContentChange"
                    >
            </editor>
          </el-form-item>
        </el-form>
      <el-footer class="text-center">
        <el-button type="primary" @click="saveRoute" :loading = 'btn_loading' size="small">保存</el-button>
        <el-button @click="goBack" size="small">返回</el-button>
      </el-footer>
    </div>
</template>
<style lang="scss" scoped>
  .l_margin{
    margin-left: -70px;
    margin-right: 200px;
  }
  .journey_day{
    width: 150px;
  }
  .ql-editor p{
    height: 150px;
  }
  .el-form{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }
  .add_jourmey{
    width: 150px;
  }
  .el-form{
    margin-bottom: 20px;
  }
  .el-input{
    width: 200px;
  }
  
  .fixed-button{
    position: fixed;
    top:130px;
    left: 245px;
    z-index: 20;
  }
</style>
<script>
	export default {
		props:['status'],
		data() {
		var checkRouteName = (rule,value,callback) => {
			if(!value){
			callback(new Error('请选择活动区域'));
			}else{
			callback()
			}
		}
		var checkHotels = (rule,value,callback) => {
			if(!value){
			callback(new Error('请输入住宿酒店'));
			}else if(!/^[^ ]+$/.test(value)){
			callback(new Error('住宿酒店不能含有空格'));
			}else{
			callback()
			}
		}
		var checkCityName = (rule,value,callback) => {
			if(!value){
			callback(new Error('请输入住宿城市'));
			}else if(!/^[^ ]+$/.test(value)){
			callback(new Error('住宿城市不能含有空格'));
			}else{
			callback()
			}
		}
		var checkTickets = (rule,value,callback) => {
			value = value.replace(/^\s*|\s*$/g,'');
			if(!value){
			callback(new Error('请输入行程景点'));
			}else{
			callback()
			}
		}
		return {
			isFixed:false,
			btn_loading: false,
			fullscreenLoading:false,
			mealInfo:[],
			traffic:[],
			AirlineType: 'Domestic',
			editorOption: {
			},
			id:'',
			itemForm:[],
			rules: {
			routeName: [
				{required: true, validator:checkRouteName, trigger: 'blur' }
			],
			returnTraffic: [
				{ type: 'array', required: true, message: '请至少选择一种交通方式', trigger: 'change' }
			],
	//          MealInfoArr:[
	//            { type: 'array', required: true, message: '请至少选择一种用餐方式', trigger: 'change' }
	//          ],
	//          Hotels: [
	//            {required: true, validator:checkHotels, trigger: 'blur' }
	//          ],
			cityName: [
				{required: true, validator:checkCityName, trigger: 'blur' }
			],
	//          Tickets: [
	//            {required: true, validator:checkTickets, trigger: 'blur' }
	//          ],
			}
		};
		},
		watch:{
		'status':function (val) {
			if(val == 'second'){
				this.getGroupLineRoute();
			}
		}
		},
		mounted(){
			this.groupHttp.post('/GroupLine/GetEnumMealType',{}).then((res)=>{
			this.mealInfo = res.data
			}).catch((e)=>{
				console.log(e)
			});
			this.groupHttp.post('/GroupLine/GetEnumTrafficType',{}).then((res)=>{
			this.traffic = res.data
			}).catch((e)=>{
			console.log(e)
			})
			// this.fixedButton();
		},
		methods: {
		getGroupLineRoute(){
			this.fullscreenLoading = true;
			this.groupHttp.post('/GroupLine/GetGroupLineRoute',{LineId:this.$route.query.lineId}).then(res=>{
				if(res.data.isSuccess == true){
				this.fullscreenLoading = false;
				res.data.objects.forEach((item,index)=>{
						if(item.returnMealInfo !=null){
							let mealArr = item.returnMealInfo.split(',')
							mealArr.splice(mealArr.indexOf(''),1)
							item.returnMealInfo = mealArr
						}else{
							item.returnMealInfo=[]
						}
						if(item.returnTraffic !=null){
							let trafficArr = item.returnTraffic.split(',')
							trafficArr.splice(trafficArr.indexOf(''),1)
							item.returnTraffic = trafficArr
						}else{
							item.returnTraffic=[]
						}
				})
				this.itemForm  = res.data.objects
				if(res.data.tripDays > 0 && res.data.objects.length < res.data.tripDays){
					let day = res.data.tripDays-res.data.objects.length;
					let num = res.data.objects.length
					for(let i= 0;i<day;i++){
						num++
						this.addJourney(num);
				}
				}else{
					this.itemForm.splice(res.data.tripDays,res.data.objects.length)
				}
			}
			}).catch(e=>{
			this.fullscreenLoading = false;
			})
		},
		onContentChange(data){
			let str = 'editor_id-';
			let index = data.id.replace(str,'');
			this.itemForm[index].tickets = data.value;
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		fixedButton(){
			window.onscroll=(event)=>{
				var scrollTop=document.documentElement.scrollTop;
				if(scrollTop>=115){
				this.isFixed=true;
				}else{
				this.isFixed=false;
				}
			}
		},
		//添加行程
		addJourney(index){
			this.itemForm.push({
				routeTitle:`第${index}天`,
				LineId:this.$route.query.lineId,
				sortOrder:'',
				routeName: '',
				returnMealInfo:[],
				returnTraffic:[],
				hotels: '',
				cityName: '',
				tickets:'',
				mealInfoArr:[],
				trafficArr:[]
			})
		},
	//      addressResult(val){
	//          console.log(val)
	//          this.itemForm.CityName=val.second.name
	//      },
		//删除行程
		removeJourney(index){
			this.$confirm('此操作将删除该行程, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
			this.itemForm.splice(index,1)
			this.$message({
				type: 'success',
				message: '删除成功!'
			});
			setTimeout(() => {
				for(var i = 0;i< this.$refs['item'].length; i++ ){
				this.$refs['item'][i].$children[2].clearValidate();
				}
			},100)
			}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消删除'
			});
			});
		},
		goBack() {
		this.$router.push({
			path:'/grouptour/RouteTable'
		})
		},
		//保存
		saveRoute(){
			var boo = true;
			for(var i = 0;i<this.$refs.item.length;i++){
				this.$refs.item[i].validate((valid) => {
				boo = valid;
				})
			}
			if(!boo){
				return;
			}
			this.btn_loading = true;
			this.groupHttp.post('/GroupLine/RouteSave',{Dto:this.itemForm}).then((res)=>{
				if(res.data.isSuccess == true){
					this.$message({
					message: '保存成功',
					type: 'success'
					})
					this.btn_loading = false;
				}else{
					this.$message.error('出错了：' + res.data.message)
					setTimeout( () => {
					this.btn_loading = false;
					},3000)
				}
			}).catch((e)=>{
				console.log(e)
			})
		}
		}
	}
</script>


