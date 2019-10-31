<template>
  <div>
    <el-form ref="form">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column label="列1">
          <template slot-scope="scope">
            <el-form-item class="is-required" :class="{'is-error':!scope.row.input1.validate}">
              <el-input v-model="scope.row.input1.value"></el-input>
              <div class="el-form-item__error" v-if="!scope.row.input1.validate">
                {{scope.row.input1.message}}
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="列2">
          <template slot-scope="scope">
            <el-form-item class="is-required" :class="{'is-error':!scope.row.input2.validate}">
              <!-- <el-input v-model="scope.row.input2.value"></el-input> -->
              <el-select v-model="scope.row.input2.value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="el-form-item__error" v-if="!scope.row.input2.validate">
                {{scope.row.input2.message}}
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="列3">
          <template slot-scope="scope">
            <el-form-item class="is-required" :class="{'is-error':!scope.row.input3.validate}">
              <el-input v-model="scope.row.input3.value"></el-input>
              <div class="el-form-item__error" v-if="!scope.row.input3.validate">
                {{scope.row.input3.message}}
              </div>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-button @click="submit">测试</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          input1:{
            value:'',
            validate:true,
            message:'a不能为空'
          },
          input2:{
            value:'',//因为input2.value是通过下拉选项绑定options中的value,所以input3可以通过这里的值获取到options中的验证规则
            validate:true,
            message:'b不能为空'
          },
          input3:{
            value:'',
            validate:true,
            relation:'input2',//设置关联字段 表示input3关联input2，input3的验证方式需要通过input2的value进行选择性验证
            message:'c不能为空'
          },
        },{
          input1:{
            value:'',
            validate:true,
            message:'d不能为空'
          },
          input2:{
            value:'',
            validate:true,
            message:'e不能为空'
          },
          input3:{
            value:'',
            validate:true,
            relation:'input2',
            message:'f不能为空'
          },
        },{
          input1:{
            value:'',
            validate:true,
            message:'g不能为空'
          },
          input2:{
            value:'',
            validate:true,
            message:'h不能为空'
          },
          input3:{
            value:'',
            validate:true,
            relation:'input2',
            message:'i不能为空'
          },
        }],
        //所有公共下拉选项（每个选项内包含了选项本身和选项对应的正则以及错误提示文字）
        options: [{
          value: '1',
          label: '身份证',
          RegEx:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          message:'身份证输入不合法'
        }, {
          value: '2',
          label: '手机号',
          RegEx:/^[1][3,4,5,7,8][0-9]{9}$/,
          message:'手机号输入不合法'
        }],

      };
    },
    watch: {
      //监听表格内的数据变化 变化时调用验证方法 用来消除已验证的错误红色框
      tableData: {
        handler: function (newVal) {
          this.validate()
        },
        deep: true
      }
    },
    methods: {
      //验证方法（画重点，要考），
      validate(){
        //定义一个数组变量记录所有字段的验证结果（true和false）
        let validate=[]
        //循环整个表格数据
        this.tableData.forEach((item,index)=>{
          //循环每一个item里的key
          for(let k in item){
            //如果item的值不为空，则进行更深层次的验证
            if(item[k].value!==""){
              //检测item是否具有relation关联字段 （如input3的关联字段是input2的value）
              if(item[k].hasOwnProperty('relation')){
                //取到input2的value
                let regexType=item[item[k]['relation']].value
                //取到input2中value对应在this.options对应的option
                let option=this.options.find((opt, index, arr)=>{
                  return opt.value==regexType
                })
                //用上一步取到的option中的RegEx正则验证item[k]的value(也就是input3输入的值) 把结果赋值给item[k].validate
                item[k].validate=option.RegEx.test(item[k].value)
                //把option中的message赋值给item[k].message
                item[k].message=option.message
              }else{
                //如果item[k]是不具有relation关联字段 说明只是检测是否为空 那么到了这里已经证明他不为空 直接true
                item[k].validate=true
              }
            }else{
              //item[k].value=="" 所以false
              item[k].validate=false
            }
            //把以上每个item[k]的验证结果push进开始定义的数组validate里
            validate.push(item[k].validate)
          }
        })
        //返回一个结果 validate是否包含false 只要有一个false 就代表整个表单有未验证通过的
        return validate.indexOf(false)==-1
      },
      submit(){
        if(this.validate()){
          alert('提交')
        }
      }
    }
  };
</script>

<style>

</style>
