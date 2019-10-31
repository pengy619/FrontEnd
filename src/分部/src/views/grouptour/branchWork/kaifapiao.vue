<template>
	<div class='view'>
        <el-row :gutter="20">
            <el-col :span="20" :offset="10" style='font-size:20px;'>{{(disSettleClientName || '暂无名字')}}</el-col>
        </el-row>
        <div>
            <h4>发票详细</h4>
            <el-form ref="form" :model="fapiao_form" label-width="120px" id='fapiao_form' size='small' :rules='rules'>
                <el-form-item label="发票抬头" class='form-inline-input' prop='invoiceTitle'>
                    <el-input v-model="fapiao_form.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" class='form-inline-input addressSelect' prop='addressselect'>
                    <el-select v-model="fapiao_form.provinceId" class='addressSel' placeholder="- - - -请选择- - - -" @change="provinceChange">
                        <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.cityId" class='addressSel' placeholder="- - - -请选择- - - -" @change="cityChange">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.districId" class='addressSel' placeholder="- - - -请选择- - - -">
                        <el-option
                            v-for="item in districList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='form-inline-input' label="详细地址" style='width:100%;' prop='address'>
                        <el-input v-model="fapiao_form.address"></el-input>
                    </el-form-item>
                <el-form-item label="银行账号" class='form-inline-input' prop='account'>
                    <el-input v-model="fapiao_form.account"></el-input>
                </el-form-item>

                <el-form-item label="开户行" class='form-inline-input' prop='bank'>
                    <el-input v-model="fapiao_form.bank"></el-input>
                </el-form-item>
                <el-form-item label="发票内容" class='form-inline-input' prop='content'>
                    <el-select v-model="fapiao_form.content" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in InvoiceItem"
                            :key="index"
                            :label="item.itemName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票类型" class='form-inline-input' prop='type'>
                    <el-select v-model="fapiao_form.type" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in InvoiceType"
                            :key="index"
                            :label="item.typeName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票单位" class='form-inline-input' prop='danwei'>
                    <el-select v-model="fapiao_form.danwei" placeholder="请选择" @change='companyChange'>
                        <el-option
                            v-for="(item,index) in InvoiceCompany"
                            :key="index"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司税号" class='form-inline-input' prop='taxNumber'>
                    <el-input v-model="fapiao_form.taxNumber"></el-input>
                </el-form-item>
                <el-form-item label="领取方式" class='form-inline-input' style='width:100%;' prop='radio'>
                    <el-radio-group v-model="fapiao_form.radio" @change='radioChange'>
                        <el-radio label="1">邮寄</el-radio>
                        <el-radio label="2">自取</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class='form-inline-input' label="收件人" v-if='fapiao_form.radio == 1' prop='toName'>
                    <el-input v-model="fapiao_form.toName"></el-input>
                </el-form-item>
                <el-form-item class='form-inline-input' label="联系电话" v-if='fapiao_form.radio == 1' prop='toMobile'>
                    <el-input v-model="fapiao_form.toMobile"></el-input>
                </el-form-item>
                <el-form-item label="发票邮寄地址" class='form-inline-input addressSelect' v-if='fapiao_form.radio == 1' prop='toaddressselect'>
                    <el-select v-model="fapiao_form.toprovinceId" class='addressSel' placeholder="- - - -请选择- - - -" @change="toprovinceChange" >
                        <el-option
                            v-for="item in toprovinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.tocityId" class='addressSel' placeholder="- - - -请选择- - - -" @change="tocityChange" >
                        <el-option
                            v-for="item in tocityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.todistricId" class='addressSel' placeholder="- - - -请选择- - - -" >
                        <el-option
                            v-for="item in todistricList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='form-inline-input' label="邮寄详细地址" v-if='fapiao_form.radio == 1' prop='toaddress'>
                        <el-input v-model="fapiao_form.toaddress"></el-input>
                    </el-form-item>
                <el-form-item label="备注" class='form-inline-input' style='width:80%' prop='beizhu'>
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="fapiao_form.beizhu"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div style='margin:15px 0;'>
                <h4>发票对应记录</h4>
                <el-form ref="form1" :model="jilu_form" label-width="120px"  size='small' :rules='rules1'>
                    <el-form-item class='form-inline-input' label="发票金额:"  prop='invoiceAmount' style='width:30%'>
                        <el-input v-model="jilu_form.invoiceAmount"></el-input>
                    </el-form-item>
                    <el-form-item class='form-inline-input' label="多开发票金额:"  prop='additionalAmount' style='width:30%'>
                        <el-input v-model="jilu_form.additionalAmount"></el-input>
                    </el-form-item>
                    <el-form-item class='form-inline-input' label="发票税费:" prop='taxAmount' style='width:30%'>
                        <el-input v-model="jilu_form.taxAmount"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                border
                ref="singleTable"
                :data="tableData"
                style="width: 100%">
                    <el-table-column property="feeAmount" label="申请金额" align='center'></el-table-column>
                    <el-table-column property="invoiceAmount" label="已申请" align='center'></el-table-column>
                    <el-table-column property="unApply" label="未申请" align='center'></el-table-column>
                    <el-table-column property="feeNo" label="收款订单号" align='center'></el-table-column>
                    <el-table-column property="disSettleClientName" label="收款客户" align='center'></el-table-column>
                    <el-table-column property="feeDateFormat" label="收款时间" align='center'></el-table-column>
                    <el-table-column property="orderInfos[0].orderNo" label="订单号" align='center'></el-table-column>
                    <el-table-column property="handler" label="收款人" align='center'></el-table-column>
            </el-table>
        </div>
        <div style="text-align:center;margin-top:25px;">
                <el-button class="button" type='primary' size='small' @click='saveInvoice' :loading = 'btn_loading' style='margin-right:20px;margin-left:-100px;'>保 存</el-button>
                <el-button class="button" type='primary' size='small' @click = 'goBack'>取 消</el-button>
        </div>
	</div>
