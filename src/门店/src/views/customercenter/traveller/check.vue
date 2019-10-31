<template>
  <div>
      <h4><span class="vercitals">| </span>旅客信息</h4>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>姓名：</span>{{m1}}
            </el-col>
            <el-col :span="10">
                <span>英文名：</span>{{m2}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>性别：</span>{{m3}}
            </el-col>
            <el-col :span="10">
                <span>婚姻状况：</span>{{m4}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>人群：</span>{{m5}}
            </el-col>
            <el-col :span="10">
                <span>出生日期：</span>{{m6}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>身份证号：</span>{{m7}}
            </el-col>
            <el-col :span="10">
                <span>有效期：</span>{{m8}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>护照号：</span>{{m9}}
            </el-col>
            <el-col :span="10">
                <span>有效期：</span>{{m10}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>港澳台通行证：</span>{{m11}}
            </el-col>
            <el-col :span="10">
                <span>有效期：</span>{{m12}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>电话号码：</span>{{m13}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>出生地：</span>{{m14}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <span>通信地址：</span>{{m15}}
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false" type="primary">返回</el-button>
        </span>
  </div>
</template>
<script>
export default {
  data () {
      return {
        m1:'张三',m2:'zhangsan',m3:'男',m4:'未婚',m5:'成人',m6:'1991-11-12',m7:'430523*********8855',
        m8:'2017-12-8',m9:'545*****522',m10:'2017-12-8',m11:'545*****522',m12:'2017-12-8',
        m13:'135******23',m14:'湖南省长沙市开福区',m15:'湖南省长沙市开福',
      }
  }
}
</script>

<style scoped lang="scss">
   @import "../../../style/common.scss";
    .el-input,{
      width: 200px;
    }
    #dialog-padding{
      padding: 10px 20px;
      font-size: 16px;
    }
</style>
