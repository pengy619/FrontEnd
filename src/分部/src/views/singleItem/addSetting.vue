<template>
  <div class="view">
    <el-form size="small" :model="form" :rules="rules" ref="form">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-checkbox v-model="form.isChecked">启用</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" :loading='loading'>提交发布</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      form: {
        name: "",
        isChecked: false
      },
      rules: {
        name: [{ max: 50, message: '名称长度不能大于50个字符', trigger: 'blur' },{ required: true, message: "请输入类型名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if(this.$route.query.id){
      this.getInfo();
    }
  },
  methods: {
    //获取信息
    getInfo(){
      this.groupHttp.post('SingleProduct/Get',{
        id:this.$route.query.id
      }).then(res=>{
        if(res.data.isSuccess == true){
          this.form.name = res.data.name;
          this.form.isChecked = res.data.isEnabled
        }else{
          this.$message.error(res.data)
        }
      })
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.groupHttp.post('SingleProduct/Save',{
            Name:this.form.name,
            IsEnabled:this.form.isChecked,
            id:this.$route.query.id || ''
          }).then(res=>{
            if(res.data.isSuccess == true){
              this.loading = false;
              this.$message({
                type:'success',
                message:'保存成功'
              })
              this.$router.go(-1)
            }else{
              this.loading = false;
              this.$message.error(res.data.message);
            }
          }).catch(e=>{
            console.log(e)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.el-form-item--small .el-form-item__error{
  left: 80px;
}
</style>
