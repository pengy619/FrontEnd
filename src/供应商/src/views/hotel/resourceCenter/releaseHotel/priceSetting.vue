<template>
	<div class="view" v-loading="viewLoading">
		<el-header class="margin_bottom">
			<el-steps :active="4" align-center>
				<el-step title="选择酒店" description=""></el-step>
				<el-step title="选择房型" description=""></el-step>
				<el-step title="产品设置" description=""></el-step>
				<el-step title="价格设置" description=""></el-step>
			</el-steps>
		</el-header>
		<h4>价格/库存设置</h4>
		<el-row style="width:800px;"><price-table :price-data="priceData"></price-table></el-row>
		<el-form size="small" :model="setPriceForm" :rules="rules" ref="setPriceForm" label-width="120px" class="margin_top">
            <el-form-item label="设置日期" prop="date">
                <el-date-picker
					v-model="setPriceForm.date"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
            </el-form-item>
			<el-form-item label="星期" >
				<el-checkbox  v-model="isAllWeek" class="inline-block margin_right" key="all" @change="handleChangeAllWeek">全部</el-checkbox>
                <el-checkbox-group v-model="setPriceForm.week" class="inline-block" @change="handleChangeWeek">
					<el-checkbox v-for="item in weekList" :label="item.key" :key="item.key">{{item.value}}</el-checkbox>
				</el-checkbox-group>
            </el-form-item>
			<el-form-item label="同行结算价" prop="costPrice">
                <el-input-number :controls="false" :min="0" v-model="setPriceForm.costPrice" class="input_comm text-left" /> 元
            </el-form-item>
			<el-form-item label="直客销售价" prop="retailSalesPrice">
                <el-input-number :controls="false" :min="0" v-model="setPriceForm.retailSalesPrice" class="input_comm text-left" /> 元
            </el-form-item>
			<el-form-item label="媒体外卖价">
                <el-input-number :controls="false" :min="0" v-model="setPriceForm.customerPrice" class="input_comm text-left" /> 元
            </el-form-item>
			<el-form-item label="库存" prop="stockBalance">
                <el-input-number :controls="false" :min="0" v-model="setPriceForm.stockBalance" class="input_comm text-left" /> 间
            </el-form-item>
			<el-form-item label="" >
                <el-button size="small" type="warn" @click="handleSetPrice('setPriceForm')">设置</el-button>
            </el-form-item>
        </el-form>
		<el-row class="text-center margin_top">
			<el-button size="small" type="" v-if="isEdit" @click="$router.go(-1)" :loading='btnLoading'>上一步</el-button>
			<el-button size="small" type="primary" @click="submitForm('infoForm')" :loading='btnLoading'>保存</el-button>
		</el-row>
	</div>
</template>
<style lang="scss" scoped>
</style>
<script>
	import priceTable from '@/components/priceTable';
	import {dateFmt} from '@/utils/tools.js';
	export default{
		components:{
            priceTable
        },
		data() {
			return {
				pickerOptions:{
					disabledDate(time) {
						return time.getTime() < Date.now()-24*60*60*1000;
					},
				},
				isEdit:this.$route.query.isEdit,
				viewLoading:false,
				isAllWeek:false,
				priceData:[],
				btnLoading:false,
				weekList:[{
					key:'1',value:'周一'
				},{
					key:'2',value:'周二'
				},{
					key:'3',value:'周三'
				},{
					key:'4',value:'周四'
				},{
					key:'5',value:'周五'
				},{
					key:'6',value:'周六'
				},{
					key:'0',value:'周日'
				},],
				setPriceForm: {
					costPrice:'',
					retailSalesPrice:'',
					customerPrice:'',
					date:'',
					stockBalance:'',
					soldQuantity:0,
					week:[]
				},
				infoForm:{
					ProductId:this.$route.query.productId,
					PriceList:[]
				},
				rules: {
					costPrice: [{required: true, message: '请输入同行结算价', trigger: 'blur'}],
					retailSalesPrice: [{required: true, message: '请输入直客销售价', trigger: 'blur'}],
					date:[{required: true, message: '请选择日期', trigger: 'change'}],
					stockBalance:[{required: true, message: '请输入库存', trigger: 'blur'}],
				},
			};
		},
		mounted(){
			if(this.$route.query.isEdit){
				this.viewLoading=true;
				this.queryData();
			}
		},
		methods: {
			queryData(){
				this.groupHttp.get('/HotelProduct/GetHotelProductPriceEditInfo',{params:{ProductId:this.$route.query.productId}})
				.then((res) => {
					if(res.data.isSuccess){
						this.infoForm.PriceList=res.data.objects;
						this.priceData=this.infoForm.PriceList;
					}else{
						this.$message.error(res.data.message);
					}
					this.viewLoading=false;
				}).catch((e) => {
					console.log(e)
				})
			},
			handleChangeAllWeek(val){
				if(val==true){
					this.setPriceForm.week=['0','1','2','3','4','5','6']
				}else{
					this.setPriceForm.week=[]
				}
			},
			handleChangeWeek(val){
				if(val.length<7){
					this.isAllWeek=false;
				}else{
					this.isAllWeek=true;
				}
			},
			handleSetPrice(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
						let s=this.setPriceForm.date[0],e=this.setPriceForm.date[1],
							startDate=new Date(s),endDate=new Date(e);
						let arr=[];
						while(endDate.getTime()>=startDate.getTime()){
							let week=startDate.getDay()+'';
							if(this.setPriceForm.week.length==0||this.setPriceForm.week.length>0&&this.setPriceForm.week.indexOf(week)>-1){
								let obj={
									costPrice:this.setPriceForm.costPrice,
									retailSalesPrice:this.setPriceForm.retailSalesPrice,
									customerPrice:this.setPriceForm.customerPrice,
									date:dateFmt(startDate,'yyyy-MM-dd'),
									stockBalance:this.setPriceForm.stockBalance,
									soldQuantity:this.setPriceForm.soldQuantity,
								}
								arr.push(obj)
							}
							startDate.setDate(startDate.getDate()+1);
						}
						if(this.infoForm.PriceList.length>0){
							let num=0;
							var newArr=JSON.parse(JSON.stringify(this.infoForm.PriceList))
							this.infoForm.PriceList.forEach((item,index)=>{
								item.date=dateFmt(new Date(item.date),'yyyy-MM-dd');
								arr.forEach(item1=>{
									item1.date=dateFmt(new Date(item1.date),'yyyy-MM-dd');
									if(item.date==item1.date){
										newArr.splice(index-num,1)
										num=num+1;
									}
								})
							})
							this.infoForm.PriceList=newArr;
						}
						this.infoForm.PriceList.push(...arr);
						this.priceData=this.infoForm.PriceList;
					}
				})
				
			},
			//提交价格设置
			submitForm(){
				if (this.infoForm.PriceList.length>0) {
					this.btnLoading=true;
					this.groupHttp.post('/HotelProduct/CreateOrEditHotelProductPrice',this.infoForm)
					.then((res) => {
						if(res.data.isSuccess){
							this.$message({
								type:'success',
								message:'保存价格设置成功！'
							});
							this.$router.push({name:'hotelProductList'})
						}else{
							this.$message.error(res.data.message);
						}
						
						this.btnLoading=false;
					}).catch((e) => {
						console.log(e)
					})
				}else{
					this.$message.error('请设置价格');
				}
				
			},
		}
	}
</script>
