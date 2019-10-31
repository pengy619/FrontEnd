<template>
	<div class='view'>
		<div>
			<div >
				<h4>线路信息</h4>
			</div>
			<div>
				<el-row>
					<el-col class="text1">线路名称</el-col>
					<el-col :span="15">{{routeName}}</el-col>
				</el-row>
				<el-row>
					<el-col class="text1">线路类型</el-col>
					<el-col :span="5">{{routeType}}</el-col>
					<el-col class="text1">团号</el-col>
					<el-col :span="5">{{watchword}}</el-col>
				</el-row>
				<el-row>
					<el-col class="text1">团期</el-col>
					<el-col :span="15">{{teamDate}}</el-col>
				</el-row>
			</div>
		</div>
		<div>
			<div >
				<h4>预留信息</h4>
			</div>
			<div>
				<el-form ref="form" :model="form" label-width="100px" id="form2" size="small" :rules="rules">
					<el-form-item class="form-inline-input" label="预留数量" prop="quantity">
						<el-input v-model="form.quantity"></el-input>
					</el-form-item>
					<el-form-item class="form-inline-input" label="预留账号" prop="account">
						<el-input v-model="form.account"></el-input>
					</el-form-item>
					<el-form-item class="form-inline-input" label="预留时间" prop="purchaseDate">
            <el-date-picker
              v-model="form.purchaseDate"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="StartDisableDate"
              placeholder="选择日期">
            </el-date-picker>
					</el-form-item>
					<el-form-item class="form-inline-input" label="预留联系人" prop="linkMan">
						<el-input v-model="form.linkMan"></el-input>
					</el-form-item>
					<el-form-item class="form-inline-input" label="预留电话" prop="linkPhone">
						<el-input v-model="form.linkPhone"></el-input>
					</el-form-item>
					<el-form-item label="" class="form-inline-input">
						<el-input style="visibility:hidden;"></el-input>
					</el-form-item>
					<el-form-item label="预留说明" class="form-inline-input" style="width:80%;" prop="comment">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.comment"></el-input>
					</el-form-item>
					<el-form-item class="form-inline-input" style='width:100%;'>
						<el-button type="primary" @click="submitOrder" :loading='btn_loading' size='small' class='form-btn'>确 定</el-button>
						<el-button size = 'small' @click="channelBtn">取 消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
  import {dateFmt} from '@/utils/tools'
