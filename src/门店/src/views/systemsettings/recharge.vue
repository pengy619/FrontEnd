<template>
  <div class="view">
    <el-form ref="recharge" status-icon :rules="rules" :model="recharge" label-width="100px" id='informataion'>
      <el-form-item label="充值账号" >
        <!-- <el-input v-model="recharge.createByName" placeholder="自动带入（门店主登陆账号）" disabled size="small" ></el-input>  -->
        <label >{{recharge.createByName}}</label>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input v-model="recharge.unitName" size="small" class="input_comm"  @change="changeTips" :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model="recharge.amount" size="small" class="input_comm"  @change="changeTips"></el-input>
      </el-form-item>
      <el-form-item label="充值方式" prop="rechargeWayId">
        <el-select v-model="recharge.rechargeWayId" size="small" @change="changeTips"  placeholder="请选择充值方式">
          <el-option v-for="item in voucherwayobj" :key="item.id" :label="item.rechargeWayName" :value="item.id"></el-option>
        </el-select>
        <el-checkbox v-model="isShowBank" class="margin_left">是否选择银行</el-checkbox>
        <div class="danger">
          {{rechargeWayTips}}          
        </div>
      </el-form-item>
      <el-form-item label="交易时间" size="small" prop="transactionDate">
          <el-date-picker v-model="recharge.transactionDate" type="date" placeholder="选择日期" :picker-options='pickerOptions'></el-date-picker>
      </el-form-item>
      <el-form-item label="选择银行" v-if="isShowBank" prop="transactionType" ref="" >
        <el-select v-model="recharge.transactionType" size="small"   placeholder="请选择银行">
          <el-option v-for="(item,index) in vouvherbanknumobj" :key="index" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="银行账号"  v-if="isShowBank"  prop="bankName" class="form-inline-input">
          <el-input v-model="recharge.bankName" size="small" ></el-input>
      </el-form-item> -->
      <el-form-item v-if="recharge.IsActive " label="四联单号" prop="documentNo" >
        <el-input v-model="recharge.documentNo" size="small" ></el-input>
      </el-form-item>
      <el-form-item label="充值附件" prop="attachment" size="small" >
        <el-upload class="upload-demo"
                   action="/attachment/upload"
                   :http-request="attchementUPload"
                   :on-success="handSuccess"
                   :before-upload="beforeAvatarUpload"
                   multiple
                   :limit="1"
                   :file-list="fileList">
          <el-button size="small" type="primary">点击上传附件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="recharge.executeDesc" size="small" style="width:40%"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="2" :offset="3">
            <el-button type="primary" size="small" @click="uptheinfo('recharge')" :loading="loading">提交</el-button>
          </el-col>
          <el-col :span="2"> <el-button size="small" type="info" @click="channelrecharge">取消</el-button></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="温馨提示" v-if="warnInfo.isActive">
        <span class="danger">
          {{warnInfo.value}}
        </span>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { dateFmt } from "@/utils/tools.js";
  export default {
    data() {
      let moneyvalidator = (rule, value, callback) => {
        let reg = /^\d+(?:\.\d{1,2})?$/;
        if (!value) {
          callback(new Error("金额不能为空"));
        } else if (!reg.test(value)) {
          callback(new Error("金额必须为正数，且仅保留两位小数"));
        } else {
          callback();
        }
      }
      var checkFeeDate = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请选择充值时间"));
        } else {
          callback();
        }
      };
      let checkDocumentNo = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入唯一四联单号'));
        } else if (value.length > 50) {
          callback(new Error("最多输入50位"));
          //   if(value.length > 50){
          //       callback(new Error("最多输入50位"));
          //   }
          //   if(isNaN(value)){
          //       callback(new Error("只能输入数字"));
          //   }
        } else if (isNaN(value)) {
          callback(new Error("只能输入数字"));
        } else {
          callback();
        }

      }
      return {
         pickerOptions:{
          disabledDate:(date) => {
              return  date.getTime() > Date.now();
          }
        },
        warnInfo:{},
        loading:false,
        isShowBank: false,
        recharge: {//这里的几个参数都是必须要填写的，验证必须全部加上不能为空
          unitName:'',
          transactionDate:'',
          transactionType: "",//充值类型
          createByName: "",//充值账号
          bankAccountNo: '',//银行账号
          amount: '',//充值金额
          method: 1,//充值方式
          bankName: '',//银行名称
          //fee:'',//税金
          attachment: '',//附件路径
          executeDesc: '',//备注
          documentNo: '',//四联单
          IsActive: true,
          rechargeWayId: '', //充值方式id
          rechargeWayName: '' //充值方式名称
        },
        voucherwayobj: [],//充值方式-远程获取
        vouvherbanknumobj: [],//充值类型-远程获取
        fileList: [],//文件列表
        rechargeWayTips:'',
        // linshivouchertype:["微信","支付宝","银联"]
        rules: {
          transactionDate: [{ required: true, validator: checkFeeDate, trigger: "change" }],
          transactionType: [{ required: true, message: '请选择银行', type: 'number', trigger: 'change' }],
          //bankAccountNo:[{ required:true, message:'请输入充值账号', trigger:'change' }],
          amount: [{ required: true, validator: moneyvalidator, trigger: 'blur' }],
          method: [{ required: true, message: "请选择充值方式", type: 'number', trigger: 'blur' }],
          bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
          executeDesc:[{ required: true, message: '请输入备注', trigger: 'blur' }],
          //fee: [{ required: true, message: '请输入税金', trigger: 'blur' }],
          attachment: [{ required: true, message: '请上传附件', trigger: "change" }],
          documentNo: [{ required: true, validator: checkDocumentNo, trigger: 'blur' }],
          rechargeWayId: [{ required: true, message: '请选择充值方式', type: 'number', trigger: 'change' }]
        }
      }
    },
    methods: {///http://120.76.20.11:8004/attachment/upload上传文件用
      uptheinfo(formrecharge) {
        var _this = this;
        this.$refs[formrecharge].validate((valid) => {
          if (valid) {
            _this.loading = true;
            _this.recharge.rechargeWayName = _this.voucherwayobj.find(c => c.id == _this.recharge.rechargeWayId).rechargeWayName;   
            //拿到的是 银行键值，，需通过数据转换
            let bankObj = _this.vouvherbanknumobj;
            let bankObjlength = _this.vouvherbanknumobj.length;
            for (let i = 0; i < bankObjlength; i++) {
              if (bankObj[i].key == _this.recharge.transactionType) {
                //如果选中的值 与 原数据中的值相等 则分割字符串 分别赋值
                let bankobj_value = bankObj[i].value;
                _this.recharge.bankAccountNo = bankobj_value.substring(bankobj_value.indexOf("-") + 1, bankobj_value.length);
                _this.recharge.bankName = bankobj_value.substring(0, bankobj_value.lastIndexOf("-"));
              }
            }
            _this.shopHttp.post('/Finance/AddFinTransactionRecord', {
              transactionType: 1,//这个写死
              //createByName:_this.recharge.createByName,
              UnitName:_this.recharge.unitName,
              TransactionDate:_this.recharge.transactionDate,
              bankAccountNo: _this.recharge.bankAccountNo,
              amount: _this.recharge.amount,
              method: _this.recharge.method,
              bankName: _this.recharge.bankName,
              attachment: _this.recharge.attachment,
              executeDesc: _this.recharge.executeDesc,
              IsActive: _this.recharge.IsActive,
              rechargeWayId: _this.recharge.rechargeWayId,
              rechargeWayName: _this.recharge.rechargeWayName
            }).then(function (res) {
              // console.log(res);
              if (res.data.isSuccess) {
                _this.loading = false;
                _this.$router.push({ path: '/systemsettings/rechargelist' });
              } else {
                _this.loading = false;
                _this.$message("后台服务器错误");
              }
            }).catch(function (error) {
              console.log(error);
            });
          } else {
            return false;
          }
        })

      },
      channelrecharge() {
        this.$router.go(-1);
      },
      getVoucherway() {
        var _this = this;
        this.shopHttp.post("/Finance/GetRechargeWay", {}).then(function (res) {
            _this.voucherwayobj = res.data;
        }).catch(function (er) {
          console.log("充值页面获取充值方式错误提示:" + er);
        });
      },
      getVouchertype() {//获取充值银行/Finance/GetFinTransactionType
        var _this = this;
        this.shopHttp.post("/Finance/GetFinBankAccountSeletList", {}).then(function (res) {
          //console.log(res);
          if (res.data.isSuccess) {
            _this.vouvherbanknumobj = res.data.objects;
          }
        }).catch(function (err) {
          console.log("充值页面获取充值类型错误提示:" + er);
        });
      },
      getAccountName() {
        //获取充值账号
        var _this = this;
        _this.shopHttp.get("/Finance/GetAccountName").then(res => {
          // console.log(res);
          _this.recharge.createByName = res.data;
        }).catch(err => {
          console.log(err);
        })
      },
      //文件上传用
      handSuccess(file) {
        console.log(file);
      },
      attchementUPload(val) {
        var _this = this;
        var f = new FormData();
        f.append('FileData', val.file);
        f.append('Category', "AirTicket");
        f.append('thumbnail', true);
        f.append('Folder', 'Airline');
        this.fileUpload.post(val.action, f).then(function (res) {
          // console.log("上传图片----------------------------");
          //console.log("文件上传成功"+res.data.Url);
          _this.recharge.attachment = res.data.Url;
        }).catch(function (err) {
          console.log(err);
        })
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //是否启用四联单
      getIsActive() {
        var _this = this;
        this.shopHttp.get('/SystemSetting/GetEnableQuaterForm').then(res => {
          //console.log(res);
          _this.recharge.IsActive = res.data.isActive;
        })
      },
      //选择充值方式改变提示信息
      changeTips() {
        if (this.recharge.amount) {
          let rechargeWayInfo = this.voucherwayobj.find(c => c.id == this.recharge.rechargeWayId);
          let cutFee = ((rechargeWayInfo.fees / 1000) * this.recharge.amount).toFixed(2);
          let lastCutFee = (Number(cutFee) > Number(rechargeWayInfo.maxFees) && rechargeWayInfo.isLimit)? rechargeWayInfo.maxFees : cutFee;
          let str = '当前充值手续费' + rechargeWayInfo.fees + '‰，扣除' + lastCutFee
            + '，实际到账￥' + (Number(this.recharge.amount) - Number(lastCutFee)).toFixed(2);
          this.rechargeWayTips = str;
        }
        
      },
      getPromptText(){
		let companyType=localStorage.getItem('companyType');
        this.shopHttp.get('SystemSetting/GetRechargeTips').then(res => {
          this.warnInfo=res.data;
        })
      }
    },
    mounted: function () {
      this.recharge.transactionDate = dateFmt(new Date(), "yyyy-MM-dd");
		  this.getPromptText()
      this.getVoucherway();
      this.getVouchertype();
      this.getAccountName();
      this.getIsActive();
    }

  }
</script>

<style>

</style>

