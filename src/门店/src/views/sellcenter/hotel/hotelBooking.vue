<template>
    <div class="view">
        <div class="booking-box">
            <div class="booking-form">
                <el-form :model="form" :rules="rules" ref="form" label-width="90px" size="small ">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>预订信息</span>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="入住日期" prop="CheckInDate" >
                                <el-date-picker
                                v-model="form.CheckInDate"
                                @change="checkInDateChange"
                                type="date" :picker-options="pickerOptions" id="s"
                                placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="离店日期" prop="CheckOutDate" >
                                <el-date-picker
                                v-model="form.CheckOutDate"
                                @change="checkOutDateChange"
                                type="date"  :picker-options="pickerOptions" id="e"
                                placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="房间数" prop="RoomCount" >
                                <el-select placeholder="请选择" v-model="form.RoomCount">
                                    <el-option v-for="item in 9" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="每间入住" prop="StayCount" >
                                <el-select placeholder="请选择" v-model="form.StayCount">
                                    <el-option v-for="item in 9" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="特殊要求" style="width:560px">
                                <el-input type="textarea" v-model="form.Remark"></el-input>
                                <p style="margin:0;color:#999;font-size:12px;">（您的要求我们会传达酒店，但不一定保证酒店能够实现）</p>
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="是否加床" >
                                <template v-if="hotel.canExtraBed">
                                    <el-checkbox label="加床" name="type"   v-model="other.isAddbed" @change="handleChangePrice"></el-checkbox>
                                    <span><b style="color:red"> ￥{{hotel.extraBedPrice}} </b>/张，你想加</span>
                                    <el-select placeholder="" style="width:80px" v-model="other.addbedNum">
                                        <el-option v-for="item in hotel.extraBedNumber" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <span>张</span>
                                </template>
                                <template v-else>
                                    该商品不支持加床
                                </template>
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                           <el-form-item label="是否加早" >
                                <template v-if="hotel.canExtraBreakfast">
                                    <el-checkbox label="加早" name="type"  v-model="other.isAddbreakfast" @change="handleChangePrice"></el-checkbox>
                                    <span><b style="color:red"> ￥{{hotel.extraBreakfaskPrice}}</b>/份，你想加</span>
                                    <el-select placeholder="" style="width:80px" v-model="other.addbreakfastNum">
                                        <el-option v-for="item in hotel.extraBreakfaskNumber" :label="item" :value="item"></el-option>
                                    </el-select>
                                    <span>份</span>
                                </template>
                                <template v-else>
                                    该商品不支持加早
                                </template>
                            </el-form-item>
                        </div>
                    </el-card>

                    <el-card shadow="hover" style="margin-top:10px">
                        <div slot="header" class="clearfix">
                            <span>门店信息</span>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="客户" required>
                                <el-input disabled v-model="form.CustomerName"></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="联系人" prop="CustomerMan" >
                                <el-input disabled v-model="form.CustomerJson.LinkMan"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="CustomerPhone" >
                                <el-input disabled v-model="form.CustomerJson.LinkMobile"></el-input>
                            </el-form-item>
                        </div>
                    </el-card>

                    <el-card shadow="hover" style="margin-top:10px">
                        <div slot="header" class="clearfix">
                            <span>入住人信息</span>
                        </div>
                        <div class="form-item-inline" v-for="(item,index) in form.TravelersJson" :key="index">
                            <span class="delete-row" @click="delTravelersJson(item,index)" v-if="index!=0"><i class="el-icon-circle-close"></i></span>
                            <template v-if="index===0">
                                <el-form-item :label="'住客姓名'+(index+1)" prop="firstTravelerName">
                                    <el-input v-model="item.TravelerName"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" prop="firstTravelerPhone">
                                    <el-input v-model="item.TravelerPhone" ></el-input>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item :label="'住客姓名'+(index+1)" >
                                    <el-input v-model="item.TravelerName"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" >
                                    <el-input v-model="item.TravelerPhone"></el-input>
                                </el-form-item>
                            </template>
                        </div>
                        <div class="form-item-inline">
                            <el-button size="mini" @click="addTravelersJson">添加行</el-button>
                        </div>
                    </el-card>

                    <el-card shadow="hover" style="margin-top:10px" v-if="hotel">
                        <div slot="header" class="clearfix">
                            <span>预订须知</span>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="退款规则" >
                                {{hotel.canRefund?'提前'+hotel.refundLeadDay+'天可退':'不可退'}}
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="餐型" >
                                {{hotel.breakfastType}}
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="资源确认" >
                                {{hotel.paymentType==0?'无需确认':'需确认'}}
                            </el-form-item>
                        </div>
                        <div class="form-item-inline">
                            <el-form-item label="补充说明" >
                                {{hotel.additionalRemarks}}
                            </el-form-item>
                        </div>
                    </el-card>

                    <el-card shadow="hover" style="margin-top:10px">
                        <el-button @click="$router.go(-1)">取消</el-button>
                        <el-button @click="submit(1)" type="primary" :disabled="other.totalPrice===0" :loading="submitLoading1">提交订单</el-button>
                        <el-button type="warning" @click="submit(2,'hotelPayment')" v-if="companyType==2"  :loading="submitLoading1" :disabled="other.totalPrice===0||hotel.paymentType==1">提交并支付</el-button>
                        <el-button type="warning" @click="submit(2,'hotelReceivables')" v-else-if="companyType==1" :loading="submitLoading1" :disabled="other.totalPrice===0||hotel.paymentType==1">提交并收款</el-button>
                    </el-card>
                </el-form>
            </div>
            <div class="booking-info">
                <el-card shadow="hover" body-style="padding:1px" style="min-height:577px;position: sticky!important;top:120px" v-loading="!hotel">
                    <div class="thumb-image-box" v-if="hotel">
                        <img :src="hotel.hotelImage" alt="">
                    </div>
                    <div class="info-box" v-if="hotel">
                        <div>{{hotel.hotelName}}</div>
                        <div>{{hotel.address}}</div>
                        <div class="border-dashed"></div>
                        <div class="big-title">{{hotel.roomName}}</div>
                        <div class="info-row">
                            <span>床型：<span style="margin-right:5px" v-for="(item,index) in hotel.orderRoomBedInfos" :key="index"><span v-if="index>0">、</span>{{item.bedTypeName}}，{{item.bedSizeName}}，{{item.bedNumber}}张</span></span>
                            
                        </div>
                        <div class="info-row">
                            <span>宽带：{{hotel.hasNetwork?'有':'无'}}</span>
                            <span>楼层：{{hotel.floor}}层</span>
                            <span>面积：{{hotel.area}}平方米</span>
                        </div>
                        <div class="info-row">
                            <span>备注：{{hotel.remark}}</span>
                        </div>
                        <div class="border-dashed"></div>
                        <div class="info-row">
                            <span>入住<em> {{other.night}}</em>晚，<em>{{form.RoomCount}}</em>间客房</span>
                        </div>
                        <div class="info-row">
                            <span>加床 <em v-if="other.isAddbed">{{other.addbedNum}}</em><em v-else>0</em>张 {{hotel.extraBedPrice}}元/张 共<price name="a2">{{other.isAddbed?other.addbedNum*hotel.extraBedPrice:0}}</price>元</span>
                        </div>
                        <div class="info-row">
                            <span>加早 <em v-if="other.isAddbreakfast">{{other.addbreakfastNum}}</em><em v-else>0</em>份 {{hotel.extraBreakfaskPrice}}元/份 共<price name="a1">{{other.isAddbreakfast?other.addbreakfastNum*hotel.extraBreakfaskPrice:0}}</price>元</span>
                        </div>
                        <div class="big-title">
                            订单总价：<span class="price">￥{{other.totalPrice}}</span>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import * as utils from '@/utils/tools.js'
