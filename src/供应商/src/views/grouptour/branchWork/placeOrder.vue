<template>
  <div class='view'>
    <div>
      <div>
        <h4>线路信息</h4>
      </div>
      <div>
        <el-row>
          <el-col :span="2" class="text1">线路名称</el-col>
          <el-col :span="20">{{routeName}}(线路编号：{{groupNum}})</el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">出团团期</el-col>
          <el-col :span="20">{{groupTime}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="text1">线路类型</el-col>
          <el-col :span="20">{{routeType}}</el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div>
        <h4>客户信息</h4>
      </div>
      <div>
        <el-form ref="form2" :model="form2" :rules='rules2' label-width="100px" id="form2" size="small">
          <el-form-item label="客户" class="form-inline-input" prop='CustomerId'>
            <el-select
              v-model="form2.CustomerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="getLinkMessage"
              :loading="loading">
              <el-option
                v-for="item in options4"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" class="form-inline-input" prop='LinkMan'>
            <el-input v-model="form2.LinkMan"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" class="form-inline-input" prop='LinkMobile'>
            <el-input v-model="form2.LinkMobile"></el-input>
          </el-form-item>
          <el-form-item label="QQ" class="form-inline-input" prop='LinkQQ'>
            <el-input v-model="form2.LinkQQ"></el-input>
          </el-form-item>
          <el-form-item label="Email" class="form-inline-input" prop='LinkEmail'>
            <el-input v-model="form2.LinkEmail"></el-input>
          </el-form-item>
          <el-form-item label="合同号" class="form-inline-input" prop='ContractNo'>
            <el-input v-model="form2.ContractNo"></el-input>
          </el-form-item>
          <el-form-item label="订单日期" class="form-inline-input" prop='orderDate'>
            <el-date-picker
              v-model="form2.orderDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <div>
        <h4>预订信息</h4>
      </div>
      <div>
        <el-form ref="form3" :model="form3" :rules='rules3' label-width="100px" id="form3" size="small">
          <el-form-item label="主要联系人" prop='FirstLinkMan'>
            <el-input v-model="form3.FirstLinkMan" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop='FirstLinkPhone'>
            <el-input v-model="form3.FirstLinkPhone" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form3.FirstLinkGender">
              <el-radio :label="1">先生</el-radio>
              <el-radio :label="2">女士</el-radio>
             </el-radio-group>
          </el-form-item>
          <el-form-item label="添加为游客">
            <el-checkbox v-model="IsAddCustomer">是否添加为游客</el-checkbox>
          </el-form-item>
          <el-form-item label="出发地" prop='CustomerSource'>
            <el-select v-model="form3.CustomerSource" placeholder="请选择" @visible-change="clientSiteFun" @change="seleSite">
              <el-option
                v-for="item in clientSite"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <h4>附加表</h4>
        <div>
          <el-table :data="tableData1" border show-summary style="width: 100%;margin-bottom:20px;" :summary-method="getSummaries">
            <el-table-column prop="priceName"
                             label="价格名称"
            >
            </el-table-column>
            <el-table-column prop="priceTypeName"
                             label="价格类型">
            </el-table-column>
            <el-table-column prop="retailPrice"
                             label="内部价">
            </el-table-column>
            <el-table-column
              label="人数" prop="Quantiy">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.Quantiy" :min='0' :max='999999'></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <h4>附加费用</h4>
      <el-button type="primary" @click="addTr" class="but_marginbom">添加行</el-button>
      <div>
        <el-table :data="tableData2"
                  border
                  style="width: 100%" class="margin_bottom">
          <el-table-column prop="AdditionalName"
                           label="费用名">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.AdditionalName"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="UnitPrice"
                           label="价格">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.UnitPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Quantity"
                           label="数量">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.Quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Comment"
                           label="说明">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.Comment"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Amount"
                           label="合计">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete1(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<span class="demonstration">内部价: </span>-->
        <!--<el-input style='width:15%;margin-right:20px;' size="small" v-model="interiorAmount" :disabled="true"></el-input>-->
        <span class="demonstration">附加费: </span>
        <el-input style='width:15%;margin-right:20px;' size="small" v-model="additionAmount" :disabled="true"></el-input>
        <span class="demonstration">优惠: </span>
        <el-input style='width:15%;margin-right:20px;' size="small"  @change="discounts" v-model="DiscountAmount"></el-input>
        <span class="demonstration">总价: </span>
        <el-input style='width:15%;margin-right:20px;' size="small" :disabled="true" v-model="aggregateAmount"></el-input>
      </div>
    </div>
    <div>
      <div>
        <h4>旅客信息</h4>
      </div>
      <div>
        <el-button type="primary" @click="addTr1" class="but_marginbom">添加行</el-button>
        <!--<el-button type="primary">导入</el-button>-->
      </div>
      <el-table
        :data="table3"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="GuestName"
          label="姓名"
          >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.GuestName"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="GuestType"
          label="类型"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.GuestType" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="GuestGender"
          label="性别"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.GuestGender" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in sex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="MobilePhone"
          label="手机号"
          >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.MobilePhone"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="CertificateType"
          label="证件类型"
          >
          <template slot-scope="scope">
            <el-select v-model="scope.row.CertificateType" placeholder="请选择" size="small" class="select_width">
              <el-option
                v-for="item in cardList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="IDCardNO"
          label="证件号码"
          width="200">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.IDCardNO"></el-input>
          </template>
        </el-table-column>
          <el-table-column
          prop="Birthday"
          label="出生日期"
          >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.Birthday"
              type="date"
              placeholder="选择日期" size="small" class="date_width">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="GatherLocation"
          label="集合地点"
          width="120">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.GatherLocation"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
         >
          <template slot-scope="scope">
            <el-button @click="handleDelete2(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <h4>备注</h4>
      <el-input type="textarea" :rows="4" v-model="Comment"></el-input>
      <div style="margin-top:15px;">
        <el-button type="primary" @click="onSubmit('form2','form3')" :loading="submitLoading1">确 定</el-button>
        <el-button type="info" @click="goBack">返 回</el-button>
        <el-button type="primary" @click="onSubmit('form2','form3','payment')" :disabled="confirmType!=4" :loading="submitLoading2">收款</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {dateFmt} from '@/utils/tools'
  var _index = 1;
  export default {
    data() {
      var checkQQ = (rule,value,callback) => {
        if(!value){
          callback(new Error('您还没有输入QQ号码'))
        }else if(!/^\d{5,10}$/.test(value)){
          callback(new Error('您的QQ号码有误'))
        }else{
          callback()
        }
      }
      var checkEmail = (rule,value,callback) => {
        if(!value){
          callback(new Error('您还没有输入邮箱'))
        }else if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)){
          callback(new Error('您的邮箱格式有误'))
        }else{
          callback()
        }
      }
      var checkPhone = (rule,value,callback) => {
        if(!value){
          callback(new Error('您还没有手机号码'))
        }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
          callback(new Error('您的手机号码有误'))
        }else{
          callback()
        }
      }
      var checkOrderDate = (rule,value,callback) => {
        if(!value){
          callback(new Error('您还没有选择订单日期'))
        }else{
          callback()
        }
      }
      return {
        submitLoading1: false,
        submitLoading2: false,
        additionAmount:0, //附加费用
        interiorAmount:0,  //价格
//        aggregateAmount:0,  //总价
        DiscountAmount:0,  //折扣金额
        IsAddCustomer:false,
        client: [],
        clientSite: [],
        sex: [{
          value: '1',
          label: '男'
        }, {
          value: '2',
          label: '女'
        }],
        ProductId:'',
        typeList: [],
        cardList: [],
        confirmType:this.$route.query.confirmType,
        lineId: this.$route.query.lineId,
        routeName: this.$route.query.fullName,
        routeType: this.$route.query.groupLineTypeName,
        groupTime: '',
        groupNum: this.$route.query.teamNo,
        SourceCityName: '长沙',
        Comment: '',
        form2: {
          CustomerId: '',
          LinkMan: '',
          LinkMobile: '',
          LinkQQ: '',
          LinkEmail: '',
          ContractNo: '',
          ContractId: 0,
          orderDate: '',

        },
        rules2:{
          CustomerId : [
            {type:'number',required: true,message:'您还没有选择客户名称', trigger: 'change'}
          ],
//          LinkMan : [
//            {required: true,message:'您还没有输入联系人', trigger: 'blur'}
//          ],
//          LinkMobile : [
//            {required: true,validator:checkPhone, trigger: 'blur'}
//          ],
//          LinkQQ : [
//            {required: true,validator:checkQQ, trigger: 'blur'}
//          ],
//          LinkEmail : [
//            {required: true,validator:checkEmail, trigger: 'blur'}
//          ],
          ContractNo : [
            {required: true,message:'您还没有输入合同号', trigger: 'blur'}
          ],
          orderDate: [
            {required: true,validator:checkOrderDate, trigger: 'blur'}
          ]
        },
        options4: [],
        list: [
        ],
        loading: false,
        form3: {
          FirstLinkMan: '',
          pFirstLinkPhonehone: '',
          FirstLinkGender:1,
          CustomerSource: ''
        },
        rules3:{
          FirstLinkMan : [
            {required: true,message:'您还没有输入联系人', trigger: 'blur'}
          ],
          FirstLinkPhone : [
            {required: true,validator:checkPhone, trigger: 'blur'}
          ],
          CustomerSource:[
            {required: true,message:'您还没有选择出发地', trigger: 'change'}
          ]
        },
        table1: [
          {
            priceName: '成人价',
            priceTypeName: '成人',
            GuestType: 1,
            PriceType: 6,
            retailPrice: 0,
            Quantiy:'',
            Amount:''
          },
          {
            priceName: '老人价',
            priceTypeName: '老人',
            GuestType: 2,
            PriceType: 6,
            retailPrice:0,
            Quantiy: '',
            Amount:''
          },
          {
            priceName: '儿童价',
            priceTypeName: '儿童',
            PriceType: 6,
            GuestType: 3,
            retailPrice: 0,
            Quantiy: '',
            Amount:''
          },
          {
            priceName: '婴儿价',
            priceTypeName: '婴儿',
            PriceType: 6,
            GuestType: 4,
            retailPrice: 0,
            Quantiy: '',
            Amount:''
          }
        ],
        table2: [
          {
            AdditionalName: '',
            UnitPrice: 0,
            Quantity: 0,
            Comment:'',
            Amount:''
          }
        ],
        table3: [
          {
            GuestType: '',
            GuestGender: '',
            GuestName: '',
            CertificateType: '',
            IDCardNO: '',
            Birthday: '',
            MobilePhone: '',
            GatherLocation: ''
          }
        ]
      }
    },
    computed:{
      tableData1() {
        var interiorArr = [];
        this.table1.map((v,i)=>{
          v.Amount=v.retailPrice*v.Quantiy;
          interiorArr[i] = v.Amount;
          this.interiorAmount = interiorArr.reduce((prev, curr)=>{
            const value = Number(curr);
               if (!isNaN(value)) {
                 return prev + curr;
               } else {
                 this.$message.error('请输入数字');
               }
             })
          });
        return this.table1
      },
      tableData2(){
        var additionArr =[];
        this.table2.map((v,i)=>{
          v.Amount = v.UnitPrice*v.Quantity;
          additionArr[i] = v.Amount;
          this.additionAmount = additionArr.reduce((prev, curr)=>{
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              this.$message.error('请输入数字');
            }
          })
        });
        return this.table2
      },
      aggregateAmount:function(){
        return Number(this.additionAmount) + Number(this.interiorAmount) - Number(this.DiscountAmount);
      }
    },
    mounted(){
      this.dateFormat();
      this.typeListFun();
      this.cardListFun();
    },
     watch:{
      table3:{
         handler:function (newVal) {
          newVal.forEach((item,index)=>{
            if(item.CertificateType == 1 && item.IDCardNO.length == 18){
              let yyyy = item.IDCardNO.substring(6, 10);
              let mm = item.IDCardNO.substring(10, 12);
              let dd = item.IDCardNO.substring(12, 14);
              item.Birthday = yyyy +'-'+ mm +'-'+ dd
            }
          })
         },
        deep:true
       }
    },
    methods: {
       getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item=> Number(item[column.property]));
          sums[3] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        })
        return sums
      },
      goBack(){
        this.$router.go(-1);
      },
      getLinkMessage(val){
        this.groupHttp.post('/Customers/GetCustomerOrder', {DisCompanyInfoId: val}).then(res => {
          this.form2.LinkMan = res.data.contanct
          this.form2.LinkMobile = res.data.mobilePhone
          this.form2.LinkEmail = res.data.mailbox
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.groupHttp.post('/Customers/GetCustomerList',{CustomerName:query}).then(res=>{
            if(res.data.isSuccess == true){
              this.list = res.data.objects;
              this.loading = false;
              this.options4 = this.list.filter(item => {
                return item.name.indexOf(query) > -1;
              });
            }
          })
        } else {
          this.options4 = [];
        }
      },
      onSubmit(form2, form3, type) {
        let isValidate = true;
        this.table3.forEach((item,index)=>{
             if(item.GuestName != ''){
                 //循环看 如果有输入姓名
                 
                 if(item.GuestType == ''){
                      this.$message({type:'info',message:'请选择类型'});
                      isValidate = false;
                      return;
                 }else{
                   console.log(item.GuestType);
                    if(item.GuestType != '3' && item.GuestType != '4'){
                        if(item.CertificateType == ''){
                              this.$message({type:'info',message:'请选择证件类型'});
                              isValidate = false;
                              return;
                        }else{
                          isValidate = true;
                        }
                        if(item.IDCardNO == ''){
                              this.$message({type:'info',message:'请输入证件号码'});
                              isValidate = false;
                              return;
                        }else{
                          isValidate = true;
                        }
                    }else{
                      if(item.GuestType == '3' || item.GuestType == '4'){
                          item.CertificateType = '身份证';
                      }
                         isValidate = true;
                    }
                 }
                 if(item.GuestGender == ''){
                      this.$message({type:'info',message:'请选择性别'});
                      isValidate = false;
                      return;
                 }else{
                   isValidate = true;
                 }
             }else{
                 //如果没有输入姓名
                 if(item.CertificateType != '' || item.GuestGender != '' || item.GuestType != '' || item.IDCardNO != ''){
                    isValidate = false;
                    this.$message({type:'info',message:'请输入姓名'});
                    return;
                 }else{
                    isValidate = true;
                 }
             }   
          })
           if(isValidate){
          var obj = {};
          obj.ProductId = this.ProductId;
          obj.DepartureDate = this.groupTime;
          obj.SourceCityName = this.SourceCityName;
          obj.AdditionalAmount = this.additionAmount;
          obj.DiscountAmount = this.DiscountAmount;
          obj.Amount = this.aggregateAmount;
          obj.CustomerId = this.form2.CustomerId;
           this.options4.forEach((item) => {
          if (item.disCompanyInfoId == this.form2.CustomerId) {
            obj.CustomerName = item.customerName
          }
        })
          obj.orderDate = this.form2.orderDate;
          obj.LinkMan = this.form2.LinkMan;
          obj.LinkMobile = this.form2.LinkMobile;
          obj.LinkQQ = this.form2.LinkQQ;
          obj.LinkEmail = this.form2.LinkEmail;
          obj.ContractNo = this.form2.ContractNo;
          obj.ContractId = this.form2.ContractId;
          obj.FirstLinkMan = 1234;
          obj.FirstLinkPhone = this.form3.FirstLinkPhone;
          obj.FirstLinkGender = this.form3.FirstLinkGender;
          obj.CustomerSource = this.form3.CustomerSource;
          obj.Comment = this.Comment;
          obj.PositionList = this.table1;
          obj.AdditionalList = this.table2;
           this.table3.forEach((item,index)=>{
              for(let k in item){
                 if(item[k] != ''){
                   obj.GuestList = this.table3;
                 }
              }
          })
          this.$refs['form2'].validate((valid) => {
            if(valid){
              this.$refs['form3'].validate((valid) => {
                if(valid){
                   if(this.interiorAmount == 0){
                    this.$message.error("合计报名人数不能为0")
                  }else{
                     if (type == "payment") {
                      this.submitLoading2 = true;
                    } else {
                      this.submitLoading1 = true;
                    }
                    this.groupHttp.post('/GroupLine/CreateGroupLineOrder',{IsAddCustomer:this.IsAddCustomer,Dto:obj}).
                    then(res=>{
                      if(res.data.isSuccess == true){
                        this.$message({
                          type:'success',
                          message:'下单成功'
                        })
                        if (type == "payment") {
                          this.submitLoading2 = false;
                          let arr = [];
                          arr.push(res.data.settlementId);
                          this.$router.push({
                            path: "/grouptour/orderReceivables",
                            query: { settlementIds: arr,cusSettleClientId: res.data.customerSettlementClientId },
                          });
                        } else {
                          this.submitLoading1 = false;
                          this.$router.push({ path: "/grouptour/orderList" });
                        }
                      }else{
                        this.$message.error('出错了:'+res.data.message);
                        setTimeout(()=>{
                           if (type == "payment") {
                            this.submitLoading2 = false;
                          } else {
                            this.submitLoading1 = false;
                          }
                        },3000)
                      }
                    }).catch(e=>{
                      this.$message.error(e)
                      setTimeout(()=>{
                        if (type == "payment") {
                          this.submitLoading2 = false;
                        } else {
                          this.submitLoading1 = false;
                        }
                      },500)
                    })
                  }
                }else{
                  this.$message.error('您的预订信息还没有完善')
                }
              })
            }else{
              this.$message.error('您的客户信息还没有完善')
            }
          });
           }
      },
      addTr() {
        this.table2.push({
          AdditionalName: '',
          UnitPrice: 0,
          Quantity: 0,
          Comment: '',
          Amount: ''
        })
      },
      discounts(val){
        var reg = /^([1-9]*[1-9][0-9]*|[0]{1,1})$/;
        if(reg.test(val) || ''){
           this.DiscountAmount = Number(val);
        }else{
          this.$message.error('请输入正整数')
        }
      },
      //添加行
      addTr1(){
        this.table3.push({
          GuestType: '',
          GuestGender: '',
          GuestName: '',
          CertificateType: '',
          IDCardNO: '',
          Birthday: '',
          MobilePhone: '',
          GatherLocation: ''
        })
      },
      //删除行
      handleDelete1(index, row) {
        this.table2.splice(index, 1)
      },
      handleDelete2(index, row) {
        this.table3.splice(index, 1)
      },
      typeListFun(){
        this.groupHttp.post('/GroupLine/GeEnumGuestTypeList').then(res => {
          this.typeList = res.data.keyValueList
        }).catch(e => {
          console.log(e)
        })
      },
      cardListFun(){
        this.groupHttp.post('/GroupLine/GeEnumCardList').then(res => {
          this.cardList = res.data.keyValueList
        }).catch(e => {
          console.log(e)
        })
      },
      //日期格式
      dateFormat(){
        var time = new Date(this.$route.query.teamDate);
        this.groupTime = dateFmt(time, 'yyyy-MM-dd')
      },
      //出发地
      clientSiteFun(open, close){
        if (open) {
          this.groupHttp.post('/GroupLine/GetCustomerSource', {
            TeamDate: this.groupTime,
            lineId: this.lineId
          }).then(res => {
            this.clientSite = res.data.keyValueList
          }).catch(e => {
            console.log(e)
          })
        }
      },
      seleSite(val){
        this.ProductId = val;
        this.groupHttp.post('/GroupLine/GetProductPrice', {TeamDate: this.groupTime, ProductId: val}).then(res => {
          let data = res.data.priceList;
          data.forEach(function (item) {
            if (item.priceType == 6) {
              this.table1[0].retailPrice = item.price;
              this.table1[1].retailPrice = item.oldPrice;
              this.table1[2].retailPrice = item.childPrice;
              this.table1[3].retailPrice = item.babyPrice;
            }
          }.bind(this))
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>
<style scoped lang="scss">

  #form3 .el-form-item {
    width: 40%;
    float: left;
  }

  .text1 {
    width: 100px;
    text-align: right;
    padding-right: 10px;
  }

  .form-inline-input {
    width: 40%;
    float: left;
  }

  .form-inline-input .el-input {
    width: 70%;
    margin-right: 5%;
  }

  #form2::after, #form3::after {
    clear: both;
    content: '.';
    display: block;
    width: 0;
    height: 0;
  }

  .el-row {
    margin: 5px 0 15px 0;
    padding-left: 10px;
  }

  .el-col {
    padding-right: 25px;
  }

  .but_marginbom {
    margin-bottom: 10px;
  }
  .form-inline-input .el-input{
    width: 200px;
  }
</style>
