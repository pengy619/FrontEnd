<template>
  <div class="view">
    <h4>签约必填信息</h4>
    <el-form :model="form1" :rules="rules1" ref="form1" label-width="120px" size="small" :inline="true">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form1.name" style="width:500px"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="14">
          <el-form-item label="计划" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
          <span>(出发日期：2019-01-01 返回日期：2019-01-04)</span>
        </el-col>
        <el-col :span="10">
          <el-form-item label="合同模板" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="行程天数" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="过夜天数" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="旅游人数" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出发城市" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="签约代表姓名" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="签约代表手机号" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="签约代表身份证" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="经办人" prop="name">
            <el-input v-model="form1.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form1: {
        name: ""
      },
      rules1: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
</style>