export default {
    data() {
        var checkCustomerId = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请选择客户'));
            }else{
                return callback()
            }
        };
        var checkCustomerMan = (rule, value, callback) => {
            if (!this.form.CustomerJson.LinkMan) {
                return callback(new Error('联系人不能为空'));
            }else{
                return callback()
            }
        };
        var checkCustomerPhone = (rule, value, callback) => {
            if (!this.form.CustomerJson.LinkMobile) {
                return callback(new Error('联系电话不能为空'));
            }else{
                return callback()
            }
        };
        var checkFirstTravelerName= (rule, value, callback) => {
            if (!this.form.TravelersJson[0].TravelerName) {
                return callback(new Error('第一个联系人必填'));
            }else{
                return callback()
            }
        };
        var checkFirstTravelerPhone= (rule, value, callback) => {
            if (!this.form.TravelersJson[0].TravelerPhone) {
                return callback(new Error('第一个联系方式必填'));
            }else{
                return callback()
            }
        };
        return {
		    companyType:localStorage.getItem('companyType'),
            hotel:{},
            form:{
                ProductId:null,
                OrderAmount:0,
                Remark:'',
                OrderSource:0,
                CheckInDate:'',
                CheckOutDate:'',
                RoomCount:1,
                StayCount:1,
                AddBedCount:0,
                Addbreakfast:0,
                TravelerName:'',
                TravelerPhone:'',
                TravelersJson:[{
                    TravelerName:'',
                    TravelerPhone:'',
                }],
                CustomerJson:{
                    LinkQQ:'',
                    LinkEmail:'',
                    LinkMan:'',
                    LinkMobile:'',
                },
                CustomerName:"",
                CustomerId:0,
                BuyUserId:0,
                UserName:'',
                SupCompanysId:0,
                SupCompanyName:'',
                BoCompanyId:0,
                BoCompanyName:'',
            },
            other:{
                night:0,
                isAddbed:false,
                addbedNum:0,
                isAddbreakfast:false,
                addbreakfastNum:0,
                customer:{
                    loading:false,
                    options:[],
                    selected:'',
                },
                allDatePrice:[],
                totalPrice:0
            },
            rules:{
                CheckInDate:[
                    { type: 'date', required: true, message: '请选择入住日期', trigger: 'change' }
                ],
                CheckOutDate:[
                    { type: 'date', required: true, message: '请选择离店日期', trigger: 'change' }
                ],
                RoomCount:[
                    {  required: true, message: '请选择房间数', trigger: 'change' }
                ],
                StayCount:[
                    {  required: true, message: '请选择每间入住', trigger: 'change' }
                ],
                // CustomerId:[
                //     {required: true,validator: checkCustomerId, trigger: 'blur'}
                // ],
                CustomerMan:[
                    {required: true,validator: checkCustomerMan, trigger: 'change'}
                ],
                CustomerPhone:[
                    {required: true,validator: checkCustomerPhone, trigger: 'change'}
                ],
                firstTravelerName:[
                    {required: true,validator: checkFirstTravelerName, trigger: 'blur'}
                ],
                firstTravelerPhone:[
                    {required: true,validator: checkFirstTravelerPhone, trigger: 'blur'}
                ]
            },
            submitLoading1:false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now()-24*60*60*1000;
                },
            }
        };
    },
    watch:{
        'other.isAddbed':function(val){
            if(val==false){
                this.other.addbedNum=0
            }else if(this.other.addbedNum==0){
                this.other.addbedNum=1
            }
        },
        'other.isAddbreakfast':function(val){
            if(val==false){
                this.other.addbreakfastNum=0
            }else if(this.other.addbreakfastNum===0){
                this.other.addbreakfastNum=1
            }
            
        },
        'other.addbedNum':function(val){
            this.form.AddBedCount=val
            this.calcTotalPrice()
        },
        'other.addbreakfastNum':function(val){
            this.form.Addbreakfast=val
            this.calcTotalPrice()
        },
        'form.RoomCount':function(val){
            this.calcTotalPrice()
        }
    },
    mounted() {
        this.form.ProductId=this.$route.params.id
        this.getDetail()
        this.getShopInfo()
    },
    methods: {
        getShopInfo(){
            this.shopHttp.get('/ShopAccount/GetShopBasicInfo')
            .then(res=>{
                if(res.data.isSuccess){
                    this.form.CustomerId=res.data.objects[0].id
                    this.form.CustomerName=res.data.objects[0].name
                    this.form.CustomerJson.LinkMan=res.data.objects[0].contanct
                    this.form.CustomerJson.LinkMobile=res.data.objects[0].mobilePhone
                }
            })
        },
        handleChangePrice(val){
            this.calcTotalPrice();
        },
        getDetail(){
            this.shopHttp.get('HotelOrder/GetProductInfo',{
                params:{
                    productId:this.$route.params.id
                }
            }).then(res=>{
                this.hotel=res.data
            })
        },
        addTravelersJson(){
            this.form.TravelersJson.push({
                TravelerName:'',
                TravelerPhone:'',
            })
        },
        delTravelersJson(row,i){
            this.form.TravelersJson.splice(i,1)
        },
        searchCustomer(key){
            this.other.customer.loading=true
            this.shopHttp.get('/SettleClient/GetCustomerDrop?CustomerName='+key)
            .then(res=>{
                this.other.customer.options=res.data.objects
                this.other.customer.loading=false
            })
            .catch(err=>{
                this.other.customer.loading=false
            })
        },
        getCustomerInfo(){
            this.form.CustomerId=this.other.customer.selected
            this.shopHttp.post('SettleClient/GetCustomerOrder',{
                DisCompanyInfoId:this.other.customer.selected
            })
            .then(res=>{
                this.form.CustomerJson.LinkMan=res.data.contanct
                this.form.CustomerJson.LinkEmail=res.data.mailbox
                this.form.CustomerJson.LinkMobile=res.data.mobilePhone
            })
            .catch(err=>{
                
            })
        },
        checkInDateChange(val){
            if(this.form.CheckOutDate){
                this.other.night=this.DateDiff(this.form.CheckOutDate,val)
                this.getPrice(res=>{
                    this.other.allDatePrice=res.data.priceList
                    this.calcTotalPrice()
                })
            }
        },
        checkOutDateChange(val){
            if(this.form.CheckInDate){
                this.other.night=this.DateDiff(val,this.form.CheckInDate)
                this.getPrice(res=>{
                    this.other.allDatePrice=res.data.priceList
                    this.calcTotalPrice()
                })
            }
        },
        DateDiff(oDate1, oDate2){   
            var iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数   
            return  iDays
        },
        getPrice(cb){
            this.shopHttp.get('HotelOrder/GetHotelPriceInfoByDate',{
                params:{
                    ProductId:this.$route.params.id,
                    CheckInDate:utils.dateFmt(this.form.CheckInDate,'yyyy-MM-dd'),
                    CheckOutDate:utils.dateFmt(this.form.CheckOutDate,'yyyy-MM-dd')
                }
            }).then(res=>{
                if(res.data.isSuccess){
                    cb&&cb(res)
                }else{
                    this.other.allDatePrice=[]
                    this.calcTotalPrice()
                    this.$message.error(res.data.message);
                }
            }).catch(err=>{
                
            })
        },
        calcTotalPrice(){
            this.other.totalPrice=0
            if(this.companyType==1){
                this.other.allDatePrice.forEach(item=>{
                    this.other.totalPrice=this.other.totalPrice+item.retailSalesPrice
                })
            }else if(this.companyType==2){
                this.other.allDatePrice.forEach(item=>{
                    this.other.totalPrice=this.other.totalPrice+item.costPrice
                })
            }
            
            this.other.totalPrice=this.other.totalPrice*this.form.RoomCount
            if(this.other.isAddbed){
                this.other.totalPrice=this.other.totalPrice+(this.other.addbedNum*this.hotel.extraBedPrice)
            }
            if(this.other.isAddbreakfast){
                this.other.totalPrice=this.other.totalPrice+(this.other.addbreakfastNum*this.hotel.extraBreakfaskPrice)
            }
            this.form.OrderAmount=this.other.totalPrice
            
        },
        submit(type,name){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var form=JSON.parse(JSON.stringify(this.form))
                    form.TravelerName=this.form.TravelersJson[0].TravelerName;
                    form.TravelerPhone=this.form.TravelersJson[0].TravelerPhone;
                    form.CheckInDate=utils.dateFmt(this.form.CheckInDate,'yyyy-MM-dd')
                    form.CheckOutDate=utils.dateFmt(this.form.CheckOutDate,'yyyy-MM-dd')
                    form.CustomerJson=JSON.stringify(this.form.CustomerJson)
                    form.TravelersJson=JSON.stringify(this.form.TravelersJson)
                    this.other.customer.options.forEach(item=>{
                        if(item.disCompanyInfoId==this.form.CustomerId){
                            form.CustomerName=item.customerName
                        }
                    })
                    this.submitLoading1=true
                    this.shopHttp.post('HotelOrder/HotelOrderSubmit',form)
                    .then(res=>{
                        if(res.data.isSuccess){
                            this.$message({
                                message: '提交订单成功',
                                type: 'success'
                            });
                            if(type==2){
                                if(this.companyType==1){
                                    this.$router.push({name:name,query:{settlementIds:[res.data.settlementId],disSettleClientId:res.data.disSettleClientId}})
                                }else{
                                    this.$router.push({name:name,query:{orderIds:[res.data.orderId]}})
                                }
                            }else if(type==1){
                                this.$router.push('/orderCenter/hotelOrderList')
                            }
                            
                        }else{
                            this.$message.error(res.data.message);
                        }
                        this.submitLoading1=false
                    })
                    .catch(err=>{
                        this.submitLoading1=false
                    })
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.booking-box{
    width: 80%;
    min-width: 1000px;
    display: flex;
    .booking-form{
        flex: 1;
    }
    .booking-info{
        margin-left: 20px;
        width: 370px;
        .info-card{
            position: sticky!important;
            top: 120px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
        .thumb-image-box{
            width: 100%;
            height: 240px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 100%;
            }
        }
        .info-box{
            padding: 10px 10px 20px 10px;
            .big-title{
                font-size: 22px;
                .price{
                    font-size: 24px;
                    color: #ff6600
                }
            }
            .border-dashed{
                height: 0;
                border-top: 1px dashed #ddd;
                margin: 5px 0;
            }
            .info-row{
                padding: 3px 0;
                display: flex;
                span{
                    flex: 1
                }
                em{
                    color:#409EFF;
                    font-style: normal;
                    padding: 0 3px;
                }
                price{
                    color:#ff6600;
                    padding: 0 3px;
                }
            }
        }
    }
    .form-item-inline{
        display: flex;
        flex-wrap: wrap;
        position: relative;
        .delete-row{
            position: absolute;
            top: 5px;
            left: -12px;
            cursor: pointer;
            color: #909399;
            &:hover{
                color: #606266
            }
        }
    }
}

</style>