export default {
  data() {
    var checkInt = (rule,value,callback) => {
        if(!value){
          callback(new Error('预留数量不能为空'));
        }else if(!/^[^ ]+$/.test(value)){
          callback(new Error('预留数量不能含有空格'));
        }else if(value.indexOf('.') >0 || !Number.isInteger(Number(value))){
          callback(new Error('预留数量只能输入整数'));
        }else if(value == 0){
          callback(new Error('预留数量至少为1'))
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
          callback();
        }
      }
    var checkDate = (rule,value,callback) => {
        if(this.form.purchaseDate == ''){
          callback(new Error('您还没有选择预留日期'))
        }else{
          callback();
        }
      }
    return {
      btn_loading:false,
      priceId:this.$route.params.message ? this.$route.params.message.priceId : '',
      routeName: this.$route.params.message ? this.$route.params.message.fullName : '暂无线路名称(内蒙古-西藏-北京-哈尔滨)',
      routeType: this.$route.params.message ? this.$route.params.message.groupLineTypeName : '暂无线路类型',
      watchword: this.$route.params.message ? this.$route.params.message.teamNo : '暂无团号',
      lineId:this.$route.params.message ? this.$route.params.message.lineId : '',
      teamDate:this.$route.params.message ? this.$route.params.message.teamDate : '暂无团期',
      groupTime: "暂无",
      form: {
        ReservedStatus:0,
        quantity: "",
        account: "",
        departureDate: "",
        purchaseDate:'',
        linkMan: "",
        linkPhone: "",
        comment: "",
        PriceId:'',
        FullName:'',
        LineId:this.$route.params.lineid
      },
      StartDisableDate: {
        disabledDate: date => {
          return date.getTime() < Date.now()- 3600 * 1000 * 24;
        }
      },
      rules:{
        quantity: [
          { required: true, validator:checkInt, trigger: 'blur' },
        ],
        // account: [
        //   { required: true, message: '预留账号不能为空', trigger: 'blur' },
        // ],
        purchaseDate: [
          { required: true, validator: checkDate, trigger: 'blur' },
        ],
        linkMan: [
          { required: true, message: '预留联系人不能为空', trigger: 'blur' },
        ],
        linkPhone: [
          { required: true, validator: checkPhone, trigger: 'blur' },
        ],
        comment: [
          { required: true, message: '请输入说明信息', trigger: 'blur' },
        ],
      }
    }
  },
  mounted(){
    this.dateFormat();
    this.getGrouplineInformation();
  },
  methods: {
    GMTToStr(time){
            let date = new Date(time);
            let year = date.getFullYear();
            let mouth = (date.getMonth() + 1);
            mouth = (String(mouth).length == 1 ? 0 + '' + mouth : mouth);
            let day = date.getDate();
            day = (String(day).length == 1 ? 0 + '' + day  : day);
            // date.getHours() + ':' +
            // date.getMinutes() + ':' +
            // date.getSeconds()
            return year + '-' + mouth + '-' + day
        },
    submitOrder() {
      // console.log(this.$route.params.message)
      // return;
      var _this = this;
      var teamDate = this.teamDate.substring(0,10);
      var purchaseDate = this.GMTToStr(this.form.purchaseDate);
      _this.$refs['form'].validate((valid) => {
        if(valid){
          _this.shopHttp.post("/GroupLine/CreateGroupLinePurchase", _this.form).then(res => {
            //console.log(res);
            if (res.data.isSuccess == true) {
              _this.$message({
                type:'success',
                message:'新增预留单成功'
              })
              _this.btn_loading = false;
              setTimeout(()=>{
                    _this.$router.push({path:'/orderCenter/lineReservation'})
              },500)
            } else {
              _this.$message.error('出错了！' + res.data.message)
              setTimeout(() => {
                _this.btn_loading = false;
              },500)
            }
          })
          .catch(e => {
            console.log(e);
          });
        }
      })
    },
    dateFormat(){
      //let date = new Date(this.$route.params.message.teamDate);
      //this.groupTime = dateFmt(date,"yyyy-MM-dd");
    },
    getGrouplineInformation(){
         var _this = this;
         _this.form.PriceId = this.$route.params.DateDetailId;
         _this.form.LineId = this.$route.params.lineid;
         _this.form.departureDate = this.$route.params.DepartureDate;
         _this.shopHttp.get("/GroupLine/GetGroupLineInformation?GroupLineDateDetailId="+this.$route.params.DateDetailId).then(function(res){
             //console.log(res);
             if(res.data.isSuccess){
                 _this.routeName = res.data.fullName;//线路名称
                 _this.routeType = res.data.enumGroupLineType;//线路类型
                 _this.watchword = res.data.teamNo;//团号
                 _this.form.FullName = res.data.fullName;
                 let mdate = res.data.date;
                 let getdate = mdate!= null || mdate != "" ? mdate.substring(0,mdate.lastIndexOf("T")):"";
                 _this.teamDate = getdate;
             }else{
                _this.$message("服务器故障，获取线路详细信息失败");
             }
         }).catch(function(err){
              console.log(err);
              _this.$message("获取线路详细信息失败");
         });
    },
    channelBtn(){
      //取消按钮
       this.$router.go(-1);
    }
  }
};
</script>
  <style scoped lang="scss">
  h4{
    height: 40px;
    line-height:40px;
    padding-left:20px;
    color: #409EFF;
    border-bottom: 1px solid #409EFF;
    font-size: 14px;
  }
  .text1 {
    width:100px;
    text-align: right;
  }
  .el-row {
    margin: 20px 0 15px 0;
    padding-left: 10px;
  }
  .el-col {
    padding-right: 25px;
  }
  .form-inline-input {
    width: 40%;
    float: left;
    padding-right: 5%;
  }
  .form-btn{
    margin:10px 100px 10px 20%;
  }
  .form-inline-input .el-input {
    width: 200px;
    margin-right: 5%;
  }
  #form2::after {
    clear: both;
    content: ".";
    display: block;
    width: 0;
    height: 0;
  }
</style>
