<template>
  <div class="view">
    <el-form :model="marketForm" :rules="rules" ref="marketForm" label-width="120px" class="demo-marketForm"
             size="small">
      <el-form-item label="销售范围" prop="scope">
        <el-checkbox-group v-model="marketForm.scope">
          <el-checkbox label="1" name="type">同行</el-checkbox>
          <el-checkbox label="2" name="type">直客</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-radio-group v-model="marketForm.payType">
          <el-radio label="1">在线支付</el-radio>
          <el-radio label="2">景点支付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="团票设置" prop="setTicket">
        <el-radio-group v-model="marketForm.setTicket">
          <el-radio label="1">无团队票</el-radio>
          <el-radio label="2">有团队票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品总数量" prop="allAmount">
        <el-input v-model="marketForm.allAmount"></el-input>
        <p class="margin_0px">“0”表示不限量，销售完毕(在价格规则定义的时间范围内)系统会自动将产品下架。</p>
      </el-form-item>
      <el-form-item label="每单最多可购买" prop="buyAmount">
        <el-input v-model="marketForm.buyAmount"></el-input>
        <p class="margin_0px">“0”表示不限量</p>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="购买年龄限制" prop="ageStart">
            <el-input v-model="marketForm.ageStart" class="width_100"></el-input>
            岁到
            <p class="margin_0px" style="width: 300px">“0”表示不限制(必选录入身份才会起效)</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="ageEnd" label-width="-30px">
            <el-input v-model="marketForm.ageEnd" class="width_100"></el-input>
            岁
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="手机号限制" prop="telStart">
            <el-input v-model="marketForm.telStart" class="width_100"></el-input>
            天内购买
            <p class="margin_0px">“0”表示不限量</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="telEnd" label-width="0px">
            <el-input v-model="marketForm.telEnd" class="width_100"></el-input>
            张
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="身份证限制" prop="IDStart">
            <el-input v-model="marketForm.IDStart" class="width_100"></el-input>
            天内购买
            <p class="margin_0px">“0”表示不限量</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="IDEnd" label-width="0px">
            <el-input v-model="marketForm.IDEnd" class="width_100"></el-input>
            张
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="resetForm('marketForm')">上一步</el-button>
        <el-button type="primary" @click="submitForm('marketForm')">保存,下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .el-input {
    width: 200px;
  }

  .width_100.el-input {
    width: 100px;
  }

  .el-col.el-col-5 {
    width: 285px;
  }
</style>
<script>
  export default {
    data() {
      return {
        marketForm: {
          scope: [],
          payType: '',
          setTicket: '',
          allAmount: '',
          buyAmount: '',
          ageStart: '',
          ageEnd: '',
          telStart: '',
          telEnd: '',
          IDStart: '',
          IDEnd: ''
        },
        rules: {
          scope: [
            {type: 'array', required: true, message: '请至少选择一个销售范围', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          setTicket: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          allAmount: [
            {required: true, message: '请输入产品总数量', trigger: 'blur'},
          ],
          buyAmount: [
            {required: true, message: '请输入购买数量', trigger: 'blur'},
          ],
          ageStart: [
            {required: true, message: '请输入年龄', trigger: 'blur'},
          ],
          ageEnd: [
            {required: true, message: '请输入年龄', trigger: 'blur'},
          ],
          telStart: [
            {required: true, message: '请输入天数', trigger: 'blur'},
          ],
          telEnd: [
            {required: true, message: '请输入数量', trigger: 'blur'},
          ],
          IDStart: [
            {required: true, message: '请输入天数', trigger: 'blur'},
          ],
          IDEnd: [
            {required: true, message: '请输入数量', trigger: 'blur'},
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
