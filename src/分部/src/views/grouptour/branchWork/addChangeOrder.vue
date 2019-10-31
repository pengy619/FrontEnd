<template>
  <div class="view" id="view" v-loading="initLoading">
    <h4>订单信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单号" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="创建人" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单状态" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="客户名称" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系人" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系电话" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="QQ" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Email" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="合同号" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单日期" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="门店名称" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="供应商名称" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>线路信息</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="线路名称" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="团号" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="出团日期" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="线路类型" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>订单金额</h4>
    <el-form>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="订单人数" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单总金额" size="small" label-width="100px">
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4>变更申请</h4>
    <el-form :model="changeForm" label-width="100px" ref="changeForm" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="订单人数" size="small" label-width="100px">
            <el-radio-group v-model="changeForm.changePeople">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="14" style="display:flex" v-if="changeForm.changePeople==true">
          <el-form-item size="small" label-width="100px" label="成人" prop="man">
            <el-input style="width:100px" v-model.number="changeForm.man" type="text"></el-input>
          </el-form-item>
          <el-form-item size="small" label-width="100px" label="老人" prop="oldman">
            <el-input style="width:100px" type="text" v-model.number="changeForm.oldman"></el-input>
          </el-form-item>
          <el-form-item size="small" label-width="100px" label="小孩" prop="child">
            <el-input style="width:100px" type="text" v-model.number="changeForm.child"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="变更订单金额" size="small" label-width="100px">
            <el-radio-group v-model="changeForm.changAamount">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item size="small" label-width="100px" v-if="changeForm.changAamount==true" prop='Aamount'>
            <el-input style="width:200px" v-model.number="changeForm.Aamount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="changeForm.remarks" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('changeForm')">保存</el-button>
        <el-button>返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initLoading: false,
      changeForm: {
        changePeople: false,
        changAamount: false,
        Aamount: 0,
        remarks: "",
        man: 0,
        oldman: 0,
        child: 0
      },
      rules: {
        man: { type: "number", message: "必须为数字值", trigger: "blur" },
        oldman: { type: "number", message: "必须为数字值", trigger: "blur" },
        child: { type: "number", message: "必须为数字值", trigger: "blur" },
        Aamount: { type: "number", message: "必须为数字值", trigger: "blur" }
      }
    };
  },
  methods: {
    onSubmit(changeForm) {
      this.$refs[changeForm].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
</style>
