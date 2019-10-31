<template>
  <div class="view">
    <el-header>
      <el-steps :active="6" align-center class="ui-step">
        <el-step title="线路信息" description=""></el-step>
        <el-step title="行程信息" description=""></el-step>
        <el-step title="小项目" description=""></el-step>
        <el-step title="预订说明" description=""></el-step>
        <el-step title="上传附件" description=""></el-step>
        <el-step title="特殊人群限制" description=""></el-step>
        <el-step title="退款说明"></el-step>
      </el-steps>
    </el-header>
    <el-form :model="specialForm" :rules="rules" ref="specialForm">
      <el-form-item label="">
        <el-checkbox v-model="specialForm.check_foreign">不接收外籍游客（含港澳台同胞）</el-checkbox>
      </el-form-item>
      <el-form-item label="" prop="yearMore">
        <el-checkbox v-model="specialForm.check_agebeyond">出游人年龄超过</el-checkbox>
        <el-input size="small" class="input_width" v-model="specialForm.yearMore"
                  :disabled="boolSwitch(specialForm.check_agebeyond)"></el-input>
        岁（含）不接收
      </el-form-item>
      <el-form-item label="" prop="yearLess">
        <el-checkbox v-model="specialForm.check_ageunder">
          出游人年龄低于
        </el-checkbox>
        <el-input size="small" class="input_width" v-model="specialForm.yearLess"
                  :disabled="boolSwitch(specialForm.check_ageunder)"></el-input>
        岁（含）不接收
      </el-form-item>
      <el-form-item label="" prop="guideAgeFrom" style='display:inline-block;'>
        <el-checkbox v-model="specialForm.check_ageform">单订出游年龄</el-checkbox>
        <el-input size="small" style='width:80px;' v-model="specialForm.guideAgeFrom"
                  :disabled="boolSwitch(specialForm.check_ageform)"></el-input>
        岁至
      </el-form-item>
      <el-form-item label="" prop="guideAgeTo" style='display:inline-block;'>
        <el-input size="small" style='width:80px;' v-model="specialForm.guideAgeTo"
                  :disabled="boolSwitch(specialForm.check_ageform)"></el-input>
        可以正常在线预订，
        年龄范围以外的出游人需现询确认
      </el-form-item>
      <el-form-item label="" prop="orderPersonLess">
        <el-checkbox v-model="specialForm.check_ageformbeyond">单订出游人数少于</el-checkbox>
        <el-input size="small" class="input_width" v-model="specialForm.orderPersonLess"
                  :disabled="boolSwitch(specialForm.check_ageformbeyond)"></el-input>
        需现询确认
      </el-form-item>
      <el-form-item label="" prop="orderPersonMore">
        <el-checkbox v-model="specialForm.check_ageformunder">单订出游超过人数</el-checkbox>
        <el-input size="small" class="input_width" v-model="specialForm.orderPersonMore"
                  :disabled="boolSwitch(specialForm.check_ageformunder)"></el-input>
        需现询确认
      </el-form-item>
    </el-form>
    <div class="text-center">
      <el-button type="primary" @click="saveOption('specialForm')" :loading='btn_loading' size='small'>保存、下一步</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">

  .el-form {
    margin-left: 25%;
  }
