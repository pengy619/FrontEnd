<template>
    <div class="view" v-loading="linelistloading">
         <!-- 1=自营门店 2=加盟门店 -->
        <div style='height:175px;' v-if="companyType==2">
            <div class = 'div_top left'>    
                <div style='font-size:18px;'>账户余额（元）<span style='margin-left:80px;'>冻结余额（元）</span></div> 
                <p style='font-size:14px;'><span>￥ {{assets}}</span><span style='margin-left:130px;'>￥ {{freezeAssets}}</span></p>
                <i class="icon iconfont icon-xiaoshoumingxi"></i>
                <div>
                  <el-button type="warning" size="small" @click="rechargemanage">充值</el-button>
                  <el-button type="warning" size="small" @click="balanceoutmanage">余额管理</el-button>
                </div>                           
            </div>
            <!-- <div class = 'div_top right'> 
                <div style='font-size:14px;'>授信额度（元）</div>
                <p style='font-size:30px;margin:0;'><span>￥</span>{{creditAmount}}</p>
                <i class="icon iconfont icon-qianbao"></i>
                <div>
                    <el-button type="warning" size="small" @click="lineofCreditmanage">信用额度管理</el-button>
                </div>
            </div> -->
        </div>
        <div style='height:175px;' v-else>
            <div class = 'div_top left'>
                <div style='font-size:14px;'>授信额度（元）</div>
                <p style='font-size:30px;margin:0;'><span>￥</span>{{creditAmount}}</p>
                <i class="icon iconfont icon-qianbao"></i>
                <div>
                    <el-button type="warning" size="small" @click="lineofCreditmanage">信用额度管理</el-button>
                </div>
            </div>
        </div>
        <!-- <div style='height:175px;' v-else>
            <div class = 'div_top left'>
                <div style='font-size:18px;'>账户余额（元）</div>
                <p style='font-size:14px;'><span>￥</span>{{assets}}</p>
                 <i class="icon iconfont icon-xiaoshoumingxi"></i>
                <div>
                    <el-button type="warning" size="small" @click="rechargemanage">充值</el-button>
                    <el-button type="warning" size="small" @click="balanceoutmanage">余额管理</el-button>
                </div>
            </div>
            
        </div> -->
        <h3>收支明细</h3>
        <el-form  :inline="true" size="small" label-width="80px">
            <el-form-item label="交易类型" >
                <el-select placeholder="请选择"  v-model="accountType" size="small" clearable>
                    <el-option v-for="(item,index) in accounttypeArray" :key="index"  :label="item.name" :value="item.value" v-if="item.value!=1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单号">
                <el-input v-model="orderNumber"></el-input>
             </el-form-item>
            <el-form-item label="交易时间" >
                <el-date-picker
                    size="small"
                    id="startime"
                    v-model="startTime"
                    type="date" 
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始日期">
                    </el-date-picker> 至
                    <el-date-picker
                    size="small"
                    id="endtime"
                    v-model="endTime"
                    type="date" 
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束日期">
                    </el-date-picker>
            </el-form-item>
            <el-button type="warning" size="small" icon="el-icon-search" @click="getPropertylist()">搜索</el-button>
              <el-button type="primary" size="small" @click="handleExport">导出</el-button>
        </el-form>
        <div class="margin_bottom">总计：<span class="danger">{{total}}</span> 条  <span class="margin_left">共：<span class="danger">{{totalMoney}}</span> 元</span></div>
        <el-table ref="multipleTable" v-loading="linelistloading" size="small" :data="accountData" tooltip-effect="dark"  style="width:100%">
            <el-table-column prop="amount" label="金额" size="small" align="center" width='200px'>
                    <template slot-scope="scope">
                        <div v-if="scope.row.amount>=0">
                        <span v-if="scope.row.symbol == '-'"  class="price">{{scope.row.symbol+''+scope.row.amount}}</span>
                        <span v-else class="price">{{scope.row.symbol+''+scope.row.amount}}</span> 元
                        </div>
                    </template>
            </el-table-column>
            <!-- :formatter="fixType" -->
            <el-table-column prop="tradeTypeName"  label="交易类型" size="small"  align="center"></el-table-column>
            <el-table-column label="订单号" size="small"  align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.orderType!=null && scope.row.orderId!=null">
                        <span style="color:blue;cursor: pointer;" @click="openView(scope.row.orderType,scope.row.orderId,scope.row.orderNo)">{{scope.row.orderNo}}</span>
                    </div>
                    <span v-else style="color:red">
                        {{scope.row.orderNo}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="creationTime" :formatter="creationtime" label="发生日期"  width="180" size="small"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serialNumber" label="流水单号"  align="center" size="small" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageindex"
            :page-sizes="[5,10,20,50]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data(){
        return{
            branchID:'',
            accountType:'',
            accounttypeArray:[],
            startTime:'',
            endTime:'',
            pageindex:1,
            pagesize:10,
            total:0,
            totalMoney:0,
            orderNumber:'',
            linelistloading:false,
            accountData:[],
            companyType:2,//默认是加盟门店
            assets: 0,
            freezeAssets:0,
            creditAmount:0,
            //lsType:['余额支付','信用额支付','订单退款','线下充值','余额转进','余额转出','信用额转进','信用额转出']
           // lsType:['','现金','转账','总部代收','微信','支付宝','刷卡','支票','余额支付','信用额支付','余额转进','余额转出','信用额转进','信用额转出','']
        }
    },
    mounted:function(){
        this.getProperty();
        this.getPropertylist();
        this.getBranchId();
    },
    methods:{
        openView(ordertype,orderid,orderNo){
            let routerDate;
            if(ordertype == 6){
                routerDate = this.$router.resolve({
                   path: "/orderCenter/orderCheck",
                   query: { orderId: orderid, orderNo:orderNo}
               });
               window.open(routerDate.href)
            }else if(ordertype == 8){
               routerDate = this.$router.resolve({path:'/orderCenter/offlineOrderDetail',query:{orderId:orderid}})
                window.open(routerDate.href)
            }else if(ordertype == 9){
               routerDate = this.$router.resolve({path:'/singleItem/singleOrderDetail',query:{id:orderid}})
                window.open(routerDate.href)
            }else{
                return
            }
        },
        getBranchId(){
            let that = this
            this.shopHttp.get('/Finance/GetBranchId').then(function(res) {
               that.branchID =  res.data;
            });
        },
        lineofCreditmanage(){
            this.$router.push({name:'lineofCreditManage'})
        },
        balanceoutmanage(){
            this.$router.push({name:'balanceout'});
        },
        rechargemanage(){
            this.$router.push({name:'recharge'})
        },
        handleExport(){
            let url = process.env.WEB_API + '/Property/ExportPropertyList?TradeType='+this.accountType+'&StartDate='+this.startTime+'&EndDate='+this.endTime+'&orderNo='+this.orderNumber+'&PageSize='+this.pagesize+'&PageIndex='+this.pageindex+'&BranchID='+this.branchID+"&DisCompanyId="
              this.shopHttp.get("/Finance/GetShopId").then(function(res) {
                window.location.href = url + res.data;
              });
        },
        getPropertylist(pageIndex=1){// 搜索 列表
            let _this = this;
            _this.linelistloading = true;
           // let url = '/Property/GetPropertyList?TradeType='+_this.accountType+'&StartDate='+_this.startTime+'&EndDate='+_this.endTime+'&PageSize='+_this.pagesize+'&PageIndex='+_this.pageindex
            if(_this.startTime == null || _this.startTime == ''){
                  _this.startTime = "";
            }
            if(_this.endTime == null || _this.endTime == ""){
                _this.endTime = "";
            }
            let type =  _this.accountType ==null ? "" : _this.accountType;
            _this.shopHttp.get('/Property/GetPropertyList?TradeType='+type+'&StartDate='+_this.startTime+'&EndDate='+_this.endTime+'&PageSize='+_this.pagesize+'&PageIndex='+pageIndex+'&orderNo='+_this.orderNumber).then(res=>{
                if(res.data.isSuccess){
                    _this.accountData = res.data.objects;
                    _this.total = res.data.total;
                    _this.totalMoney = res.data.totalMoney;
                   
                }else{
                    this.$message({
                        type: "error",
                        message: "出错了!" + res.data.message
                    });
                }
                _this.linelistloading = false;
            }).catch(err=>{
                _this.linelistloading = false;
                console.log(err);
            })
        },
        getProperty(){//账户余额或授信额度
            var _this = this;
            _this.shopHttp.get('/Property/GetProperty').then(res=>{
               // console.log(res);
                if(res.data.isSuccess){
                    _this.companyType = res.data.objects[0].companyType;
                    _this.assets = res.data.objects[0].assets;
                    _this.freezeAssets = res.data.objects[0].freezeAssets;
                    _this.creditAmount= res.data.objects[0].creditAmount;
                    _this.getTradeTypes();
                }
            }).catch(err=>{
               console.log(err);
            })
        },
        getTradeTypes(){//获取交易类型  这里 还没有分类型
            var _this = this;
            _this.shopHttp.get('/Property/GetTradeTypes?companyType='+_this.companyType).then(res=>{
               // console.log(res);
                if(res.data.isSuccess){
                   _this.accounttypeArray = res.data.objects;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        handleSizeChange(val){
            this.pagesize = val;
            this.getPropertylist(this.pageindex);
        },
        handleCurrentChange(val){
            this.pageindex = val;
            this.getPropertylist(this.pageindex);
        },
        creationtime(val){
          let oTime = val.creationTime;
        //   if(oTime.indexOf('T')>0){
                // let tTime = val.creationTime.replace(" ","T");
                // let sTime = tTime.substring(0,tTime.lastIndexOf('.'));
                // return sTime;
        //   }else{
        //       return oTime;
        //   }
          if(oTime != null && oTime != ''){
            let tTime = oTime.substring(0,oTime.lastIndexOf('T'));
            let sTime = oTime.substring(oTime.indexOf('T')+1,oTime.lastIndexOf('.'));
            return tTime+" "+sTime;
          }
          
        },
        fixType(val){
           return this.lsType[val.tradeType];
        }
    }
}
</script>

<style lang='scss' scoped>
    .div_top{
        display:inline-block;
        height: 157px;
        width:49.5%;
        margin-bottom:0 0 20px 0;
        color:white;
        position: relative;
        padding:20px;
    }
    .div_top i{
        width:70px;
        height:112px;
        position:absolute;
        top:31px;
        right:40px;
        opacity:.3;
        font-size:70px;
        line-height:112px;
    }
    .left{
        float:left;
        background:rgb(253, 135, 116);
    }
    .right{
        float:right;
        background:rgb(90, 183, 223);
    }
    // .el-button--text{
    //     color: red;
    // }
</style>
