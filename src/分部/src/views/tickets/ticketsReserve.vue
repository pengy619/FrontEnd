<template>
  <div class="view">
    <el-header>
      <el-steps :active="3" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="reserveForm" :rules="rules" ref="reserveForm" label-width="120px" class="demo-reserveForm"
             size="small">
      <el-form-item label="预订时间限制" prop="reserveDate">
        在提前天数当日要求在
        <el-time-picker
          v-model="reserveForm.reserveDate"
          placeholder="选择时间">
        </el-time-picker>
        分之前预订
      </el-form-item>
      <el-form-item label="生效时间限制" prop="startDate">
        必须在购票后
        <el-input v-model="reserveForm.startDate"></el-input>
        分钟后才能入园
        <p class="margin_0px">(对于在线支付产品在实际到达数量少于预订数量时有效)</p>
      </el-form-item>
      <el-form-item label="订单确认方式" prop="affirmMode">
        <el-radio-group v-model="reserveForm.affirmMode">
          <el-radio label="1">人工确认</el-radio>
          <el-radio label="2">自动确认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预订成功短信" prop="sendMode">
        <el-radio-group v-model="reserveForm.sendMode">
          <el-radio label="1">发送短信</el-radio>
          <el-radio label="2">不发送短信</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效期限制" prop="validityDate">
      <el-radio-group v-model="reserveForm.validityDate">
        <div class="margin_top_10px">
          <el-radio label="1">游客选定的游玩日期当天有效</el-radio>
        </div>
        <div class="margin_top_10px">
          <el-radio label="2">游客预订日期延后
            <el-input :disabled="reserveForm.validityDate != 2"></el-input>
            天有效
          </el-radio>
        </div>
        <div class="margin_top_10px">
          <el-radio label="3">截止到指定日期
            <el-input :disabled="reserveForm.validityDate != 3"></el-input>
            有效
          </el-radio>
        </div>
        <div class="margin_top_10px">
          <el-radio label="4">游客选定的游玩日期延后
            <el-input :disabled="reserveForm.validityDate != 4"></el-input>
            天有效
          </el-radio>
        </div>
      </el-radio-group>
    </el-form-item>
      <el-form-item label="客人资料要求" prop="dataRequire">
        <el-radio-group v-model="reserveForm.dataRequire">
          <div class="margin_top_10px">
            <el-radio label="1">要求输入每个客人资料</el-radio>
          </div>
          <div class="margin_top_10px">
            <el-radio label="2">只需要输入一个客人资料</el-radio>
          </div>
          <div class="margin_top_10px">
            <el-radio label="3">只需要联系人信息(选择了此项，下面的必填信息失效)
            </el-radio>
          </div>
          <div class="margin_top_10px">
            <el-radio label="4">每
              <el-input :disabled="reserveForm.dataRequire != 4"></el-input>
              位游客共享一个游客信息
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户必填信息" prop="customerInfo">
        <el-checkbox-group v-model="reserveForm.customerInfo">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('reserveForm')">上一步</el-button>
        <el-button type="primary" @click="submitForm('reserveForm')">保存，下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .el-input {
    width: 100px;
  }
  .view .el-date-editor.el-input,.view .el-date-editor input{
    width: 145px;
  }
</style>
<script>
  export default {
    data() {
      return {
        reserveForm: {
          reserveDate:'',
          startDate: '',
          affirmMode: '',
          sendMode: '',
          validityDate: '',
          dataRequire: '',
          customerInfo: []
        },
        rules: {
          reserveDate: [
            { type: 'date', required: true, message: '请输入时间', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请输入时间', trigger: 'blur'},
          ],
          affirmMode: [
            {required: true, message: '请选择确认方式', trigger: 'change'}
          ],
          sendMode: [
            {required: true, message: '请选择确认方式', trigger: 'change'}
          ],
          validityDate: [
            {required: true, message: '请选择有效期限制', trigger: 'change'}
          ],
          dataRequire: [
            {required: true, message: '请选择确认方式', trigger: 'change'}
          ],
          customerInfo: [
            {type: 'array', required: true, message: '请至少选择一个必填信息', trigger: 'change'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({path:'/Tickets/ticketsVerification'})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$router.go(-1)
      }
    }
  }
</script>
