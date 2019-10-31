<template>
	<div class="price-table">
		<div class="top-controls">
			<i class="el-icon-arrow-left" :class="{'disabled':isCurrentMonth}" @click="handlePreMonth"></i>
			<span class="current-ym">{{currentYM}}</span>
			<i class="el-icon-arrow-right" @click="handleNextMonth"></i>
		</div>
		<el-table :data="tableList" border >
			<el-table-column label="星期一">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[0].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[0].dateStr}}</span>
						<div v-if="scope.row[0].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[0].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[0].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[0].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[0].surplusStock}}</span>/{{scope.row[0].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期二">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[1].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[1].dateStr}}</span>
						<div v-if="scope.row[1].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[1].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[1].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[1].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[1].surplusStock}}</span>/{{scope.row[1].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期三">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[2].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[2].dateStr}}</span>
						<div v-if="scope.row[2].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[2].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[2].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[2].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[2].surplusStock}}</span>/{{scope.row[2].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期四">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[3].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[3].dateStr}}</span>
						<div v-if="scope.row[3].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[3].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[3].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[3].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[3].surplusStock}}</span>/{{scope.row[3].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期五">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[4].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[4].dateStr}}</span>
						<div v-if="scope.row[4].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[4].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[4].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[4].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[4].surplusStock}}</span>/{{scope.row[4].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期六">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[5].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[5].dateStr}}</span>
						<div v-if="scope.row[5].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[5].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[5].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[5].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[5].surplusStock}}</span>/{{scope.row[5].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="星期日">
				<template slot-scope="scope">
					<div :class="{'no-price':!scope.row[6].isCurrShowMonth,'td':true}">
						<span class="date">{{scope.row[6].dateStr}}</span>
						<div v-if="scope.row[6].isHadPrice">
							<div class="p">同行价：<span class="price">￥{{scope.row[6].costPrice}}</span></div>
							<div class="p">销售价：<span class="price">￥{{scope.row[6].retailSalesPrice}}</span></div>
							<div class="p">媒卖价：<span class="price">￥{{scope.row[6].customerPrice}}</span></div>
							<div class="p">库存：<span class="red">{{scope.row[6].surplusStock}}</span>/{{scope.row[6].stockBalance}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		props:{
			priceData:{
				default:this.defaultData,
				type:Array,
			},
		},
		data() {
			return {
				tableList: [],
				dateObj:{},
				currentYM:'',
				isCurrentMonth:true,
				defaultData:[],
				setData:[]
			}
		},
		watch:{
			'priceData':function(val){
				this.setData=val;
				this.setPrice();
			},
		},
		mounted(){
			this.dateObj=this.getDateObj();
			this.setTableTd()
		},
		methods:{
			updateVal(val){
				this.setData=val;
				this.setPrice();
			},
			setTableTd(){
				let obj=[{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},{
						costPrice:0,retailSalesPrice:0,customerPrice:0,dateStr:'',soldQuantity:0,surplusStock:0,stockBalance:0,isHadPrice:false,
					},
				]

				for(let i=0;i<6;i++){
					this.tableList.push(JSON.parse(JSON.stringify(obj)))
				}
				this.showCalendarData();
			},
			getDateObj(){
				let _date = new Date();    // 默认为当前系统时间
				return {
					getDate : function(){
						return _date;
					},
					setDate : function(date) {
						_date = date;
					}
				};
			},
			showCalendarData(){
				let dateObj=this.dateObj,
					_year = dateObj.getDate().getFullYear(),
					_month = dateObj.getDate().getMonth() ,
					_firstDay = new Date(_year, _month , 1),
					_now=new Date();  // 当前月第一天
				this.currentYM=`${dateObj.getDate().getFullYear()} 年 ${dateObj.getDate().getMonth()+1} 月`
				for(let i = 0; i < this.tableList.length; i++) {
					for(let j=0;j<this.tableList[i].length;j++){
						let index=i*7+j;
						let _thisDay = new Date(_year, _month , (_firstDay.getDay()>0?(index+2 - _firstDay.getDay()):(index+2 - (_firstDay.getDay()+7))));
						this.tableList[i][j].dateStr = _thisDay.getDate();
						this.tableList[i][j].isHadPrice = false;
						this.tableList[i][j].isCurrShowMonth = false;
						
						this.setData.forEach(item => {
							if(this.getDateStr(_thisDay)==this.getDateStr(new Date(item.date))){
								this.tableList[i][j].costPrice = item.costPrice;
								this.tableList[i][j].retailSalesPrice = item.retailSalesPrice;
								this.tableList[i][j].customerPrice = item.customerPrice;
								this.tableList[i][j].isHadPrice = true;
								this.tableList[i][j].soldQuantity = item.soldQuantity;
								this.tableList[i][j].surplusStock = item.stockBalance-item.soldQuantity;
								this.tableList[i][j].stockBalance = item.stockBalance;
								if(_month==new Date(item.date).getMonth()&&(_thisDay.getTime()>=(_now.getTime()-24*60*60*1000))){
									this.tableList[i][j].isCurrShowMonth = true;
								}
							}
						});
					}
				}
				if((_year+''+_month) == (_now.getFullYear()+''+_now.getMonth())) {
					this.isCurrentMonth = true;  // 当前月
				}else {    // 其他月
					this.isCurrentMonth = false;
				}
			},
			setPrice(){
				let dateObj=this.dateObj,
					_year = dateObj.getDate().getFullYear(),
					_month = dateObj.getDate().getMonth() ,
					_firstDay = new Date(_year, _month , 1);  // 当前月第一天
				for(let i = 0; i < this.tableList.length; i++) {
					for(let j=0;j<this.tableList[i].length;j++){
						let index=i*7+j;
						// let _thisDay = new Date(_year, _month , index+2 - _firstDay.getDay());
						let _thisDay = new Date(_year, _month , (_firstDay.getDay()>0?(index+2 - _firstDay.getDay()):(index+2 - (_firstDay.getDay()+7))));
						this.setData.forEach(item => {
							if(this.getDateStr(_thisDay)==this.getDateStr(new Date(item.date))){
								this.tableList[i][j].costPrice = item.costPrice;
								this.tableList[i][j].retailSalesPrice = item.retailSalesPrice;
								this.tableList[i][j].customerPrice = item.customerPrice;
								this.tableList[i][j].isHadPrice = true;
								this.tableList[i][j].soldQuantity = item.soldQuantity;
								this.tableList[i][j].surplusStock = item.stockBalance-item.soldQuantity;
								this.tableList[i][j].stockBalance = item.stockBalance;
								if(_month==new Date(item.date).getMonth()&&(_thisDay.getTime()>=(new Date().getTime()-24*60*60*1000))){
									this.tableList[i][j].isCurrShowMonth = true;
								}
							}
						});
					}
				}
			},
			handlePreMonth(){
				if(this.isCurrentMonth){
					return false;
				}
				let date = this.dateObj.getDate();
				this.dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
				this.showCalendarData();
			},
			handleNextMonth(){
				let date = this.dateObj.getDate();
				this.dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
				this.showCalendarData();
			},
			getDateStr(date){
			    let _year = date.getFullYear();
			    let _month = date.getMonth() + 1;    // 月从0开始计数
			    let _d = date.getDate();
			     
			    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
			    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
			    return _year + _month + _d;
			}
		}
	}
</script>

<style scoped>
	.price-table{
		background-color: #fff;
	}
	.price-table .top-controls{
		padding: 5px 0;
		text-align: center;
		font-size: 20px;
	}
	.price-table .top-controls .current-ym{
		font-size: 16px;
		margin: 0 40px;
	}
	.price-table .el-icon-arrow-left,.price-table .el-icon-arrow-right{
		cursor: pointer;
		font-weight: 600
	}
	.price-table .el-icon-arrow-left.disabled,.price-table .el-icon-arrow-right.disabled{
		color: #ccc;
		cursor: initial;
	}
	.price-table .red{
		color: red
	}
	.price-table .no-price .red{
		color: #ccc;
	}
	.price-table .el-table td .td{
		min-height: 96px;
		padding: 5px 10px 4px 10px;
	}
	.price-table .el-table td .p{
		font-size: 12px;
		line-height: initial;
	}
	.price-table .no-price{
		background-color: #f5f5f5;
		color: #ccc;
		/* min-height: 225px; */
	}
	.price-table .date{
		color: coral;
	}
	.price-table .no-price .date{
		color: #ccc;
	}
</style>
