<template>
  <div class="view">
    <el-header>
      <el-steps :active="5" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="refundForm" :rules="rules" ref="refundForm" label-width="120px" class="demo-refundForm"
             size="small">
      <el-form-item label="退款设置" prop="setRefund">
        <el-radio-group v-model="refundForm.setRefund">
          <el-radio label="1">不支持退款</el-radio>
          <el-radio label="2">免费退款</el-radio>
          <el-radio label="3">有条件退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="refund1" v-show="refundForm.setRefund == 3">
        <el-checkbox label="1" v-model="refundForm.refund1">支持生成通知单后，有效日期前(未验证情况下)退款</el-checkbox>
        </el-checkbox-group>
        <el-button size="mini">添加退款规则</el-button>
      </el-form-item>
      <el-row v-for="item in refundForm.list1" v-show="refundForm.setRefund == 3">
        <el-col :span="6">
          <el-form-item label="" prop="day">
            有效日期前
            <el-input v-model="item.day"></el-input>
            天
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="0px" prop="date">
            <el-time-picker
              v-model="item.date"
              placeholder="选择时间">
            </el-time-picker>
            前，可退
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="-100px" prop="type">
            <el-select v-model="item.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="" label-width="-255px" prop="price">
            定价的
            <el-input v-model="item.price"></el-input>
            %
            <el-button class="lmargin_10" type="danger">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="" prop="refund2" v-show="refundForm.setRefund == 3">
        <el-checkbox label="1" v-model="refundForm.refund2">支持有效日期后(未验证情况下)退款</el-checkbox>
        </el-checkbox-group>
        <el-button size="mini">添加退款规则</el-button>
      </el-form-item>
      <el-row v-for="item in refundForm.list2" v-show="refundForm.setRefund == 3">
        <el-col :span="6">
          <el-form-item label="" prop="day">
            有效日期前
            <el-input v-model="item.day"></el-input>
            天
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="0px" prop="date">
            <el-time-picker
              v-model="item.date"
              placeholder="选择时间">
            </el-time-picker>
            前，可退
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="-100px" prop="type">
            <el-select v-model="item.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="" label-width="-255px" prop="price">
            定价的
            <el-input v-model="item.price"></el-input>
            %
            <el-button class="lmargin_10" type="danger">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="退款说明" prop="desc">
        <el-input type="textarea" v-model="refundForm.desc" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('refundForm')">上一步</el-button>
        <el-button type="primary" @click="submitForm('refundForm')">保存，下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .el-input {
    width: 100px;
  }

  .el-textarea {
    width: 55%;
  }

  .el-col.el-col-6 {
    width: 305px;
  }

  .view .el-date-editor.el-input, .view .el-date-editor input {
    width: 145px;
  }

  .view .el-select .el-input, .view .el-select input {
    width: 145px;
  }
</style>
<script>
  export default {
    data() {
      return {
        refundForm: {
          refund1: false,
          refund2: false,
          setRefund: '',
          list1: [{
            day: '',
            date: '',
            type: '',
            price: ''
          }],
          list2: [{
            day: '',
            date: '',
            type: '',
            price: ''
          }]
        },
        options: [{
          value: '1',
          label: '固定比例'
        },
          {
            value: '2',
            label: '固定金额'
          }
        ],
        rules: {
          setRefund: [
            {required: true, message: '请选择退款设置', trigger: 'change'}
          ],
          day: [
            {required: true, message: '请输入天数', trigger: 'blur'}
          ],
          date: [
            {type: 'date', required: true, message: '请输入时间', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          price: [
            {required: true, message: '请选择活动资源', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.$router.push({path: '/Tickets/ticketsMessage'})
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