</template>
<script>
	export default {
  		data() {
            var checkaddressselect = (rule, value, callback) => {
                if(this.fapiao_form.provinceId == '' || this.fapiao_form.cityId == '' || this.fapiao_form.districId == '' ){
                    callback(new Error('您的公司地址还未完善'))
                }else{
                    callback()
                }
            }
            var checktoaddressselect = (rule, value, callback) => {
                if(this.fapiao_form.radio !=  1){
                    return callback();
                }
                if(this.fapiao_form.toprovinceId == '' || this.fapiao_form.tocityId == '' || this.fapiao_form.todistricId == '' ){
                    callback(new Error('您的邮寄地址还未完善'))
                }else{
                    callback()
                }
            } 
            var checkPhone = (rule, value, callback) => {
                if(this.fapiao_form.radio !=  1){
                    return callback();
                }
                if (!value) {
                    callback(new Error("您还没填写手机号码"));
                } else if (!/^1[0-9][0-9]\d{8}$/.test(value)) {
                    callback(new Error("您的手机号码有误"));
                } else {
                    callback();
                }
            }
            var checktoName = (rule, value, callback) => {
                if(this.fapiao_form.radio !=  1){
                    return callback();
                }
                if (!value) {
                    callback(new Error("您还没填写收件人"));
                }else{
                    callback();
                }
            };
            var checktoaddress = (rule, value, callback) => {
                if(this.fapiao_form.radio !=  1){
                    return callback();
                }
                if (!value) {
                    callback(new Error("您还没填写邮寄详细地址"));
                }else{
                    callback();
                }
            };
            var checktaxAmount = (rule, value, callback) => {
                if(this.jilu_form.taxAmount == ''){
                    return callback();
                }else if(!/^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(value)){
                    callback(new Error('发票税费只能是正数'))
                }else{
                    callback()
                }
            };
            var checkadditionalAmount = (rule, value, callback) => {
                if(this.jilu_form.additionalAmount == ''){
                    return callback();
                }else if(!/^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(value)){
                    callback(new Error('多开发票金额只能是正数'))
                }else{
                    callback()
                }
            };
            var checkinvoiceAmount = (rule, value, callback) => {
                if(value == ''){
                    callback(new Error('发票金额不能为空'));
                }else if(!/^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(value)){
                    callback(new Error('发票金额只能是正数'))
                }else{
                    callback()
                }
            }
            var checkcontent = (rule, value, callback) => {
                if(this.fapiao_form.content == ''){
                    callback(new Error('您还没有选择发票内容'));
                }else{
                    callback()
                }
            };
            var checkdanwei = (rule, value, callback) => {
                if(this.fapiao_form.danwei == ''){
                    callback(new Error('您还没有选择发票单位'));
                }else{
                    callback()
                }
            };
            var checktype = (rule, value, callback) => {
                if(this.fapiao_form.type == ''){
                    callback(new Error('您还没有选择发票类型'));
                }else{
                    callback()
                }
            };
    		return {
                btn_loading:false,
                disSettleClientName:'客户名称',
                cusFeeId:this.$route.query.cusFeeId,//传过来的参数
                InvoiceType:[],//发票类型
                InvoiceItem:[],//发票内容
                InvoiceCompany:[],//发票单位

                tableData:[],
                //居住地地址
                provinceList:[],
                provinceName:'',
                cityList:[],
                cityName:'',
                districList:[],
                districName:'',

                //邮寄地址
                toprovinceList:[],
                toprovinceName:'',
                tocityList:[],
                tocityName:'',
                todistricList:[],
                todistricName:'',

                fapiao_form:{
                    provinceId:'',cityId:'',districId:'',address:'',toprovinceId:'',tocityId:'',toMobile:'',toName:'',taxNumber:'',
                    todistricId:'',toaddress:'',invoiceNo:'',content:'',type:'',danwei:'',beizhu:'',radio:'',invoiceItemName:''
                },
                //发票记录
                jilu_form:{
                    invoiceAmount:'',
                    additionalAmount:'',
                    taxAmount:''
                },
                rules:{
                    invoiceTitle:[
                        {required:true,message:'您还没填写发票抬头',trigger:'blur'}
                    ],
                    addressselect:[
                        {required:true,validator:checkaddressselect,trigger:'change'}
                    ],
                    toaddressselect:[
                        {required:true,validator:checktoaddressselect,trigger:'change'}
                    ],
                    address:[
                         {required:true,message:'您还没填写详细地址',trigger:'blur'}
                    ],
                    account:[
                         {required:true,message:'您还没填写银行账号',trigger:'blur'}
                    ],
                    bank:[
                         {required:true,message:'您还没填写开户行',trigger:'blur'}
                    ],
                    content:[
                         {required:true,validator:checkcontent,trigger:'change'}
                    ],
                    type:[
                         {required:true,validator:checktype,trigger:'change'}
                    ],
                    danwei:[
                         {required:true,validator:checkdanwei,trigger:'change'}
                    ],
                    taxNumber:[
                         {required:true,message:'您还没填写公司税号',trigger:'blur'}
                    ],
                    radio:[
                         {required:true,message:'您还没选择领取方式',trigger:'blur'}
                    ],
                    toName:[
                         {required:true,validator:checktoName,trigger:'blur'}
                    ],
                    toMobile:[
                         {required:true,validator:checkPhone,trigger:'blur'}
                    ],
                    toaddress:[
                         {required:true,validator:checktoaddress,trigger:'blur'}
                    ],
                    beizhu:[
                         {required:true,message:'您还没填写备注',trigger:'blur'}
                    ]
                },
                rules1:{
                    invoiceAmount:[
                        {required:true,validator:checkinvoiceAmount,trigger:'blur'}
                    ],
                    additionalAmount:[
                        {required:false,validator:checkadditionalAmount,trigger:'blur'}
                    ],
                    taxAmount:[
                        {required:false,validator:checktaxAmount,trigger:'blur'}
                    ]
                }
            }
		},
		methods: {
            //地址选择(省)
            provinceChange(val){
                this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
				.then((res)=>{
                    console.log(res)
                    if(res.status == 200){
                        this.cityList = res.data;
                        this.districList = [];
                        this.fapiao_form.cityId = '',
                        this.fapiao_form.districId = ''
                    }
				}).catch((e) => {
                    console.log(e);
                })
            },
            //地址选择(市)
            cityChange(val){
                this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val)
				.then((res)=>{
                    console.log(res)
                    if(res.status == 200){
                        this.districList = res.data;
                        this.fapiao_form.districId = ''
                    }
				}).catch((e) => {
                    console.log(e);
                })
            },
            //地址选择(省)
            toprovinceChange(val){
                this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
				.then((res)=>{
                    if(res.status == 200){
                        this.tocityList = res.data;
                        this.todistricList = [];
                        this.fapiao_form.tocityId = '',
                        this.fapiao_form.todistricId = ''
                    }
				}).catch((e) => {
                    console.log(e);
                })
            },
            //地址选择(市)
            tocityChange(val){
                this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val)
				.then((res)=>{
                    if(res.status == 200){
                        this.todistricList = res.data;
                        this.fapiao_form.todistricId = ''
                    }
				}).catch((e) => {
                    console.log(e);
                })
            },
            //结算单位改动时
            companyChange(val){
                this.InvoiceCompany.forEach((com) => {
                    if(com.id == val){
                        console.log(com.taxNumber)
                    }
                });
            },
            //领取方式为自取时  清空邮寄的相关数据
            radioChange(){
                if(this.fapiao_form.radio == 2){
                    this.fapiao_form.toMobile = '';
                    this.fapiao_form.toName = '';
                    this.fapiao_form.toaddress = '';
                    this.fapiao_form.toprovinceId = '';
                    this.fapiao_form.tocityId = '';
                    this.fapiao_form.todistricId = '';
                }
            },
            saveInvoice(){
                this.provinceList.forEach((item) => {
                    if(item.id == this.fapiao_form.provinceId){
                        this.provinceName = item.name;
                    }
                })
                this.cityList.forEach((item) => {
                    if(item.id == this.fapiao_form.cityId){
                        this.cityName = item.name;
                    }
                })
                this.districList.forEach((item) => {
                    if(item.id == this.fapiao_form.districId){
                        this.districName = item.name;
                    }
                })
                this.toprovinceList.forEach((item) => {
                    if(item.id == this.fapiao_form.toprovinceId){
                        this.toprovinceName = item.name;
                    }
                })
                this.tocityList.forEach((item) => {
                    if(item.id == this.fapiao_form.tocityId){
                        this.tocityName = item.name;
                    }
                })
                this.todistricList.forEach((item) => {
                    if(item.id == this.fapiao_form.todistricId){
                        this.todistricName = item.name;
                    }
                })
                this.InvoiceItem.forEach((item)=>{
                    if(item.id==this.fapiao_form.content){
                        this.fapiao_form.invoiceItemName=item.itemName;
                        return;
                    }
                })

                this.$refs.form.validate( (valid) => {
                    if(valid){
                        this.$refs.form1.validate( (valid) => {
                            if(valid){
                                this.btn_loading = true;
                                this.groupHttp.post('/Invoice/ApplyInvoice',{
                                cusFeeId: this.cusFeeId,
                                disSettleClientName:this.disSettleClientName,
                                invoiceTypeId: this.fapiao_form.type,
                                invoiceItemId: this.fapiao_form.content,
                                invoiceItems: this.fapiao_form.invoiceItemName,
                                invoiceCompanyId: this.fapiao_form.danwei,
                                invoiceTitle: this.fapiao_form.invoiceTitle,
                                taxNumber: this.fapiao_form.taxNumber,
                                invoiceAmount: this.jilu_form.invoiceAmount,
                                additionalAmount: this.jilu_form.additionalAmount == '' ? 0 : this.jilu_form.additionalAmount,
                                taxAmount: this.jilu_form.taxAmount == '' ? 0 : this.jilu_form.taxAmount,
                                openingBank: this.fapiao_form.bank,
                                bankAccount: this.fapiao_form.account,
                                provinceID: this.fapiao_form.provinceId,
                                provinceName: this.provinceName,
                                cityID: this.fapiao_form.cityId,
                                cityName: this.cityName,
                                districtID: this.fapiao_form.districId,
                                districtName: this.districName,
                                address: this.fapiao_form.address,
                                receiveType: this.fapiao_form.radio,
                                toName: this.fapiao_form.toName,
                                toMobile: this.fapiao_form.toMobile ,
                                toProvinceID: this.fapiao_form.toprovinceId,
                                toProvinceName: this.toprovinceName,
                                toCityID: this.fapiao_form.tocityId,
                                toCityName: this.tocityName,
                                toDistrictID: this.fapiao_form.todistrictId,
                                toDistrictName: this.todistricName,
                                toAddress: this.fapiao_form.toaddress,
                                applyRemark: this.fapiao_form.beizhu
                            }).then((res) => {
                                if(res.data.isSuccess == true){
                                    this.$message({
                                        type:'success',
                                        message:'保存成功'
                                    })
                                    this.btn_loading = false;
                                    setTimeout(() => {
                                        this.$router.push('/grouptour/orderList')
                                    },500)
                                }else{
                                    this.$message.error('出错了!' + res.data.message);
                                    setTimeout(() => {
                                        this.btn_loading = false;
                                    },500)
                                }
                            }).catch((e) => {
                                console.log(e);
                            });
                            }
                        })
                         
                    }
                });
            },
            goBack(){
                this.$router.go(-1)
            }
        },
		mounted() {
            this.groupHttp.get("CustomerFee/GetCustomerFeeDetail?id=" + this.cusFeeId).then(res => {
                console.log(res);
                if (res.status == 200) {
                    this.tableData.push(res.data);
                    //计算未申请金额
                    this.tableData[0].unApply = this.tableData[0].feeAmount -  this.tableData[0].invoiceAmount;
                    this.disSettleClientName = res.data.disSettleClientName;
                }else{
                    this.$message({
                        type: "info",
                        message: "出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
            //获取省级行政单位
            this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1')
				.then((res)=>{
                    if(res.status == 200){
                        this.provinceList = res.data;
                        this.toprovinceList = res.data;
                    }
				}).catch((e) => {
                    console.log(e);
                })
            //发票单位
            this.groupHttp.get("/Invoice/GetInvoiceCompany").then(res => {
                if (res.data.isSuccess == true) {
                        this.InvoiceCompany = res.data.objects;
                }else{
                    this.$message({
                        type: "info",
                        message: "获取发票单位出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
            //发票内容
            this.groupHttp.get("/Invoice/GetInvoiceItem").then(res => {
                if (res.data.isSuccess == true) {
                        this.InvoiceItem = res.data.objects;
                }else{
                    this.$message({
                        type: "info",
                        message: "获取发票内容出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
            //发票类型
            this.groupHttp.get("/Invoice/GetInvoiceType").then(res => {
                if (res.data.isSuccess == true) {
                        this.InvoiceType = res.data.objects;
                }else{
                    this.$message({
                        type: "info",
                        message: "获取发票类型出错了" + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
        }
	}
</script>
<style scoped lang="scss">
    @import "../../../style/common.scss";
    .form-inline-input {
        width: 40%;
        float: left;
        padding-right: 5%;
    }
    .form-inline-input .el-input {
        width: 200px;
        margin-right: 5%;
    }
    #fapiao_form::after {
        clear: both;
        content: ".";
        display: block;
        width: 0;
        height: 0;
    }
    .button{
        margin: 0px auto;
    }
    .view{
        background: #fff;
        padding: 20px;
    }
    .el-row .el-col .el-input{
        width:200px;
    }
    .addressSelect{
        width:100%;
    }
    .addressSel{
        margin-right:10px;
    }
</style>