</style>
<script>
  export default {
    data() {
      var checkInt1 = (rules, value, callback) => {
        if (this.specialForm.check_agebeyond == true) {
          if (!value) {
            callback(new Error('输入内容不能为空'))
          } else if (!/^[^ ]+$/.test(value)) {
            callback(new Error('输入内容不能含有空格'));
          } else if (value.indexOf('.') > 0 || !Number.isInteger(Number(value))) {
            callback(new Error('输入内容只能整数'));
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      var checkInt2 = (rules, value, callback) => {
        if (this.specialForm.check_ageunder == true) {
          if (!value) {
            callback(new Error('输入内容不能为空'))
          } else if (!/^[^ ]+$/.test(value)) {
            callback(new Error('输入内容不能含有空格'));
          } else if (value.indexOf('.') > 0 || !Number.isInteger(Number(value))) {
            callback(new Error('输入内容只能整数'));
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      var checkInt3 = (rules, value, callback) => {
        if (this.specialForm.check_ageform == true) {
          if (!value) {
            callback(new Error('输入内容不能为空'))
          } else if (!/^[^ ]+$/.test(value)) {
            callback(new Error('输入内容不能含有空格'));
          } else if (value.indexOf('.') > 0 || !Number.isInteger(Number(value))) {
            callback(new Error('输入内容只能整数'));
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      var checkInt4 = (rules, value, callback) => {
        if (this.specialForm.check_ageformunder == true) {
          if (!value) {
            callback(new Error('输入内容不能为空'))
          } else if (!/^[^ ]+$/.test(value)) {
            callback(new Error('输入内容不能含有空格'));
          } else if (value.indexOf('.') > 0 || !Number.isInteger(Number(value))) {
            callback(new Error('输入内容只能整数'));
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      var checkInt5 = (rules, value, callback) => {
        if (this.specialForm.check_ageformbeyond == true) {
          if (!value) {
            callback(new Error('输入内容不能为空'))
          } else if (!/^[^ ]+$/.test(value)) {
            callback(new Error('输入内容不能含有空格'));
          } else if (value.indexOf('.') > 0 || !Number.isInteger(Number(value))) {
            callback(new Error('输入内容只能整数'));
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      return {
        btn_loading: false,
        lineId: '',
        specialForm: {
          check_foreign: false,
          check_agebeyond: false,
          check_ageunder: false,
          check_ageform: false,
          check_ageformunder: false,
          check_ageformbeyond: false,
          yearMore: "",
          yearLess: "",
          guideAgeFrom: "",
          guideAgeTo: "",
          orderPersonLess: "",
          orderPersonMore: ""
        },
        rules: {
          yearMore: [
            {required: true, validator: checkInt1, trigger: 'blur'}
          ],
          yearLess: [
            {required: true, validator: checkInt2, trigger: 'blur'}
          ],
          guideAgeFrom: [
            {required: true, validator: checkInt3, trigger: 'blur'}
          ],
          guideAgeTo: [
            {required: true, validator: checkInt3, trigger: 'blur'}
          ],
          orderPersonLess: [
            {required: true, validator: checkInt5, trigger: 'blur'}
          ],
          orderPersonMore: [
            {required: true, validator: checkInt4, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      boolSwitch(boo){
        return boo == true ? false : true
      },
      saveOption(specialForm){
        this.$refs[specialForm].validate((valid) => {
          if (valid) {
                    // if(this.specialForm.yearMore !=''&& this.specialForm.yearLess != '' && this.specialForm.yearMore <= this.specialForm.yearLess){
                    //     this.$message.error('出游人年龄设置出错了')
                    //     return;
                    // }
                    // if(this.specialForm.guideAgeFrom > this.specialForm.guideAgeTo){
                    //     this.$message.error('单订出游年龄设置出错了')
                    //     return;
                    // }
                    // if(this.specialForm.orderPersonLess > this.specialForm.orderPersonMore){
                    //     this.$message.error('单订出游人数设置出错了')
                    //     return;
                    // }
            this.btn_loading = true;
            this.groupHttp.post("GroupLine/CreateGroupLineExceptional", {
              lineId: this.$route.query.lineId,
              isAbroad: this.specialForm.check_foreign,
              yearMore: this.specialForm.yearMore,
              yearLess: this.specialForm.yearLess,
              guideAgeFrom: this.specialForm.guideAgeFrom,
              guideAgeTo: this.specialForm.guideAgeTo,
              orderPersonLess: this.specialForm.orderPersonLess,
              orderPersonMore: this.specialForm.orderPersonMore
            }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.btn_loading = false;
                this.$router.push({path:'/grouptour/Refund',query:{lineId:this.$route.query.lineId,lineTypeId:this.$route.query.lineTypeId}});
                // setTimeout(() => {
                //   //this.$router.push({path:'/grouptour/Refund',query:{lineId:this.$route.query.lineId}});
                //   var url = location.href.substring(0, location.href.indexOf('grouptour'));
                //   location.replace(url + 'grouptour/Refund?lineId=' + this.$route.query.lineId);
                // }, 1000)
              } else {
                this.$message.errer("操作失败: " + res.data.message);
                setTimeout(() => {
                  this.btn_loading = false;
                }, 1000)
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })

      }
    },
    mounted() {
    }
  }
</script>
