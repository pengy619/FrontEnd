<template>
  <div class="view">
    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" class="demo-infoForm" size="small">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="infoForm.name" class="inp_width"></el-input>
      </el-form-item>
      <el-form-item label="产品简称" prop="shortName">
        <el-input v-model="infoForm.shortName" class="inp_width"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="内部编码">
            <el-input v-model="infoForm.nbCoding"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="外部编码">
            <el-input v-model="infoForm.wbCoding"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="产品所在地" prop="address">
        <address-select width="200px" :data-type="AirlineType" @result="addressResult"
                        class="address_width" ref= 'addressSelect'></address-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-select v-model="infoForm.supplier" placeholder="请选择供应商">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="票种" prop="variety">
        <el-select v-model="infoForm.variety" placeholder="请选择票种">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应景点" prop="dynamicTags">
        <el-tag
          :key="tag"
          v-for="tag in infoForm.dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="适用人群" prop="personExplain">
        <el-input type="textarea" v-model="infoForm.personExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="营业时间说明" prop="dateExplain">
        <el-input type="textarea" v-model="infoForm.dateExplain" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="产品包含人数" prop="person">
        成人：<el-input v-model="infoForm.person"></el-input> 人，儿童<el-input v-model="infoForm.children"></el-input>人
        <p class="margin_0px">1件产品对应的人数，例如情侣套餐预订1件对应的是2人。</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('infoForm')">保存，下一步</el-button>
        <!--<el-button @click="resetForm('infoForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-textarea {
    width: 55%;
  }
  .el-input {
    width: 200px;
  }
  .inp_width.el-input{
    width: 510px;
  }
  .el-col.el-col-5{
    width: 310px;
  }
</style>

<script>
  import addressSelect from "@/components/address-select/index";
  export default {
    components: { addressSelect },
    data() {
      return {
        AirlineType: "Domestic",
        infoForm: {
          name: '',
          shortName:'',
          nbCoding:'',
          wbCoding:'',
          address:'',
          supplier: '',
          variety: '',
          dynamicTags: ['标签一', '标签二', '标签三'],
          personExplain: '',
          dateExplain: '',
          person:'',
          children:0
        },
        options: [{
          value: '选项1',
          label: '黄金糕'
        }],
        inputVisible: false,
        inputValue: '',
        rules: {
          name: [
            {required: true, message: '请输入产品名称', trigger: 'blur'},
          ],
          shortName: [
            {required: true, message: '请输入产品简称', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请选择产品所在地', trigger: 'change'}
          ],
          supplier: [
            {required: true, message: '请选择供应商', trigger: 'change'}
          ],
          variety: [
            {required: true, message: '请选择票种', trigger: 'change'}
          ],
          dynamicTags: [
            { type: 'array', required: true, message: '请选择票种', trigger: 'change'}
          ],
          personExplain: [
            {required: true, message: '请填写适用人群说明', trigger: 'blur'}
          ],
          dateExplain: [
            {required: true, message: '请填写营业时间说明', trigger: 'blur'}
          ],
          person: [
            {required: true, message: '请填写人数', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      addressResult(val) {

      },
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
      },
      //标签添加
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>
