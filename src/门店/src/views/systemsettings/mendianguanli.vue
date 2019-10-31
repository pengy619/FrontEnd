<template>
  <div class="box">
      <div>
          <span style="margin-right:40px">门店</span>
          <el-input size="small" v-model="form.name" class="form-inline-input"></el-input>
          <el-button type="primary" size="small" >查找</el-button> 
      </div>
      <div style="margin-top:50px">
          <el-table :data="mendianTable" border style="width: 100%">
            <el-table-column align="center" prop="number" label="门店编号"></el-table-column>
            <el-table-column align="center" prop="type" label="门店分类"></el-table-column>
            <el-table-column align="center" prop="name" label="门店名称" width='200'></el-table-column>
            <el-table-column align="center" prop="people" label="负责人"></el-table-column>
            <el-table-column align="center" prop="fanwei" label="经营范围" width='200'></el-table-column>
            <el-table-column align="center" prop="address" label="门店联系地址" width='200'></el-table-column>
            <el-table-column align="center" prop="telephone" label="联系电话" width='120'></el-table-column>
            <el-table-column align="center" prop="fax" label="传真" width='100'></el-table-column>
            <el-table-column align="center" prop="remark" label="备注" width='200'></el-table-column>
            <el-table-column
            prop="operation"
            label="操作"
            align="center"
            width='150'>
                <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="convertOrder">编辑</el-button>
                            <el-button type="text" size="mini" @click="cancelOrder">查看</el-button>
                            <el-button type="text" size="mini" @click="deleteOrder">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
          form: {
              name: ''
          },
          mendianTable:[{
              number: '20170212',
              type: '营门店女',
              name: '内蒙古-西藏-北京-哈尔滨',
              people: '国内游',
              fanwei: '散拼',
              address: '1',
              telephone: '12345674567',
              fax: '222',
              remark: '接送机活动结束',
              operation: ''
          }]
      }

  }
}
</script>
<style lang="scss" scoped>
    .form-inline-input {
        width: 40%;
        padding-right: 5%;
        }
    .box{
        padding: 30px;
        background: white;
    }
</style>

