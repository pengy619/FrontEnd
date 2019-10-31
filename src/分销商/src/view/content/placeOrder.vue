<template>
  <div class='view'>
    <div class='breadcrumb'>
      <span>您所在的位置 : </span><a href="#" class='normal'>云旅通首页</a> > <a href="#" class='normal'>线路预订</a> > <a href="#" class='active'>{{routeName}}</a>
    </div>
    <!-- <el-steps :active="1">
        <el-step title="填写订单" description=""></el-step>
        <el-step title="支付订单" description=""></el-step>
        <el-step title="预订成功" description=""></el-step>
    </el-steps> -->
    <div class='ylt-progress'>
      <ul class="clear">
        <li class="active">
          <p>1.填写订单</p>
        </li>
        <li>
          <p>2.支付订单</p>
        </li>
        <li>
          <p>3.预定成功</p>
        </li>
      </ul>
    </div>
    <div class='bg-white'>
      <div>
        <div class='h4-div'>
          <h4><span>线路信息</span></h4>
        </div>
        <div class='font-14'> 
          <el-row>
            <el-col :span="2" class="text1">线路名称</el-col>
            <el-col :span="16">{{routeName}}(线路编号：{{groupNum}})</el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="text1">出团日期</el-col>
            <el-col :span="16">{{groupTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="text1">线路类型</el-col>
            <el-col :span="16">{{routeType}}</el-col>
          </el-row>
        </div>
      </div>
      <!-- <div>
        <div>
          <h4>客户信息</h4>
        </div>
        <div>
          <el-form ref="form2" :model="form2" :rules='rules2' label-width="120px" id="form2" size="small">
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
                  :key="item.disCompanyInfoId"
                  :label="item.customerName"
                  :value="item.disCompanyInfoId">
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
              <el-select
                v-model="form2.ContractNo"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="searchContractNo"
                :loading="loading">
                <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单日期" class="form-inline-input" prop='orderDate'>
              <el-date-picker
                v-model="form2.orderDate"
                type="date"
                placeholder="选择日期"
                :picker-options="StartDisableDate"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
      <div>
        <div>
          <div class='h4-div'>
          <h4>
            <span>预订信息</span>
          </h4>
        </div>
        <div>
          <el-form ref="form3" :model="form3" :rules='rules3' label-width="120px" id="form3" size="small" class="padding_left">
            <el-form-item label="主要联系人" prop='FirstLinkMan'>
              <el-input v-model="form3.FirstLinkMan"></el-input>
            </el-form-item>
            <el-form-item label="主要联系人电话" prop='FirstLinkPhone'>
              <el-input v-model="form3.FirstLinkPhone"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form3.FirstLinkGender">
                <el-radio :label="1">先生</el-radio>
                <el-radio :label="2">女士</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="添加为游客">
              <el-radio-group v-model="IsAddCustomer">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出发地" prop='CustomerSource'>
              <el-select v-model="form3.CustomerSource" placeholder="请选择" @change="seleSite">
                <el-option
                  v-for="item in clientSite"
                  :key="item.key"
                  :label="item.name"
                  :value="Number(item.key)">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
          <div class='h4-div'>
            <h4>
              <span>附加表</span>
            </h4>
          </div>
          <div class='m-20'>
            <el-table :data="tableData1" border style="width: 100%;margin-bottom:20px;" show-summary  :summary-method="getSummaries">
              <el-table-column prop="priceName"
                              label="价格名称" align='center'
              >
              </el-table-column>
              <el-table-column prop="priceTypeName" align='center'
                              label="价格类型"> 
              </el-table-column>
              <el-table-column prop="retailPrice" align='center'
                              label="同行价">
              </el-table-column>
              <el-table-column align='center'
                label="人数" prop="Quantiy">
                <template slot-scope="scope">
                  <el-input-number size="small" v-model="scope.row.Quantiy" :min='0' :max='999999'></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class='h4-div'>
          <h4>
            <span>附加费用</span>
            <el-button type="warning" @click="addTr" class="but_marginbom" size='mini'>添加行</el-button></h4>
        </div>
        <div class='m-20'>
          <el-table :data="tableData2"
                    border align='center'
                    style="width: 100%" class="margin_bottom">
            <el-table-column prop="AdditionalName" align='center'
                            label="费用名">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.AdditionalName"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="UnitPrice" align='center'
                            label="价格">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.UnitPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" align='center'
                            label="数量">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.Quantity"></el-input>
              </template>
            </el-table-column> 
            <el-table-column prop="Comment" align='center'
                            label="说明">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.Comment"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Amount" align='center'
                            label="合计">
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDelete1(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class='p-l-40'>
            <span class="demonstration">同行价: </span> 
            <el-input style='width:15%;margin-right:20px;' size="small" v-model="interiorAmount" :disabled="true" ></el-input>
            <span class="demonstration">附加费: </span>
            <el-input style='width:15%;margin-right:20px;' size="small" v-model="additionAmount" :disabled="true"></el-input>
            <span class="demonstration">优惠: </span>
            <el-input style='width:15%;margin-right:20px;' size="small"  @change="discounts" v-model="DiscountAmount"></el-input>
            <span class="demonstration">总价: </span>
            <el-input style='width:15%;margin-right:20px;' size="small" :disabled="true" v-model="aggregateAmount"></el-input>
          </div>
        </div>
      </div>
      <div>
        <div class='h4-div'>
          <h4>
            <span>旅客信息</span>
            <el-button type="warning" @click="addTr1" class="but_marginbom" size="mini">添加行</el-button>
          </h4>
        </div>
        <div class="m-20">
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
            label="姓名" align='center'
            >
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.GuestName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="GuestType"
            label="类型" align='center'
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
            label="性别" align='center'
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
            label="手机号" align='center'
            >
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.MobilePhone"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="CertificateType"
            label="证件类型" align='center'
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
            label="证件号码" align='center'
            >
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.IDCardNO"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="Birthday"
            label="出生日期"
            width="150" align='center'
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.Birthday"
                type="date"
                :picker-options="EndDisableDate"
                placeholder="选择日期" size="small" class="date_width">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="GatherLocation"
            label="集合地点" align='center'
            >
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.GatherLocation"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作" align='center'
          >
            <template slot-scope="scope">
              <el-button @click="handleDelete2(scope.$index, scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      <div>
        <div class='h4-div'>
          <h4>
            <span>备注</span>
          </h4>
        </div>
        <div class="m-20">
          <el-input type="textarea" :rows="4" v-model="Comment"></el-input>
        </div>
        <div class='sub-div'>
          <el-button type="warning" @click="onSubmit('form2','form3')" :loading="submitLoading1" icon='el-icon-check'>确 定</el-button>
          <el-button type="warning" @click="onSubmit('form2','form3','payment')" :loading="submitLoading2" icon='el-icon-arrow-right'>去支付</el-button> 
          <el-button @click="goBack" icon='el-icon-close'>取 消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {dateFmt} from '@/utils/tools'
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
        StartDisableDate: {
          disabledDate: date => {
            return date.getTime() < Date.now()- 3600 * 1000 * 24;
          }
        },
        EndDisableDate: {
          disabledDate: date => {
            return date.getTime() > Date.now();
          }
        },
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
        ProductId:this.$route.query.productId || 1409,
        typeList: [],
        cardList: [],
        lineId: this.$route.query.lineId,
        
        routeName: this.$route.query.line_name,
        routeType: this.$route.query.line_type,
        groupTime: this.$route.query.team_date,
        groupNum: this.$route.query.line_code,
        teamNo:this.$route.query.teamNo,
        SourceCityName:'',
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
        list: [],
        options:[],
        contractList:[],
        loading: false,
        curPriceType:'',
        form3: {
          FirstLinkMan: '',
          pFirstLinkPhonehone: '',
          FirstLinkGender:1,
          CustomerSource:''
        },
        rules3:{
          FirstLinkMan : [
            {required: true,message:'您还没有输入联系人', trigger: 'blur'}
          ],
          FirstLinkPhone : [
            {required: true,validator:checkPhone, trigger: 'blur'}
          ],
          CustomerSource:[
            {type:'number',required: true,message:'您还没有选择出发地', trigger: 'change'}
          ]
        },
        table1: [
          {
            priceName: '成人价',
            priceTypeName: '成人',
            GuestType: 1,
            PriceType: 6,
            retailPrice: 0,
            Quantiy: this.$route.query.adult_num,
            Amount: ''
          },
          {
            priceName: '老人价',
            priceTypeName: '老人',
            GuestType: 2,
            PriceType: 6,
            retailPrice:0,
            Quantiy: this.$route.query.old_num,
            Amount: ''
          },
          {
            priceName: '儿童价',
            priceTypeName: '儿童',
            PriceType: 6,
            GuestType: 3,
            retailPrice: 0,
            Quantiy: this.$route.query.child_num,
            Amount: ''
          },
          {
            priceName: '婴儿价',
            priceTypeName: '婴儿',
            PriceType: 6,
            GuestType: 4,
            retailPrice: 0,
            Quantiy: this.$route.query.baby_num,
            Amount: ''
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
            GatherLocation: '',
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
          let amount = Number(v.Amount);
          if(!isNaN(amount)){
            additionArr[i] = v.Amount;
            this.additionAmount = additionArr.reduce((prev, curr)=>{
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                this.$message.error('请输入数字');
              }
            })
          }else{
            this.$message.error('请输入数字');
          }
        });
        return this.table2
      },
      aggregateAmount:function(){
        return Number(this.additionAmount) + Number(this.interiorAmount) - Number(this.DiscountAmount);
      }
    },
    mounted(){
      // this.dateFormat();
      this.typeListFun();
      this.cardListFun();
      this.getCurPriceType();
      this.seleSite();
      this.clientSiteFun();
      this.form2.orderDate = dateFmt(new Date(),"yyyy-MM-dd")
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
        console.log(this   )
        this.$router.go(-1);
      },
      getCurPriceType() {
        this.groupHttp.post("/GroupLine/GetCurPriceType").then(res => {
          if (res.status == 200) {
            console.log(res)
            this.curPriceType = res.data;
          }
        });
      },
      getLinkMessage(val){
        this.groupHttp.post('/Customers/GetCustomerOrder',{DisCompanyInfoId:val}).then(res=>{
            this.form2.LinkMan = res.data.contanct
            this.form2.LinkMobile = res.data.mobilePhone
            this.form2.LinkEmail = res.data.mailbox
        })
      },
      //客户搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.groupHttp.post('/Customers/GetCustomerDrop',{CustomerName:query}).then(res=>{
            if(res.data.isSuccess == true){
              this.list = res.data.objects;
              this.loading = false;
              this.options4 = this.list.filter(item => {
                return item.customerName.indexOf(query) > -1;
              });
            }
          })
        } else {
          this.options4 = [];
        }
      },
      //合同搜索
      searchContractNo(query){
        if (query !== '') {
          this.loading = true;
          this.groupHttp.get('Contract/GetAvailableContractNos?ContractNo='+query).then(res=>{
            if(res.data.isSuccess == true){
                console.log(res.data.objects)
              this.contractList = res.data.objects;
              this.loading = false;
              this.options = this.contractList.filter(item => {
                return item.indexOf(query) > -1;
              });
            }
          })
        } else {
          this.options = [];
        }
      },
      onSubmit(form2, form3, type) {
          console.log(this.table1)
          var obj = {};
          obj.ProductId = this.ProductId;
          obj.DepartureDate = this.groupTime;
          obj.SourceCityName = this.SourceCityName;
          obj.AdditionalAmount = this.additionAmount;
          obj.DiscountAmount = this.DiscountAmount;
          obj.Amount = this.aggregateAmount;
          // obj.CustomerId = this.form2.CustomerId;
          // this.options4.forEach((item)=>{
          //   if(item.disCompanyInfoId == this.form2.CustomerId){
          //     obj.CustomerName = item.customerName
          //   }
          // })
          // obj.orderDate = this.form2.orderDate;
          // obj.LinkMan = this.form2.LinkMan;
          // obj.LinkMobile = this.form2.LinkMobile;
          // obj.LinkQQ = this.form2.LinkQQ;
          // obj.LinkEmail = this.form2.LinkEmail;
          // obj.ContractNo = this.form2.ContractNo;
          // obj.ContractId = this.form2.ContractId;
          obj.FirstLinkMan = this.form3.FirstLinkMan;
          obj.FirstLinkPhone = this.form3.FirstLinkPhone;
          obj.FirstLinkGender = this.form3.FirstLinkGender;
          obj.CustomerSource = this.form3.CustomerSource;
          obj.TeamNo = this.teamNo,
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
          // this.$refs['form2'].validate((valid) => {
          //   if(valid){
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
                          // let arr = [];
                          // arr.push(res.data.settlementId);
                          //orderId
                          location.href="/GroupLineOrder/Index?oid=" + res.data.orderId 
                        } else {
                          this.submitLoading1 = false;
                          //this.$router.push({ path: "/GroupLineOrder/GetGroupLineOrderList" });
                          location.href="/GroupLineOrder/GetGroupLineOrderList"

                        }
                      }else{
                        this.$message.error('出错了:'+res.data.message);
                        setTimeout(()=>{
                          if (type == "payment") {
                            this.submitLoading2 = false;
                          } else {
                            this.submitLoading1 = false;
                          }
                        },500)
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
          //   }else{
          //     this.$message.error('您的客户信息还没有完善')
          //   }
          // })
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
        this.additionAmount = this.additionAmount - row.Amount
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
      // //日期格式
      // dateFormat(){
      //   var time = new Date(this.$route.params.message.dateTeamDate);
      //   this.groupTime = dateFmt(time, 'yyyy-MM-dd')
      // },
      //出发地
      clientSiteFun(){
          this.groupHttp.post('/GroupLine/GetCustomerSource', {
            TeamDate: this.groupTime,
            lineId: this.lineId
          }).then(res => {
            this.clientSite = res.data.keyValueList
          }).catch(e => {
            console.log(e)
          })
      },
      seleSite(val){
        this.clientSite.forEach((item, index) => {
          if (item.key == val) {
            this.SourceCityName = item.name;
          }
        });
        this.groupHttp.post('/GroupLine/GetProductPrice', {TeamDate: this.groupTime, ProductId: val}).then(res => {
          let data = res.data.priceList;
          data.forEach(function (item) {
            if (item.priceType == 5) {
              this.table1[0].retailPrice = item.price;
              this.table1[1].retailPrice = item.oldPrice;
              this.table1[2].retailPrice = item.childPrice;
              this.table1[3].retailPrice = item.babyPrice;
              this.table1[0].PriceType = this.curPriceType;
              this.table1[1].PriceType = this.curPriceType;
              this.table1[2].PriceType = this.curPriceType;
              this.table1[3].PriceType = this.curPriceType;
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
  @import "../../style/common.scss";
  .padding_left{
    padding-left: 115px;
  }
  .bg-white{
    background-color:#fff;
  }
  ul li{
    list-style: none;
  }
  .d-none{
    display:none;
  }
  .p-l-40{
    padding-left:40px;
  }
  .m-20{
    margin:0px 20px;
  }
  .ylt-progress {
    margin: 20px 0 90px 0;
    border-radius: 5px;
}
  .ylt-progress li {
    position: relative;
    height: 5px;
    width: 33.333%;
    background-color: #e2e2e2;
    float: left;
  }
  .ylt-progress li.active {
    background-color: #66cc66 !important;
  }
  .ylt-progress li:before {
    position: absolute;
    display: block;
    content: '';
    left: 50%;
    top: -6px;
    width: 8px;
    height: 8px;
    margin-left: -10px;
    background-color: #fff;
    border: 4px solid #e2e2e2;
    border-radius: 100%;
  }
  .ylt-progress li.active:before {
    border-color: #66cc66 !important;
}
  .ylt-progress li p {
    text-align: center;
    margin-top: 15px;
    line-height: 1.6;
    font-size: 14px;
  }
  .ylt-progress li.active p {
    color: #66cc66 !important;
  }
  .breadcrumb{
    margin-bottom:35px;
    font-size:14px;
  }
  .breadcrumb a{
    text-decoration:none;
    color:#727272;
    font-size: 12px;
  }
  .breadcrumb a.active{
    color:#ff8800;
  }
  .breadcrumb a:hover{
    color:#ff8800;
    cursor:pointer;
  }
  #form3 .el-form-item {
    width: 40%;
    float: left;
  }
  .font-14 .el-row .el-col{
    font-size:14px;
  }
  .text1 {
    width: 200px;
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
  .h4-div{
    margin-bottom:35px;
  }
  .h4-div h4{
    width:100%;
    height:39px;
    color:#48c8f7;
    line-height:39px;
    border-bottom:1px solid #e5e5e5;
    margin-right:10px;
    margin-bottom:-2px;
  }
  .h4-div h4 span{
    display:inline-block;
    width:86px;
    color:#48c8f7;
    border-bottom:2px solid #48c8f7;
    text-align:center;
    margin-right:15px;
  }
  .el-row { 
    margin: 5px 0 15px 0;
    padding-left: 10px;
  }

  .el-col {
    margin-right:25px;
  }

  .but_marginbom {
    margin-bottom: 10px;
  }
  .el-form .el-input{
    width: 200px;
  }
  .el-form-item__content .el-select.el-select--small{
    width:200px!important;
  }
  .sub-div{
    height:60px;
    margin:20px 0;
    text-align: center;
  }
</style>
