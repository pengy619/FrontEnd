<template>
  <div class='view' v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="退款规则" prop="canrefund">
        <el-radio-group v-model="ruleForm.canrefund" @change = 'canrefundChange'>
          <el-radio :label="0" class="radio_width">不可退</el-radio>
          <el-radio :label="1" class="radio_width">可退</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="canrefunddays">
        <span class="span_color"  v-show='ruleForm.canrefund==1'>出团前<el-input size='small' class="width_100px" v-model = 'ruleForm.canrefunddays'></el-input>天可退</span>
      </el-form-item>
      <!-- <el-form-item class='height_20'>
      </el-form-item>
      <el-form-item label="" prop="pricerefund" v-show='ruleForm.canrefund==1' class='width_360'>
        <el-radio-group v-model="ruleForm.pricerefund" @change = 'pricerefundChange'>
          <el-radio :label="0" class="radio_width">全退</el-radio>
          <el-radio :label="1" class="radio_width">部分退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class='width_700' prop="pricerefundnum">
        <span class="span_color" v-show='ruleForm.pricerefund==1'>退商品金额<el-input size='small' class="width_100px" v-model = 'ruleForm.pricerefundnum'></el-input>%</span>
      </el-form-item>
      <el-form-item class='height_20'>
      </el-form-item> -->
      <el-form-item label="预定规则" prop="canreserve">
        <el-radio-group v-model="ruleForm.canreserve" @change = 'canreserveChange'>
          <el-radio :label="0" class="radio_width">不可预订</el-radio>
          <el-radio :label="1" class="radio_width">可预订</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="canreservedays">
        <span class="span_color" v-show='ruleForm.canreserve==1'>出团前<el-input size='small' class="width_100px" v-model = 'ruleForm.canreservedays'></el-input>天内不可预订</span>
      </el-form-item>
      <!-- <el-form-item class='height_20'>
      </el-form-item>
      <el-form-item label="" prop="pricereserve" v-show='ruleForm.canreserve==1' class='width_360'>
        <el-radio-group v-model="ruleForm.pricereserve" @change = 'pricereserveChange'>
          <el-radio :label="0" class="radio_width">不需交押金</el-radio>
          <el-radio :label="1" class="radio_width">需交押金</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class='width_700' prop="pricereservenum">
        <span class="span_color" v-show='ruleForm.pricereserve==1'>押金金额<el-input size='small' class="width_100px" v-model = 'ruleForm.pricereservenum'></el-input>元</span>
      </el-form-item> -->
      <el-form-item label="退款说明" prop="Tickets">
        <editor id='editor_id' height="260px" width="700px" :content="ruleForm.RefundDesc" uploadJson="/Home/UploadImage"
                pluginsPath="/static/kindeditor/plugins/"
                :allowFileManager="false"
                :loadStyleMode="false"
                @on-content-change="onContentChange"
        >
        </editor>
      </el-form-item>
    </el-form>
    <el-footer>
      <el-button type="primary" @click="submitForm('ruleForm','save',false)" size='small' :loading = 'btn_loading'>保存</el-button>
      <el-button type="primary" size='small' v-show='showSubmit' @click="submitForm('ruleForm','',false)" :loading = 'btn_loading'>保存并提交</el-button>
      <el-button @click="goBack" size='small'>返回</el-button>
    </el-footer>
  </div>
</template>

