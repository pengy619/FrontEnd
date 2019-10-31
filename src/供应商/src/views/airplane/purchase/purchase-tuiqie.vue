<template>
	<div class="view">
		<h4>采购单信息</h4>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="4">
				采购单号：C0001
			</el-col>
			<el-col :span="4">C0001：广州 - 北京</el-col>
			<el-col :span="4">航空公司：南航</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="4">
				出发地：广州
			</el-col>
			<el-col :span="4">目的地：北京</el-col>
			<el-col :span="4">航程天数：5天</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="4">
				机型：32F
			</el-col>
			<el-col :span="4">座位数：189</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="4">
				总成本：1000000元
			</el-col>
			<el-col :span="4">供应商：北京供应商</el-col>
			<el-col :span="4">采购日期：2017-10-12</el-col>
		</el-row>
		<el-row :gutter="20" type="flex" class="info-row">
			<el-col :span="24">
				备注：这个是北京供应商提供的包机资源
			</el-col>
		</el-row>

		<h4>退切信息</h4>
		
		<el-row>
		<el-col :span="12">
		<el-form ref="form" :model="form" label-width="100px" size="small" style="margin-top: 10px;">
			<el-form-item label="供应商">
				<span>北京供应商</span>
			</el-form-item>
			<el-form-item label="退回库存数">
				<el-input style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item label="库存单价">
				<el-input style="width: 200px"></el-input> 元
			</el-form-item>
			<el-form-item label="库存总金额">
				<el-input style="width: 200px"></el-input> 元
			</el-form-item>
			<el-form-item label="备注">
				 <el-input type="textarea"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary">保存</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
		</el-col>
		</el-row>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					priceName: '来价',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}, {
					priceName: '媒体外卖价(元)',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}, {
					priceName: '同行价(元)',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}, {
					priceName: '加盟结算价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}, {
					priceName: '直客销售价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}, {
					priceName: '内部价（元）',
					price1: '200',
					price2: '200',
					price3: '200',
					currency: '人民币'
				}],
				voyageData:[{
		          date: '2016-05-02',
		          name: '王小虎',
		          address: '上海'
		        }, {
		          date: '2016-05-04',
		          name: '王小虎',
		          address: '上海 '
		        }, {
		          date: '2016-05-01',
		          name: '王小虎',
		          address: '上海'
		        }, {
		          date: '2016-05-03',
		          name: '王小虎',
		          address: '上海 '
		        }],
		        stockTable:[{
		        	type:'当前',
		        	total:150,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        	currency:'1'
		        },{
		        	type:'本次调整',
		        	total:150,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        	currency:'1'
		        },{
		        	type:'调整后',
		        	total:150,
		        	kongwei:0,
		        	qiewei:0,
		        	yuwei:0,
		        	shuaiwei:0,
		        	currency:'1'
		        }],
		        currency:[{
		        	label:'人民币',
		        	value:'1'
		        },{
		        	label:'美元',
		        	value:'2'
		        }],
		        dialogTableVisible:false,
		        refundRulesData:[{
		        	ruleName:'退票规定20170709版',
		        	createDate:'2017-07-09 10:56',
		        	updateDate:'2017-10-11 10:56',
		        },
		        {
		        	ruleName:'退票规定20171011版',
		        	createDate:'2017-10-11 10:56',
		        	updateDate:'2017-10-11 10:56',
		        }],
		        saleStatus:true
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
</style>