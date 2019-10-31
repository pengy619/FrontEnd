<template>
  <div class='view'>
    <el-dialog  :visible.sync="dialogFormVisible">
        <el-form  :model="dialogForm" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="英文名">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="婚姻状况">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="人群">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="有效证件号">
                <el-select v-model="dialogForm.region" placeholder="请选择">
                <el-option label="身份证号" value="身份证"></el-option>
                <el-option label="护照号" value="护照"></el-option>
                </el-select>
            </el-form-item>
           <el-form-item label="证件有效期">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="出生地">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="通信地址">
                <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="dialogFormVisible = false">确 定</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取 消</el-button>
    </el-dialog>
    <div class="block">
      <span class="demonstration">姓名: </span>
      <el-input style='width:10%'></el-input>
      <span class="demonstration">英文名: </span>
      <el-input style='width:10%'></el-input>
      <span class="demonstration">身份证号: </span>
      <el-input style='width:10%'></el-input>
      <span class="demonstration">护照号: </span>
      <el-input style='width:10%'></el-input>
      <span class="demonstration">手机号码: </span>
      <el-input style='width:10%'></el-input>
      <el-button type="primary" icon="el-icon-search" >查找</el-button>
    </div>
    <div>
        <div style='margin:15px 0 0 20px;'>
            <el-button type="primary" @click="dialogFormVisible = true"><i class="el-icon-plus"></i> 新建</el-button>
            <!-- <el-button type="primary">导出 excel</el-button> -->
        </div>
        <div id='table'>
            <el-table
              border
              :data="messageTable"
              style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="70px"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="姓名"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="englishName"
                    label="英文名"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="maritalStatus"
                    label="婚姻状况"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="person"
                    label="人群"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="birthday"
                    label="出生日期"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="identityNumber"
                    label="身份证号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="passportNum"
                    label="护照号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="validPeriod"
                    label="证件有效期"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="homePlace"
                    label="出生地"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="phone"
                    label="电话号码"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="通信地址"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="travellerOrigin"
                    label="来源"
                    >
                  </el-table-column>
                  <el-table-column
                      label="操作"
                      min-width="100"
                      align="center"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="small">删除</el-button>
                        </template>
                  </el-table-column>
            </el-table>
            <div>
                <div class="pagination">
                    <el-pagination
                        :data = 'pagination'
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="pagination.sizes"
                        :page-size="pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      handleSizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      }
    },
    data() {
      return {
        dialogFormVisible:false,
        dialogForm:{
            name:'',
            region:''
        },
        messageTable:[{
            
          },{
            
          },{
            
          }],
           pagination:{
              sizes:[5,10,20],
              size:10,
              currentPage: 1,
              total:0
           }
       }
    }
  };

</script>
<style scoped lang="scss">
    #table{
        margin:15px 0 10px 0;
    }
</style>
