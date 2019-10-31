<template>
	<div class='view'>
        <div>
            <h4>发票详细</h4>
            <el-form ref="form" :model="fapiao_form" label-width="100px" id='fapiao_form' size='small'>
                <el-form-item label="发票抬头" class='form-inline-input'>
                    <el-input v-model="fapiao_form.invoiceNo"></el-input>
                </el-form-item>
                <el-form-item label="居住地地址" class='form-inline-input addressSelect'>
                    <el-select v-model="fapiao_form.provinceId" placeholder="- - - -请选择- - - -" @change="provinceChange">
                        <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.cityId" placeholder="- - - -请选择- - - -" @change="cityChange">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.districId" placeholder="- - - -请选择- - - -" >
                        <el-option
                            v-for="item in districList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='form-inline-input' label="详细地址">
                        <el-input v-model="fapiao_form.addressDetail"></el-input>
                    </el-form-item>
                <el-form-item label="银行账号" class='form-inline-input'>
                    <el-input v-model="fapiao_form.account"></el-input>
                </el-form-item>
                <el-form-item label="开户行" class='form-inline-input'>
                    <el-select v-model="fapiao_form.bank" placeholder="请选择银行" >
                        <el-option
                            v-for="item in bankList"
                            :key="item.id"
                            :label="item.dicdata_Value"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票内容" class='form-inline-input'>
                    <el-select v-model="fapiao_form.content" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in InvoiceItem"
                            :key="index"
                            :label="item.itemName"
                            :value="item.itemName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票类型" class='form-inline-input'>
                    <el-select v-model="fapiao_form.type" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in InvoiceType"
                                :key="index"
                                :label="item.typeName"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票单位" class='form-inline-input'>
                    <el-select v-model="fapiao_form.danwei" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in InvoiceCompany"
                            :key="index"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取方式" class='form-inline-input'>
                    <el-radio v-model="fapiao_form.radio" label="1">邮寄</el-radio>
                    <el-radio v-model="fapiao_form.radio" label="2">自取</el-radio>
                </el-form-item>
                <el-form-item class='form-inline-input' label="收件人" v-if='fapiao_form.radio == 1'>
                    <el-input v-model="fapiao_form.toName"></el-input>
                </el-form-item>
                <el-form-item class='form-inline-input' label="联系电话" v-if='fapiao_form.radio == 1' >
                    <el-input v-model="fapiao_form.toMobile"></el-input>
                </el-form-item>
                <el-form-item label="发票邮寄地址" class='form-inline-input addressSelect' v-show = 'this.fapiao_form.radio == 1 ? true : false'>
                    <el-select v-model="fapiao_form.toprovinceId" placeholder="- - - -请选择- - - -" @change="toprovinceChange">
                        <el-option
                            v-for="item in toprovinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.tocityId" placeholder="- - - -请选择- - - -" @change="tocityChange">
                        <el-option
                            v-for="item in tocityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="fapiao_form.todistricId" placeholder="- - - -请选择- - - -" >
                        <el-option
                            v-for="item in todistricList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='form-inline-input' label="邮寄详细地址" v-show = 'this.fapiao_form.radio == 1 ? true : false'>
                        <el-input v-model="fapiao_form.addressDetail"></el-input>
                    </el-form-item>
                <el-form-item label="备注" class='form-inline-input' style='width:80%'>
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="fapiao_form.beizhu"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div style='margin:15px 0;'>
                <h4>发票对应记录</h4>
                <el-row>
                    <el-col :span="10">
                        <span style='display:inline-block;width:95px;text-align:right;'>发票金额: </span>
                        <el-input size='small' v-model="invoiceAmount"></el-input>
                    </el-col>
                    <!-- <el-col :span="7">
                        <span>多开发票金额: </span>
                        <el-input size='small' v-model="additionalAmount"></el-input>
                    </el-col> -->
                    <el-col :span="7">
                        <span>发票税费: </span>
                        <el-input size='small' v-model="taxAmount"></el-input>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div style="text-align:center;margin-top:15px;">
                <el-button class="button" type='primary' size='small' @click='saveInvoice' :loading = 'btn_loading'>保 存</el-button>
                <el-button class="button" type='primary' size='small'>取 消</el-button>
        </div>
	</div>