<script>
  export default {
    props:['status'],
    data() {
      var checkInt = (rules,value,callback) => {
        if(!value){
          callback(new Error('输入内容不能为空'))
        }else if((''+value).indexOf('.') >0 || !Number.isInteger(Number(value)) || value < 1){
          callback(new Error('输入内容只能正整数'));
        }else{
          callback()
        }
      }
      //可退款提前天数
      var checkCanrefunddays = (rules,value,callback) => {
        if(this.ruleForm.canrefund == 0){
          callback();
        }else if(!value){
          callback(new Error('天数不能为空'))
        }else if((''+value).indexOf('.') >0 || !Number.isInteger(Number(value)) || value < 1){
          callback(new Error('天数只能正整数'));
        }else{
          callback();
        }
      }
      //是否全退
      var checkPricerefund = (rules,value,callback) => {
        if(this.ruleForm.canrefund == 1 && this.ruleForm.pricerefund != 0 && this.ruleForm.pricerefund != 1){
          callback(new Error('您还没有选择退款方式'))
        }else{
          callback();
        }
      }
      //退款金额
      var checkPricerefundnum = (rules,value,callback) => {
        if(this.ruleForm.canrefund == 1 && this.ruleForm.pricerefund == 1){
          if(!value){
            callback(new Error('退款金额百分比不能为空'))
          }else if((''+value).indexOf('.') >0 || !Number.isInteger(Number(value)) || value < 1 || value >100){
            callback(new Error('退款金额只能1到100的正整数'));
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
      //可预订提前天数
      var checkCanreservedays = (rules,value,callback) => {
        if(this.ruleForm.canreserve == 0){
          callback();
        }else if(!value){
          callback(new Error('天数不能为空'))
        }else if((''+value).indexOf('.') >0 || !Number.isInteger(Number(value)) || value < 1){
          callback(new Error('天数只能正整数'));
        }else{
          callback();
        }
      }
      //是否需要押金
      var checkPricereserve = (rules,value,callback) => {
        if(this.ruleForm.canreserve == 1 && this.ruleForm.pricereserve != 0 && this.ruleForm.pricereserve != 1){
          callback(new Error('您还没有选择是否需要押金'))
        }else{
          callback();
        }
      }
      //押金金额
      var checkPricereservenum = (rules,value,callback) => {
        if(this.ruleForm.canreserve == 1 && this.ruleForm.pricereserve == 1){
          if(!value){
            callback(new Error('押金金额不能为空'))
          }else if((''+value).indexOf('.') >0 || !Number.isInteger(Number(value)) || value < 1){
            callback(new Error('押金金额只能正整数'));
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
      //文本框
      var checkTickets = (rules,value,callback) => {
        if(!this.ruleForm.RefundDesc){
          callback(new Error('说明信息不能为空'))
        }else{
          callback()
        }
      }
      //文本框
      return {
        showSubmit: false,
        btn_loading : false,
        fullscreenLoading:false,
        ruleForm:{
          canrefund:'',
          pricerefund:'',
          canreserve:'',
          pricereserve:'',
          canrefunddays:'',
          pricerefundnum:'',
          canreservedays:'',
          pricereservenum:'',
          RefundDesc:''

        },
        rules:{
          canrefund: [//是否可退
            {type:'number',required: true, message: '请至少选择一个退款规则', trigger: 'change' }
          ],
          canrefunddays: [//提前退款天数
            {required: true, validator: checkCanrefunddays, trigger: 'blur' }
          ],
          pricerefund: [//是否全退
            {type:'number',required: true, validator: checkPricerefund, trigger: 'change' }
          ],
          pricerefundnum: [//退款金额
            {required: true, validator: checkPricerefundnum, trigger: 'blur' }
          ],
          canreserve:[//是否可预订
            {type:'number',required: true,validator: true, message: '请至少选择一个预订规则', trigger: 'change' }
          ],
          canreservedays: [//提前预定天数
            {required: true, validator: checkCanreservedays, trigger: 'blur' }
          ],
          pricereserve: [//是否需要押金
            {type:'number',validator: checkPricereserve, trigger: 'change' }
          ],
          pricereservenum: [//押金金额
            {required: true, validator: checkPricereservenum, trigger: 'blur' }
          ],
//          Tickets:[
//            {required: true, validator: checkTickets, trigger: 'blur' }
//          ]
        }
      }
    },
    watch:{
      'status':function (val) {
        if (val == 'seven'){
          this.getRefundInfo();
        }
      }
    },
    mounted() {
      this.canSubmit();
    },
    methods: {
      canSubmit() {
        this.groupHttp
          .get("GroupLine/CanSubmit?lineId=" + this.$route.query.lineId)
          .then(res => {
            if (res.data.isSuccess == true) {
              this.showSubmit = res.data.canSubmit;
            }
          });
      },
      submit() {
        this.groupHttp
          .get("/GroupLine/Submit?lineId=" + this.$route.query.lineId)
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              setTimeout(() => {
                this.$router.push({ path: "/grouptour/RouteTable" });
              }, 500);
            }
          });
      },
      onContentChange(data){
        this.ruleForm.RefundDesc = data.value;
      },
      goBack(){
        this.$router.push({path: '/grouptour/RouteTable'})
      },
      getRefundInfo(){
          this.fullscreenLoading = true,
          this.groupHttp.get('GroupLine/GetRefundInfo?lineId='+this.$route.query.lineId).then(res=>{
              if(res.data.isSuccess == true){
                this.fullscreenLoading = false,
                this.ruleForm.RefundDesc = res.data.refundDesc
                this.ruleForm.pricerefund = res.data.dto.isAllRefund == false ? 1 : 0
                this.ruleForm.canrefund = res.data.dto.canRefund == true ? 1 : 0
                this.ruleForm.canreserve = Number(res.data.dto.canDestine)
                this.ruleForm.pricereserve = res.data.dto.hasDestineAmount == true ? 1 : 0
                this.ruleForm.canrefunddays = res.data.dto.refundDay
                this.ruleForm.pricerefundnum = res.data.dto.refundAmount
                this.ruleForm.canreservedays = res.data.dto.destineDay
                this.ruleForm.pricereservenum = res.data.dto.destineAmount 
              }else{
                this.fullscreenLoading = false;
              }

          })
      },
      //是否可退
      canrefundChange(){
        if(this.ruleForm.canrefund == 0){
          this.ruleForm.canrefunddays = '';
          this.ruleForm.pricerefundnum = '';
          this.ruleForm.pricerefund = 0;
          //清除验证消息
          this.$refs['ruleForm'].$children[1].clearValidate()
          this.$refs['ruleForm'].$children[3].clearValidate()
          this.$refs['ruleForm'].$children[4].clearValidate()
        }
      },
      //可退金额
      pricerefundChange(){
        if(this.ruleForm.canreserve == 0){
          this.ruleForm.pricerefundnum = '';
          //清除验证消息
          this.$refs['ruleForm'].$children[4].clearValidate();
        }
      },
      //能否预定
      canreserveChange(){
        if(this.ruleForm.canreserve == 0){
          this.ruleForm.canreservedays = '';
          this.ruleForm.pricereservenum = '';
          this.ruleForm.pricereserve = 0;
          //清除验证消息
          this.$refs['ruleForm'].$children[7].clearValidate()
          this.$refs['ruleForm'].$children[9].clearValidate()
          this.$refs['ruleForm'].$children[10].clearValidate()
        }
      },
      //是否需要定金
      pricereserveChange(){
        if(this.ruleForm.pricereserve == 0){
          this.ruleForm.pricereservenum = '';
          //清除验证消息
          this.$refs['ruleForm'].$children[10].clearValidate()
        }
      },
      submitForm(ruleForm, status, bool){
        this.$refs['ruleForm'].validate((valid) => {
          if(valid){
            //this.btn_loading = true;
            this.groupHttp.post("/GroupLine/SaveRefundInfo", {
              IsSave: bool,
              RefundDesc:this.ruleForm.RefundDesc,
              Dto:{
                LineId:this.$route.query.lineId,//2180
                CanRefund:this.ruleForm.canrefund == 1 ? true : false,
                RefundDay:this.ruleForm.canrefunddays,
                IsAllRefund:this.ruleForm.pricerefund == 0 ? true : false,
                RefundAmount:this.ruleForm.pricerefundnum,
                CanDestine:this.ruleForm.canreserve == 1 ? true : false,
                DestineDay:this.ruleForm.canreservedays,
                HasDestineAmount:this.ruleForm.pricereserve == 1 ? true : false,
                DestineAmount:this.ruleForm.pricereservenum
              }
            }).then(res => {
              if (res.data.isSuccess == true) {
                if (status == 'save') {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.btn_loading = false;
                  setTimeout(() => {
                    this.$router.push({ path: "/grouptour/RouteTable" });
                  }, 500);
                } else {
                  this.submit();
                }
              } else {
                this.$message.error(res.data.message)
                setTimeout(()=>{
                  this.btn_loading = false;
                },500)
              }
            }).catch(e => {
              console.log(e);
            })
          }
        });

      }
    }
  }
</script>

<style lang="scss" scoped>
  .width_360{
    width:360px;
    display:inline-block;
  }
  .width_700{
    display:inline-block;
    margin-left:-50px;
    width:700px;
  }
  .width_100px{
    width:100px;
    margin:0 10px;
  }
  .el-footer{
    margin-top: 30px;
    margin-left: 6%;
  }

  .el-input{
    display: inline
  }
  .height_20{
    width:100%;
    height:20px;
  }

</style>
