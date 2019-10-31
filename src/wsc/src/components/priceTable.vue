<template>
	<div class="price-box-wrap">
        <div class="price-box">
            <div class="price-table">
                <div class="table-weeks">
                    <span class="price">日</span>
                    <span>一</span>
                    <span>二</span>
                    <span>三</span>
                    <span>四</span>
                    <span>五</span>
                    <span class="price">六</span>
                </div>
                <div class="table-body">
                    <div :class="{'active':item.isActive,'table-td':true,'disabled':item.disabled}" @click="handleChoiceDate(item,index)" v-for="(item,index) in tableList">
                        {{item.dateStr}}
                        <template  v-if="item.isHadPrice">
                            <p class="price">￥{{item.price}}</p>
                            <p class="stock"><span class="red">{{item.surplusStock}}</span>/{{item.foundNumberCount}}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	export default {
		props:{
			priceData:{
				default:this.defaultData,
				type:Object,
			},
		},
		data() {
			return {
				tableList: [],
				dateObj:{},
				defaultData:{},
                setData:{},
			}
		},
		watch:{
			'priceData':function(val){
                this.setData=val;
                let date = this.dateObj.getDate();
				this.dateObj.setDate(new Date(val.date));
				this.showCalendarData();
			},
		},
		mounted(){
            this.dateObj=this.getDateObj();
		},
		methods:{
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
					_firstDay = new Date(_year, _month , 1);// 当前月第一天
                this.tableList=[];
                let dateLength=this.getCountDays(dateObj.getDate());
                
                let prevLength=_firstDay.getDay();
                for(let i=0;i< prevLength;i++){
                    let _thisDay = new Date(_year, _month ,i);
                    var obj={}
                    this.tableList.push(obj)
                }
                for(let i=1;i<=dateLength;i++){
                    let obj={};
                    let _thisDay = new Date(_year, _month ,i);
                    // let _thisDay = new Date(_year, _month , (_firstDay.getDay()>0?(index+1 - _firstDay.getDay()):(index+1 - (_firstDay.getDay()+7))));
                    obj.dateStr = i;
                    obj.teamDate=`${_year}-${_month+1}-${i}`;
                    obj.isHadPrice = false;
                    // this.tableList[i].isCurrShowMonth = false;
                    obj.isActive = false;
                    this.setData.priceList.forEach(item => {
                        if(this.getDateStr(_thisDay)==this.getDateStr(new Date(item.teamDate))){
                            obj.price = item.price||0;
                            obj.oldPrice = item.oldPrice||0;
                            obj.childPrice = item.childPrice||0;
                            obj.isHadPrice = true;
                            obj.soldQuantity = item.soldQuantity || 0;
                            item.foundNumberCount = item.foundNumberCount == 99999 ? "∞" : item.foundNumberCount
                            obj.surplusStock = item.foundNumberCount == "∞" ? item.foundNumberCount:item.foundNumberCount-item.soldQuantity;
                            obj.foundNumberCount = item.foundNumberCount||0;
                        }
                        if(_thisDay<new Date()){
                            obj.disabled=true
                        }
                    }); 
                    this.tableList.push(obj)
                }
            },
            getCountDays(date){
                let curDate = new Date(date);
                let curMonth = curDate.getMonth();
                curDate.setMonth(curMonth+1)
                curDate.setDate(0);
                return curDate.getDate();
            },
            handleChoiceDate(item,index){
                if(item.disabled){
                    return false
                }
                if(item.isHadPrice){
                    this.$emit('table-click',item)
                    this.tableList.forEach(list=>{
                        list.isActive=false;
                    })
                    this.tableList[index].isActive=true;
				}
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

<style scoped lang=scss>
    @import "../style/theme.scss";
	.price-table{
		width: 100%;
        table-layout: fixed;
		background-color: #fff;
		.table-weeks{
            display: flex;
            span{
                flex: 1;
                padding: .1rem 0;
                text-align: center;
            }
		}
        .table-body{
            display: flex;
            flex-wrap: wrap;
            .table-td{
                flex: calc(100%/7) 0 0;
                padding: .1rem .05rem;
				min-height: .6rem;
                overflow: hidden;
                border: 1px solid transparent;
                text-align: center;
                .price,.stock{
					font-size: .12rem;
					.red{
						color: red
					}
                }
                &.active{
                    border-color: $theme-orange1;
                    background-color: #fff8ef;
                }
                &.disabled{
                    background: #f5f5f5;
                    color: #999!important
                }
            }
        }
	}
</style>
