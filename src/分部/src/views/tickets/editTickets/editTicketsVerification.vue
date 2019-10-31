<template>
  <div class="view">
    <el-form :model="verifyForm" :rules="rules" ref="verifyForm" label-width="120px" class="demo-verifyForm" size="small">
      <el-form-item label="入园地址" prop="ryAddress">
        <el-input v-model="verifyForm.ryAddress"></el-input>
      </el-form-item>
      <el-form-item label="取票地址" prop="qpAddress">
        <el-input v-model="verifyForm.qpAddress"></el-input>
      </el-form-item>
      <el-form-item label="游客入园设置" prop="rySet">
        <el-input v-model="verifyForm.rySet"></el-input>
      </el-form-item>
      <el-form-item label="订单自动完成" prop="order">
        <el-radio-group v-model="verifyForm.order">
          <el-radio label="1">订单过了有效日期自动设置为完成状态</el-radio>
          <el-radio label="2">必须人工验证订单才能为完成状态</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="应到未处理" prop="dispose">
        <el-radio-group v-model="verifyForm.dispose">
          <el-radio label="1">系统自动按照分销价退款到分销商</el-radio>
          <el-radio label="2">人工做退改处理</el-radio>
        </el-radio-group>
        <p class="margin_0px">(对于在线支付产品在实际到达数量少于预订数量时有效)</p>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('verifyForm')">上一步</el-button>
        <el-button type="primary" @click="submitForm('verifyForm')">保存，下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .el-input{
    width: 300px;
  }
</style>
<script>
  export default {
    data() {
      return {
        verifyForm: {
          ryAddress: '',
          qpAddress: '',
          rySet: '',
          order: '',
          dispose: '',
        },
        rules: {
          ryAddress: [
            { required: true, message: '请输入入园地址', trigger: 'blur' }
          ],
          qpAddress: [
            { required: true, message: '请输入取票地址', trigger: 'blur' }
          ],
          rySet: [
            { required: true, message: '请输入入园设置', trigger: 'blur' }
          ],
          order: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          dispose: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
