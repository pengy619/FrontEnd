<template>
  <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
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
      <el-form-item label="" prop="guideAgeFrom">
        <el-checkbox v-model="specialForm.check_ageform">单订出游年龄</el-checkbox>
        <el-input size="small" class="input_width" v-model="specialForm.guideAgeFrom"
                  :disabled="boolSwitch(specialForm.check_ageform)"></el-input>
        岁至
        <el-input size="small" class="input_width" v-model="specialForm.guideAgeTo"
                  :disabled="boolSwitch(specialForm.check_ageform)"></el-input>
        可以正常在线预订，
        年龄范围以外的出游人需现询确认
      </el-form-item>
      <!-- <el-form-item label="" prop="guideAgeTo"> -->
      <!-- </el-form-item> -->
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
    <el-footer>
      <el-button type="primary" @click="saveOption" :loading='btn_loading' size="small">保 存</el-button>
      <el-button @click="goBack" size="small">返回</el-button>
    </el-footer>
  </div>
</template>
<style scoped lang="scss">
  .el-form {
    margin-left: 15%;
  }

  .el-footer {
    margin-left: 14%;
  }
  .el-checkbox {
    width: 150px;
  }
</style>
<script>
  export default {
    props: ['status'],
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
        } else {
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
        } else {
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
        } else {
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
        } else {
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
        } else {
          callback()
        }
      }
      return {
        btn_loading: false,
        fullscreenLoading: false,
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
    watch: {
      'status': function (val) {
        if (val == 'six') {
          this.getExceptional();
        }
      }
    },
    methods: {
      goBack(){
        this.$router.push({path: '/grouptour/RouteTable'})
      },
      boolSwitch(boo){
        return boo == true ? false : true
      },
      getExceptional(){
        this.fullscreenLoading = true
        this.groupHttp.post('/GroupLine/GetGroupLineExceptional', {LineId: this.$route.query.lineId}).then(res => {
          this.fullscreenLoading = false
          if (res.data.guideAgeTo != null) {
            this.specialForm.check_ageform = true;
          }
          if (res.data.yearMore != null) {
            this.specialForm.check_agebeyond = true;
          }
          if (res.data.guideAgeFrom != null) {
            this.specialForm.check_ageform = true;
          }
          if (res.data.yearLess != null) {
            this.specialForm.check_ageunder = true;
          }
          if (res.data.orderPersonMore != null) {
            this.specialForm.check_ageformunder  = true;
          }
          if (res.data.orderPersonLess != null) {
            this.specialForm.check_ageformbeyond= true;
          }
          this.specialForm.guideAgeTo = res.data.guideAgeTo
          this.specialForm.yearMore = res.data.yearMore
          this.specialForm.guideAgeFrom = res.data.guideAgeFrom
          this.specialForm.yearLess = res.data.yearLess
          this.specialForm.check_foreign = res.data.isAbroad
          this.specialForm.orderPersonMore = res.data.orderPersonMore
          this.specialForm.orderPersonLess = res.data.orderPersonLess
        })
      },
      saveOption(){
        this.$refs['specialForm'].validate((valid) => {
          if (valid) {
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
              } else {
                this.$message.errer(res.data.message);
                setTimeout(() => {
                  this.btn_loading = false;
                }, 3000)
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