</template>
<script>
	export default {
  		data() {
    		return {
                btn_loading:false,
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
                
                InvoiceType:[],//发票类型
                InvoiceItem:[],//发票内容
                InvoiceCompany:[],//发票单位

                bankList:[],

                fapiao_form:{
                    provinceId:'',cityId:'',districId:'',address:'',toprovinceId:'',tocityId:'',toMobile:'',toName:'',taxNumber:'',
                    todistricId:'',toaddress:'',invoiceNo:'',content:'',type:'',danwei:'',beizhu:''
                },
                invoiceAmount:'',
                taxAmount:''
            }
		},
		methods: {
            //地址选择(省)
            provinceChange(val){
                this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
				.then((res)=>{
                    //console.log(res)
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
                   // console.log(res)
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
            saveInvoice(){
                this.btn_loading = true;
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
                // this.shopHttp.post('/Invoice/ApplyInvoice',{
                //     "branchId": 1,
                //     "disCompanyId": 2,
                //     "cusFeeId": 3,
                //     "invoiceNo": "sample string 4",
                //     "invoiceTypeId": 5,
                //     "invoiceItemId": 6,
                //     "invoiceCompanyId": 7,
                //     "invoiceTitle": "sample string 8",
                //     "taxNumber": "sample string 9",
                //     "status": 0,
                //     "invoiceAmount": 10.0,
                //     "additionalAmount": 11.0,
                //     "taxAmount": 12.0,
                //     "openingBank": "sample string 13",
                //     "bankAccount": "sample string 14",
                //     "provinceID": this.fapiao_form.provinceId,
                //     "provinceName": this.provinceName,
                //     "cityID": this.fapiao_form.cityId,
                //     "cityName": this.cityName,
                //     "districtID": this.fapiao_form.districtId,
                //     "districtName": this.districtName,
                //     "address": this.fapiao_form.address,
                //     "receiveType": this.fapiao_form.radio,
                //     "toName": "sample string 22",
                //     "toMobile": "sample string 23",
                //     "toProvinceID": this.fapiao_form.toprovinceId,
                //     "toProvinceName": this.toprovinceName,
                //     "toCityID": this.fapiao_form.tocityId,
                //     "toCityName": this.todistrictName,
                //     "toDistrictID": this.fapiao_form.toDistrictId,
                //     "toDistrictName": this.todistrictName,
                //     "toAddress": this.fapiao_form.toaddress,
                //     "applyRemark": "sample string 31",
                //     "fillInvoiceNo": "sample string 32",
                //     "fillBy": "sample string 33",
                //     "fillRemark": "sample string 34",
                //     "receiveBy": "sample string 35",
                //     "receiveRemark": "sample string 36",
                //     "expressNo": "sample string 37",
                //     "expressCompany": "sample string 38",
                //     "expressDate": "2017-11-30T18:42:31.9872009+08:00",
                //     "expressRemark": "sample string 39",
                //     "lastModificationTime": "2017-11-30T18:42:31.9872009+08:00",
                //     "lastModifierUserId": 1,
                //     "creationTime": "2017-11-30T18:42:31.9881765+08:00",
                //     "creatorUserId": 1,
                //     "id": 41
                // }).then((res) => {
                //     if(res.data.isSuccess == true){
                //         this.$message({
                //             type:'success',
                //             message:'保存成功'
                //         })
                //         this.btn_loading = false;
                //     }else{
                //         this.$message.error('出错了:'+ res.data.message);
                //         setTimeout(() => {
                //             this.btn_loading = false;
                //         },500)
                //     }
                // }).catch((e) => {
                //     console.log(e);
                // });
            },
        },
		mounted() {
            this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1')
				.then((res)=>{
                   // console.log(res)
                    if(res.status == 200){
                        this.provinceList = res.data;
                        this.toprovinceList = res.data;
                    }
				}).catch((e) => {
                    console.log(e);
                })

             //发票单位
            this.shopHttp.get("/Invoice/GetInvoiceCompany").then(res => {
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
            this.shopHttp.get("/Invoice/GetInvoiceItem").then(res => {
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
            this.shopHttp.get("/Invoice/GetInvoiceType").then(res => {
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
                 //银行列表
            this.shopHttp.get("/Invoice/GetBankList").then(res => {
                if (res.data.isSuccess == true) {
                        this.bankList = res.data.objects;
                }else{
                    this.$message({
                        type: "info",
                        message: "获取银行列表出错了," + res.data.message
                        });
                    }
                }).catch(e => {
                    console.log(e)
                });  
        }
	}
</script>
<style scoped lang="scss">
    @import "../../style/common.scss";
    .form-inline-input {
        width: 40%;
        float: left;
        padding-right: 5%;
    }
    .form-inline-input .el-input {
        width: 215px;
        margin-right: 5%;
    }
    #fapiao_form::after {
        clear: both;
        content: ".";
        display: block;
        width: 0;
        height: 0;
    }
    .view{
        background: #fff;
        padding: 20px;
    }
    .el-row .el-col .el-input{
        width:215px;
    }
    .addressSelect{
        width:100%;
    }
    .addressSelect .el-select{
        width:150px;
        margin-right:45px;
    }
    .el-button{
        margin-right:30px;
    }
    .el-col .el-input{
        width:200px;
    }
</style>