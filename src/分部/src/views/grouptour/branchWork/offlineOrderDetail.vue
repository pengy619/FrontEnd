<template>
  <div class="view" id="box" v-loading="fullscreenLoading">
    <h4>订单信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单号" size="small" label-width="100px">
            <span>{{details.orderNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" size="small" label-width="100px">
            <span>{{details.orderDateString}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单状态" size="small" label-width="100px">
            <span>{{details.orderStatusName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建人" size="small" label-width="100px">
            <span>{{details.createUserName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>线路信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="线路名称" size="small" label-width="100px">
            <span>{{details.lineName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="团号" size="small" label-width="100px">
            <span>{{details.teamNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出团日期" size="small" label-width="100px">
            <span>{{details.departureDateString}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="行程单" size="small" label-width="100px">
            <a :href='details.tripFileUrl' :download='details.tripFileUrl'>
              <span>{{details.tripFileName}}</span>
            </a>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>客户信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="客户名称" size="small" label-width="100px">
            <span>{{details.customerName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系人" size="small" label-width="100px">
            <span>{{details.linkMan}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" size="small" label-width="100px">
            <span>{{details.linkMobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="QQ" size="small" label-width="100px">
            <span>{{details.linkQQ}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Email" size="small" label-width="100px">
            <span>{{details.linkEmail}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="合同号" size="small" label-width="100px">
            <span>{{details.contractNo}}</span>
            <el-button size="small" @click="dialogFormVisible = true" v-show="details.orderSource==8 && canChangeContractNo==true">更换合同</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期" size="small" label-width="100px">
            <span>{{details.orderDateString}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>预订信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="主要联系电话" size="small" label-width="100px">
            <span>{{details.firstLinkPhone}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="主要联系人" size="small" label-width="100px">
            <span>{{details.firstLinkMan}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>价格表</h4>
    <el-table size="small" ref="price" :data="priceTable" border show-summary :summary-method="getSummaries" tooltip-effect="dark" style="width: 100%">
      <el-table-column size="small" prop="priceName" label="价格名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="priceTypeName" label="价格类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="retailPrice" label="同行结算价" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="quantiy" label="人数" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <h4>附加费</h4>
    <el-table size="small" ref="additionalList" :data="details.groupLineOfflineAdditionals" border max-height="800" tooltip-effect="dark"
              style="width: 100%">
      <el-table-column size="small" prop="additionalName" label="费用名" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="unitPrice" label="价格" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="quantity" label="数量" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column size="small" prop="comment" label="说明" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="附加费合计：" size="small" label-width="120px">
            <span>{{details.additionalAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="优惠：" size="small" label-width="80px">
            <span>{{details.discountAmount}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="总价：" size="small" label-width="80px">
            <span>{{details.amount}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>旅客信息</h4>
    <el-table ref="information" :data="details.groupLineOfflineOrderGuests" border max-height="300" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="guestName" label="姓名" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="guestTypeName" label="旅客类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="guestGenderName" label="性别" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column  label="出生日期" align="center" show-overflow-tooltip>
         <template slot-scope="scope">
            {{scope.row.birthday?scope.row.birthday.split('T')[0]:''}}
          </template>
      </el-table-column>
      <el-table-column prop="mobilePhone" label="手机号码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="certificateTypeName" label="证件类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="idCardNO" label="证件号码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gatherLocation" label="集合地" align="center" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <h4>供应商信息</h4>
    <el-table ref="information" :data="supplierInfo" border max-height="300" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="supplierName" label="供应商名称" align="center">
      </el-table-column>
      <el-table-column prop="linkName" label="联系人" align="center">
      </el-table-column>
      <el-table-column prop="linkPhone" label="联系方式" align="center">
      </el-table-column>
      <el-table-column  label="联系地址" align="center" show-overflow-tooltip>
         <template slot-scope="scope">
            {{scope.row.provinceName+scope.row.cityName+scope.row.districtName+' '+scope.row.address}}
          </template>
      </el-table-column>
    </el-table>
    <el-row class="margin_top">
      <el-col :span="3" v-for="item in qualificationsList" style="padding-right:10px"><img style="width:100%; height:200px;" :src="item" @click="checkAttachment(item)" /></el-col>
    </el-row>
    <el-row style="padding:10px 0">
      推广费：
      <el-radio v-model="extension.enumCalculationType" :label="2">固定金额</el-radio>
      <el-input style="width:80px;" size="small" type="tel" v-model="extension.settingValue1" clearable></el-input> 元 / 单
      <el-radio v-model="extension.enumCalculationType" :label="1" style="margin-left:20px">百分比</el-radio>
      <el-input style="width:80px;" size="small" type="tel" v-model="extension.settingValue2" clearable></el-input> % / 单
      <el-radio v-model="extension.enumCalculationType" :label="0" style="margin-left:20px">类型</el-radio>
      成人<el-input style="width:80px;" size="small" type="tel" v-model="extension.adultValue" clearable></el-input>  元 / 人
      老人<el-input style="width:80px;" size="small" type="tel" v-model="extension.elderValue" clearable></el-input>  元 / 人
      儿童<el-input style="width:80px;" size="small" type="tel" v-model="extension.childValue" clearable></el-input>  元 / 人
    </el-row>
    <h4>备注</h4>
    <el-form>
      <el-row>
        {{details.comment||'无'}}
      </el-row>
    </el-form>

    <br/>
    <el-row :gutter="20">
      <el-col :span="10" :offset="10">
        <el-button size="small" type="primary" @click="handleConfirmOrder" v-if="!details.isComfirm">确认订单</el-button>
        <el-button class="mbackbtn" type="info" size="small" @click="back">返回</el-button>
      </el-col>
    </el-row>
    <el-dialog title="合同更换" :visible.sync="dialogFormVisible" width="410px" @close="handleCloseDialog">
      <el-form :model="Form" ref="Form" :rules="rules" size="small">
        <el-form-item label="现用合同编号：" :label-width="formLabelWidth">
          <span>{{details.contractNo}}</span>
        </el-form-item>
        <el-form-item label="新换合同编号：" :label-width="formLabelWidth" prop="newContractNo">
          <el-select v-model="Form.newContractNo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="searchContractNo" :loading="loading">
							<el-option v-for="item in contractList" :key="item" :label="item" :value="item">
							</el-option>
					</el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="ChangeContractNo('Form')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {dateFmt} from '@/utils/tools'
  export default {
    data(){
      return {
        dialogFormVisible: false,
        fullscreenLoading:false,
        loading:false,
        contractNo: '',
        details: {},
        price: [{}],
        additionalList: [{}],
        information: [{}],
        supplierInfo:[],
        dialogImageUrl:'',
        dialogVisible:false,
        formLabelWidth: '120px',
        Form: {
          newContractNo: ''
        },
        canChangeContractNo:'',
        rules: {
          newContractNo: [
            { required:'true',message: '请填写合同编号', trigger: 'blur'}
          ]
        },
				contractList: [],
        priceTable: [{
					priceName: "成人价",
					priceTypeName: "成人",
					retailPrice: 0,
					quantiy: "",
				},{
					priceName: "老人价",
					priceTypeName: "老人",
					retailPrice: 0,
					quantiy: "",
				},{
					priceName: "儿童价",
					priceTypeName: "儿童",
					retailPrice: 0,
					quantiy: "",
				//},{
				//	priceName: "婴儿价",
				//	priceTypeName: "婴儿",
				//	retailPrice: 0,
				//	quantiy: "",
        }],

        qualificationsList: [],//供应商资质集合

        extension:{
          enumCalculationType:null,
          settingValue1:null,
          settingValue2:null,
          adultValue:null,
          elderValue:null,
          childValue:null,
        }
      }
    },
    mounted () {
      this.initMessage();
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      //图片放大
      checkAttachment(url){
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      },
      //初始化信息
      initMessage(){
        let  url;
        if(this.$route.query.orderId){
           url= "/GroupLineOffline/GetGroupLineOfflineOrderDetail?OrderId=" + this.$route.query.orderId;
        }else if(this.$route.query.orderNo){
          url= "/GroupLineOffline/GetGroupLineOfflineOrderDetail?OrderNo=" + this.$route.query.orderNo;
        }
        this.fullscreenLoading = true;
          this.groupHttp.get(url).then(res => {
            this.details = res.data.offlineOrderDetail;
            this.supplierInfo.push(res.data.offlineOrderDetail.groupLineOfflineSupplier)
            this.canChangeContractNo=res.data.canChangeContractNo
            this.priceTable[0].retailPrice=this.details.adultPrice;
            this.priceTable[0].quantiy=this.details.adultNumber;
            this.priceTable[1].retailPrice=this.details.oldPrice;
            this.priceTable[1].quantiy=this.details.oldNumber;
            this.priceTable[2].retailPrice=this.details.childPrice;
            this.priceTable[2].quantiy=this.details.childNumber;
            //this.priceTable[3].retailPrice=this.details.babyPrice;
            //this.priceTable[3].quantiy=this.details.babyNumber;
            this.fullscreenLoading = false;
            this.qualificationsList = res.data.offlineOrderDetail.groupLineOfflineSupplier.qualifications.split(",");

            this.extension.enumCalculationType=this.details.enumCalculationType
            if(this.extension.enumCalculationType===2){
              this.extension.settingValue1=this.details.settingValue
            }else if(this.extension.enumCalculationType==1){
              this.extension.settingValue2=this.details.settingValue
            }else if(this.extension.enumCalculationType===0){
              this.extension.adultValue=this.details.settingValue
            }
            this.extension.childValue=this.details.childValue
            this.extension.elderValue=this.details.elderValue
          }).catch(e => {
            this.fullscreenLoading = false;
          })
      },
      //合同搜索
			searchContractNo(query) {
				if(query !== "") {
					this.loading = true;
					this.groupHttp
						.get("Contract/GetAvailableContractNos?ContractNo=" + query)
						.then(res => {
							if(res.data.isSuccess == true) {
								let objects = res.data.objects;
								this.loading = false;
								this.contractList = objects.filter(item => {
									return item.indexOf(query) > -1;
								});
							}
						});
				} else {
					this.contractList = [];
				}
			},
      ChangeContractNo(Form){
        this.groupHttp.post('/GroupLineOffline/ChangeContractNo', {
          OrderId: this.$route.query.orderId,
          NewContractNo: this.Form.newContractNo
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogFormVisible = false
            this.initMessage();
           
          }else{
            this.$message.error(res.data.message)
          }
        }).catch(e=>{
          console.log(e)
        });
      },
      handleCloseDialog(){
         this.$refs['Form'].resetFields()
      },
      getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = "合计";
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					sums[3] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if(!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0);
				});
				return sums;
      },
      handleConfirmOrder(){
        this.$confirm('是否确认订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[this.$route.query.orderId],settingValue;
          if(this.extension.enumCalculationType===2){
            settingValue=this.extension.settingValue1
          }else if(this.extension.enumCalculationType==1){
            settingValue=this.extension.settingValue2
          }else if(this.extension.enumCalculationType===0){
            settingValue=this.extension.adultValue
          }
          if((this.extension.enumCalculationType==2&&!this.isNumber(settingValue))||(this.extension.enumCalculationType==1&&!this.isNumber(settingValue))){
            this.$message.error('推广费请设置为数字');
            return false
          }
          if(this.extension.enumCalculationType===0){
            if(settingValue!==''&&!this.isNumber(settingValue)){
              this.$message.error('推广费请设置为数字');
              return false
            }
            if(this.extension.elderValue!==''&&!this.isNumber(settingValue)){
              this.$message.error('推广费请设置为数字');
              return false
            }
            if(this.extension.childValue!==''&&!this.isNumber(settingValue)){
              this.$message.error('推广费请设置为数字');
              return false
            }
            
          }
          
          this.groupHttp.post("GroupLineOffline/UpdateOrderComfirm", {
            orderIds:ids,
            enumCalculationType:this.extension.enumCalculationType,
            settingValue:settingValue,
            elderValue:this.extension.elderValue,
            childValue:this.extension.childValue,
          })
          .then(res => {
            if (res.data.isSuccess) {
              this.$message({
                type: "success",
                message: "确认订单成功"});
                this.extension.settingValue1=this.extension.settingValue2=this.extension.adultValue=''
              this.initMessage();
            } else {
              this.$message({
                type: "info",
                message: "操作失败:" + res.data.message
              });
            }
          })
          .catch(e => {
            console.log(e)
          });
        }).catch(() => {});
      },
      isNumber(val){

          var regPos = /^\d+(\.\d+)?$/; //非负浮点数
          var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
          if(regPos.test(val) || regNeg.test(val)){
              return true;
          }else{
              return false;
          }

      }
    }
  }
</script>

<style scoped lang="scss">
  .mysapn {
    font-weight: bold;
  }

  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }

  .vercitals {
    font-weight: bold;
    font-size: 20px;
  }

  .view .el-input.width_180px {
    width: 180px;
  }
</style>

