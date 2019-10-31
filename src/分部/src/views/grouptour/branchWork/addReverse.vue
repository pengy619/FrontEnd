<template>
	<div class='view'>
		<div>
			<div >
				<h4>线路信息</h4>
			</div>
			<div>
				<el-row :gutter="20">
					<el-col :span="2" class="text1">线路名称</el-col>
					<el-col :span="15">{{routeName}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="2" class="text1">线路类型</el-col>
					<el-col :span="15">{{routeType}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="2" class="text1">团号</el-col>
					<el-col :span="15">{{watchword}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="2" class="text1">团期</el-col>
					<el-col :span="15">{{groupTime}}</el-col>
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
					<el-form-item class="form-inline-input">
						<el-button type="primary" @click="submitOrder" :loading = 'btn_loading'>确 定</el-button>
						<el-button @click="goBack">返 回</el-button>
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
      btn_loading : false,
      priceId:this.$route.params.message.dateDetailId,
      routeName: this.$route.params.message.fullName,
      routeType: this.$route.params.message.groupLineTypeName,
      watchword: this.$route.params.message.teamNo,
      lineId:this.$route.params.message.lineId,
      departureDate:this.$route.params.message.teamDate,
      groupTime: "",
      form: {
        quantity: "",
        account: "",
        purchaseDate: "",
        linkMan: "",
        linkPhone: "",
        comment: ""
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
//        account: [
//          { required: true, message: '预留账号不能为空', trigger: 'blur' },
//        ],
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
  methods: {
    submitOrder() {
      this.$refs['form'].validate((valid) => {
        if(valid){
          this.btn_loading = true;
          this.groupHttp
          .post("/GroupLine/CreateGroupLinePurchase", {
            ReservedStatus:0,
            FullName: this.routeName,
            quantity: this.form.quantity,
            account: this.form.account,
            purchaseDate: this.form.purchaseDate,
            linkMan: this.form.linkMan,
            linkPhone: this.form.linkPhone,
            comment: this.form.comment,
            priceId: this.priceId,
            lineId: this.lineId,
            DepartureDate:this.departureDate
          })
          .then(res => {
            if (res.data.isSuccess == true) {
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
              this.btn_loading = false;
              setTimeout(()=>{
                    this.$router.push({path:'/grouptour/reverseList'})
              },500)
            } else {
                this.$message.error(res.data.message)
                setTimeout(()=>{
                    this.btn_loading = false;
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
      let date = new Date(this.$route.params.message.teamDate);
      this.groupTime = dateFmt(date,"yyyy-MM-dd");
    },
    goBack(){
        this.$router.go(-1);
    }
  },
  mounted(){
    this.dateFormat();
  },
};
</script>
  <style scoped lang="scss">
  .view{
    padding:15px;
  }
  .text1 {
    width: 100px;
    text-align: right;
  }
  .el-row {
    margin: 5px 0 15px 0;
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
